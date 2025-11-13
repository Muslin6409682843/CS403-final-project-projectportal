import { useState, useEffect } from "react";

interface FilterMultiChoiceProps {
  label: string;
  options: string[];
  selectedOptions?: string[];
  onChange: (selected: string[]) => void;
}

const FilterMultiChoice = ({
  label,
  options,
  selectedOptions = [],
  onChange,
}: FilterMultiChoiceProps) => {
  const [selected, setSelected] = useState<string[]>(selectedOptions);

  useEffect(() => {
    setSelected(selectedOptions);
  }, [selectedOptions]);

  const handleToggle = (option: string) => {
    let newSelected: string[];
    if (selected.includes(option)) {
      newSelected = selected.filter((item) => item !== option);
    } else {
      newSelected = [...selected, option];
    }
    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div style={{ marginBottom: "1.5rem", fontSize: "20px" }}>
      <div style={{ fontWeight: 600, marginBottom: "0.75rem" }}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {options.map((option, idx) => (
          <label
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "20px",
              color: "#333",
              borderRadius: "30px",
            }}
          >
            <input
              type="checkbox"
              value={option}
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              style={{
                width: "20px",
                height: "20px",
                marginRight: "0.5rem",
                accentColor: "#FD7521",
              }}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterMultiChoice;
