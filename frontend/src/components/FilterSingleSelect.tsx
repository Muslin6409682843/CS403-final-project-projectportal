import { useState, useEffect } from "react";
import FilterDropMenu from "./FilterDropMenu";

interface FilterSingleSelectProps {
  label: string;
  rangeValue?: [number, number];
  onRangeChange: (range: [number, number]) => void;
}

const MIN = 2000;
const CURRENT_YEAR = new Date().getFullYear();

const FilterSingleSelect = ({
  label,
  rangeValue,
  onRangeChange,
}: FilterSingleSelectProps) => {
  const [range, setRange] = useState<[number, number]>(
    rangeValue || [MIN, CURRENT_YEAR]
  );

  useEffect(() => {
    if (rangeValue) setRange(rangeValue);
  }, [rangeValue]);

  const handleRangeChange = (index: 0 | 1, value: number) => {
    let newRange: [number, number] =
      index === 0 ? [value, range[1]] : [range[0], value];
    if (newRange[0] > newRange[1]) newRange = [value, value];
    setRange(newRange);
    onRangeChange(newRange);
  };

  return (
    <div style={{ marginBottom: "1.5rem", fontSize: "20px" }}>
      <div style={{ fontWeight: 600, marginBottom: "0.75rem" }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            type="range"
            min={MIN}
            max={CURRENT_YEAR}
            value={range[0]}
            onChange={(e) => handleRangeChange(0, Number(e.target.value))}
            style={{
              flex: 1,
              height: "16px",
              cursor: "pointer",
              accentColor: "#24201dff",
            }}
          />
          <input
            type="range"
            min={MIN}
            max={CURRENT_YEAR}
            value={range[1]}
            onChange={(e) => handleRangeChange(1, Number(e.target.value))}
            style={{
              flex: 1,
              height: "16px",
              cursor: "pointer",
              accentColor: "#24201dff",
            }}
          />
        </div>
        <div style={{ fontSize: "20px", color: "#555" }}>
          {range[0] === range[1]
            ? `เลือกปี พ.ศ. ${range[0] + 543}`
            : `ปี พ.ศ. ${range[0] + 543} - ${range[1] + 543}`}
        </div>
      </div>
    </div>
  );
};

export default FilterSingleSelect;
