import TradeCard from '../TradeCard/TradeCard';
import './TradeCardContainer.css';

const TradeCardContainer = ({ trades, onClose }: any) => {
  return (
    <div className="trade-card-container">
      {trades.map((trade: any) => (
        <TradeCard key={trade.ID} trade={trade} onClose={onClose} />
      ))}
    </div>
  );
};

export default TradeCardContainer;