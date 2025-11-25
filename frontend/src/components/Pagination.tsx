import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // แสดงแค่ 1, last, และรอบ currentPage ±2
  const visiblePages: (number | string)[] = [];
  pages.forEach((p, _idx) => {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2) {
      visiblePages.push(p);
    } else if (
      // เพิ่ม ... เมื่อข้ามช่วง
      visiblePages[visiblePages.length - 1] !== "..."
    ) {
      visiblePages.push("...");
    }
  });

  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {visiblePages.map((page, idx) => {
        if (page === "...") {
          return (
            <span key={`dots-${idx}`} style={{ padding: "0.5rem 1rem" }}>
              ...
            </span>
          );
        }

        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(Number(page))}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: isActive ? "#ccc" : "#fff",
              color: isActive ? "#000" : "#333",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
};

export default Pagination;
