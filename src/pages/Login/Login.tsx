import { auth } from '../../services/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
  const emailLogin = async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      alert('✅ Вхід виконано');
      console.log('Користувач:', cred.user);
    } catch (err: any) {
      alert('❌ Помилка входу: ' + err.message);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      alert('✅ Вхід через Google виконано');
      console.log('Користувач:', result.user);
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