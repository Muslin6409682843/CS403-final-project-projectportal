import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectForm, { type ProjectData } from "../components/ProjectForm";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";
import { createPortal } from "react-dom";

// Mock ข้อมูล MyProjects
const MOCK_PROJECTS: (ProjectData & { id: string })[] = [
  {
    id: "p1",
    title: "ระบบจองห้องเรียนออนไลน์",
    projectNameTH: "ระบบจองห้องเรียนออนไลน์",
    projectNameEN: "Online Classroom Booking System",
    members: ["นายสมศักดิ์ ดีเด่น"],
    advisor: "อ. ดร. นันทนา ใจเย็น",
    year: "2025",
    abstract: "บทคัดย่อภาษาไทย...",
    uploadedAt: "2025-09-10T14:30:00",
  },
  {
    id: "p2",
    title: "แพลตฟอร์มสื่อสารเพื่อการเรียนการสอน",
    projectNameTH: "แพลตฟอร์มสื่อสารเพื่อการเรียนการสอน",
    projectNameEN: "Communication Platform for Learning",
    members: ["ทีมงานนักศึกษาปี 4"],
    advisor: "อ. ดร. กาญจนา ใจดี",
    year: "2023",
    abstract: "บทคัดย่อภาษาไทย...",
    uploadedAt: "2025-09-05T09:00:00",
  },
  {
    id: "p3",
    title: "แอปพลิเคชันวิเคราะห์ข้อมูลการเดินทาง",
    projectNameTH: "แอปพลิเคชันวิเคราะห์ข้อมูลการเดินทาง",
    projectNameEN: "Travel Data Analysis App",
    members: ["น.ส. สมหญิง เก่งงาน"],
    advisor: "อ. ดร. สมปอง สมใจ",
    year: "2024",
    abstract: "บทคัดย่อภาษาไทย...",
    uploadedAt: "2025-09-08T16:45:00",
  },
];

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectData | undefined>(undefined);
  const [isDirty, setIsDirty] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);

  useEffect(() => {
    const proj = MOCK_PROJECTS.find((p) => p.id === id);
    setProject(proj);
  }, [id]);

  const handleBackClick = () => {
    if (!isDirty) {
      navigate("/my-projects");
    } else {
      setShowBackModal(true);
    }
  };

  const confirmBack = () => {
    setShowBackModal(false);
    navigate("/my-projects");
  };

  const handleSubmit = (data: ProjectData) => {
    console.log("แก้ไขโครงงาน:", data);
    navigate("/my-projects");
  };

  const handleDelete = () => {
    console.log("ลบโครงงาน:", project);
    navigate("/my-projects");
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        <button
          onClick={handleBackClick}
          style={{
            marginBottom: "1rem",
            padding: "0.3rem 0.6rem",
            backgroundColor: "#eee",
            border: "none",
            borderRadius: "6px",
            color: "#000000",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            width: "fit-content",
          }}
        >
          ← กลับไปหน้าโครงงานของฉัน
        </button>

        <h2>แก้ไขโครงงาน</h2>

        {/* เพิ่มระยะห่างจากหัวข้อ */}
        <div style={{ marginTop: "2rem" }}>
          <ProjectForm
            initialData={project}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onChangeDirty={() => setIsDirty(true)}
          />
        </div>
      </div>

      {/* Modal Confirm Back */}
      {showBackModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999999,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "3rem 2rem",
                borderRadius: "16px",
                textAlign: "center",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              }}
            >
              <h2 style={{ marginBottom: "1.5rem" }}>
                คุณไม่ต้องการบันทึกการเปลี่ยนแปลงที่เกิดขึ้นกับโครงงานใช่หรือไม่?
              </h2>
              <button
                onClick={confirmBack}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#FD7521",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginRight: "1rem",
                }}
              >
                ยืนยัน
              </button>
              <button
                onClick={() => setShowBackModal(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ddd",
                  color: "#333",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default EditProject;
