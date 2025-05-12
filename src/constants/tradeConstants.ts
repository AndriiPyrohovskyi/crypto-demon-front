export const sortingOptions = [
  { label: "ID", value: "ID" },
  { label: "Валюта", value: "Валюта" },
  { label: "Лонг/Шорт", value: "Long_Short" },
  { label: "Статус", value: "Статус" },
  { label: "Дата створення", value: "Дата_створення" },
  { label: 'Маржа', value: 'Маржа' },
  { label: "Кредитне плече", value: "Кредитне_плече" },
  { label: "Об'єм ордеру", value: "Обєм" },
  { label: "Дельта", value: "Дельта" },
  { label: "Комісія", value: "Комісія" },
  { label: "Дата закриття", value: "Дата_закриття" },
  { label: "Орієнтований прибуток", value: "Орієнтований_прибуток" },
  { label: "Орієнтовані збитки", value: "Орієнтовані_збитки" },
];


export const tableTradesColumns = [
  { key: 'ID', header: 'ID' },
  { key: 'Валюта', header: 'Валюта' },
  { key: 'Long_Short', header: 'Long Short' },
  { key: 'Статус', header: 'Статус ордеру' },
  { key: 'Дата_створення', header: 'Дата створення' },
  { key: 'Маржа', header: 'Маржа' },
  { key: 'Кредитне_плече', header: 'Кредитне плече' },
  { key: 'Обєм', header: "Об'єм ордеру" },
  { key: 'Ціна_входу', header: 'Ціна входу' },
  { key: 'Теперішня_ціна', header: 'Теперішня ціна' },
  { key: 'Орієнтована_ціна_ліквідації', header: 'Орієнтовна ціна ліквідації' },
  { key: 'Дельта', header: 'Дельта' },
  { key: 'Комісія', header: 'Комісія' },
  { key: 'Дата_закриття', header: 'Дата закриття' },
  { key: 'Ціна_закриття', header: 'Ціна закриття' },
  { key: 'Орієнтований_прибуток', header: 'Орієнтований прибуток' },
  { key: 'Ціна_фіксації_прибутку', header: 'Ціна фіксації прибутку' },
  { key: 'Орієнтовані_збитки', header: 'Орієнтовані збитки' },
  { key: 'Ціна_фіксації_збитків', header: 'Ціна фіксації збитків' },
];

export const tableTradesColumnsWidths = {
  ID: '35px',
  Валюта: '90px',
  Long_Short: '60px',
  Статус: '80px',
  Дата_створення: '110px',
  Маржа: '100px',
  Кредитне_плече: '90px',
  Обєм: '90px',
  Ціна_входу: '100px',
  Теперішня_ціна: '100px',
  Орієнтована_ціна_ліквідації: '150px',
  Дельта: '100px',
  Комісія: '90px',
  Дата_закриття: '110px',
  Ціна_закриття: '100px',
  Орієнтований_прибуток: '140px',
  Ціна_фіксації_прибутку: '120px',
  Орієнтовані_збитки: '140px',
  Ціна_фіксації_збитків: '120px'
};

export const generateFilterOptions = (trades: any[]) => {
  const numericFields = [
    { label: "ID", key: "ID" },
    { label: "Кредитне плече", key: "Кредитне_плече" },
    { label: "Дельта", key: "Дельта" },
  ];

  const textFields = [
    { label: "Валюта", key: "Валюта", inputs: 1, type: "text" },
  ];

  const numericOptions = numericFields.map((field) => {
    const values = trades.map((trade) => trade[field.key]).filter((v) => typeof v === "number");
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { label: field.label, key: field.key, inputs: 2, slider: true, min, max };
  });

  const textOptions = textFields.map((field) => ({
    label: field.label,
    key: field.key,
    inputs: field.inputs,
    type: field.type,
  }));

  return [...numericOptions, ...textOptions];
};