import  { useState } from 'react';
import { auth } from '../../services/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const { setUser } = useAuth();
  const [username, setUsername] = useState('');

  const emailRegister = async (email: string, password: string, username: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      const firebaseUid = cred.user.uid;
      const token = await cred.user.getIdToken();
      localStorage.setItem('token', token);

      const res = await fetch('https://crypto-demon-back.onrender.com/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          username,
          firebaseUid,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('📩 Ми надіслали листа для підтвердження email');
      } else {
        const errMsg = await res.text();
        console.error('Помилка реєстрації:', errMsg);
        alert('❌ Помилка реєстрації: ' + errMsg);
      }
    } catch (error: any) {
      alert('❌ Помилка реєстрації: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Реєстрація</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as any;
        const email = target.email.value;
        const password = target.password.value;
        const uname = target.username.value;
        emailRegister(email, password, uname);
      }}>
        <div>
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username}
            onChange={e => setUsername(e.target.value)}
            required 
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Зареєструватися</button>
      </form>
      <p>Вже є акаунт? <a href="/login">Увійти</a></p>
    </div>
  );
};

export default Signup;