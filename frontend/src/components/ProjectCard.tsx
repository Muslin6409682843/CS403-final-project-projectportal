import React, { useState } from "react";
import { FaStar, FaFileAlt, FaFileImage, FaFileCode } from "react-icons/fa";

interface ProjectCardProps {
  id: string | number;
  title: string;
  titleEn: string;
  author: string;
  advisor: string;
  year: string | number;
  uploadedAt?: string;
  onNavigate?: (id: string | number) => void;
  isFavorite: boolean;
  onToggleFavorite?: (id: string | number) => void;
  role?: string | null;

  //ไอคอนแสดงไฟล์แนบ
  files?: {
    book?: string | null;
    slide?: string | null;
    source?: string | null;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  title,
  titleEn,
  author,
  advisor,
  year,
  onNavigate,
  isFavorite,
  onToggleFavorite,
  role,

  files,
}) => {
  // ปุ่ม favorite disabled ถ้าไม่ใช่ Student/Staff
  const disabled =
    !onToggleFavorite || !(role === "Student" || role === "Staff");

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
        onClick={() => !disabled && onToggleFavorite?.(id)}
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

      {/* ไอคอนไฟล์แนบ — วางขวาล่าง */}
      <div
        style={{
          position: "absolute",
          bottom: "15px",
          right: "20px",
          display: "flex",
          gap: "12px",
        }}
      >
        {files?.book && files.book.trim() !== "" && (
          <FaFileAlt size={20} color="#33469A" title="รูปเล่มโครงงาน" />
        )}

        {files?.slide && files.slide.trim() !== "" && (
          <FaFileImage size={20} color="#33469A" title="สไลด์นำเสนอ" />
        )}

        {files?.source && files.source.trim() !== "" && (
          <FaFileCode size={20} color="#33469A" title="Source Code" />
        )}
      </div>

      {/* หัวข้อโปรเจกต์ (ลิงก์กดได้) */}
      <h2 style={{ marginBottom: "1rem", paddingRight: "2rem" }}>
        <div
          onClick={() => onNavigate?.(id)}
          style={{
            cursor: "pointer",
            color: "#33469A",
            textDecoration: "none",
            display: "inline-block",
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
          {/* Title TH */}
          <span style={{ display: "block" }}>{title}</span>

          {/* Title EN (ขึ้นบรรทัดใหม่ + มีวงเล็บครอบ) */}
          {titleEn && (
            <span
              style={{
                display: "block",
                marginTop: "4px",
                fontSize: "20px",
              }}
            >
              ({titleEn})
            </span>
          )}
        </div>
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
