import './CryptoPortfolio.css';

interface CryptoItem {
  icon: string;
  symbol: string;
  quantity: number;
  value: number;
}

interface CryptoPortfolioProps {
  data: CryptoItem[];
}

const CryptoPortfolio: React.FC<CryptoPortfolioProps> = ({ data }) => {
  return (
    <div className="crypto-portfolio">
      {data.map((item: CryptoItem, index: number) => (
        <div className="crypto-item" key={index}>
          <div className="crypto-icon">
            <img src={item.icon} alt={item.symbol} />
          </div>
          <div className="crypto-symbol">{item.symbol}</div>
          <div className="crypto-quantity">{item.quantity}</div>
          <div className="crypto-value">{item.value} USDT</div>
        </div>
      ))}
    </div>
  );
};

export default CryptoPortfolio;
