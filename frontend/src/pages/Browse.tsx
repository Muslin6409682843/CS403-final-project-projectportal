import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../components/SideBar";
import TextSearch from "../components/TextSearch";
import Sorting from "../components/Sorting";
import ProjectCard from "../components/ProjectCard";
import Pagination from "../components/Pagination";

import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";

interface Project {
  projectID: number;
  titleTh: string;
  member: string;
  advisor: string;
  coAdvisor?: string;
  year: number;
  createDate?: string;
}

function Browse() {
  // State
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const itemsPerPage = 10;

  // Fetch data from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get<Project[]>(
          "http://localhost:8081/api/projects",
          { withCredentials: true }
        );
        setProjects(res.data);
      } catch (err) {
        console.error("ไม่สามารถโหลดข้อมูลโครงงาน:", err);
      }
    };
    fetchProjects();
  }, []);

  // Handlers
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

  // Filter + Sort
  const filteredProjects = projects.filter((p) =>
    p.titleTh.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProjects = filteredProjects.sort((a, b) =>
    sortOption === "newest" ? b.year - a.year : a.year - b.year
  );

  // Pagination
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
      {/* Sidebar */}
      <div
        style={{
          width: "500px",
          height: "100%",
          overflowY: "auto",
          backgroundColor: "#ffffff",
          paddingLeft: "2rem",
          paddingRight: "1rem",
        }}
      >
        <SideBar
          onFilterChange={(filters) => console.log("Filter changed:", filters)}
          onResetFilters={() => console.log("Reset filters")}
        />
      </div>

      {/* Main content */}
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
        {/* Search */}
        <div style={{ marginBottom: "1rem" }}>
          <TextSearch onSearch={handleSearch} />
        </div>

        {/* Sorting */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Sorting value={sortOption} onChange={handleSortChange} />
        </div>

        {/* Project cards */}
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
              key={project.projectID}
              id={project.projectID}
              title={project.titleTh}
              author={project.member}
              advisor={project.advisor}
              year={project.year}
              onNavigate={(id) => navigate(`/project/${id}`)}
              isFavorite={favorites.includes(project.projectID)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
          {displayedProjects.length === 0 && (
            <p>ไม่พบโครงงานที่ตรงกับการค้นหา</p>
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
  );
}

export default Browse;
