import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import './AuthForm.css';

const Login = () => {
  const { setUser } = useAuth();

  const emailLogin = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      localStorage.setItem('token', token);

      const res = await fetch('https://crypto-demon-back.onrender.com/auth/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('✅ Вхід виконано');
      } else {
        const errMsg = await res.text();
        alert('❌ Помилка входу: ' + errMsg);
      }
    } catch (error: any) {
      alert('❌ Помилка входу: ' + error.message);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);

      const res = await fetch('https://crypto-demon-back.onrender.com/auth/user', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('✅ Вхід через Google виконано');
      } else {
        const errMsg = await res.text();
        alert('❌ Помилка входу через Google: ' + errMsg);
      }
    } catch (error: any) {
      alert('❌ Помилка входу через Google: ' + error.message);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Вхід</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as any;
        const email = target.email.value;
        const password = target.password.value;
        emailLogin(email, password);
      }}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Пароль" required />
        <button type="submit">Увійти</button>
      </form>
      <button className="google-btn" onClick={googleLogin}>Увійти через Google</button>
      <p className="form-footer">Ще немає акаунту? <a href="/signup">Зареєструватися</a></p>
    </div>
  );
};

export default Login;
