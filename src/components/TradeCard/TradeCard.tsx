import React from 'react';
import './TradeCard.css';

interface TradeCardProps {
  trade: any;
  onClose?: (trade: any) => void;
}

const TradeCard: React.FC<TradeCardProps> = ({ trade, onClose }) => {
  const isLong = trade.Long_Short === 'Long';
  const statusColor = isLong ? 'long' : 'short';

  return (
    <div className="trade-card">
      <div className={`trade-card-top ${statusColor}`}>
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
          <div><strong>Актуальна ціна:</strong> {trade.Актуальна_ціна}</div>
          <div><strong>Ціна ліквідації:</strong> {trade.Орієнтовна_ціна_ліквідації}</div>
        </div>
        <div className="row">
          <div><strong>TP:</strong> {trade.Орієнтований_прибуток}</div>
          <div><strong>SL:</strong> {trade.Орієнтовані_збитки}</div>
        </div>
        <div className="row profit-row">
          <div><strong>Актуальний прибуток:</strong></div>
          <div className="profit">{trade.Дельта}</div>
        </div>
        <div className="row">
          <div><strong>Комісія:</strong> <span className="fee">{trade.Комісія}</span></div>
        </div>
        <div className="row">
          <div><strong>Створено:</strong> {trade.Дата_створення}</div>
          <div><strong>Закрито:</strong> {trade.Дата_закриття}</div>
        </div>
      </div>

      {onClose && (
        <button className="close-btn" onClick={() => onClose(trade)}>
          Закрити ордер
        </button>
      )}
    </div>
  );
};

export default TradeCard;
