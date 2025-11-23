import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AccountSideBar from "../components/AccountSideBar";
import TextSearch from "../components/TextSearch";
import Sorting from "../components/Sorting";
import ProjectCard from "../components/ProjectCard";
import Pagination from "../components/Pagination";

import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";

interface Project {
  projectID: number;
  titleTh: string;
  titleEn: string;
  member: string;
  advisor: string;
  coAdvisor?: string;
  year: number;
}

function Favorite() {
  const navigate = useNavigate();

  // --- States ---
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  const itemsPerPage = 5;

  // --- ดึงข้อมูล session ของ user ---
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/check-session", {
          withCredentials: true,
        });
        if (res.data.status)
          setCurrentUser({ username: res.data.username, role: res.data.role });
      } catch (err) {
        console.error("ไม่สามารถเช็ค session:", err);
      }
    };
    fetchSession();
  }, []);

  // --- ดึงรายการ favorites ของ user ---
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axios.get<number[]>(
          "http://localhost:8081/api/bookmark",
          { withCredentials: true }
        );
        setFavorites(res.data);
      } catch (err) {
        console.error("ไม่สามารถโหลด Favorites:", err);
      }
    };
    fetchFavorites();
  }, []);

  // --- ดึงข้อมูลโปรเจกต์ทั้งหมด ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get<Project[]>(
          "http://localhost:8081/api/projects",
          { withCredentials: true }
        );
        setProjects(res.data);
      } catch (err) {
        console.error("ไม่สามารถโหลดโปรเจกต์:", err);
      }
    };
    fetchProjects();
  }, []);

  // --- Toggle Favorite ---
  const toggleFavorite = async (id: string | number) => {
    try {
      const projectId = Number(id); // แปลง id เป็น number ก่อนส่ง API

      if (favorites.includes(projectId)) {
        // ลบ bookmark
        await axios.delete(`http://localhost:8081/api/bookmark/${projectId}`, {
          withCredentials: true,
        });
        setFavorites((prev) => prev.filter((fid) => fid !== projectId));
      } else {
        // เพิ่ม bookmark
        await axios.post(
          `http://localhost:8081/api/bookmark/${projectId}`,
          {},
          { withCredentials: true }
        );
        setFavorites((prev) => [...prev, projectId]);
      }
    } catch (err: any) {
      if (err.response) {
        alert(err.response.data);
      } else {
        console.error(err);
      }
    }
  };

  // --- Handlers ---
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  // --- Filter + Search + Sort ---
  const filteredProjects = projects
    .filter((p) => favorites.includes(p.projectID)) // เฉพาะโปรเจกต์ favorite
    .filter(
      (p) =>
        p.titleTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const sortedProjects = filteredProjects.sort((a, b) =>
    sortOption === "newest" ? b.year - a.year : a.year - b.year
  );

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const displayedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "500px",
          overflowY: "auto",
          backgroundColor: "#fff",
          padding: "2rem 1rem",
        }}
      >
        <AccountSideBar />
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem 2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Search */}
        <div style={{ marginBottom: "1rem" }}>
          <TextSearch value={searchQuery} onSearch={handleSearch} />
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
              key={project.projectID}
              id={project.projectID}
              title={project.titleTh}
              author={project.member}
              advisor={project.advisor}
              year={project.year}
              onNavigate={(id) => navigate(`/project/${id}`)}
              isFavorite={favorites.includes(project.projectID)}
              onToggleFavorite={toggleFavorite}
              role={currentUser?.role || "Guest"}
            />
          ))}
          {displayedProjects.length === 0 && (
            <p>คุณยังไม่มีโปรเจกต์รายการโปรด</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ marginTop: "1rem", alignSelf: "center" }}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Favorite;
