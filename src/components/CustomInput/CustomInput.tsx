import React from 'react';
import './CustomInput.css';

interface CustomInputProps {
  onChange: (value: string | number) => void;
  placeholder?: string;
  symbol?: string;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
}

const CustomInput: React.FC<CustomInputProps> = ({
  onChange,
  placeholder,
  symbol,
  type = 'text',
  min,
  max,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (type === 'number') {
      onChange(Number(value));
    } else {
      onChange(value);
    }
  };

  return (
    <div className="custom_input">
      <input
        type={type}
        onChange={handleChange}
        placeholder={placeholder}
        min={type === 'number' ? min : undefined}
        max={type === 'number' ? max : undefined}
      />
      {symbol && <span className="input_symbol">{symbol}</span>}
    </div>
  );
};

export default CustomInput;