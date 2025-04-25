import { useState, useEffect } from "react";
import "./Trade.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import FilterList from "../../components/FilterList/FilterList";
import LongShortSelector from "../../components/LongShortSelector/LongShortSelector";
import CustomInput from "../../components/CustomInput/CustomInput";
import Table from "../../components/Table/Table";
import TradeCard from "../../components/TradeCard/TradeCard";
import { useAuth } from "../../context/AuthContext";
import SingleHandleSlider from "../../components/SingleHandleSlider/SingleHandleSlider";
import Button from "../../components/Button/Button";

interface CurrencyItem {
  label: string;
  value: string;
  icon: string;
}

const Trade = () => {
  const { user } = useAuth();

  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [tableData, setTableData] = useState<any[]>([]);
  const [entryPriceType, setEntryPriceType] = useState<"market" | "limit">("market");
  const [currentMarketPrice, setCurrentMarketPrice] = useState<number>(1000);
  
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem | null>(null);
  const [position, setPosition] = useState<"long" | "short" | null>(null);
  const [leverage, setLeverage] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [investmentDollar, setInvestmentDollar] = useState<number>(0);
  const [investmentCrypto, setInvestmentCrypto] = useState<number>(0);
  const [investmentPercent, setInvestmentPercent] = useState<number>(50);

  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);
  const [commission, setCommission] = useState<number>(0);

  const [targetProfit, setTargetProfit] = useState<number>(0);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [stopLossFixPrice, setStopLossFixPrice] = useState<number>(0);

  const userBalance = Number(user.balance);

  let sortingOptions = [
    { label: "ID", value: "id" },
    { label: "Валюта", value: "currency" },
    { label: "Лонг/Шорт", value: "long_short" },
    { label: "Статус", value: "status" },
    { label: "Дата створення", value: "creation_date" },
    { label: "Маржа", value: "margin" },
    { label: "Кредитне плече", value: "leverage" },
    { label: "Дельта", value: "delta" },
    { label: "Комісія", value: "commission" },
    { label: "Дата закриття", value: "closing_date" },
    { label: "Орієнтований прибуток", value: "estimated_profit" },
    { label: "Орієнтовані збитки", value: "estimated_loss" },
  ];

  let filterOptions = [
    { label: "ID", inputs: 2, slider: true, min: 10, max: 20},
    { label: "Кредитне плече", inputs: 2, slider: true, min: 10, max: 20},
    { label: "Валюта", inputs: 1},
    { label: "Лонг" },
    { label: "Шорт" },
    { label: "Маржа", inputs: 2, slider: true, min: 10, max: 20},
    { label: "Відкритий ордер" },
    { label: "Закритий ордер" },
    { label: "Комісія", inputs: 2, slider: true, min: 10, max: 20},
    { label: "Орієнтований прибуток", inputs: 2, slider: true, min: 10, max: 20},
    { label: "Орієнтовані збитки", inputs: 2, slider: true, min: 10, max: 20},
    { label: "Дата створення", inputs: 2, slider: true, min: 10, max: 20},
    { label: "Дата закриття", inputs: 2, slider: true, min: 10, max: 20},
  ];

  // const currencyMapping: { [key: string]: number } = {
  //   BTCUSDT: 1,
  //   ETHUSDT: 2,
  //   BNBUSDT: 3,
  //   XRPUSDT: 4,
  //   DOGEUSDT: 5,
  // };

  let currencyArray: CurrencyItem[] = [
    { label: "BTCUSDT", value: "BTCUSDT", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png" },
    { label: "ETHUSDT", value: "ETHUSDT", icon: "https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png" },
    { label: "BNBUSDT", value: "BNBUSDT", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP9cUvoCvmCXO4pNHvnREHBCKW30U-BVxKfg&s" },
    { label: "XRPUSDT", value: "XRPUSDT", icon: "https://cdn-icons-png.flaticon.com/512/4821/4821657.png" },
    { label: "DOGEUSDT", value: "DOGEUSDT", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkk8y5lQ3x584L9GY1kEBIPlZpGMb0Z0u9sA&s" },
  ];

  const getMaxInvestmentFactor = (lev: number): number => {
    return 20/lev;
  };

  const getActivePrice = () =>
    entryPriceType === "limit" && entryPrice > 0 ? entryPrice : currentMarketPrice;
  const maxInvestment = userBalance * (getMaxInvestmentFactor(leverage) / 100);

  // central sync
  const syncValues = (source: 'dollar' | 'crypto' | 'percent', raw: number) => {
    const price = getActivePrice();
    const m = maxInvestment;
    switch (source) {
      case 'dollar': {
        const dollar = raw;
        const crypto = price > 0 ? dollar / price : 0;
        const percent = m > 0 ? Math.min(100, (dollar / m) * 100) : 0;
        setInvestmentDollar(dollar);
        setInvestmentCrypto(crypto);
        setInvestmentPercent(percent);
        break;
      }
      case 'crypto': {
        const crypto = raw;
        const dollar = price > 0 ? crypto * price : 0;
        const percent = m > 0 ? Math.min(100, (dollar / m) * 100) : 0;
        setInvestmentCrypto(crypto);
        setInvestmentDollar(dollar);
        setInvestmentPercent(percent);
        break;
      }
      case 'percent': {
        const percent = raw;
        const dollar = (m * percent) / 100;
        const crypto = price > 0 ? dollar / price : 0;
        setInvestmentPercent(percent);
        setInvestmentDollar(dollar);
        setInvestmentCrypto(crypto);
        break;
      }
    }
  };

  // handlers
  const handleDollarChange = (value: string | number) => {
    syncValues('dollar', Number(value));
  };

  const handleCryptoChange = (value: string | number) => {
    syncValues('crypto', Number(value));
  };

  const handleSliderChange = (val: number) => {
    syncValues('percent', val);
  };

  const isInvestmentExceeded = investmentDollar > maxInvestment + 1e-8;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchPrice = async () => {
      if (!selectedCurrency) return;
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${selectedCurrency.value}`
        );
        const data = await res.json();
        if (data.price) setCurrentMarketPrice(Number(data.price));
      } catch (e) {
        // fallback or ignore
      }
    };
    fetchPrice();
    interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [selectedCurrency]);

  useEffect(() => {
    const price = getActivePrice();
    if (price > 0 && leverage > 0) {
      const liq =
        position === "long"
          ? price * (1 - 1 / leverage)
          : price * (1 + 1 / leverage);
      setLiquidationPrice(liq);
    } else {
      setLiquidationPrice(0);
    }
    setCommission(investmentDollar * 0.05);
  }, [
    entryPrice,
    entryPriceType,
    currentMarketPrice,
    leverage,
    position,
    investmentDollar
  ]);

  useEffect(() => {
    const price = getActivePrice();
    if (investmentDollar > 0 && leverage > 0) {
      const sizeCrypto = (investmentDollar * leverage) / price;
      const tpPrice =
        position === 'long'
          ? price + targetProfit / sizeCrypto
          : price - targetProfit / sizeCrypto;
      setTakeProfitPrice(tpPrice);
    } else {
      setTakeProfitPrice(price);
    }
  }, [
    targetProfit,
    entryPriceType,
    entryPrice,
    currentMarketPrice,
    position,
    investmentDollar,
    leverage
  ]);

  useEffect(() => {
    const price = getActivePrice();
    if (investmentDollar > 0 && leverage > 0) {
      const sizeCrypto = (investmentDollar * leverage) / price;
      const slPrice =
        position === 'long'
          ? price - stopLoss / sizeCrypto
          : price + stopLoss / sizeCrypto;
      setStopLossFixPrice(slPrice);
    } else {
      setStopLossFixPrice(price);
    }
  }, [
    stopLoss,
    entryPriceType,
    entryPrice,
    currentMarketPrice,
    position,
    investmentDollar,
    leverage
  ]);

  const handleOpenOrder = async () => {
    if (!selectedCurrency || !position || investmentDollar <= 0) {
      alert("Будь ласка, заповніть всі необхідні поля");
      return;
    }

    const body = {
      symbol: selectedCurrency.value.replace(/USDT$/, ''),
      margin: investmentDollar,
      leverage: leverage,
      type: position === "long" ? "buy" : "sell",
      entryPrice: getActivePrice(),
      closing_price: 0,
      TP_value: targetProfit,
      SL_value: stopLoss,
      TP_price: takeProfitPrice,
      SL_price: stopLossFixPrice
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        "https://crypto-demon-back.onrender.com/trade/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(body),
        }
      );

      const text = await res.text();
      console.log("CreateTrade response:", text);
      const result = JSON.parse(text);

      if (res.ok && result.status === "success") {
        alert(result.message);
      } else {
        console.error("CreateTrade error:", result);
        alert("Сталася помилка: " + (result.message || res.statusText));
      }
    } catch (err) {
      console.error("Error opening order:", err);
      alert("Не вдалось відкрити ордер");
    }
  };

  useEffect(() => {
    const fetchTrades = async () => {
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
          console.log("Отримані дані:", data);
          console.log("User from Trade:", user);
          const userTrades = data.trades.filter((trade: any) => trade.user && trade.user.id === user.id);
          const formattedTrades = userTrades.map((trade: any) => ({
            ID: trade.id,
            Валюта: trade.currency?.symbol || '-',
            Long_Short: trade.type === 'buy' ? 'Long' : 'Short',
            Статус: trade.status,
            Дата_створення: new Date(trade.created_at).toLocaleDateString(),
            Маржа: Number(trade.margin).toFixed(2),
            Кредитне_плече: trade.leverage,
            Обєм: Number(trade.value).toFixed(2),
            Ціна_входу: Number(trade.bought_at_price).toFixed(2),
            Орієнтована_ціна_ліквідації: Number(trade.liquidation_price).toFixed(2),
            Дельта: trade.status === "closed" ? Number(trade.fixed_user_profit).toFixed(2) : "отримується динамічно",
            Комісія: Number(trade.fixed_company_profit).toFixed(2),
            Дата_закриття: trade.closed_at
              ? new Date(trade.closed_at).toLocaleDateString()
              : '-',
            Ціна_закриття: 'в розробці',
            Орієнтований_прибуток: 'в розробці',
            Ціна_фіксації_прибутку: 'в розробці',
            Орієнтовані_збитки: 'в розробці',
            Ціна_фіксації_збитків: 'в розробці'
          }));
          setTableData(formattedTrades);
        } else {
          console.error("Failed to fetch trades:", await res.text());
        }
      } catch (err) {
        console.error("Error fetching trades:", err);
      }
    };
    fetchTrades();
  }, []);

  function sortByOption(value: string): void {
    console.log(value);
  }
  function setSortOrder(value: string): void {
    console.log(value);
  }
  const setFilterOptions = (selected: { [key: string]: string[] }) => {
    console.log("Вибрані фільтри:", selected);
  };

  return (
    <div className="trade_container">
      <div className="create_order_container">
        <h1>Створити новий ордер</h1>
        <div className="instruments_container">
          <div className="choose_instrument_container">
            <Dropdown
              options={currencyArray}
              placeholder="Оберіть криптовалюту"
              onChange={(value) => {
                const curr = currencyArray.find((c) => c.value === value);
                setSelectedCurrency(curr || null);
              }}
            />
            <LongShortSelector value={position} onChange={setPosition} />
            <div className="choose_leverage_container">
              <h3>Кредитне плече</h3>
              <CustomInput
                symbol="x"
                onChange={(value) => setLeverage(Number(value))}
                type="number"
                min={1}
                max={5}
              />
              <p>
                Максимальне кредитне плече - 5х, щоб уникнути ризиків. При 1х – 20% балансу,
                2х – 10%, 3х – ~6.67%, 4х – 5%, 5х – 4%.
              </p>
            </div>
          </div>
          <div className="choose_value_container">
            <h3>Ціна входу</h3>
            <Dropdown
              options={[
                { label: "Ринкова ціна", value: "market" },
                { label: "Лімітна ціна", value: "limit" },
              ]}
              placeholder="Тип ціни входу"
              onChange={(value) => setEntryPriceType(value as "market" | "limit")}
            />
            {entryPriceType === "limit" ? (
              <CustomInput
                symbol="$"
                onChange={(value) => setEntryPrice(Number(value))}
                type="number"
                min={0}
                max={1000000000}
              />
            ) : (
              <p>Поточна ціна: ${currentMarketPrice}</p>
            )}
            <h3>Ваш вклад</h3>
            <CustomInput
              symbol="$"
              value={(Number(investmentDollar).toFixed(2)).toString()}
              onChange={handleDollarChange}
              type="number"
              min={0}
              max={1000000000}
            />
            <CustomInput
              symbol={selectedCurrency?.value || "CRYPTO"}
              value={(Number(investmentCrypto).toFixed(2)).toString()}
              onChange={handleCryptoChange}
              type="number"
              min={0}
              max={1000000000}
            />
            <SingleHandleSlider
              min={0}
              max={100}
              value={Number(Number(investmentPercent).toFixed(0))}
              onChange={handleSliderChange}
            />
            <p>Вклад: {Number(investmentPercent).toFixed(0)}%</p>
            {isInvestmentExceeded && (
              <p style={{ color: "red" }}>
                Перевищено максимальний вклад! Зменшіть суму або кредитне плече.
              </p>
            )}
            <h3>Орієнтовна ціна ліквідації:</h3>
            <p>${liquidationPrice.toFixed(2)}</p>
            <h3>Комісія: </h3>
            <p>${commission.toFixed(2)}</p>
          </div>
          <div className="choose_TPSL_container">
            <h3>Тейк Профіт</h3>
            <h4>Орієнтований прибуток (у $)</h4>
            <CustomInput
              symbol="$"
              value={targetProfit.toFixed(2)}
              onChange={(v) => setTargetProfit(Number(v))}
              type="number"
              min={0}
              max={1e9}
              step={0.01}                            // ← додаємо
            />
            <h4>Ціна фіксації прибутку</h4>
            <CustomInput
              symbol="$"
              value={takeProfitPrice.toFixed(2)}
              onChange={(v) => {
                const p = Number(v);
                setTakeProfitPrice(p);
                setTargetProfit(
                  position === 'long'
                    ? p - getActivePrice()            // ← від активної ціни
                    : getActivePrice() - p
                );
              }}
              type="number"
              min={0}
              max={1e9}
              step={0.01}
            />

            <h3>Стоп Лосс</h3>
            <h4>Орієнтований збиток (у $)</h4>
            <CustomInput
              symbol="$"
              value={stopLoss.toFixed(2)}
              onChange={(v) => setStopLoss(Number(v))}
              type="number"
              min={0}
              max={1e9}
              step={0.01}
            />
            <h4>Ціна фіксації збитку</h4>
            <CustomInput
              symbol="$"
              value={stopLossFixPrice.toFixed(2)}
              onChange={(v) => {
                const p = Number(v);
                setStopLossFixPrice(p);
                setStopLoss(
                  position === 'long'
                    ? getActivePrice() - p
                    : p - getActivePrice()
                );
              }}
              type="number"
              min={0}
              max={1e9}
              step={0.01}
            />
            <h3>Комісія за відкриття ордеру</h3>
            <p>1% від об'єму ордеру</p>
          </div>
          <Button text={"Відкрити ордер"} onClick={handleOpenOrder} />
        </div>
      </div>
      <div className="history_container">
        <div className="side_instruments">
          <div className="view_mode_selector">
            <div className={`view_mode_option ${viewMode === 'list' ? 'active' : ''}`}
                 onClick={() => setViewMode('list')}>
              <span className="icon">☰</span>
            </div>
            <div className={`view_mode_option ${viewMode === 'card' ? 'active' : ''}`}
                 onClick={() => setViewMode('card')}>
              <span className="icon">🖼️</span>
            </div>
          </div>
          <div className="sort_mode_container">
            <h3>Сортування за</h3>
            <Dropdown
              options={sortingOptions}
              placeholder="Сортування за"
              onChange={sortByOption}/>
            <Dropdown
              options={[
                { label: "Від А до Я", value: "asc" },
                { label: "Від Я до А", value: "desc" },
              ]}
              placeholder="Порядок сортування"
              onChange={setSortOrder}/>
            <FilterList
              title="Фільтри"
              options={filterOptions}
              onFilterChange={setFilterOptions}/>
          </div>
        </div>
        <div className="trade_content">
          <h1>Торгівля</h1>
          <div className="trade_list">
            {viewMode === 'list' ? (
              <div className="trades_table">
                <Table
                  columns={[
                    { key: 'ID', header: 'ID' },
                    { key: 'Валюта', header: 'Валюта' },
                    { key: 'Long_Short', header: 'Long Short' },
                    { key: 'Статус', header: 'Статус ордеру' },
                    { key: 'Дата_створення', header: 'Дата створення' },
                    { key: 'Маржа', header: 'Маржа' },
                    { key: 'Кредитне_плече', header: 'Кредитне плече' },
                    { key: 'Обєм', header: "Об'єм ордеру" },
                    { key: 'Ціна_входу', header: 'Ціна входу' },
                    { key: 'Орієнтовна_ціна_ліквідації', header: 'Орієнтовна ціна ліквідації' },
                    { key: 'Дельта', header: 'Дельта' },
                    { key: 'Комісія', header: 'Комісія' },
                    { key: 'Дата_закриття', header: 'Дата закриття' },
                    { key: 'Ціна_закриття', header: 'Ціна закриття' },
                    { key: 'Орієнтований_прибуток', header: 'Орієнтований прибуток' },
                    { key: 'Ціна_фіксації_прибутку', header: 'Ціна фіксації прибутку' },
                    { key: 'Орієнтовані_збитки', header: 'Орієнтовані збитки' },
                    { key: 'Ціна_фіксації_збитків', header: 'Ціна фіксації збитків' },
                  ]}
                  data={tableData}
                  columnWidths={{
                    ID: '35px', 
                    Валюта: '90px', 
                    Long_Short: '60px', 
                    Статус: '80px', 
                    Дата_створення: '100px', 
                    Маржа: '70px', 
                    Кредитне_плече: '90px', 
                    Обєм: '70px', 
                    Ціна_входу: '60px', 
                    Орієнтовна_ціна_ліквідації: '100px', 
                    Дельта: '70px', 
                    Комісія: '75px', 
                    Дата_закриття: '100px', 
                    Ціна_закриття: '85px', 
                    Орієнтований_прибуток: '120px', 
                    Ціна_фіксації_прибутку: '120px',
                    Орієнтовані_збитки: '120px',
                    Ціна_фіксації_збитків: '120px'
                  }}
                />
              </div>
            ) : (
              <div className="trades_cards_container">
                {tableData.map(trade => (
                  <TradeCard key={trade.ID} trade={trade} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trade;