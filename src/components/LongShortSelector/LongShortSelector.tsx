import React from "react";
import "./LongShortSelector.css";

interface LongShortSelectorProps {
  value: "long" | "short" | null;
  onChange: (value: "long" | "short") => void;
  style?: React.CSSProperties;
}

const LongShortSelector: React.FC<LongShortSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="longshort-selector">
      <button
        className={`long-option ${value === "long" ? "selected" : ""}`}
        onClick={() => onChange("long")}
      >
        🟢 Long
      </button>
      <button
        className={`short-option ${value === "short" ? "selected" : ""}`}
        onClick={() => onChange("short")}
      >
        🔴 Short
      </button>
    </div>
  );
};

export default LongShortSelector;
