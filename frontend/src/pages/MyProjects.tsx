import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 นำเข้า useNavigate
import AccountSideBar from "../components/AccountSideBar";
import MyProjectCard from "../components/MyProjectCard";
import Pagination from "../components/Pagination";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";

function MyProjects() {
  const navigate = useNavigate(); // 👈 สร้าง navigate function

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const [myProjects, setMyProjects] = useState([
    {
      id: "p1",
      title: "ระบบจองห้องเรียนออนไลน์",
      author: "นายสมศักดิ์ ดีเด่น",
      advisor: "อ. ดร. นันทนา ใจเย็น",
      year: "2025",
      uploadedAt: "2025-09-10T14:30:00",
    },
    {
      id: "p2",
      title: "แพลตฟอร์มสื่อสารเพื่อการเรียนการสอน",
      author: "ทีมงานนักศึกษาปี 4",
      advisor: "อ. ดร. กาญจนา ใจดี",
      year: "2023",
      uploadedAt: "2025-09-05T09:00:00",
    },
    {
      id: "p3",
      title: "แอปพลิเคชันวิเคราะห์ข้อมูลการเดินทาง",
      author: "น.ส. สมหญิง เก่งงาน",
      advisor: "อ. ดร. สมปอง สมใจ",
      year: "2024",
      uploadedAt: "2025-09-08T16:45:00",
    },
  ]);

  const sortedProjects = [...myProjects].sort(
    (a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const displayedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ----- Handle Delete -----
  const handleDelete = (id: string | number) => {
    setMyProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // ----- Handle Edit -----
  const handleEdit = (id: string | number) => {
    navigate(`/edit-project/${id}`); // 👈 นำทางไปหน้าแก้ไขโครงงาน
  };

  // ----- Handle Add Project -----
  const handleAddProject = () => {
    navigate("/add-project"); // 👈 นำทางไปหน้าเพิ่มโครงงาน
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <AccountSideBar />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "1rem 2rem",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem" }}>โครงงานของฉัน</h2>
          <p style={{ marginTop: 0, marginBottom: "1rem", color: "#555" }}>
            โครงงานทั้งหมด {myProjects.length} รายการ
          </p>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {displayedProjects.map((project) => (
              <MyProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                author={project.author}
                advisor={project.advisor}
                year={project.year}
                uploadedAt={project.uploadedAt}
                onNavigate={(id) => navigate(`/project/${id}`)} // 👈 รายละเอียดโครงงาน
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}

            {displayedProjects.length === 0 && <p>คุณยังไม่มีโครงงานของคุณ</p>}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: "1rem", alignSelf: "center" }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}

          <button
            onClick={handleAddProject}
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              backgroundColor: "#FD7521",
              color: "white",
              border: "none",
              borderRadius: "50px",
              padding: "0.8rem 1.5rem",
              display: "flex",
              alignItems: "center",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}>+</span>
            เพิ่มโครงงาน
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyProjects;
