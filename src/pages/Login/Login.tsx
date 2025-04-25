import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

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
        console.error('Помилка завантаження користувача:', errMsg);
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
        console.error('Помилка завантаження користувача:', errMsg);
        alert('❌ Помилка входу через Google: ' + errMsg);
      }
    } catch (error: any) {
      alert('❌ Помилка входу через Google: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Вхід</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        const target = e.target as any;
        const email = target.email.value;
        const password = target.password.value;
        emailLogin(email, password);
      }}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Пароль:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Увійти</button>
      </form>
      <button onClick={googleLogin}>Увійти через Google</button>
      <p>Ще немає акаунту? <a href="/signup">Зареєструватися</a></p>
    </div>
  );
};

export default Login;