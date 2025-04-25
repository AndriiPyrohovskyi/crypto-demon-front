import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header__content">
        <h1 className="header__logo">Crypto Demon</h1>
        <nav className="header__nav">
          <ul>
            <li><Link to="/">Головна</Link></li>
            <li><Link to="/trade">Трейдинг</Link></li>
            <li><Link to="/transactions">Транзакції</Link></li>
            <li><Link to="/savings">Збереження</Link></li>
            {user ? (
              <>
                <li>{Number(user.balance).toFixed(2)}$</li>
                <li className="header__profile">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="header__avatar" />
                  ) : (
                    <div className="header__avatar-placeholder">👤</div>
                  )}
                  <span className="header__username"><Link to="/profile">{user.username}</Link></span>
                </li>
                <li><button onClick={logout}>Вийти</button></li>
              </>
            ) : (
              <>
                <li className="auth"><Link to="/login">Увійти</Link></li>
                <li className="auth"><Link to="/signup">Зареєструватись</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <div className="header__line"></div>
    </header>
  );
};

export default Header;