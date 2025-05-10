import React, { useState, useEffect, useCallback } from "react";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import FilterList from "../../../../components/FilterList/FilterList";
import Table from "../../../../components/Table/Table";
import TradeCard from "../../../../components/TradeCard/TradeCard";
import { sortingOptions, tableTradesColumns, tableTradesColumnsWidths, generateFilterOptions } from "../../../../constants/tradeConstants";
import "./TradeHistory.css";
import ChartPanel from "../../../../components/ChartPanel/ChartPanel";

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
        const userTrades = data.trades.filter((t: any) => t.user?.id === user.id);
        const formatted = userTrades.map((trade: any) => ({
          ID: trade.id,
          Валюта: trade.currency?.symbol || '-',
          Long_Short: trade.type === 'buy' ? 'Long' : 'Short',
          Статус: trade.status,
          Дата_створення: new Date(trade.created_at).toLocaleDateString(),
          Маржа: Number(trade.margin),
          Кредитне_плече: Number(trade.leverage),
          Обєм: Number(trade.value),
          Ціна_входу: Number(trade.bought_at_price),
          Теперішня_ціна: 0,
          Орієнтована_ціна_ліквідації: Number(trade.liquidation_price),
          Дельта: trade.status === "closed"
            ? Number(trade.fixed_user_profit)
            : "отримується динамічно",
          Комісія: Number(trade.fixed_company_profit),
          Дата_закриття: trade.closed_at
            ? new Date(trade.closed_at).toLocaleDateString()
            : '-',
        }));
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
      new Set(originalData.map(t => t.Валюта + "USDT"))
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

        setTableData(current =>
          current.map(row => {
            const sym = row.Валюта + "USDT";
            const p = prices.find(x => x.symbol === sym);
            return {
              ...row,
              Теперішня_ціна: p ? Number(p.price) : row.Теперішня_ціна
            };
          })
        );
      } catch (err) {
        console.error("Помилка отримання цін Binance:", err);
      }
    };

    fetchPrices();
    const id = setInterval(fetchPrices, 5000);
    return () => clearInterval(id);
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

  const setSortOrder = (value: string): void => {
    const sortedData = [...tableData].reverse();
    setTableData(sortedData);
  };

  const applyFilters = (filters: { [key: string]: string[] }) => {

    const filteredData = originalData.filter((trade) => {

      const result = Object.entries(filters).every(([label, values]) => {
        const option = filterOptions.find(opt => opt.label === label);
        const dataKey = option?.key || label;
        const tradeValue = trade[dataKey];

        if (tradeValue === undefined || tradeValue === null) {
          return false;
        }

        if (values.length === 2) {
          const [min, max] = values.map(Number);
          const isInRange = tradeValue >= min && tradeValue <= max;
          return isInRange;
        } else if (values.length === 1) {
          const filterValue = values[0].toLowerCase();
          if (typeof tradeValue === "string") {
            const isMatch = tradeValue.toLowerCase() === filterValue;
            return isMatch;
          }
          const isIncluded = tradeValue.toString().toLowerCase().includes(filterValue);
          return isIncluded;
        }

        return true;
      });
      return result;
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
    <div className="history_container">
      <div className="side_instruments">
        <div className="view_mode_selector">
          <div
            className={`view_mode_option ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <span className="icon">☰</span>
          </div>
          <div
            className={`view_mode_option ${viewMode === 'card' ? 'active' : ''}`}
            onClick={() => setViewMode('card')}
          >
            <span className="icon">🖼️</span>
          </div>
        </div>
        <div className="sort_mode_container">
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
      <div className="trade_content">
        <h1>Торгівля</h1>
        <div className="trade_list">
          {viewMode === 'list' ? (
            <div className="trades_table">
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
            <div className="trades_cards_container">
              {tableData.map(trade => (
                <TradeCard
                  key={trade.ID}
                  trade={trade}
                  onClose={handleCloseOrder}
                />
              ))}
            </div>
          )}
        </div>
        <ChartPanel data={tableData} />
      </div>
    </div>
  );
};

export default TradeHistory;