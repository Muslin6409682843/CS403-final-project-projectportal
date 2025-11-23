import React, { useState } from "react";
import AccountSideBar from "../components/AccountSideBar";
import TextSearch from "../components/TextSearch";
import Sorting from "../components/Sorting";
import ProjectCard from "../components/ProjectCard";
import Pagination from "../components/Pagination";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";

function Favorite() {
  // ----- State -----
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);

  const itemsPerPage = 2;

  // ----- Project Data (ตัวอย่าง) -----
  const favoriteProjects = [
    {
      id: "f1",
      title: "ระบบจองห้องเรียนออนไลน์",
      author: "นายสมศักดิ์ ดีเด่น",
      advisor: "อ. ดร. นันทนา ใจเย็น",
      year: "2025",
    },
    {
      id: "f2",
      title: "แพลตฟอร์มสื่อสารเพื่อการเรียนการสอน",
      author: "ทีมงานนักศึกษาปี 4",
      advisor: "อ. ดร. กาญจนา ใจดี",
      year: "2023",
    },
    {
      id: "f3",
      title: "แอปพลิเคชันวิเคราะห์ข้อมูลการเดินทาง",
      author: "น.ส. สมหญิง เก่งงาน",
      advisor: "อ. ดร. สมปอง สมใจ",
      year: "2024",
    },
  ];

  // ----- Handlers -----
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const toggleFavorite = (id: string | number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // ----- Filter + Sort -----
  const filteredProjects = favoriteProjects.filter((p) =>
    p.title.includes(searchQuery)
  );

  const sortedProjects = filteredProjects.sort((a, b) =>
    sortOption === "newest" ? +b.year - +a.year : +a.year - +b.year
  );

  // ----- Pagination -----
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const displayedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
          {/* TextSearch */}
          <div style={{ marginBottom: "1rem" }}>
            <TextSearch onSearch={handleSearch} />
          </div>

          {/* Title + Sorting */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            {/* ฝั่งซ้าย */}
            <h2 style={{ margin: 0 }}>รายการโปรด</h2>

            {/* ฝั่งขวา */}
            <Sorting value={sortOption} onChange={handleSortChange} />
          </div>

          {/* Project Cards */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {displayedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                title={project.title}
                author={project.author}
                advisor={project.advisor}
                year={project.year}
                onNavigate={(id) => console.log("ไปหน้ารายละเอียด:", id)}
                isFavorite={favorites.includes(project.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}

            {displayedProjects.length === 0 && (
              <p>คุณยังไม่มีโครงงานที่บันทึกเป็นรายการโปรด</p>
            )}
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

export default Favorite;
