import { useState } from "react";
import "./Trade.css";
import Dropdown from "../../components/Dropdown/Dropdown";
import FilterList from "../../components/FilterList/FilterList";
import LongShortSelector from "../../components/LongShortSelector/LongShortSelector";
import CustomInput from "../../components/CustomInput/CustomInput";
import Table from "../../components/Table/Table";
import TradeCard from "../../components/TradeCard/TradeCard";

const Trade = () => {
    const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
    let currencyArray = [
      { label: "BTCUSDT", value: "BTCUSDT", icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Bitcoin.svg/1024px-Bitcoin.svg.png" },
      { label: "ETHUSDT", value: "ETHUSDT", icon: "https://www.iconarchive.com/download/i109534/cjdowner/cryptocurrency-flat/Ethereum-ETH.1024.png" },
      { label: "BNBUSDT", value: "BNBUSDT", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP9cUvoCvmCXO4pNHvnREHBCKW30U-BVxKfg&s" },
      { label: "XRPUSDT", value: "XRPUSDT", icon: "https://cdn-icons-png.flaticon.com/512/4821/4821657.png" },
      { label: "DOGEUSDT", value: "DOGEUSDT", icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkk8y5lQ3x584L9GY1kEBIPlZpGMb0Z0u9sA&s" },
    ]

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
      { label: "Маржа", inputs: 2,  slider: true, min: 10, max: 20},
      { label: "Відкритий ордер" },
      { label: "Закритий ордер" },
      { label: "Комісія", inputs: 2, slider: true, min: 10, max: 20},
      { label: "Орієнтований прибуток", inputs: 2, slider: true, min: 10, max: 20},
      { label: "Орієнтовані збитки", inputs: 2, slider: true, min: 10, max: 20},
      { label: "Дата створення", inputs: 2,  slider: true, min: 10, max: 20},
      { label: "Дата закриття", inputs: 2,  slider: true, min: 10, max: 20},
    ]

    let tableData = [
      {
        ID: 1,
        Валюта: 'BTCUSDT',
        Long_Short: 'Long',
        Статус: "Відкритий",
        Дата_створення: "2023-10-01 10:21",
        Маржа: 100,
        Кредитне_плече: 5,
        Обєм: 0.01,
        Ціна_входу: 50000,
        Орієнтовна_ціна_ліквідації: 49000,
        Дельта: 0.5,
        Комісія: 0.1,
        Дата_закриття: "-",
        Ціна_закриття: -1,
        Орієнтований_прибуток: 1000,
        Ціна_фіксації_прибутку: 52000,
        Орієнтовані_збитки: 500,
        Ціна_фіксації_збитків: 49000,
      },
      {
        ID: 2,
        Валюта: 'BTCUSDT',
        Long_Short: 'Long',
        Статус: "Закритий",
        Дата_створення: "2023-10-01 10:21",
        Маржа: 100,
        Кредитне_плече: 5,
        Обєм: 0.01,
        Ціна_входу: 50000,
        Орієнтовна_ціна_ліквідації: 49000,
        Дельта: 0.5,
        Комісія: 0.1,
        Дата_закриття: "2023-10-02 12:00",
        Ціна_закриття: 51000,
        Орієнтований_прибуток: 1000,
        Ціна_фіксації_прибутку: 52000,
        Орієнтовані_збитки: 500,
        Ціна_фіксації_збитків: 49000,
      },
    ]
    function sortByOption(value: string): void {
      console.log(value);
    }
    function setSortOrder(value: string): void {
      console.log(value);
    }
    const setFilterOptions = (selected: { [key: string]: string[] }) => {
      console.log("Вибрані фільтри:", selected);
    };
    const [position, setPosition] = useState<"long" | "short" | null>(null);
    const [leverage, setLeverage] = useState(Number);
    console.log("Кредитне плече:", leverage);
    return (
      <div className="trade_container">
        <div className="create_order_container">
          <h1>Створити новий ордер</h1>
          <div className="instruments_container">
            <div className="choose_instrument_container">
              <Dropdown 
                options={currencyArray}>
              </Dropdown>
              <LongShortSelector value={position} onChange={setPosition}/>
              <div className="choose_leverage_container">
                <h3>Кредитне плече</h3>
                <CustomInput
                symbol="x"
                onChange={(value) => setLeverage(value as number)}
                type="number"
                min={1}
                max={5}>
                </CustomInput>
              </div>
              <p>Максимальне кредине плече - 5х, щоб уникнути ризиків та забезпечити безпечу торгівлю. При 1х максимальний об'єм балансу що можна вкласти - 20%, відповідно, при 5х - 4%.</p>
            </div>
            <div className="choose_value_container">

            </div>
            <div className="choose_TPSL_container">

            </div>
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
                      {key: 'Обєм', header: 'Об\'єм ордеру'},
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
                  <TradeCard key={trade.ID} trade={trade} />))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default Trade;