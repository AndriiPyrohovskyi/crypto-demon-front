import React, { useState } from "react";
import "./FilterList.css";
import MultiHandleSlider from "../MultiHandleSlider/MultiHandleSlider";

interface FilterOption {
  label: string;
  inputs?: number;
  slider?: boolean;
  type?: "text" | "number";
  min?: number;
  max?: number;
}

interface FilterListProps {
  title: string;
  options: FilterOption[];
  onFilterChange: (value: { [key: string]: string[] }) => void;
}

const FilterList: React.FC<FilterListProps> = ({ title, options, onFilterChange }) => {
  const [selected, setSelected] = useState<{ [key: string]: string[] }>({});

  const update = (label: string, newValues: string[]) => {
    const updated = { ...selected, [label]: newValues };
    setSelected(updated);
    onFilterChange(updated);
  };

  const toggleOption = (label: string, count = 0, optMin = 0, optMax = 100) => {
    const current = selected[label];
    const option = options.find(opt => opt.label === label);

    if (current) {
      const updated = { ...selected };
      delete updated[label];
      setSelected(updated);
      onFilterChange(updated);
    } else {
      let defaultValues: string[] = count > 0
        ? Array.from({ length: count }, (_, i) =>
            Math.round(((optMax - optMin) / (count - 1)) * i + optMin).toString())
        : [optMin.toString()];

      update(label, defaultValues);
    }
  };

  const updateInput = (label: string, index: number, val: string) => {
    const option = options.find(opt => opt.label === label);
    const type = option?.type || "text";
    const min = option?.min ?? 0;
    const max = option?.max ?? 100;

    let values = [...(selected[label] || [])];
    if (type === "number") {
      let parsed = parseInt(val);
      if (isNaN(parsed)) parsed = 0;
      parsed = Math.max(min, Math.min(max, parsed));
      values[index] = parsed.toString();
      for (let i = 1; i < values.length; i++) {
        if (+values[i] < +values[i - 1]) values[i] = values[i - 1];
      }
    } else {
      values[index] = val;
    }

    update(label, values);
  };

  return (
    <div className="filter_list">
      <h3>{title}</h3>
      {options.map(({ label, inputs = 0, slider, type, min, max }, i) => (
        <div key={i} className="filter_item">
          <label>
            <input
              type="checkbox"
              checked={!!selected[label]}
              onChange={() => toggleOption(label, inputs, min ?? 0, max ?? 100)}
            />
            <span>{label}</span>
          </label>
          {selected[label] && (
            <div className="filter_inputs">
              <div className="input_fields">
                {Array.from({ length: inputs }).map((_, idx) => (
                  <input
                    key={idx}
                    type={type || "text"}
                    value={selected[label][idx] || ""}
                    onChange={(e) => updateInput(label, idx, e.target.value)}
                    min={type === "number" ? min : undefined}
                    max={type === "number" ? max : undefined}
                  />
                ))}
              </div>
              {slider && (
                <MultiHandleSlider
                  min={min || 0}
                  max={max || 100}
                  values={selected[label].map(Number)}
                  onChange={(vals) => update(label, vals.map(String))}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterList;
