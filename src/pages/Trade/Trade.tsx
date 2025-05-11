import { useState, useEffect } from "react";
import "./Trade.css";
import { useAuth } from "../../context/AuthContext";
import CreateOrder from "./components/CreateOrder/CreateOrder";
import TradeHistory from "./components/TradeHistory/TradeHistory";

const Trade = () => {
  const { user } = useAuth();
  const [userBalance, setUserBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await fetchUserBalance('USDT');
      if (balance !== null) {
        setUserBalance(balance);
      }
    };
    fetchBalance();
  }, []);

  const fetchUserBalance = async (symbol: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Токен не знайдено");
      return null;
    }
  
    try {
      const res = await fetch(`https://crypto-demon-back.onrender.com/user-currency/${symbol}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        console.error("Помилка запиту:", res.statusText);
        return null;
      }
  
      const data = await res.json();
      return data.balance;
    } catch (err) {
      console.error("Помилка під час виконання запиту:", err);
      return null;
    }
  };
  return (
    <div className="trade_container">
      <CreateOrder userBalance={userBalance} />
      <TradeHistory user={user} />
    </div>
  );
};

export default Trade;