import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
  const [user, setUser] = useState<{ username: string; avatar_url: string | null } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('https://crypto-demon-back.onrender.com/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Помилка отримання даних користувача:', error);
      }
    };

    fetchUser();
  }, []);

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
                <li className="header__profile">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" className="header__avatar" />
                  ) : (
                    <div className="header__avatar-placeholder">👤</div>
                  )}
                  <span className="header__username">{user.username}</span>
                </li>
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