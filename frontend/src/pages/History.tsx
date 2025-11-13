import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountSideBar from "../components/AccountSideBar";
import Pagination from "../components/Pagination";
import HistorySorting from "../components/HistorySorting";
import { FaStar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";

interface HistoryItem {
  id: string;
  title: string;
  author: string;
  advisor: string;
  year: string;
  viewedAt: string; // timestamp ของการเข้าชม
}

function History() {
  const navigate = useNavigate();

  // ----- State -----
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const itemsPerPage = 3;

  // ----- Mock History Data -----
  const historyProjects: HistoryItem[] = [
    {
      id: "h1",
      title: "ระบบจัดการโปรเจกต์นักศึกษา",
      author: "นายสมชาย ใจดี",
      advisor: "อ. ดร. วิไล ศรีสุข",
      year: "2025",
      viewedAt: "2025-09-01T10:00:00",
    },
    {
      id: "h2",
      title: "แอปพลิเคชันวิเคราะห์ข้อมูลการเดินทาง",
      author: "น.ส. สมหญิง เก่งงาน",
      advisor: "อ. ดร. สมปอง สมใจ",
      year: "2024",
      viewedAt: "2025-09-03T14:30:00",
    },
    {
      id: "h3",
      title: "แพลตฟอร์มสื่อสารเพื่อการเรียนการสอน",
      author: "ทีมงานนักศึกษาปี 4",
      advisor: "อ. ดร. กาญจนา ใจดี",
      year: "2023",
      viewedAt: "2025-09-02T09:15:00",
    },
    {
      id: "h4",
      title: "ระบบจองห้องเรียนออนไลน์",
      author: "นายสมศักดิ์ ดีเด่น",
      advisor: "อ. ดร. นันทนา ใจเย็น",
      year: "2025",
      viewedAt: "2025-09-05T11:20:00",
    },
  ];

  // ----- Sort -----
  const sortedHistory = historyProjects.sort((a, b) =>
    sortOption === "newest"
      ? new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
      : new Date(a.viewedAt).getTime() - new Date(b.viewedAt).getTime()
  );

  // ----- Pagination -----
  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const displayedProjects = sortedHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ----- Toggle Favorite -----
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ----- Navigate to Detail -----
  const handleNavigate = (id: string) => {
    navigate(`/project/${id}`);
  };

  // ----- Group by date -----
  const groupedByDate: { [date: string]: HistoryItem[] } = {};
  displayedProjects.forEach((project) => {
    const date = new Date(project.viewedAt).toLocaleDateString();
    if (!groupedByDate[date]) groupedByDate[date] = [];
    groupedByDate[date].push(project);
  });

  // ----- Sorted dates (newest first) -----
  const sortedDates = Object.keys(groupedByDate).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <AccountSideBar />

        {/* Main Content */}
        <div
          className="main-background"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "1rem 2rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sorting */}
          <HistorySorting value={sortOption} onChange={setSortOption} />

          {/* History List */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {sortedDates.map((date) => (
              <div key={date}>
                {/* Date Header */}
                <h3
                  style={{
                    margin: "1rem 0 1rem 0", // เว้นระยะห่างด้านล่าง
                    color: "#33469A",
                    fontSize: "16px", // ลดขนาด font
                  }}
                >
                  วันที่{" "}
                  {new Date(date).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </h3>

                {/* Cards for this date */}
                {groupedByDate[date].map((project) => (
                  <div
                    key={project.id}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "30px",
                      padding: "1.5rem",
                      marginBottom: "1.5rem",
                      marginTop: "0.5rem", // เพิ่มช่องว่างใต้วันที่
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      width: "100%",
                      boxSizing: "border-box",
                      position: "relative",
                    }}
                  >
                    {/* Favorite */}
                    <button
                      onClick={() => toggleFavorite(project.id)}
                      style={{
                        position: "absolute",
                        top: "15px",
                        right: "20px",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                    >
                      <FaStar
                        color={favorites[project.id] ? "#FFD700" : "white"}
                        style={{
                          stroke: favorites[project.id] ? "none" : "black",
                          strokeWidth: 40,
                        }}
                      />
                    </button>

                    {/* Title */}
                    <h2 style={{ marginBottom: "1rem", paddingRight: "2rem" }}>
                      <span
                        onClick={() => handleNavigate(project.id)}
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
                        {project.title}
                      </span>
                    </h2>

                    {/* Details */}
                    <p
                      style={{
                        margin: "0.3rem 0",
                        fontSize: "14px",
                        color: "#000000",
                      }}
                    >
                      <strong>ผู้จัดทำ:</strong> {project.author}
                    </p>
                    <p
                      style={{
                        margin: "0.3rem 0",
                        fontSize: "14px",
                        color: "#000000",
                      }}
                    >
                      <strong>อาจารย์ที่ปรึกษา:</strong> {project.advisor}
                    </p>
                    <p
                      style={{
                        margin: "0.3rem 0",
                        fontSize: "14px",
                        color: "#000000",
                      }}
                    >
                      <strong>ปีที่เผยแพร่:</strong> {project.year}
                    </p>
                    <p
                      style={{
                        margin: "0.3rem 0",
                        fontSize: "14px",
                        color: "#555555",
                      }}
                    >
                      <strong>เข้าชมล่าสุด:</strong>{" "}
                      {new Date(project.viewedAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            ))}

            {displayedProjects.length === 0 && <p>ยังไม่มีประวัติการเข้าชม</p>}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: "1rem", alignSelf: "center" }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
