import React from "react";

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#FD7521",
  color: "#fff",
  border: "none",
  borderRadius: "20px",
  padding: "14px 20px",
  fontSize: "16px",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  cursor: "pointer",
  width: "250px",
};

const iconStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const ProjectActionButtons: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: "350px",
        right: "5%",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
      {/* ⭐ รายการโปรด */}
      <button style={buttonStyle}>
        <span style={iconStyle}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9" />
          </svg>
        </span>
        เพิ่มเข้ารายการโปรด
      </button>

      {/* 📄 ดาวน์โหลดเล่มโครงงาน */}
      <button style={buttonStyle}>
        <span style={iconStyle}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        </span>
        ดาวน์โหลดเล่มโครงงาน
      </button>

      {/* 🖼 ดาวน์โหลดสไลด์ */}
      <button style={buttonStyle}>
        <span style={iconStyle}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="12" y1="17" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </span>
        ดาวน์โหลดสไลด์
      </button>

      {/* <> ดาวน์โหลดโค้ด */}
      <button style={buttonStyle}>
        <span style={iconStyle}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </span>
        ดาวน์โหลดโค้ด
      </button>
    </div>
  );
};

export default ProjectActionButtons;
