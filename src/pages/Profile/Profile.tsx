import { useEffect, useState } from 'react';
import { auth } from '../../services/firebase'; 
import Sidebar from '../../components/Sidebar/Sidebar';
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import './Profile.css';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [user, setUser] = useState<{
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    balance: number;
    avatar_url: string | null;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.warn('Користувач не авторизований');
          return;
        }
        const token = await currentUser.getIdToken();

        const response = await fetch('https://crypto-demon-back.onrender.com/auth/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Помилка отримання даних користувача:', await response.text());
        }
      } catch (error) {
        console.error('Помилка отримання даних користувача:', error);
      }
    };

    fetchUser();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="profile__content">
            <h2>Профіль</h2>
            {user ? (
              <div className="profile__details">
                <div className="profile__avatar">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="Avatar" />
                  ) : (
                    <div className="profile__avatar-placeholder">👤</div>
                  )}
                </div>
                <div className="profile__info">
                  <p>id: {user.id}</p>
                  <p>username: {user.username}</p>
                  <p>email: {user.email}</p>
                  <p>role: {user.role}</p>
                  <p>createdAt: {user.createdAt}</p>
                  <p>
                    Balance: <strong>{user.balance.toFixed(2)} $</strong>
                  </p>
                  <Button text="Edit" />
                </div>
              </div>
            ) : (
              <p>Завантаження...</p>
            )}
          </div>
        );
      case 'transactions':
        return (
          <div className="profile__content">
            <h2>Історія транзакцій</h2>
          </div>
        );
      case 'trading':
        return (
          <div className="profile__content">
            <h2>Історія трейдингу</h2>
          </div>
        );
      case 'statistics':
        return (
          <div className="profile__content">
            <h2>Статистика</h2>
            <Dropdown options={[
              {label: "Графік 1", value: "graph1"},
              {label: "Графік 2", value: "graph2"},
              {label: "Графік 3", value: "graph3"}
              ]} />
            <div className="profile__chart">Тут буде графік</div>
          </div>
        );
      case 'balance':
        return (
          <div className="profile__content">
            <h2>Операції над балансом</h2>
            <div className="profile__balance">
              <p>Баланс: 0.00 $</p>
              <Button text="Поповнити баланс" />
              <Button text="Вивести кошти" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile">
      <Sidebar
        items={[
          { label: 'Профіль', value: 'profile' },
          { label: 'Історія транзакцій', value: 'transactions' },
          { label: 'Історія трейдингу', value: 'trading' },
          { label: 'Статистика', value: 'statistics' },
          { label: 'Операції над балансом', value: 'balance' },
          { label: 'Видалити мій акаунт', value: 'delete' },
        ]}
        onSelect={setActiveSection}
        activeItem={activeSection}
      />
      <div className="profile__main">{renderContent()}</div>
    </div>
  );
};

export default Profile;