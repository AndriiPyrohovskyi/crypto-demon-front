import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__logo">Crypto Demon</h1>
        <nav className="header__nav">
          <ul>
            <li><Link to="/">Головна</Link></li>
            <li><Link to="/trade">Трейдинг</Link></li>
            <li><Link to="/profile">Профіль</Link></li>
            <li className="auth"><Link to="/login">Увійти</Link></li>
            <li className="auth"><Link to="/signup">Зареєструватись</Link></li>
          </ul>
        </nav>
      </div>
      <div className="header__line"></div>
    </header>
  );
};

export default Header;