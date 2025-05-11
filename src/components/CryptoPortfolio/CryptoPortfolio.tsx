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

const formatNumber = (num: number, digits = 4) =>
  num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });

const CryptoPortfolio: React.FC<CryptoPortfolioProps> = ({ data }) => {
  return (
    <div className="crypto-portfolio">
      <h2 className="crypto-portfolio__title">Мій Портфель</h2>
      <div className="crypto-portfolio__list">
        {data.map((item, index) => (
          <div className="crypto-item" key={index}>
            <div className="crypto-item__left">
              <img src={item.icon} alt={item.symbol} className="crypto-item__icon" />
              <span className="crypto-item__symbol">{item.symbol}</span>
            </div>
            <div className="crypto-item__right">
              <div className="crypto-item__quantity">
                {formatNumber(item.quantity)} <span className="unit">{item.symbol}</span>
              </div>
              <div className="crypto-item__value">
                ≈ {formatNumber(item.value, 2)} <span className="unit">USDT</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoPortfolio;
