import React from 'react';
import './CustomInput.css';

export interface CustomInputProps {
  symbol?: string;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  type: string;
  min?: number;
  max?: number;
  value?: string;
  step?: number;
  placeholder?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  symbol, onChange, onBlur, type = 'text', min, max, value, step, placeholder
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(type === 'number' ? e.target.value : e.target.value);
  };

  return (
    <div className="custom-input">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
        step={type === 'number' ? step : undefined}
        placeholder={placeholder}
      />
      {symbol && <span className="input-symbol">{symbol}</span>}
    </div>
  );
};

export default CustomInput;
