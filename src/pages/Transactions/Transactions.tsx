import React, { useEffect, useState } from 'react';
import Dropdown from '../../components/Dropdown/Dropdown';
import CustomInput from '../../components/CustomInput/CustomInput';
import Table from '../../components/Table/Table';
import { useAuth } from '../../context/AuthContext';
import './Transactions.css';
import Button from '../../components/Button/Button';
import SingleHandleSlider from '../../components/SingleHandleSlider/SingleHandleSlider';
import FilterList from '../../components/FilterList/FilterList';
import {
  transactionSortingOptions,
  transactionColumns as txColumns,
  generateTransactionFilterOptions,
  TxRow
} from '../../constants/transactionConstants';
import {exchangeColumns, exchangeColumnsWidth} from '../../constants/exchangeConstants';
import {UserRow, userColumns} from '../../constants/userConstants';

const Transactions = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [txs, setTxs] = useState<TxRow[]>([]);
  const [originalTxs, setOriginalTxs] = useState<TxRow[]>([]); 
  const [currencyArray, setCurrencyArray] = useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const [valueDollar, setValueDollar] = useState<number>(0);
  const [valueCrypto, setValueCrypto] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [recipientMethod, setRecipientMethod] = useState<string>('ByID');
  const [recipientInput, setRecipientInput] = useState<string>('');
  const [recipientError, setRecipientError] = useState<string>('');
  const [inviteSwap, setInviteSwap] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [warning, setWarning] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>(transactionSortingOptions[0].value);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [exchanges, setExchanges] = useState<any[]>([]);
  const [swapCurrency, setSwapCurrency] = useState<string | null>(null);
  const [allCurrencies, setAllCurrencies] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const [txRes, usersRes] = await Promise.all([
          fetch('https://crypto-demon-back.onrender.com/transaction', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('https://crypto-demon-back.onrender.com/users', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        if (!txRes.ok || !usersRes.ok) throw new Error('Fetch error');
        const { transactions } = await txRes.json() as { transactions: any[] };
        const allUsers = await usersRes.json() as any[];
        const formattedTxs: TxRow[] = transactions.map(t => ({
          id: t.id,
          sender: t.sender?.username || '-',
          recipient: t.recipient?.username || '-',
          currency: t.currency?.symbol || '-',
          value: Number(t.value),
          price_at_transaction: Number(t.price_at_transaction),
          fee: t.fee != null ? Number(t.fee) : null,
          created_at: new Date(t.created_at).toLocaleDateString(),
        }));
        setTxs(formattedTxs);
        setOriginalTxs(formattedTxs); // Зберігаємо оригінальні дані
        setFilterOptions(generateTransactionFilterOptions(formattedTxs));
        const partnerIds = new Set<number>();
        transactions.forEach(t => {
          if (t.sender?.id && t.sender.id !== user.id) partnerIds.add(t.sender.id);
          if (t.recipient?.id && t.recipient.id !== user.id) partnerIds.add(t.recipient.id);
        });
        const filtered = allUsers.filter(u => partnerIds.has(u.id));
        const formattedUsers: UserRow[] = filtered.map(u => ({
          id: u.id,
          avatar: u.avatar_url
            ? <img src={u.avatar_url} alt={u.username} className="avatar-sm" />
            : null,
          username: u.username,
          last_login: u.last_login
            ? new Date(u.last_login).toLocaleString()
            : null,
        }));
        setUsers(formattedUsers);
      } catch (err) {
        console.error('Помилка завантаження даних:', err);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const token = localStorage.getItem("token");

        // Отримуємо валюти користувача
        const userCurrencyRes = await fetch(
          "https://crypto-demon-back.onrender.com/user-currency",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!userCurrencyRes.ok) throw new Error(userCurrencyRes.statusText);
        const userCurrencies: Array<{
          currency: { symbol: string; logo_url: string };
          balance: number;
        }> = await userCurrencyRes.json();

        const enrichedUserCurrencies = await Promise.all(
          userCurrencies.map(async (c) => {
            if (c.currency.symbol === "USDT") {
              return {
                label: c.currency.symbol,
                value: c.currency.symbol,
                icon: c.currency.logo_url,
                balance: c.balance,
                price: 1,
              };
            }

            const priceRes = await fetch(
              `https://api.binance.com/api/v3/ticker/price?symbol=${c.currency.symbol}USDT`
            );
            const priceData = await priceRes.json();
            return {
              label: c.currency.symbol,
              value: c.currency.symbol,
              icon: c.currency.logo_url,
              balance: c.balance,
              price: parseFloat(priceData.price),
            };
          })
        );

        setCurrencyArray(enrichedUserCurrencies);

        // Отримуємо всі доступні валюти
        const allCurrencyRes = await fetch(
          "https://crypto-demon-back.onrender.com/currency",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!allCurrencyRes.ok) throw new Error(allCurrencyRes.statusText);
        const allCurrencies: Array<{ symbol: string; logo_url: string }> =
          await allCurrencyRes.json();

        const enrichedAllCurrencies = allCurrencies.map((c) => ({
          label: c.symbol,
          value: c.symbol,
          icon: c.logo_url,
        }));

        setAllCurrencies(enrichedAllCurrencies); // Зберігаємо всі валюти окремо
      } catch (err) {
        console.error("Не вдалося завантажити валюти:", err);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchExchanges = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('https://crypto-demon-back.onrender.com/exchange/incoming', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch exchanges');
        const data = await res.json();
        setExchanges(data);
      } catch (err) {
        console.error('Error fetching exchanges:', err);
      }
    };
    
    fetchExchanges();
  }, []);

  const handleCurrencyChange = async (value: string) => {
    const selected = currencyArray.find((c) => c.value === value);
    setSelectedCurrency(selected);
    if (selected?.value === "USDT") {
      setCurrentPrice(1);
      setValueDollar(0);
      setValueCrypto(0);
      setSliderValue(0);
      return;
    }
    if (selected) {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${selected.value}USDT`
        );
        const data = await res.json();
        setCurrentPrice(Number(data.price));
      } catch (err) {
        console.error("Не вдалося отримати ціну:", err);
      }
    }
  };

  const handleUSDChange = (usd: number) => {
    setValueDollar(usd);
    setValueCrypto(+(usd / currentPrice).toFixed(8));
    const percentage = selectedCurrency?.balance
      ? Math.min((usd / (selectedCurrency.balance * currentPrice)) * 100, 100)
      : 0;
    setSliderValue(percentage);
    setWarning(usd > selectedCurrency?.balance * currentPrice ? 'Перевищено баланс!' : null);
  };

  const handleCryptoChange = (crypto: number) => {
    setValueCrypto(crypto);
    setValueDollar(+(crypto * currentPrice).toFixed(2));
    const percentage = selectedCurrency?.balance
      ? Math.min((crypto / selectedCurrency.balance) * 100, 100)
      : 0;
    setSliderValue(percentage);
    setWarning(crypto > selectedCurrency?.balance ? 'Перевищено баланс!' : null);
  };

  const handleSliderChange = (percentage: number) => {
    setSliderValue(percentage);
    if (selectedCurrency?.value === "USDT") {
      const usd = (selectedCurrency.balance * percentage) / 100;
      setValueDollar(usd);
      setWarning(usd > selectedCurrency.balance ? 'Перевищено баланс!' : null);
    } else {
      const crypto = (selectedCurrency.balance * percentage) / 100;
      setValueCrypto(crypto);
      setValueDollar(+(crypto * currentPrice).toFixed(2));
      setWarning(crypto > selectedCurrency.balance ? 'Перевищено баланс!' : null);
    }
  };

  const validateRecipient = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('https://crypto-demon-back.onrender.com/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const users = await res.json();
      const exists =
        recipientMethod === 'ByID'
          ? users.some((u: any) => u.id === Number(recipientInput))
          : users.some((u: any) => u.username === recipientInput);
      setRecipientError(exists ? '' : 'Користувача не знайдено');
    } catch (err) {
      console.error('Error validating recipient:', err);
    }
  };

  const handleSendTransaction = async () => {
    if (!selectedCurrency) {
      alert('Будь ласка, оберіть валюту');
      return;
    }
    if (!recipientInput || recipientError) {
      alert('Вкажіть коректного отримувача');
      return;
    }
    if (valueDollar <= 0) {
      alert('Вкажіть суму для переказу');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      const transactionBody = {
        recipientName: recipientInput,
        symbol: selectedCurrency.value,
        amount: valueDollar / currentPrice,
      };
      const exchangeBody = {
        fromSymbol: selectedCurrency.value,
        fromAmount: valueDollar / currentPrice,
        toSymbol: swapCurrency,
      };
  
      if (inviteSwap && swapCurrency) {
        const res = await fetch('https://crypto-demon-back.onrender.com/exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(exchangeBody),
        });
  
        if (!res.ok) throw new Error('Не вдалося запросити обмін');
        alert('Запит на обмін успішно створено');
      } else {
        const res = await fetch('https://crypto-demon-back.onrender.com/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(transactionBody),
        });
  
        if (!res.ok) throw new Error('Не вдалося виконати переказ');
        alert('Переказ успішно виконано');
      }
    } catch (err) {
      console.error('Помилка:', err);
      alert('Не вдалося виконати операцію');
    }
  };
  

  const handleAcceptExchange = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`https://crypto-demon-back.onrender.com/exchange/${id}/confirm`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to accept exchange');
      alert('Обмін прийнято');
      setExchanges((prev) => prev.filter((exchange) => exchange.id !== id));
    } catch (err) {
      console.error('Error accepting exchange:', err);
      alert('Не вдалося прийняти обмін');
    }
  };

  const handleRejectExchange = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`https://crypto-demon-back.onrender.com/exchange/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to reject exchange');
      alert('Обмін відхилено');
      setExchanges((prev) => prev.filter((exchange) => exchange.id !== id));
    } catch (err) {
      console.error('Error rejecting exchange:', err);
      alert('Не вдалося відхилити обмін');
    }
  };

  const applyFilters = (filters: { [key: string]: string[] }) => {
    const filteredData = originalTxs.filter((transaction) => {
      const result = Object.entries(filters).every(([label, values]) => {
        const option = filterOptions.find(opt => opt.label === label);
        const dataKey = option?.key || label;
        const transactionValue = transaction[dataKey as keyof TxRow];
  
        if (transactionValue === undefined || transactionValue === null) {
          return false;
        }
  
        if (values.length === 2) {
          const [min, max] = values.map(Number);
          const isInRange = 
            typeof transactionValue === 'number' &&
            transactionValue >= min && transactionValue <= max;
          return isInRange;
        } else if (values.length === 1) {
          const filterValue = values[0].toLowerCase();
          if (typeof transactionValue === "string") {
            const isMatch = transactionValue.toLowerCase() === filterValue;
            return isMatch;
          }
          const isIncluded = transactionValue.toString().toLowerCase().includes(filterValue);
          return isIncluded;
        }
  
        return true;
      });
      return result;
    });
  
    setTxs(filteredData);
  };

  const sortByOption = (value: string) => {
    setSortBy(value);
    sortData(value, sortOrder);
  };

  const setSortOrderHandler = (value: 'asc' | 'desc') => {
    setSortOrder(value);
    sortData(sortBy, value);
  };

  const sortData = (key: string, order: 'asc' | 'desc') => {
    const sortedTxs = [...txs].sort((a, b) => {
      const aValue = a[key as keyof TxRow];
      const bValue = b[key as keyof TxRow];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    setTxs(sortedTxs);
  };

  return (
    <div className="transactions_container">
      <div className="create_transaction_container">
        <div className="transaction_props">
          <h3>Валюта</h3>
          <Dropdown
            options={currencyArray.map((c) => ({
              label: c.label,
              value: c.value,
              icon: c.icon,
              balanceInUSD: c.balance * c.price,
            }))}
            placeholder="Виберіть валюту"
            onChange={handleCurrencyChange}
          />
          <h3>Баланс: {selectedCurrency?.balance.toFixed(2)} {selectedCurrency?.label}</h3>
          <h3>Баланс в USD: {(selectedCurrency?.balance * currentPrice).toFixed(2)} $</h3>
          <h3>Об'єм (USD)</h3>
          <CustomInput
            type="number"
            symbol="USDT"
            value={valueDollar.toString()}
            onChange={(val) => handleUSDChange(Number(val))}
          />
          {selectedCurrency?.value !== 'USDT' && (
            <>
              <h3>Об'єм ({selectedCurrency?.label})</h3>
              <CustomInput
                type="number"
                symbol={selectedCurrency?.label}
                value={valueCrypto.toString()}
                onChange={(val) => handleCryptoChange(Number(val))}
              />
            </>
          )}
          <SingleHandleSlider
            min={0}
            max={100}
            value={sliderValue}
            onChange={handleSliderChange}
          />
          {warning && <div className="warning">{warning}</div>}
          <h3>Ціна зараз: {currentPrice.toFixed(2)} $</h3>
        </div>
        <div className="transaction_info">
          <h3>Спосіб переказу</h3>
          <Dropdown
            options={[
              { label: 'За ID', value: 'ByID' },
              { label: "За ім'ям", value: 'ByUsername' },
            ]}
            placeholder="Оберіть спосіб переказу"
            onChange={setRecipientMethod}
          />
          <h3>{recipientMethod === 'ByID' ? 'ID користувача' : 'Username'}</h3>
          <CustomInput
            type="text"
            value={recipientInput}
            onChange={(val) => setRecipientInput(String(val))}
            onBlur={validateRecipient}
          />
          {recipientError && <div className="error">{recipientError}</div>}
          <label>
            <input
              type="checkbox"
              checked={inviteSwap}
              onChange={(e) => setInviteSwap(e.target.checked)}
            />{' '}
            запросити обмін
          </label>
          {inviteSwap && (
            <>
              <h3>Валюта для обміну</h3>
              <Dropdown
                options={allCurrencies.map((c) => ({
                  label: c.label,
                  value: c.value,
                  icon: c.icon,
                }))}
                placeholder="Виберіть валюту для обміну"
                onChange={(value) => setSwapCurrency(value)}
              />
            </>
          )}
          <Button
            text="Відправити"
            onClick={handleSendTransaction}
          />
        </div>
        <div className="transaction_recent_users">
          <div className="transaction_tables">
          <Table
            columns={userColumns}
            data={users}
            pagination={{ defaultRowsPerPage: 5, rowsPerPageOptions: [5, 10] }}
          />
          <Table
            columns={exchangeColumns}
            data={exchanges}
            columnWidths={exchangeColumnsWidth}
            actionColumn={{
              header: 'Дії',
              render: (row) => (
                <div>
                  <Button text="Прийняти" onClick={() => handleAcceptExchange(row.id)} />
                  <Button text="Відхилити" onClick={() => handleRejectExchange(row.id)} />
                </div>
              ),
            }}
            pagination={{ defaultRowsPerPage: 5, rowsPerPageOptions: [5, 10] }}
          />
          </div>
        </div>
      </div>
      <div className="transaction_history_container">
        <div className="sort_mode_container">
          <h3>Сортування за</h3>
          <Dropdown
            options={transactionSortingOptions}
            placeholder="Сортування за"
            onChange={sortByOption}
          />
          <Dropdown
            options={[
              { label: "Від А до Я", value: "asc" },
              { label: "Від Я до А", value: "desc" },
            ]}
            placeholder="Порядок сортування"
            onChange={(value) => setSortOrderHandler(value as 'asc' | 'desc')}
          />
          <FilterList
            title="Фільтри"
            options={filterOptions}
            onFilterChange={applyFilters}
          />
        </div>
        <div className="transactions_table_wrapper">
          <h3>Історія транзакцій</h3>
          <Table
            columns={txColumns}
            data={txs}
            pagination={{ defaultRowsPerPage: 10, rowsPerPageOptions: [10, 20, 50] }}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;