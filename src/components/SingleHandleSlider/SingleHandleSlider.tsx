import React from "react";
import { Range, getTrackBackground } from "react-range";
import "./SingleHandleSlider.css";

interface SingleHandleSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

const SingleHandleSlider: React.FC<SingleHandleSliderProps> = ({ min, max, value, onChange }) => {
  const values = [value];
  return (
    <Range
      values={values}
      step={1}
      min={min}
      max={max}
      onChange={(vals) => onChange(vals[0])}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "6px",
            width: "100%",
            background: getTrackBackground({
              values: values,
              colors: ["#548BF4", "#ccc"],
              min,
              max,
            }),
            borderRadius: "3px",
            margin: "20px 0",
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: "16px",
            width: "16px",
            borderRadius: "50%",
            backgroundColor: "#548BF4",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="tooltip">{value}%</div>
        </div>
      )}
    />
  );
};

export default SingleHandleSlider;