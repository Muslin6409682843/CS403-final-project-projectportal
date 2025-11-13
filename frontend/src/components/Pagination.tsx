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

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: isActive ? "#ccc" : "#fff", // ปกติ = ขาว, active = เทา
              color: isActive ? "#000" : "#333", // active = ดำ, ปกติ = เทาเข้ม
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
