import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../components/SideBar";
import TextSearch from "../components/TextSearch";
import Sorting from "../components/Sorting";
import ProjectCard from "../components/ProjectCard";
import Pagination from "../components/Pagination";
import 




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

function Browse() {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [filters, setFilters] = useState<Filters>({
  programPath: "",
  researchYear: "",
  researchYearSub: "",
  searchField: "",
  searchKeyword: [],
  topic: "",
});


  const itemsPerPage = 10;

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
    setFilters({
      programPath: "",
      researchYear: "",
      researchYearSub: "",
      searchField: "",
      searchKeyword: [],
      topic: "",
    });
  };

  const handleFilterChange = (partial: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      programPath: "",
      researchYear: "",
      researchYearSub: "",
      searchField: "",
      searchKeyword: [],
      topic: "",
    });
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

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      !q ||
      (filters.searchField === "ชื่อโครงงาน"
        ? p.titleTh.toLowerCase().includes(q) ||
          p.titleEn.toLowerCase().includes(q)
        : filters.searchField === "ชื่อผู้จัดทำ"
        ? p.member.toLowerCase().includes(q)
        : filters.searchField === "ชื่ออาจารย์ที่ปรึกษา"
        ? p.advisor.toLowerCase().includes(q) ||
          p.coAdvisor?.toLowerCase().includes(q)
        : filters.searchField === "บทคัดย่อ"
        ? p.abstractTh.toLowerCase().includes(q) ||
          p.abstractEn.toLowerCase().includes(q)
        : filters.searchField === "คำสำคัญ"
        ? p.keywordTh.toLowerCase().includes(q) ||
          p.keywordEn.toLowerCase().includes(q)
        : p.titleTh.toLowerCase().includes(q) ||
          p.titleEn.toLowerCase().includes(q) ||
          p.abstractTh.toLowerCase().includes(q) ||
          p.abstractEn.toLowerCase().includes(q) ||
          p.keywordTh.toLowerCase().includes(q) ||
          p.keywordEn.toLowerCase().includes(q) ||
          p.member.toLowerCase().includes(q) ||
          p.advisor.toLowerCase().includes(q) ||
          p.coAdvisor?.toLowerCase().includes(q) ||
          String(p.year).includes(q) ||
          p.category.toLowerCase().includes(q));

    const matchesProgram =
      !filters.programPath || p.category === filters.programPath;

    const matchesKeyword =
      !filters.searchKeyword.length ||
      filters.searchKeyword.some(
        (kw) => p.keywordTh.includes(kw) || p.keywordEn.includes(kw)
      );

    const matchesFile =
      !filters.topic ||
      ((filters.topic === "รูปเล่มรายงาน" ? !!p.file : true) &&
        (filters.topic === "สไลด์" ? !!p.slideFile : true) &&
        (filters.topic === "Source code" ? !!p.zipFile || !!p.github : true));

    let matchesYear = true;
    if (filters.researchYear === "ย้อนหลัง" && filters.researchYearSub) {
      const n = parseInt(filters.researchYearSub.replace(" ปี", ""));
      const currentYear = new Date().getFullYear();
      matchesYear = p.year >= currentYear - n;
    } else if (filters.researchYear === "จากปี" && filters.researchYearSub) {
      const [start, end] = filters.researchYearSub.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        matchesYear = p.year >= start && p.year <= end;
      }
    }

    return (
      matchesSearch &&
      matchesProgram &&
      matchesKeyword &&
      matchesFile &&
      matchesYear
    );
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
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
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
