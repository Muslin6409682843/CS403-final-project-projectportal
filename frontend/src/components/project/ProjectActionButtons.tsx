import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaFileAlt, FaFileCode, FaFileImage } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import type { ProjectDTO } from "../../dto/ProjectDTO";

interface ProjectActionButtonsProps {
  project: ProjectDTO;
}

const buttonStyle: React.CSSProperties = {
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

const ProjectActionButtons: React.FC<ProjectActionButtonsProps> = ({
  project,
}) => {
  const { isLoggedIn, role } = useAuth();
  const navigate = useNavigate();

  const allowedRoles = ["Admin", "Staff", "Student", "Guest"];

  /** ปุ่มสีส้มถ้ามีไฟล์ */
  const getButtonStyle = (file?: string) => ({
    ...buttonStyle,
    backgroundColor: file ? "#FD7521" : "#ccc",
    cursor: file ? "pointer" : "not-allowed",
  });

  /** คลิกแล้วทำอะไร */
  const handleClick = (fileUrl?: string) => {
    if (!fileUrl) return; // ปุ่มเทา → ไม่ทำอะไร

    // role ไม่มี → ไป login
    if (!role || !allowedRoles.includes(role)) {
      navigate("/login");
      return;
    }

    // role ถูกต้อง → ดาวน์โหลด
    const link = document.createElement("a");
    link.href = fileUrl.startsWith("http") ? fileUrl : `/upload/${fileUrl}`;
    link.download = fileUrl.split("/").pop() || "file";
    link.click();
  };

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
      <button style={{ ...buttonStyle, backgroundColor: "#FD7521" }}>
        <FaStar style={{ marginRight: "10px" }} /> เพิ่มเข้ารายการโปรด
      </button>

      {/* 📄 ดาวน์โหลดเล่มโครงงาน */}
      <button
        style={getButtonStyle(project.file)}
        onClick={() => handleClick(project.file)}
        disabled={!project.file}
      >
        <FaFileAlt style={{ marginRight: "10px" }} /> ดาวน์โหลดเล่มโครงงาน
      </button>

      {/* 🖼 ดาวน์โหลดสไลด์ */}
      <button
        style={getButtonStyle(project.slideFile)}
        onClick={() => handleClick(project.slideFile)}
        disabled={!project.slideFile}
      >
        <FaFileImage style={{ marginRight: "10px" }} /> ดาวน์โหลดสไลด์
      </button>

      {/* <> ดาวน์โหลดโค้ด */}
      <button
        style={getButtonStyle(project.zipFile)}
        onClick={() => handleClick(project.zipFile)}
        disabled={!project.zipFile}
      >
        <FaFileCode style={{ marginRight: "10px" }} /> ดาวน์โหลดโค้ด
      </button>
    </div>
  );
};

export default ProjectActionButtons;
