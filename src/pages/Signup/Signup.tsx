import { auth } from '../../services/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const Signup = () => {
  const emailRegister = async (email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
      alert('📩 Ми надіслали листа для підтвердження email');
      console.log('Користувач:', cred.user);
    } catch (err: any) {
      alert('❌ Помилка реєстрації: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Реєстрація</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = (e.target as any).email.value;
          const password = (e.target as any).password.value;
          emailRegister(email, password);
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
        <button type="submit">Зареєструватися</button>
      </form>
      <p>Вже є акаунт? <a href="/login">Увійти</a></p>
    </div>
  );
};

export default Signup;