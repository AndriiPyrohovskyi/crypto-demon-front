import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Перший стовпець: іконки зворотнього зв'язку */}
        <div className="footer__column footer__social">
          <h3>Зворотній зв'язок</h3>
          <ul>
            <li>
              <a href="mailto:info@cryptodemon.com">✉️ Email</a>
            </li>
            <li>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">👍 Facebook</a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦 Twitter</a>
            </li>
          </ul>
        </div>
        {/* Другий стовпець: основні посилання */}
        <div className="footer__column footer__links">
          <h3>Посилання</h3>
          <ul>
            <li><Link to="/">Головна</Link></li>
            <li><Link to="/trade">Трейдинг</Link></li>
            <li><Link to="/profile">Профіль</Link></li>
          </ul>
        </div>
        {/* Третій стовпець: назва сайту, лого і права */}
        <div className="footer__column footer__info">
          <h3>Crypto Demon</h3>
          <p>Логотип можна вставити тут</p>
          <p>&copy; {new Date().getFullYear()} Crypto Demon. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;