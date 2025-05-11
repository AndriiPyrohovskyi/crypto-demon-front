export const transactionSortingOptions = [
    { label: 'ID', value: 'id' },
    { label: 'Відправник', value: 'sender' },
    { label: 'Одержувач', value: 'recipient' },
    { label: 'Валюта', value: 'currency' },
    { label: 'Сума', value: 'value' },
    { label: 'Ціна транзакції', value: 'price_at_transaction' },
    { label: 'Комісія', value: 'fee' },
    { label: 'Дата', value: 'created_at' },
  ];
  
  export const transactionColumns = [
    { key: 'id', header: 'ID' },
    { key: 'sender', header: 'Відправник' },
    { key: 'recipient', header: 'Одержувач' },
    { key: 'currency', header: 'Валюта' },
    { key: 'value', header: 'Сума' },
    { key: 'price_at_transaction', header: 'Ціна транзакції' },
    { key: 'fee', header: 'Комісія' },
    { key: 'created_at', header: 'Дата' },
  ];
  
  export const transactionColumnsWidths = {
    id: '50px',
    sender: '120px',
    recipient: '120px',
    currency: '80px',
    value: '80px',
    price_at_transaction: '120px',
    fee: '80px',
    created_at: '120px',
  };
  
  export type TxRow = {
    id: number;
    sender: string;
    recipient: string;
    currency: string;
    value: number;
    price_at_transaction: number;
    fee: number | null;
    created_at: string;
  };

  export const generateTransactionFilterOptions = (txs: any[]) => {
    const numericFields = [
      { label: 'ID', key: 'id' },
      { label: 'Сума', key: 'value' },
      { label: 'Ціна транзакції', key: 'price_at_transaction' },
      { label: 'Комісія', key: 'fee' },
    ];
  
    const textFields = [
      { label: 'Відправник', key: 'sender', inputs: 1, type: 'text' },
      { label: 'Одержувач', key: 'recipient', inputs: 1, type: 'text' },
      { label: 'Валюта', key: 'currency', inputs: 1, type: 'text' },
      { label: 'Дата', key: 'created_at', inputs: 1, type: 'text' },
    ];
  
    const numericOptions = numericFields.map(field => {
      const values = txs
        .map(tx => tx[field.key])
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