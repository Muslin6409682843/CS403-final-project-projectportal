import { useState, useEffect, useRef } from "react";

interface FilterDropMenuProps {
  label: string;
  options: string[];
  selected?: string;
  onSelect: (value: string) => void;
  allowNone?: boolean; // ควบคุมว่าจะแสดงตัวเลือก "ไม่เลือก" หรือไม่
}

const FilterDropMenu = ({
  label,
  options,
  selected,
  onSelect,
  allowNone = true, // default: มี "ไม่เลือก"
}: FilterDropMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<string | undefined>(selected);
  const [menuWidth, setMenuWidth] = useState<number | "auto">("auto");

  const boxRef = useRef<HTMLDivElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);

  const noneOptionLabel = "ไม่เลือก";
  const allOptions = allowNone ? [noneOptionLabel, ...options] : options;

  useEffect(() => {
    setCurrent(selected);
  }, [selected]);

  useEffect(() => {
    if (!boxRef.current) return;

    const baseWidth = boxRef.current.offsetWidth;
    const style = window.getComputedStyle(boxRef.current);
    const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    const measureTextWidth = (text: string) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return 0;
      context.font = font;
      return context.measureText(text).width + 32;
    };

    const maxOptionWidth = Math.max(...allOptions.map(measureTextWidth));
    setMenuWidth(Math.max(baseWidth, maxOptionWidth));
  }, [allOptions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        boxRef.current &&
        !boxRef.current.contains(event.target as Node) &&
        ulRef.current &&
        !ulRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    if (allowNone && value === noneOptionLabel) {
      onSelect("");
      setCurrent("");
    } else {
      onSelect(value);
      setCurrent(value);
    }
    setIsOpen(false);
  };

  return (
    <div style={{ marginBottom: "1.5rem", width: "100%" }}>
      {label && (
        <div
          style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "20px" }}
        >
          {label}
        </div>
      )}

      <div
        ref={boxRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          border: "1px solid #A5A5A5",
          borderRadius: "30px",
          padding: "10px 16px",
          backgroundColor: "#ffffff",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{ color: current ? "#000000" : "#A5A5A5", fontSize: "20px" }}
        >
          {current || "เลือก..."}
        </span>
        <span
          style={{
            color: "#A5A5A5",
            fontWeight: 600,
            fontSize: "20px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          ▼
        </span>
      </div>

      {isOpen && (
        <ul
          ref={ulRef}
          style={{
            listStyle: "none",
            padding: "8px 0",
            margin: 0,
            border: "1px solid #A5A5A5",
            borderRadius: "10px",
            backgroundColor: "#ffffff",
            position: "absolute",
            zIndex: 10,
            minWidth: boxRef.current?.offsetWidth,
            width: menuWidth === "auto" ? "auto" : `${menuWidth}px`,
            maxHeight: "150px",
            overflowY: "auto",
          }}
        >
          {allOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                backgroundColor: current === option ? "#f5f5f5" : "#ffffff",
                whiteSpace: "nowrap",
                fontSize: "20px",
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilterDropMenu;
