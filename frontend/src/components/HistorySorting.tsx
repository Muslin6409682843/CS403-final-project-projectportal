import React from "react";

interface HistorySortingProps {
  value: string;
  onChange: (value: string) => void;
}

const HistorySorting: React.FC<HistorySortingProps> = ({ value, onChange }) => {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ marginRight: "8px", fontWeight: "bold" }}>
        เรียงลำดับ:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "20px",
          border: "1px solid #ccc",
          fontSize: "14px",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="newest">เข้าชมล่าสุด</option>
        <option value="oldest">เข้าชมแรกสุด</option>
      </select>
    </div>
  );
};

export default HistorySorting;
