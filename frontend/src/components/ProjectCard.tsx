import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

interface ProjectCardProps {
  id: string | number; // ใช้สำหรับลิงก์ไปดูรายละเอียด
  title: string;
  author: string;
  advisor: string;
  year: string | number;
  uploadedAt?: string;
  onNavigate?: (id: string | number) => void; // callback เวลากดหัวข้อ

  isFavorite: boolean;
  onToggleFavorite: (id: string | number) => void;

  role: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  author,
  advisor,
  year,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  role,
}) => {
  const disabled = role === "Admin" || role === "Guest";
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "30px",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* ปุ่ม Favorite */}
      <button
        onClick={() => !disabled && onToggleFavorite(id)}
        style={{
          position: "absolute",
          top: "15px",
          right: "20px",
          background: "transparent",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: "20px",
          color: disabled ? "gray" : isFavorite ? "#FFD700" : "white",
        }}
        title={disabled ? "Admin/Guest cannot favorite" : ""}
      >
        <FaStar
          color={isFavorite ? "#FFD700" : "white"}
          style={{
            stroke: isFavorite ? "none" : "black",
            strokeWidth: 40,
          }}
        />
      </button>

      {/* หัวข้อโปรเจกต์ (ลิงก์กดได้) */}
      <h2 style={{ marginBottom: "1rem", paddingRight: "2rem" }}>
        <span
          onClick={() => onNavigate?.(id)}
          style={{
            color: "#33469A",
            cursor: "pointer",
            textDecoration: "none",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#22306D";
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "#33469A";
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          {title}
        </span>
      </h2>

      {/* รายละเอียด */}
      <p style={{ margin: "0.3rem 0", fontSize: "14px", color: "#000000" }}>
        <strong>ผู้จัดทำ:</strong> {author}
      </p>
      <p style={{ margin: "0.3rem 0", fontSize: "14px", color: "#000000" }}>
        <strong>อาจารย์ที่ปรึกษา:</strong> {advisor}
      </p>
      <p style={{ margin: "0.3rem 0", fontSize: "14px", color: "#000000" }}>
        <strong>ปีที่เผยแพร่:</strong> {year}
      </p>
    </div>
  );
};

export default ProjectCard;
