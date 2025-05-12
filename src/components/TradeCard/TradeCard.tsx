import React, { useEffect, useState } from 'react';
import './TradeCard.css';

interface TradeCardProps {
  trade: any;
  onClose?: (trade: any) => void;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, onClose }) => {
  const [priceColor, setPriceColor] = useState('');
  const [previousPrice, setPreviousPrice] = useState(trade.Актуальна_ціна);

  useEffect(() => {
    const interval = setInterval(() => {
      if (trade.Актуальна_ціна > previousPrice) {
        setPriceColor('green');
      } else if (trade.Актуальна_ціна < previousPrice) {
        setPriceColor('red');
      }
      setPreviousPrice(trade.Актуальна_ціна);
    }, 5000);

    return () => clearInterval(interval);
  }, [trade.Актуальна_ціна, previousPrice]);

  const deltaColor = trade.Дельта > 0 ? 'green' : 'red';

  return (
    <div className="trade-card">
      <div className={`trade-card-top ${trade.Long_Short === 'Long' ? 'long' : 'short'}`}>
        <div className="id">ID: {trade.ID}</div>
        <div className="status">Статус: {trade.Статус}</div>
        <div className="direction">{trade.Long_Short}</div>
      </div>

      <div className="trade-card-body">
        <div className="row">
          <div><strong>Маржа:</strong> {trade.Маржа}</div>
          <div><strong>Плече:</strong> {trade.Кредитне_плече}</div>
          <div><strong>Сума ордеру:</strong> {trade.Обєм}</div>
        </div>
        <div className="row">
          <div><strong>Ціна входу:</strong> {trade.Ціна_входу}</div>
          <div><strong>Актуальна ціна:</strong> <span style={{ color: priceColor }}>{trade.Теперішня_ціна}</span></div>
          <div><strong>Ціна ліквідації:</strong> {trade.Орієнтована_ціна_ліквідації}</div>
        </div>
        <div className="row">
          <div><strong>TP:</strong> {trade.Орієнтований_прибуток}</div>
          <div><strong>SL:</strong> {trade.Орієнтовані_збитки}</div>
        </div>
        <div className="row">
          <div><strong>TP ціна:</strong> {trade.Ціна_фіксації_прибутку}</div>
          <div><strong>SL ціна:</strong> {trade.Ціна_фіксації_збитків}</div>
        </div>
        <div className="row profit-row">
          <div><strong>Актуальний прибуток:</strong></div>
          <div className="profit" style={{ color: deltaColor }}>{trade.Дельта}</div>
        </div>
        <div className="row">
          <div><strong>Комісія:</strong> <span className="fee">{trade.Комісія}</span></div>
        </div>
        <div className="row">
          <div><strong>Створено:</strong> {trade.Дата_створення}</div>
          <div><strong>Закрито:</strong> {trade.Дата_закриття}</div>
        </div>
      </div>

      {onClose && trade.Статус !== 'closed' && trade.Статус !== 'liquidated' && (
        <button className="close-btn" onClick={() => onClose(trade)}>
          Закрити ордер
        </button>
      )}
    </div>
  );
};

export default TradeCard;
