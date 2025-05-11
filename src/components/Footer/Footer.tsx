import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__column footer__brand">
          <h3>Crypto Demon</h3>
          <p>Безпечна та швидка криптобіржа для трейдерів будь-якого рівня.</p>
          <p className="footer__copy">&copy; {new Date().getFullYear()} Crypto Demon</p>
        </div>

        <div className="footer__column footer__nav">
          <h3>Навігація</h3>
          <ul>
            <li><Link to="/">Головна</Link></li>
            <li><Link to="/trade">Трейдинг</Link></li>
            <li><Link to="/profile">Профіль</Link></li>
            <li><Link to="/transactions">Транзакції</Link></li>
          </ul>
        </div>

        <div className="footer__column footer__contacts">
          <h3>Контакти</h3>
          <ul>
            <li><i className="icon-mail"></i><a href="mailto:support@cryptodemon.com"> support@cryptodemon.com</a></li>
            <li><i className="icon-phone"></i> <a href="tel:+380991234567">+38 (099) 123-45-67</a></li>
            <li><i className="icon-location"></i><a href="#">Україна, Київ</a></li>
          </ul>
        </div>

        <div className="footer__column footer__social">
          <h3>Соціальні мережі</h3>
          <ul>
            <li><i className="icon-twitter"></i><a href="https://twitter.com" target="_blank" rel="noreferrer"> Twitter</a></li>
            <li><i className="icon-facebook"></i><a href="https://facebook.com" target="_blank" rel="noreferrer"> Facebook</a></li>
            <li><i className="icon-telegram"></i><a href="https://t.me/cryptodemon" target="_blank" rel="noreferrer"> Telegram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;