import React from 'react';
import './TradeCard.css';

interface TradeCardProps {
  trade: {
    ID: number;
    Валюта: string;
    Long_Short: string;
    Статус: string;
    Дата_створення: string;
    Маржа: number;
    Кредитне_плече: number;
    Обєм: number;
    Ціна_входу: number;
    Орієнтовна_ціна_ліквідації: number;
    Дельта: number;
    Комісія: number;
    Дата_закриття: string;
    Ціна_закриття: number;
    Орієнтований_прибуток: number;
    Орієнтовані_збитки: number;
  };
}

const TradeCard: React.FC<TradeCardProps> = ({ trade }) => {
  return (
    <div className="trade-card">
      <div className="trade-card-header">
        <h2>{trade.Валюта}</h2>
        <span className={`status ${trade.Статус.toLowerCase()}`}>{trade.Статус}</span>
      </div>
      <div className="trade-card-body">
        <p><strong>ID:</strong> {trade.ID}</p>
        <p><strong>Long/Short:</strong> {trade.Long_Short}</p>
        <p><strong>Дата створення:</strong> {trade.Дата_створення}</p>
        <p><strong>Маржа:</strong> {trade.Маржа}</p>
        <p><strong>Кредитне плече:</strong> {trade.Кредитне_плече}</p>
        <p><strong>Обʼєм:</strong> {trade.Обєм}</p>
        <p><strong>Ціна входу:</strong> {trade.Ціна_входу}</p>
        <p><strong>Орієнтовна ціна ліквідації:</strong> {trade.Орієнтовна_ціна_ліквідації}</p>
        <p><strong>Дельта:</strong> {trade.Дельта}</p>
        <p><strong>Комісія:</strong> {trade.Комісія}</p>
        <p><strong>Дата закриття:</strong> {trade.Дата_закриття}</p>
        <p><strong>Ціна закриття:</strong> {trade.Ціна_закриття}</p>
        <p><strong>Орієнтований прибуток:</strong> {trade.Орієнтований_прибуток}</p>
        <p><strong>Орієнтовані збитки:</strong> {trade.Орієнтовані_збитки}</p>
      </div>
    </div>
  );
};

export default TradeCard;
