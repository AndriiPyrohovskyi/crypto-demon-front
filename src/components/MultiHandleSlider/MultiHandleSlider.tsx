import React from "react";
import { Range, getTrackBackground } from "react-range";
import "./MultiHandleSlider.css";

interface MultiHandleSliderProps {
  min: number;
  max: number;
  values: number[];
  onChange: (values: number[]) => void;
}

const MultiHandleSlider: React.FC<MultiHandleSliderProps> = ({ min, max, values, onChange }) => {
  const sanitizedValues = values.map((value) => Math.max(min, Math.min(max, value)));

  return (
    <Range
      values={sanitizedValues}
      step={1}
      min={min}
      max={max}
      onChange={onChange}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
            marginTop: "20px",
            height: "6px",
            width: "100%",
            background: getTrackBackground({
              values: sanitizedValues,
              colors: ["#990000", "#FF2E2E", "#990000"],
              min,
              max,
            }),
            borderRadius: "4px",
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props, index }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "12px",
            width: "12px",
            borderRadius: "50%",
            backgroundColor: "#FF2E2E",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="tooltip">{sanitizedValues[index]}</div>
        </div>
      )}
    />
  );
};

export default MultiHandleSlider;
