import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import Button from "../../../../components/Button/Button";
import CustomInput from "../../../../components/CustomInput/CustomInput";

const ProfileContent = () => {
    
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const [balance, setBalance] = useState<number | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState(user?.username || '');
    const [tempAvatar, setTempAvatar] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
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
    const handleSaveChanges = async () => {
        try {
          // Оновлення username
          if (username !== user?.username) {
            const res = await fetch('https://crypto-demon-back.onrender.com/users', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ username }),
            });
            if (!res.ok) throw new Error('Failed to update username');
          }
    
          // Оновлення аватара
          if (avatarFile) {
            const formData = new FormData();
            formData.append('file', avatarFile);
            const res = await fetch('https://crypto-demon-back.onrender.com/users/avatar', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });
            if (!res.ok) throw new Error('Failed to upload avatar');
          }
    
          alert('Зміни збережено');
          setIsEditing(false);
        } catch (err) {
          console.error('Error saving changes:', err);
          alert('Не вдалося зберегти зміни');
        }
      };
      const handleCancelChanges = () => {
        setIsEditing(false);
        setUsername(user?.username || '');
        setTempAvatar(null);
        setAvatarFile(null);
      };
    
      const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setAvatarFile(file);
          const reader = new FileReader();
          reader.onload = () => {
            setTempAvatar(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
      };
    return (
        <div className="profile__content">
        <h2>Профіль</h2>
        {user ? (
          <div className="profile__details">
            <div className="profile__avatar">
              {tempAvatar || user.avatar_url ? (
                <img src={tempAvatar || user.avatar_url} alt="Avatar" />
              ) : (
                <div className="profile__avatar-placeholder">👤</div>
              )}
              {isEditing && (
                <div>
                  <label htmlFor="avatar-upload" className="button">
                    Змінити аватар
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                </div>
              )}
            </div>
            <div className="profile__info">
              <p>id: {user.id}</p>
              {isEditing ? (
                <CustomInput
                  type="text"
                  value={username}
                  onChange={(val) => setUsername(val as string)}
                />
              ) : (
                <p>username: {user.username}</p>
              )}
              <p>email: {user.email}</p>
              <p>role: {user.role}</p>
              <p>createdAt: {user.created_at}</p>
              <p>
                Balance: <strong>{balance}$</strong>
              </p>
              {isEditing ? (
                <>
                  <Button text="Зберегти зміни" onClick={handleSaveChanges} />
                  <Button text="Скасувати" onClick={handleCancelChanges} />
                </>
              ) : (
                <Button text="Edit" onClick={() => setIsEditing(true)} />
              )}
            </div>
          </div>
        ) : (
          <p>Завантаження...</p>
        )}
      </div>
    );
}

export default ProfileContent;