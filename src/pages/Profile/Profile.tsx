import { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import './Profile.css';
import ProfileContent from './components/ProfileContent/ProfileContent';
import ProfileStats from './components/ProfileStats/ProfileStats';
import ProfileBalance from './components/ProfileBalance/ProfileBalance';
import { useAuth } from '../../context/AuthContext';
import AdminPanel from './components/AdminPanel/AdminPanel';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileContent/>
        );
      case 'balance':
        return (
          <ProfileBalance/>
        );
      case 'admin':
        return (
          <AdminPanel/>
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
          { label: 'Операції над балансом', value: 'balance' },
          ...(user?.role === 'admin'
            ? [{ label: 'Адмін панель', value: 'admin' }]
            : []),
        ]}
        onSelect={setActiveSection}
        activeItem={activeSection}
      />
      <div className="profile__main">{renderContent()}</div>
    </div>
  );
};

export default Profile;