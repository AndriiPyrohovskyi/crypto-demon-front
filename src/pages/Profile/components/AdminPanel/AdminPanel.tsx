import { useEffect, useState } from "react";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import Table from "../../../../components/Table/Table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [selectedChart, setSelectedChart] = useState("commission");
  const [data, setData] = useState<any>({
    totalCommission: 0,
    commissionChartData: [],
    exchangeVolume: [],
    tradeVolume: [],
    userStats: { totalUsers: 0, averageBalance: 0 },
    topUsers: [],
    transactions: [],
    trades: [],
    exchanges: [],
    users: [],
    currencies: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) fetchAllData(token);
  }, []);

  const fetchAllData = async (token: string) => {
    try {
      const [
        commissionRes,
        exchangeVolumeRes,
        tradeVolumeRes,
        userStatsRes,
        topUsersRes,
        transactionsRes,
        tradesRes,
        exchangesRes,
        usersRes,
        currenciesRes,
      ] = await Promise.all([
        fetch("https://crypto-demon-back.onrender.com/statistics/commission-data", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://crypto-demon-back.onrender.com/statistics/exchange-volume?period=month", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://crypto-demon-back.onrender.com/statistics/trade-volume?period=month", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://crypto-demon-back.onrender.com/statistics/user-stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://crypto-demon-back.onrender.com/statistics/top-users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://crypto-demon-back.onrender.com/transaction", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://crypto-demon-back.onrender.com/trade", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://crypto-demon-back.onrender.com/exchange", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://crypto-demon-back.onrender.com/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("https://crypto-demon-back.onrender.com/currency", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const commissionData = await commissionRes.json();
      const exchangeVolume = await exchangeVolumeRes.json();
      const tradeVolume = await tradeVolumeRes.json();
      const userStats = await userStatsRes.json();
      const topUsers = await topUsersRes.json();
      const transactionsData = await transactionsRes.json();
      const tradesData = await tradesRes.json();
      const transactions = transactionsData.transactions;
      const trades = tradesData.trades;
      const exchanges = await exchangesRes.json();
      const users = await usersRes.json();
      const currencies = await currenciesRes.json();
      setData({
        totalCommission: commissionData.totalCommission,
        commissionChartData: commissionData.commissionChartData,
        exchangeVolume,
        tradeVolume,
        userStats,
        topUsers,
        transactions,
        trades,
        exchanges,
        users,
        currencies,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const dropdownOptions = [
    { label: "Комісії", value: "commission" },
    { label: "Обсяг обмінів", value: "exchangeVolume" },
    { label: "Обсяг трейдів", value: "tradeVolume" },
    { label: "Статистика користувачів", value: "userStats" },
    { label: "Топ користувачів", value: "topUsers" },
    { label: "Таблиця усіх транзакцій", value: "tableTransactions" },
    { label: "Таблиця усіх трейдів", value: "tableTrades" },
    { label: "Таблиця усіх обмінів", value: "tableExchanges" },
    { label: "Таблиця усіх користувачів", value: "tableUsers" },
    { label: "Таблиця усіх валют", value: "tableCurrency" },
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case "commission":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.commissionChartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalCommission" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        );
      case "exchangeVolume":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.exchangeVolume}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total_from" fill="#8884d8" />
              <Bar dataKey="total_to" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "tradeVolume":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.tradeVolume}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalMargin" fill="#ff4560" />
              <Bar dataKey="totalValue" fill="#00d1b2" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "userStats":
        return (
          <div className="stats_card">
            <h2>📊 Статистика користувачів</h2>
            <div className="stat_line">
              <span>👥 Кількість користувачів:</span>
              <strong>{data.userStats.totalUsers}</strong>
            </div>
            <div className="stat_line">
              <span>💰 Середній баланс:</span>
              <strong>${data.userStats.averageBalance.toFixed(2)}</strong>
            </div>
          </div>
        );
      case "topUsers":
        return (
          <div className="stats_card">
            <h2>🏆 Топ користувачі</h2>
            <ul className="top_users_list">
              {data.topUsers.map((user: any, index: number) => {
                console.log(user);
                return (
                  <li key={index} className="top_user_item">
                    <span>#{index + 1}</span>
                    <span>{user.username}</span>
                    <strong>${user.totalBalance.toFixed(2)}</strong>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      case "tableTransactions":
        return (
          <Table
            columns={[
              { key: "id", header: "ID" },
              { key: "sender", header: "Відправник" },
              { key: "recipient", header: "Отримувач" },
              { key: "currency", header: "Валюта" },
              { key: "value", header: "Сума" },
              { key: "fee", header: "Комісія" },
              { key: "created_at", header: "Дата" },
            ]}
            data={data.transactions.map((tx: any) => ({
              id: tx.id,
              sender: tx.sender?.username || "-",
              recipient: tx.recipient?.username || "-",
              currency: tx.currency?.symbol || "-",
              value: tx.value,
              fee: tx.fee,
              created_at: new Date(tx.created_at).toLocaleDateString(),
            }))}
            pagination={{ defaultRowsPerPage: 10, rowsPerPageOptions: [10, 20, 50] }}
          />
        );
      case "tableTrades":
        return (
          <Table
            columns={[
              { key: "id", header: "ID" },
              { key: "currency", header: "Валюта" },
              { key: "type", header: "Тип" },
              { key: "status", header: "Статус" },
              { key: "created_at", header: "Дата" },
              { key: "margin", header: "Маржа" },
              { key: "profit", header: "Прибуток" },
            ]}
            data={data.trades.map((trade: any) => ({
              id: trade.id,
              currency: trade.currency?.symbol || "-",
              type: trade.type === "buy" ? "Long" : "Short",
              status: trade.status,
              created_at: new Date(trade.created_at).toLocaleDateString(),
              margin: trade.margin,
              profit: trade.fixed_user_profit,
            }))}
            pagination={{ defaultRowsPerPage: 10, rowsPerPageOptions: [10, 20, 50] }}
          />
        );
      case "tableExchanges":
        return (
          <Table
            columns={[
              { key: "id", header: "ID" },
              { key: "from_currency", header: "Від" },
              { key: "to_currency", header: "До" },
              { key: "amount", header: "Сума" },
              { key: "created_at", header: "Дата" },
            ]}
            data={data.exchanges.map((exchange: any) => ({
              id: exchange.id,
              from_currency: exchange.from_currency?.symbol || "-",
              to_currency: exchange.to_currency?.symbol || "-",
              amount: exchange.amount,
              created_at: new Date(exchange.created_at).toLocaleDateString(),
            }))}
            pagination={{ defaultRowsPerPage: 10, rowsPerPageOptions: [10, 20, 50] }}
          />
        );
      case "tableUsers":
        return (
          <Table
            columns={[
              { key: "id", header: "ID" },
              { key: "username", header: "Ім'я" },
              { key: "email", header: "Email" },
              { key: "created_at", header: "Дата створення" },
              { key: "last_login", header: "Останній вхід" },
            ]}
            data={data.users.map((user: any) => ({
              id: user.id,
              username: user.username,
              email: user.email,
              created_at: new Date(user.created_at).toLocaleDateString(),
              last_login: user.last_login ? new Date(user.last_login).toLocaleString() : "-",
            }))}
            pagination={{ defaultRowsPerPage: 10, rowsPerPageOptions: [10, 20, 50] }}
          />
        );
      case "tableCurrency":
        return (
          <Table
            columns={[
              { key: "symbol", header: "Символ" },
              { key: "name", header: "Назва" },
              { key: "logo", header: "Лого" },
            ]}
            data={data.currencies.map((currency: any) => ({
              symbol: currency.symbol,
              name: currency.name,
              logo: <img src={currency.logo_url} alt={currency.symbol} width={30} />,
            }))}
            pagination={{ defaultRowsPerPage: 10, rowsPerPageOptions: [10, 20, 50] }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="adminPanelContainer">
      <h1 className="adminPanelHeader">Admin Panel</h1>
      <Dropdown options={dropdownOptions} onChange={setSelectedChart} />
      <div className="mt-8">{renderChart()}</div>
    </div>
  );
};

export default AdminPanel;
