import { useEffect, useState } from 'react';
import CryptoPortfolio from '../../components/CryptoPortfolio/CryptoPortfolio';
import Dropdown from '../../components/Dropdown/Dropdown';
import FilterList from '../../components/FilterList/FilterList';
import './Savings.css';
import CustomInput from '../../components/CustomInput/CustomInput';
import Button from '../../components/Button/Button';

const Savings = () => {
  const [cryptoData, setCryptoData] = useState<
    { symbol: string; quantity: number; value: number; icon: string }[]
  >([]);
  const [originalCryptoData, setOriginalCryptoData] = useState<
    { symbol: string; quantity: number; value: number; icon: string }[]
  >([]);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<string>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currencyArray, setCurrencyArray] = useState<any[]>([]);
  const [allCurrencies, setAllCurrencies] = useState<any[]>([]);
  const [selectedFromCurrency, setSelectedFromCurrency] = useState<any>(null);
  const [selectedToCurrency, setSelectedToCurrency] = useState<any>(null);
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);

  const fetchTransactions = async () => {
    try {
      const userCurrencyResponse = await fetch('https://crypto-demon-back.onrender.com/user-currency/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const userCurrencies = await userCurrencyResponse.json();

      // Отримуємо всі доступні валюти
      const allCurrencyResponse = await fetch('https://crypto-demon-back.onrender.com/currency', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const allCurrencies = await allCurrencyResponse.json();

      // Обробка даних користувача
      const enrichedUserData = await Promise.all(
        userCurrencies.map(async (currency: { currency: { symbol: string; logo_url: string }; balance: number }) => {
          const symbol = currency.currency.symbol;
          const quantity = currency.balance;
          const icon = currency.currency.logo_url;

          if (symbol === 'USDT') {
            return { symbol, quantity, value: quantity * 1, icon };
          }

          try {
            const priceResponse = await fetch(
              `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}USDT`
            );
            const priceData = await priceResponse.json();
            const price = parseFloat(priceData.price);

            return { symbol, quantity, value: quantity * price, icon };
          } catch (error) {
            console.error(`Не вдалося отримати ціну для ${symbol}:`, error);
            return { symbol, quantity, value: 0, icon }; // Якщо не вдалося отримати ціну
          }
        })
      );

      // Додаємо валюти, яких немає у користувача
      const userSymbols = enrichedUserData.map((currency) => currency.symbol);
      const missingCurrencies = allCurrencies
        .filter((currency: { symbol: string }) => !userSymbols.includes(currency.symbol))
        .map((currency: { symbol: string; logo_url: string }) => ({
          symbol: currency.symbol,
          quantity: 0,
          value: 0,
          icon: currency.logo_url,
        }));

      // Об'єднуємо дані
      const finalData = [...enrichedUserData, ...missingCurrencies];
      setCryptoData(finalData);
      setOriginalCryptoData(finalData); // Зберігаємо оригінальні дані
      setFilterOptions(generateFilterOptions(finalData)); // Генеруємо опції фільтрів
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const generateFilterOptions = (data: any[]) => {
    const numericFields = [
      { label: 'Кількість', key: 'quantity' },
      { label: 'Значення', key: 'value' },
    ];

    const textFields = [
      { label: 'Символ', key: 'symbol', inputs: 1, type: 'text' },
    ];

    const numericOptions = numericFields.map(field => {
      const values = data
        .map(item => item[field.key])
        .filter(v => typeof v === 'number') as number[];
      const min = Math.min(...values);
      const max = Math.max(...values);
      return {
        label: field.label,
        key: field.key,
        inputs: 2,
        slider: true,
        min,
        max,
      };
    });

    const textOptions = textFields.map(field => ({
      label: field.label,
      key: field.key,
      inputs: field.inputs,
      type: field.type,
    }));

    return [...numericOptions, ...textOptions];
  };

  const applyFilters = (filters: { [key: string]: string[] }) => {
    const filteredData = originalCryptoData.filter((item) => {
      const result = Object.entries(filters).every(([label, values]) => {
        const option = filterOptions.find(opt => opt.label === label);
        const dataKey = option?.key || label;
        const itemValue = item[dataKey as keyof typeof item];

        if (itemValue === undefined || itemValue === null) {
          return false;
        }

        if (values.length === 2) {
          const [min, max] = values.map(Number);
          const isInRange = 
            typeof itemValue === 'number' &&
            itemValue >= min && itemValue <= max;
          return isInRange;
        } else if (values.length === 1) {
          const filterValue = values[0].toLowerCase();
          if (typeof itemValue === "string") {
            const isMatch = itemValue.toLowerCase() === filterValue;
            return isMatch;
          }
          const isIncluded = itemValue.toString().toLowerCase().includes(filterValue);
          return isIncluded;
        }

        return true;
      });
      return result;
    });

    setCryptoData(filteredData);
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
    const sortedData = [...cryptoData].sort((a, b) => {
      const aValue = a[key as keyof typeof a];
      const bValue = b[key as keyof typeof b];

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

    setCryptoData(sortedData);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const token = localStorage.getItem('token');

        // Отримуємо валюти користувача
        const userCurrencyRes = await fetch(
          'https://crypto-demon-back.onrender.com/user-currency',
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!userCurrencyRes.ok) throw new Error(userCurrencyRes.statusText);
        const userCurrencies: Array<{
          currency: { symbol: string; logo_url: string };
          balance: number;
        }> = await userCurrencyRes.json();

        const enrichedUserCurrencies = userCurrencies.map((c) => ({
          label: `${c.currency.symbol} (Доступно: ${c.balance})`,
          value: c.currency.symbol,
          icon: c.currency.logo_url,
          balance: c.balance,
        }));

        setCurrencyArray(enrichedUserCurrencies);

        // Отримуємо всі доступні валюти
        const allCurrencyRes = await fetch(
          'https://crypto-demon-back.onrender.com/currency',
          {
            headers: {
              'Content-Type': 'application/json',
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

        setAllCurrencies(enrichedAllCurrencies);
      } catch (err) {
        console.error('Не вдалося завантажити валюти:', err);
      }
    };

    fetchCurrencies();
  }, []);

  const handleConvert = async () => {
    if (!selectedFromCurrency || !selectedToCurrency || fromAmount <= 0) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }

    if (fromAmount > selectedFromCurrency.balance) {
      alert('Сума перевищує доступну кількість валюти');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const body = {
        fromSymbol: selectedFromCurrency.value,
        toSymbol: selectedToCurrency.value,
        fromAmount,
        toAmount,
      };
      const res = await fetch(
        'https://crypto-demon-back.onrender.com/user-currency/exchange',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error('Не вдалося виконати обмін');
      alert('Обмін успішно виконано');
    } catch (err) {
      console.error('Помилка обміну:', err);
      alert('Не вдалося виконати обмін');
    }
  };

  const handleFromAmountChange = (val: number) => {
    if (selectedFromCurrency && val > selectedFromCurrency.balance) {
      val = selectedFromCurrency.balance; // Обмежуємо значення доступною кількістю
    }
  
    setFromAmount(val);
  
    if (selectedFromCurrency && selectedToCurrency) {
      fetchExchangeRate(selectedFromCurrency.value, selectedToCurrency.value)
        .then((rate) => {
          setToAmount(val * rate);
        })
        .catch((err) => {
          console.error('Помилка отримання курсу обміну:', err);
          setToAmount(0);
        });
    }
  };
  

  const handleToAmountChange = (val: number) => {
    setToAmount(val);

    if (selectedFromCurrency && selectedToCurrency) {
      fetchExchangeRate(selectedFromCurrency.value, selectedToCurrency.value)
        .then((rate) => {
          const calculatedFromAmount = val / rate;
          if (calculatedFromAmount > selectedFromCurrency.balance) {
            setFromAmount(selectedFromCurrency.balance); // Обмежуємо значення доступною кількістю
            setToAmount(selectedFromCurrency.balance * rate); // Оновлюємо toAmount
          } else {
            setFromAmount(calculatedFromAmount);
          }
        })
        .catch((err) => {
          console.error('Помилка отримання курсу обміну:', err);
          setFromAmount(0);
        });
    }
  };

  const fetchExchangeRate = async (fromSymbol: string, toSymbol: string): Promise<number> => {
    if (fromSymbol === toSymbol) return 1; // Якщо валюти однакові, курс = 1
  
    try {
      // Завжди будуємо пару так, щоб USDT був другим
      const fetchRate = async (base: string, quote: string): Promise<number> => {
        const symbol = `${base}${quote}`;
        const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        if (response.ok) {
          const data = await response.json();
          return parseFloat(data.price);
        }
        throw new Error(`Не вдалося отримати курс для пари ${symbol}`);
      };
  
      // Якщо одна з валют — USDT, отримуємо курс напряму
      if (fromSymbol === 'USDT') {
        return fetchRate(toSymbol, 'USDT'); // Напряму до USDT
      }
      if (toSymbol === 'USDT') {
        return fetchRate(fromSymbol, 'USDT'); // Напряму від USDT
      }
  
      // Завжди конвертуємо через USDT
      const toUSDT = await fetchRate(fromSymbol, 'USDT'); // Курс з fromSymbol в USDT
      const fromUSDT = await fetchRate(toSymbol, 'USDT'); // Курс з USDT в toSymbol
      return toUSDT / fromUSDT; // Повертаємо комбінований курс
    } catch (err) {
      console.error(`Не вдалося отримати курс обміну для ${fromSymbol} -> ${toSymbol}:`, err);
      throw err;
    }
  };

  return (
    <div className="savings__container">
    <aside className="savings__sidebar">
      <h3 className="savings__section-title">Сортування</h3>
      <Dropdown
        options={[
          { label: 'Символ', value: 'symbol' },
          { label: 'Кількість', value: 'quantity' },
          { label: 'Значення', value: 'value' },
        ]}
        placeholder="Сортувати за"
        onChange={sortByOption}
      />
      <Dropdown
        options={[
          { label: "Від А до Я", value: "asc" },
          { label: "Від Я до А", value: "desc" },
        ]}
        placeholder="Порядок"
        onChange={(value) => setSortOrderHandler(value as 'asc' | 'desc')}
      />
  
      <FilterList
        title="Фільтри"
        options={filterOptions}
        onFilterChange={applyFilters}
      />
    </aside>
  
    <main className="savings__portfolio">
      <h3 className="savings__section-title">Ваш портфель</h3>
      <CryptoPortfolio data={cryptoData} />
    </main>
  
    <section className="savings__converter">
      <h3 className="savings__section-title">Конвертер</h3>
      <div className="converter__row">
        <Dropdown
          options={currencyArray}
          placeholder="З валюти"
          onChange={(value) =>
            setSelectedFromCurrency(
              currencyArray.find((c) => c.value === value)
            )
          }
        />
        <CustomInput
          type="number"
          value={fromAmount.toString()}
          onChange={(val) => handleFromAmountChange(Number(val))}
        />
      </div>
      <div className="converter__arrow">⇅</div>
      <div className="converter__row">
        <Dropdown
          options={allCurrencies}
          placeholder="У валюту"
          onChange={(value) =>
            setSelectedToCurrency(allCurrencies.find((c) => c.value === value))
          }
        />
        <CustomInput
          type="number"
          value={toAmount.toString()}
          onChange={(val) => handleToAmountChange(Number(val))}
        />
      </div>
      <Button text="Конвертувати" onClick={handleConvert} />
    </section>
  </div>
  
  );
};

export default Savings;