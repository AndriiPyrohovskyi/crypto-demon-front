import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { setUser } = useAuth();

  const emailLogin = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user?.getIdToken(); // Отримуємо токен

      if (token) {
        const response = await fetch('https://crypto-demon-back.onrender.com/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          alert('✅ Вхід виконано');
        } else {
          console.error('Помилка сервера:', await response.text());
        }
      }
    } catch (err: any) {
      alert('❌ Помилка входу: ' + err.message);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user?.getIdToken(); // Отримуємо токен

      if (token) {
        // Надсилаємо токен на сервер для перевірки
        const response = await fetch('https://crypto-demon-back.onrender.com/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Зберігаємо дані користувача в глобальному стані
          alert('✅ Вхід через Google виконано');
        } else {
          console.error('Помилка сервера:', await response.text());
        }
      }
    } catch (err: any) {
      alert('❌ Помилка входу через Google: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Вхід</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = (e.target as any).email.value;
          const password = (e.target as any).password.value;
          emailLogin(email, password);
        }}
      >
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