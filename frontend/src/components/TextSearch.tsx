// TextSearch.tsx
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa"; // ใช้ไอคอนแว่นขยายจาก react-icons

interface TextSearchProps {
  placeholder?: string;
  value?: string; // <-- เพิ่ม
  onSearch?: (query: string) => void;
}

const TextSearch: React.FC<TextSearchProps> = ({
  placeholder = "ค้นหา...",
  value = "",
  onSearch,
}) => {
  const [query, setQuery] = useState(value);

  // ซิงค์กับ prop value ถ้ามีการเปลี่ยนจากภายนอก
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder={placeholder}
        style={{
          flex: 1,
          padding: "10px 20px",
          borderRadius: "30px",
          border: "1px solid #ccc",
          outline: "none",
          fontSize: "16px",
          backgroundColor: "#ffffff",
        }}
      />
      <button
        onClick={handleSearch}
        style={{
          padding: "10px 16px",
          borderRadius: "20px",
          border: "none",
          backgroundColor: "#FD7521",
          color: "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FaSearch />
      </button>
    </div>
  );
};

export default TextSearch;
