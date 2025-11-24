import React from "react";
import { useNavigate } from "react-router-dom";
import { FaFileAlt, FaFileCode, FaFileImage } from "react-icons/fa";
import axios from "axios";

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

  /** บันทึกประวัติการดาวน์โหลด */
const recordDownload = async () => {
  try {
    if (!role) return; // ถ้าไม่ได้ login ก็ไม่ต้องบันทึก

    await axios.post(
      `http://localhost:8081/api/download-history/${project.projectID}`,
      {}, // body ว่างได้
      { withCredentials: true }
    );
  } catch (err) {
    console.error("บันทึกประวัติดาวน์โหลดไม่สำเร็จ:", err);
  }
};


  /** คลิกแล้วทำอะไร */
  const handleClick = async (fileUrl?: string) => {
    if (!fileUrl) return;

    if (!role || !allowedRoles.includes(role)) {
      navigate("/login");
      return;
    }

    // ✅ บันทึกประวัติ
    await recordDownload();

    // ดาวน์โหลดไฟล์จริง
    const link = document.createElement("a");
    link.href = fileUrl.startsWith("http") ? fileUrl : `/upload/${fileUrl}`;
    link.download = fileUrl.split("/").pop() || "file";
    link.click();
  };

  /** ปุ่มดาวน์โหลดโค้ด — มี 3 กรณีพิเศษ */
  const getCodeButtonStyle = () => {
    const hasZip = !!project.zipFile;
    const hasGithub = !!project.github;

    return {
      ...buttonStyle,
      backgroundColor: hasZip || hasGithub ? "#FD7521" : "#ccc",
      cursor: hasZip || hasGithub ? "pointer" : "not-allowed",
    };
  };

  const handleCodeClick = async () => {
    const zip = project.zipFile;
    const github = project.github;

    if (!zip && !github) return;
    if (!role || !allowedRoles.includes(role)) {
      navigate("/login");
      return;
    }

    // ✅ บันทึกประวัติ
    await recordDownload();

    if (github) {
      window.open(github, "_blank");
      return;
    }

    if (zip) {
      const link = document.createElement("a");
      link.href = zip.startsWith("http") ? zip : `/upload/${zip}`;
      link.download = zip.split("/").pop() || "code.zip";
      link.click();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
      }}
    >
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

      {/* 🧩 ดาวน์โหลดโค้ด (zip หรือ github) */}
      <button
        style={getCodeButtonStyle()}
        onClick={handleCodeClick}
        disabled={!project.zipFile && !project.github}
      >
        <FaFileCode style={{ marginRight: "10px" }} /> ดาวน์โหลดโค้ด
      </button>
    </div>
  );
};

export default ProjectActionButtons;
