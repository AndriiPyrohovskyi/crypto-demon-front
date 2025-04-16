import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Button from '../../components/Button/Button';
import Dropdown from '../../components/Dropdown/Dropdown';
import Table from '../../components/Table/Table';
import './Profile.css';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="profile__content">
            <h2>Профіль</h2>
            <div className="profile__details">
              <div className="profile__avatar"></div>
              <div className="profile__info">
                <p>id: 12345</p>
                <p>username: CryptoUser</p>
                <p>email: user@example.com</p>
                <p>role: user</p>
                <p>createdAt: 2025-01-01</p>
                <p>Balance: <strong>0.00 $</strong></p>
                <Button text="Edit" />
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="profile__content">
            <h2>Історія транзакцій</h2>
            <Table columns={['Дата', 'Сума', 'Тип']} data={[]} />
          </div>
        );
      case 'trading':
        return (
          <div className="profile__content">
            <h2>Історія трейдингу</h2>
            <Table columns={['Дата', 'Актив', 'Сума', 'Статус']} data={[]} />
          </div>
        );
      case 'statistics':
        return (
          <div className="profile__content">
            <h2>Статистика</h2>
            <Dropdown options={['Графік 1', 'Графік 2', 'Графік 3']} />
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