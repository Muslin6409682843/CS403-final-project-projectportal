import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  titleEn: string;
  abstractTh: string;
  abstractEn: string;
  keywordTh: string;
  keywordEn: string;
  member: string;
  advisor: string;
  coAdvisor?: string;
  category: string;
  year: number;
  createDate?: string;
  file?: string;
  slideFile?: string;
  zipFile?: string;
  github?: string;
}

interface FilterValues {
  program?: string;
  yearType?: "ย้อนหลัง" | "จากปี";
  yearSub?: string;
  yearRange?: [number, number];
  searchField?: string;
}

function Browse() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const itemsPerPage = 10;

  const [programFilter, setProgramFilter] = useState<string>("");
  const [yearFilterType, setYearFilterType] = useState<string>("");
  const [yearSubOption, setYearSubOption] = useState<string>("");
  const [yearRange, setYearRange] = useState<[number, number]>([
    2000,
    new Date().getFullYear(),
  ]);
  const [searchField, setSearchField] = useState<string>("");

  useEffect(() => {
    setSearchQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const url = searchQuery
          ? `http://localhost:8081/api/projects/search?q=${encodeURIComponent(
              searchQuery
            )}`
          : "http://localhost:8081/api/projects";

        const res = await axios.get<Project[]>(url, { withCredentials: true });
        setProjects(res.data);
      } catch (err) {
        console.error("ไม่สามารถโหลดข้อมูลโครงงาน:", err);
      }
    };
    fetchProjects();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    navigate(`/browse?search=${encodeURIComponent(query)}`);
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

  const handleFilterChange = (filters: FilterValues) => {
    setProgramFilter(filters.program || "");
    setYearFilterType(filters.yearType || "");
    setYearSubOption(filters.yearSub || "");
    setYearRange(filters.yearRange || [2000, new Date().getFullYear()]);
    setSearchField(filters.searchField || "");
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter((p) => {
    if (programFilter === "สหกิจ") return false;

    const q = searchQuery.toLowerCase();

    // --- ค้นหาเฉพาะ ---
    let matchSearch = true;

    if (q.trim() !== "") {
      switch (searchField) {
        case "ชื่อโครงงาน":
          matchSearch =
            p.titleTh?.toLowerCase().includes(q) ||
            p.titleEn?.toLowerCase().includes(q);
          break;

        case "ชื่อผู้จัดทำ":
          matchSearch = p.member?.toLowerCase().includes(q);
          break;

        case "ชื่ออาจารย์ที่ปรึกษา":
          matchSearch =
            (p.advisor ?? "").toLowerCase().includes(q) ||
            (p.coAdvisor ?? "").toLowerCase().includes(q);
          break;

        case "บทคัดย่อ":
          matchSearch =
            p.abstractTh?.toLowerCase().includes(q) ||
            p.abstractEn?.toLowerCase().includes(q);
          break;

        case "คำสำคัญ":
          matchSearch =
            p.keywordTh?.toLowerCase().includes(q) ||
            p.keywordEn?.toLowerCase().includes(q);
          break;

        default:
          matchSearch =
            (p.titleTh ?? "").toLowerCase().includes(q) ||
            (p.titleEn ?? "").toLowerCase().includes(q) ||
            (p.abstractTh ?? "").toLowerCase().includes(q) ||
            (p.abstractEn ?? "").toLowerCase().includes(q) ||
            (p.keywordTh ?? "").toLowerCase().includes(q) ||
            (p.keywordEn ?? "").toLowerCase().includes(q) ||
            (p.member ?? "").toLowerCase().includes(q) ||
            (p.advisor ?? "").toLowerCase().includes(q) ||
            (p.coAdvisor ?? "").toLowerCase().includes(q);
      }
    }

    // --- ปีการศึกษา ---
    let matchYear = true;
    if (Array.isArray(yearRange)) {
      const projectYearAD = p.year - 543;
      matchYear =
        projectYearAD >= yearRange[0] && projectYearAD <= yearRange[1];
    }

    return matchSearch && matchYear;
  });

  const sortedProjects = filteredProjects.sort((a, b) =>
    sortOption === "newest" ? b.year - a.year : a.year - b.year
  );

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
          onFilterChange={handleFilterChange}
          onResetFilters={() => {
            setProgramFilter("");
            setYearFilterType("");
            setYearSubOption("");
            setYearRange([2000, new Date().getFullYear()]);
          }}
        />
      </div>

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
        <div style={{ marginBottom: "1rem" }}>
          <TextSearch value={searchQuery} onSearch={handleSearch} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1rem",
          }}
        >
          <Sorting value={sortOption} onChange={handleSortChange} />
        </div>

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
