import React, { useState, useEffect, useCallback } from "react";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import FilterList from "../../../../components/FilterList/FilterList";
import Table from "../../../../components/Table/Table";
import { sortingOptions, tableTradesColumns, tableTradesColumnsWidths, generateFilterOptions } from "../../../../constants/tradeConstants";
import "./TradeHistory.css";
import ChartPanel from "../../../../components/ChartPanel/ChartPanel";
import TradeCardContainer from "../../../../components/TradeCardContainer/TradeCardContainer";

type TradeHistoryProps = {
  user: any;
};

const TradeHistory: React.FC<TradeHistoryProps> = ({ user }) => {
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [tableData, setTableData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<any[]>([]);

  const fetchTrades = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch('https://crypto-demon-back.onrender.com/trade', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Trades data:", data);
        const userTrades = data.trades.filter((t: any) => t.user?.id === user.id);
        const formatted = userTrades.map((trade: any) => {
          const currentPrice = trade.Теперішня_ціна || 0;
          const entryPrice = trade.bought_at_price || 0;
          let delta = 0;
          
          if (trade.status === "closed" || trade.status === "liquidated") {
            delta = Number(trade.fixed_user_profit);
          } else {
            if (trade.type === 'buy') {
              console.log("Current Price:", currentPrice);
              console.log("Entry Price:", entryPrice);
              console.log("Trade Value:", trade.value);
              delta = (currentPrice - entryPrice) * (trade.value / entryPrice);
            } else {
              delta = (entryPrice - currentPrice) * (trade.value / entryPrice);
            }
          }
          
          return {
            ID: trade.id,
            Валюта: trade.currency?.symbol || '-',
            Long_Short: trade.type === 'buy' ? 'Long' : 'Short',
            Статус: trade.status,
            Дата_створення: new Date(trade.created_at).toLocaleDateString(),
            Маржа: Number(trade.margin).toFixed(2),
            Кредитне_плече: Number(trade.leverage),
            Обєм: Number(trade.value).toFixed(2),
            Ціна_входу: Number(trade.bought_at_price).toFixed(2),
            Теперішня_ціна: 0,
            Орієнтована_ціна_ліквідації: Number(trade.liquidation_price).toFixed(2),
            Дельта: Number(delta),
            Комісія: Number(trade.fixed_company_profit).toFixed(2),
            Дата_закриття: trade.closed_at
              ? new Date(trade.closed_at).toLocaleDateString()
              : '-',
            Ціна_закриття: Number(trade.closing_price).toFixed(2),
            Орієнтований_прибуток: Number(trade.TP_value).toFixed(2),
            Ціна_фіксації_прибутку: Number(trade.TP_price).toFixed(2),
            Орієнтовані_збитки: Number(trade.SL_value).toFixed(2),
            Ціна_фіксації_збитків: Number(trade.SL_price).toFixed(2),
          };
        });
        setOriginalData(formatted);
        setTableData(formatted);
        setFilterOptions(generateFilterOptions(formatted));
      }
    } catch (err) {
      console.error("Помилка під час отримання торгів:", err);
    }
  }, [user]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  useEffect(() => {
    if (originalData.length === 0) return;
    const symbols = Array.from(
      new Set(originalData.map((t) => `${t.Валюта}USDT`))
    );

    const fetchPrices = async () => {
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(
            JSON.stringify(symbols)
          )}`
        );

        if (!res.ok) throw new Error(res.statusText);

        const prices: { symbol: string; price: string }[] = await res.json();
        setTableData((current) =>
          current.map((row) => {
            const sym = `${row.Валюта}USDT`;
            const p = prices.find((x) => x.symbol === sym);
            const currentPrice = p ? Number(p.price) : row.Теперішня_ціна;
            let delta = 0;
            const entryPrice = row.Ціна_входу || 0;
            const tradeValue = row.Обєм || 0;

            if (row.Статус === "closed" || row.Статус === "liquidated") {
              delta = row.Дельта;
            } else {
              if (row.Long_Short === "Long") {
                delta = (currentPrice - entryPrice) * (tradeValue / entryPrice);
              } else {
                delta = (entryPrice - currentPrice) * (tradeValue / entryPrice);
              }
            }
            const commission = delta > 0 ? delta * 0.05 : 0;

            return {
              ...row,
              Теперішня_ціна: currentPrice,
              Дельта: Number(delta.toFixed(2)),
              Комісія: Number(commission.toFixed(2)),
            };
          })
        );
      } catch (err) {
        console.error("Помилка отримання цін Binance:", err);
      }
    };

    // Викликаємо функцію для отримання цін
    fetchPrices();

    // Оновлюємо ціни кожні 5 секунд
    const intervalId = setInterval(fetchPrices, 5000);

    return () => clearInterval(intervalId); // Очищення інтервалу при розмонтуванні
  }, [originalData]);

  const sortByOption = (value: string): void => {
    const sortedData = [...tableData].sort((a, b) => {
      const aValue = isNaN(Number(a[value])) ? a[value] : Number(a[value]);
      const bValue = isNaN(Number(b[value])) ? b[value] : Number(b[value]);

      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    });
    setTableData(sortedData);
  };

  const setSortOrder = (_value: string): void => {
    const sortedData = [...tableData].reverse();
    setTableData(sortedData);
  };

  const applyFilters = (filters: { [key: string]: string[] }) => {
    const filteredData = originalData.filter((trade) => {
      return Object.entries(filters).every(([label, values]) => {
        const option = filterOptions.find((opt) => opt.label === label);
        const dataKey = option?.key || label;
        const tradeValue = trade[dataKey];

        if (tradeValue === undefined || tradeValue === null) {
          return false;
        }

        if (values.length === 2) {
          const [min, max] = values.map(Number);
          return tradeValue >= min && tradeValue <= max;
        } else if (values.length === 1) {
          const filterValue = values[0].toLowerCase();
          if (typeof tradeValue === "string") {
            return tradeValue.toLowerCase() === filterValue;
          }
          return tradeValue.toString().toLowerCase().includes(filterValue);
        } else if (option?.type === "boolean") {
          // Логічні фільтри
          return values.includes(tradeValue.toString());
        }

        return true;
      });
    });

    setTableData(filteredData);
  };

  const handleCloseOrder = async (trade: any) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`https://crypto-demon-back.onrender.com/trade/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tradeId: trade.ID,
          exitPrice: trade.Теперішня_ціна,
        })
      });
      await fetchTrades();
    } catch (err) {
      console.error(err);
    }
  };

  return (
<div className="history-container">
  <div className="side-instruments">
    <div className="view-mode-selector">
      <div
        className={`view-mode-option ${viewMode === 'list' ? 'active' : ''}`}
        onClick={() => setViewMode('list')}
      >
        <span className="icon">☰</span>
      </div>
      <div
        className={`view-mode-option ${viewMode === 'card' ? 'active' : ''}`}
        onClick={() => setViewMode('card')}
      >
        <span className="icon">🖼️</span>
      </div>
    </div>
    <div className="sort-mode-container">
      <h3>Сортування за</h3>
      <Dropdown
        options={sortingOptions}
        placeholder="Сортування за"
        onChange={sortByOption}
      />
      <Dropdown
        options={[
          { label: "Від А до Я", value: "asc" },
          { label: "Від Я до А", value: "desc" },
        ]}
        placeholder="Порядок сортування"
        onChange={setSortOrder}
      />
      <FilterList
        title="Фільтри"
        options={filterOptions}
        onFilterChange={applyFilters}
      />
    </div>
  </div>
  <div className="trade-content">
    <h1>Торгівля</h1>
    <div className="trade-list">
      {viewMode === 'list' ? (
        <div className="trades-table">
          <Table
            columns={tableTradesColumns}
            data={tableData}
            columnWidths={tableTradesColumnsWidths}
            actionColumn={{
              header: 'Дія',
              width: '100px',
              render: (trade) =>
                trade.Статус === 'open'
                  ? <button onClick={() => handleCloseOrder(trade)}>Закрити ордер</button>
                  : null
            }}
            pagination={{
              defaultRowsPerPage: 10,
              rowsPerPageOptions: [5, 10, 20]
            }}
          />
        </div>
      ) : (
        <div className="trades-cards-container">
          <TradeCardContainer
            trades={tableData}
            onClose={handleCloseOrder}
          />
        </div>
      )}
    </div>
    <ChartPanel data={tableData} />
  </div>
</div>
  );
};

export default TradeHistory;