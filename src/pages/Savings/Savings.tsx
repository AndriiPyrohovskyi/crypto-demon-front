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

  return (
    <div className="savings_container">
      <div className="sort_mode_container">
        <h3>Сортування за</h3>
        <Dropdown
          options={[
            { label: 'Символ', value: 'symbol' },
            { label: 'Кількість', value: 'quantity' },
            { label: 'Значення', value: 'value' },
          ]}
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
      <CryptoPortfolio data={cryptoData} />
      <div className="converrter_container">
      <Dropdown options={[]}/>
      <CustomInput 
      onChange={function (value: string | number): void {
        throw new Error('Function not implemented.');
      } } 
      type={'text'}/>
      <Dropdown options={[]}/>
      <CustomInput 
      onChange={function (value: string | number): void {
        throw new Error('Function not implemented.');
      } } 
      type={'text'}/>
      <Button text={'Конвертувати'} onClick={function (): void {
        throw new Error('Function not implemented.');
      } }
      />
      </div>
    </div>
  );
};

export default Savings;