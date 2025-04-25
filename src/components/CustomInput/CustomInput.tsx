import React from 'react';
import './CustomInput.css';

export interface CustomInputProps {
  symbol: string;
  onChange: (value: string | number) => void;
  type: string;
  min: number;
  max: number;
  value?: string;
  step?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  symbol, onChange, type = 'text', min, max, value, step
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // передаємо строку, а в батьківському onChange конвертуємо
    onChange(type === 'number' ? e.target.value : e.target.value);
  };

  return (
    <div className="custom_input">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
        step={type === 'number' ? step : undefined}   // ← прокидаємо
      />
      {symbol && <span className="input_symbol">{symbol}</span>}
    </div>
  );
};

export default CustomInput;