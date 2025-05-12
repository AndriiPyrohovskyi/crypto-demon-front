import { useState } from 'react';
import Button from '../../../../components/Button/Button';
import CustomInput from '../../../../components/CustomInput/CustomInput';

const ProfileBalance = () => {
  const [amount, setAmount] = useState<number>(0);

  const handleAddBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://crypto-demon-back.onrender.com/user-currency/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          symbol: 'USDT',
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error('Не вдалося поповнити баланс');
      }

      const data = await response.json();
      alert(`Баланс успішно поповнено. Новий баланс: ${data.balance}`);
    } catch (error) {
      console.error('Помилка поповнення балансу:', error);
      alert('Сталася помилка під час поповнення балансу');
    }
  };

  return (
    <div>
      <h3>Поповнення балансу</h3>
      <CustomInput
        type="number"
        value={amount.toString()}
        onChange={(value) => setAmount(Number(value))}
        placeholder="Введіть суму"
        symbol="USDT"
      />
      <Button onClick={handleAddBalance} text="Поповнити" />
    </div>
  );
};

export default ProfileBalance;