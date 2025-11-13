import React from "react";

interface SortingProps {
  value: string;
  onChange: (value: string) => void;
}

const Sorting: React.FC<SortingProps> = ({ value, onChange }) => {
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
        <option value="newest">ใหม่ที่สุด</option>
        <option value="oldest">เก่าที่สุด</option>
        <option value="relevant">เกี่ยวข้องมากที่สุด</option>
        <option value="popular">ยอดเข้าชมมากที่สุด</option>
      </select>
    </div>
  );
};

export default Sorting;
