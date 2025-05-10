import React, { useState, useEffect } from "react";
import Dropdown from "../../../../components/Dropdown/Dropdown";
import LongShortSelector from "../../../../components/LongShortSelector/LongShortSelector";
import CustomInput from "../../../../components/CustomInput/CustomInput";
import SingleHandleSlider from "../../../../components/SingleHandleSlider/SingleHandleSlider";
import Button from "../../../../components/Button/Button";
import "./CreateOrder.css";

interface CurrencyOption {
  label: string;
  value: string;
  icon: string;
}

type CreateOrderProps = {
  userBalance: number;
};

const CreateOrder: React.FC<CreateOrderProps> = ({ userBalance }) => {
  const [entryPriceType, setEntryPriceType] = useState<"market" | "limit">("market");
  const [currentMarketPrice, setCurrentMarketPrice] = useState<number>(1000);
  const [selectedCurrency, setSelectedCurrency] = useState<{ label: string; value: string; icon: string;} | null>(null);
  const [position, setPosition] = useState<"long" | "short">("long");
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
  const [currencyArray, setCurrencyArray] = useState<CurrencyOption[]>([]);
  
  const getMaxInvestmentFactor = (lev: number): number => {
    return 20 / lev;
  };

  const getActivePrice = () =>
    entryPriceType === "limit" && entryPrice > 0 ? entryPrice : currentMarketPrice;

  const maxInvestment = userBalance * (getMaxInvestmentFactor(leverage) / 100);

  const syncValues = (source: "dollar" | "crypto" | "percent", raw: number) => {
    const price = getActivePrice();
    const m = maxInvestment;
    switch (source) {
      case "dollar": {
        const dollar = raw;
        const crypto = price > 0 ? dollar / price : 0;
        const percent = m > 0 ? Math.min(100, (dollar / m) * 100) : 0;
        setInvestmentDollar(dollar);
        setInvestmentCrypto(crypto);
        setInvestmentPercent(percent);
        break;
      }
      case "crypto": {
        const crypto = raw;
        const dollar = price > 0 ? crypto * price : 0;
        const percent = m > 0 ? Math.min(100, (dollar / m) * 100) : 0;
        setInvestmentCrypto(crypto);
        setInvestmentDollar(dollar);
        setInvestmentPercent(percent);
        break;
      }
      case "percent": {
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

  const handleDollarChange = (value: string | number) => {
    syncValues("dollar", Number(value));
  };

  const handleCryptoChange = (value: string | number) => {
    syncValues("crypto", Number(value));
  };

  const handleSliderChange = (val: number) => {
    syncValues("percent", val);
  };

  const isInvestmentExceeded = investmentDollar > maxInvestment + 1e-8;

  useEffect(() => {
    const fetchPrice = async () => {
      if (!selectedCurrency || !selectedCurrency.value) return;
      try {
        const res = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${selectedCurrency.value}`
        );
        if (!res.ok) {
          console.error("Помилка API:", res.statusText);
          return;
        }
        const data = await res.json();
        if (data.price) {
          setCurrentMarketPrice(Number(data.price));
        } else {
          console.error("Ціна не знайдена в API-відповіді");
        }
      } catch (e) {
        console.error("Помилка під час отримання ціни:", e);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);
    return () => clearInterval(interval);
  }, [selectedCurrency]);
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
  
  useEffect(() => {
    const price = getActivePrice();
    if (price > 0 && leverage > 0 && investmentDollar > 0) {
      const sizeCrypto = (investmentDollar * leverage) / price;

      if (sizeCrypto > 0) {
        const liq =
          position === "long"
            ? price - (price * 1/leverage)
            : price + (price * 1/leverage);
        setLiquidationPrice(liq);
      } else {
        setLiquidationPrice(0);
      }
    } else {
      setLiquidationPrice(0);
    }
  }, [entryPrice, entryPriceType, currentMarketPrice, leverage, position, investmentDollar]);

  useEffect(() => {
    if (entryPriceType === "market") {
      setEntryPrice(currentMarketPrice);
    }
  }, [entryPriceType, currentMarketPrice]);

  useEffect(() => {
    if (investmentDollar > 0) {
      setCommission(investmentDollar * 0.05);
    } else {
      setCommission(0);
    }
  }, [investmentDollar]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://crypto-demon-back.onrender.com/currency",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(res.statusText);
        const data: Array<{ symbol: string; logo_url: string }> =
          await res.json();
        const options = data.map((c) => ({
          label: c.symbol,
          value: c.symbol + "USDT",
          icon: c.logo_url,
        }));
        setCurrencyArray(options);
      } catch (err) {
        console.error("Не вдалося завантажити валюти:", err);
      }
    };
    fetchCurrencies();
  }, []);

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
      const result = JSON.parse(text);

      if (res.ok && result.status === "success") {
        alert(result.message);
      } else {
        alert("Сталася помилка: " + (result.message || res.statusText));
      }
    } catch (err) {
      alert("Не вдалось відкрити ордер");
    }
  };

  return (
    <div className="create_order_container">
      <h1>Створити новий ордер</h1>
      <h2>Баланс: ${userBalance.toFixed(2)}</h2>
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
            <p>Поточна ціна: ${entryPrice}</p>
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
            step={0.01}
          />
          <h4>Ціна фіксації прибутку</h4>
          <CustomInput
            symbol="$"
            value={takeProfitPrice.toFixed(2)}
            onChange={(v) => {
              const p = Number(v);
              setTakeProfitPrice(p);
              setTargetProfit(
                position === "long"
                  ? p - entryPrice
                  : entryPrice - p
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
                position === "long"
                  ? entryPrice - p
                  : p - entryPrice
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
  );
};

export default CreateOrder;