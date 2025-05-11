import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import './Header.css';
import Button from '../Button/Button';

const Header = () => {
  const { user, logout } = useAuth();
  const token = localStorage.getItem('token');
  const [balance, setBalance] = useState<number | null>(null);

  const fetchBalance = async () => {
    try {
      const res = await fetch('https://crypto-demon-back.onrender.com/user-currency/balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Balance data:', data);
        setBalance(data);
      } else {
        console.error('Error fetching balance:', res.statusText);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

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
                <li>
                  {balance !== null && !isNaN(balance) ? `${balance.toFixed(2)}$` : 'Завантаження...'}
                </li>
                <li className="header__profile">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="header__avatar" />
                  ) : (
                    <div className="header__avatar-placeholder">👤</div>
                  )}
                  <span className="header__username"><Link to="/profile">{user.username}</Link></span>
                </li>
                <li><Button text="Вийти" onClick={logout} /></li>
              </>
            ) : (
              <>
                <li className="auth">
                  <Link to="/login">
                    <Button text="Увійти"/>
                  </Link>
                </li>                
                <li className="auth">
                  <Link to="/signup">
                    <Button text="Зареєструватись"/>
                  </Link>
                </li>
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