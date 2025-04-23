import { useState } from 'react';
import './SideInstruments.css';
import Dropdown from '../Dropdown/Dropdown';
import FilterList from '../FilterList/FilterList';

const SideInstruments = () => {
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');

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
          options={[
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
          onChange={setSortOrder}
        />
      <FilterList
        title="Фільтри"
        options={[
          { label: "ID", inputs: 2 },
          { label: "Кредитне плече", inputs: 2 },
          { label: "Валюта", inputs: 1 },
          { label: "Лонг" },
          { label: "Шорт" },
          { label: "Маржа", inputs: 2 },
          { label: "Відкритий ордер" },
          { label: "Закритий ордер" },
          { label: "Комісія", inputs: 2 },
          { label: "Орієнтований прибуток", inputs: 2 },
          { label: "Орієнтовані збитки", inputs: 2 },
          { label: "Дата створення", inputs: 2 },
          { label: "Дата закриття", inputs: 2 },
        ]}
        onFilterChange={setFilterOptions}
      />
      </div>
    </div>
  );
}
export default SideInstruments;
      {/* <div className="view_content">
        {viewMode === 'list' ? (
          <div className="list_view">
            <p>Елемент 1 (стрічковий режим)</p>
            <p>Елемент 2 (стрічковий режим)</p>
            <p>Елемент 3 (стрічковий режим)</p>
          </div>
        ) : (
          <div className="card_view">
            <div className="card">Елемент 1 (карточний режим)</div>
            <div className="card">Елемент 2 (карточний режим)</div>
            <div className="card">Елемент 3 (карточний режим)</div>
          </div>
        )}
      </div> */}