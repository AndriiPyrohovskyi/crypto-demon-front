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
    return (
        <Range
        values={values}
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
                values,
                colors: ["#ccc", "#548BF4", "#ccc"],
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
                backgroundColor: "#548BF4",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
            >
            <div className="tooltip">{values[index]}</div>
            </div>
        )}
        />
    );
    };

    export default MultiHandleSlider;
