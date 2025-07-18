import React from "react";

const Slider = ({ min = 0, max = 100, value, onChange }) => {
  return (
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="w-full"
    />
  );
};

export default Slider;
