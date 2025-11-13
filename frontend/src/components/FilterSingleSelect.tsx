import { useState, useEffect } from "react";
import FilterDropMenu from "./FilterDropMenu";

interface FilterSingleSelectProps {
  label: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  subOptions?: string[];
  selectedSubOption?: string;
  onSelectSubOption?: (value: string) => void;
  rangeValue?: [number, number];
  onRangeChange?: (range: [number, number]) => void;
}

const MIN = 2000;
const CURRENT_YEAR = new Date().getFullYear();

const FilterSingleSelect = ({
  label,
  options,
  selected,
  onSelect,
  subOptions,
  selectedSubOption,
  onSelectSubOption,
  rangeValue,
  onRangeChange,
}: FilterSingleSelectProps) => {
  const [current, setCurrent] = useState<string | undefined>(selected);
  const [range, setRange] = useState<[number, number]>(
    rangeValue || [MIN, CURRENT_YEAR]
  );

  useEffect(() => setCurrent(selected), [selected]);
  useEffect(() => {
    if (rangeValue) setRange(rangeValue);
  }, [rangeValue]);

  const handleChange = (value: string) => {
    if (current === value) {
      // ยกเลิกการเลือก
      setCurrent(undefined);
      onSelect("");
      onSelectSubOption && onSelectSubOption("");
    } else {
      setCurrent(value);
      onSelect(value);

      // ✅ ถ้าเลือก "ย้อนหลัง" → รีเซ็ต subOption เป็น default (เช่น "5 ปี")
      if (value === "ย้อนหลัง") {
        onSelectSubOption && onSelectSubOption(subOptions?.[0] || "5 ปี");
      }

      // ✅ ถ้าเลือก "จากปี" → รีเซ็ต range เป็นค่า default
      if (value === "จากปี") {
        const defaultRange: [number, number] = [MIN, CURRENT_YEAR];
        setRange(defaultRange);
        onRangeChange && onRangeChange(defaultRange);
      }
    }
  };

  const handleSubSelect = (value: string) => {
    onSelectSubOption && onSelectSubOption(value);
  };

  const handleRangeChange = (index: 0 | 1, value: number) => {
    let newRange: [number, number] =
      index === 0 ? [value, range[1]] : [range[0], value];
    if (newRange[0] > newRange[1]) newRange = [value, value];
    setRange(newRange);
    onRangeChange && onRangeChange(newRange);
  };

  return (
    <div style={{ marginBottom: "1.5rem", fontSize: "20px" }}>
      <div style={{ fontWeight: 600, marginBottom: "0.75rem" }}>{label}</div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {options.map((option, idx) => (
          <div
            key={idx}
            style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
          >
            {/* radio-style toggle */}
            <div
              onClick={() => handleChange(option)}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: "0.5rem",
                fontSize: "20px",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  border: "2px solid #24201dff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {current === option && (
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#24201dff",
                    }}
                  />
                )}
              </div>
              <span style={{ color: "#333" }}>{option}</span>
            </div>

            {/* Dropdown subOptions */}
            {option === "ย้อนหลัง" && current === "ย้อนหลัง" && subOptions && (
              <div style={{ flex: 1, marginLeft: "2rem" }}>
                <FilterDropMenu
                  label=""
                  options={subOptions}
                  selected={selectedSubOption || ""}
                  onSelect={handleSubSelect}
                  allowNone={false}
                />
              </div>
            )}

            {/* Range slider สำหรับ "จากปี" */}
            {option === "จากปี" && current === "จากปี" && (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  marginLeft: "2rem",
                }}
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  <input
                    type="range"
                    min={MIN}
                    max={CURRENT_YEAR}
                    value={range[0]}
                    onChange={(e) =>
                      handleRangeChange(0, Number(e.target.value))
                    }
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
                    onChange={(e) =>
                      handleRangeChange(1, Number(e.target.value))
                    }
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
                    ? `เลือกปี ${range[0]}`
                    : `${range[0]} - ${range[1]}`}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSingleSelect;
