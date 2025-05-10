import { useState, useRef, useEffect } from "react";
import "./Dropdown.css";

interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
  balanceInUSD?: number;
}

interface DropdownProps {
  options: DropdownOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DropdownOption | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: DropdownOption) => {
    setSelected(option);
    setOpen(false);
    onChange?.(option.value);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <div className="dropdown-selected" onClick={() => setOpen(!open)}>
        {selected?.icon && <img src={selected.icon} alt="" className="dropdown-icon" />}
        <span>{selected?.label || placeholder || "Оберіть"}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {open && (
        <div className="dropdown-options">
          {options.map((opt, idx) => (
            <div key={idx} className="dropdown-option" onClick={() => handleSelect(opt)}>
              {opt.icon && <img src={opt.icon} alt="" className="dropdown-icon" />}
              <span>{opt.label}</span>
              {opt.balanceInUSD !== undefined && (
                <span className="dropdown-balance">${opt.balanceInUSD.toFixed(2)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
