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
  searchKeyword?: string[];
}

function Browse() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get("search") || "";
  const pageParam = parseInt(queryParams.get("page") || "1", 10);

  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const itemsPerPage = 10;

  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  const programParam = queryParams.get("program") || "";
  const yearTypeParam = queryParams.get("yearType") || "";
  const yearSubParam = queryParams.get("yearSub") || "";
  const yearRangeParam = queryParams.get("yearRange"); // "2020,2023"
  const searchFieldParam = queryParams.get("searchField") || "";
  const documentParam = queryParams.get("document"); // "file,slide"

  const [programFilter, setProgramFilter] = useState(programParam);
  const [yearFilterType, setYearFilterType] = useState(yearTypeParam);
  const [yearSubOption, setYearSubOption] = useState(yearSubParam);
  const [yearRange, setYearRange] = useState<[number, number]>(
    yearRangeParam
      ? (yearRangeParam.split(",").map(Number) as [number, number])
      : [2000, new Date().getFullYear()]
  );
  const [searchField, setSearchField] = useState(searchFieldParam);
  const [documentFilter, setDocumentFilter] = useState<string[]>(
    documentParam ? documentParam.split(",") : []
  );

  // ---- update URL เมื่อเปลี่ยน page ----
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    queryParams.set("page", page.toString());
    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    setSearchQuery(queryParams.get("search") || "");
    setCurrentPage(parseInt(queryParams.get("page") || "1", 10));
    setProgramFilter(queryParams.get("program") || "");
    setYearFilterType(queryParams.get("yearType") || "");
    setYearSubOption(queryParams.get("yearSub") || "");
    setYearRange(
      queryParams.get("yearRange")
        ? (queryParams.get("yearRange")!.split(",").map(Number) as [
            number,
            number
          ])
        : [2000, new Date().getFullYear()]
    );
    setSearchField(queryParams.get("searchField") || "");
    setDocumentFilter(
      queryParams.get("document") ? queryParams.get("document")!.split(",") : []
    );
  }, [location.search]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // ส่ง filter เป็น query string ด้วย
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        if (programFilter) params.append("program", programFilter);
        if (yearFilterType) params.append("yearType", yearFilterType);
        if (yearSubOption) params.append("yearSub", yearSubOption);
        if (yearRange) params.append("yearRange", yearRange.join(","));
        if (searchField) params.append("searchField", searchField);
        if (documentFilter.length > 0)
          params.append("document", documentFilter.join(","));

        const url = `http://localhost:8081/api/projects?${params.toString()}`;
        const res = await axios.get<Project[]>(url, { withCredentials: true });
        setProjects(res.data);
      } catch (err) {
        console.error("ไม่สามารถโหลดข้อมูลโครงงาน:", err);
      }
    };

    fetchProjects();
  }, [
    searchQuery,
    programFilter,
    yearFilterType,
    yearSubOption,
    yearRange,
    searchField,
    documentFilter,
  ]);

  const handleSearch = (query: string) => {
    queryParams.set("search", query);
    queryParams.set("page", "1"); // รีเซ็ตหน้าใหม่เมื่อค้นหา
    navigate(`${location.pathname}?${queryParams.toString()}`);
    setSearchQuery(query);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  const toggleFavorite = async (id: string | number) => {
    try {
      if (favorites.includes(id)) {
        // ลบ bookmark
        await axios.delete(`http://localhost:8081/api/bookmark/${id}`, {
          withCredentials: true,
        });
        setFavorites((prev) => prev.filter((fid) => fid !== id));
      } else {
        // เพิ่ม bookmark
        await axios.post(
          `http://localhost:8081/api/bookmark/${id}`,
          {},
          {
            withCredentials: true,
          }
        );
        setFavorites((prev) => [...prev, id]);
      }
    } catch (err: any) {
      if (err.response) {
        alert(err.response.data);
      } else {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser || currentUser.role !== "Student") {
        setFavorites([]);
        return;
      }

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
  }, [currentUser]);

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

  const handleFilterChange = (filters: FilterValues) => {
    setProgramFilter(filters.program || "");
    setYearFilterType(filters.yearType || "");
    setYearSubOption(filters.yearSub || "");
    setYearRange(filters.yearRange || [2000, new Date().getFullYear()]);
    setSearchField(filters.searchField || "");
    setDocumentFilter(filters.searchKeyword || []);
    setCurrentPage(1);

    // อัปเดต URL
    queryParams.set("program", filters.program || "");
    queryParams.set("yearType", filters.yearType || "");
    queryParams.set("yearSub", filters.yearSub || "");
    queryParams.set(
      "yearRange",
      (filters.yearRange || [2000, new Date().getFullYear()]).join(",")
    );
    queryParams.set("searchField", filters.searchField || "");
    queryParams.set("document", (filters.searchKeyword || []).join(","));
    queryParams.set("page", "1");
    navigate(`${location.pathname}?${queryParams.toString()}`, {
      replace: true,
    });
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

    // --- เอกสารประกอบโครงงาน ---
    let matchDocument = true;

    if (documentFilter.length > 0) {
      matchDocument = documentFilter.every((doc) => {
        switch (doc) {
          case "รูปเล่มโครงงาน":
            return p.file != null && p.file.trim() !== "";

          case "สไลด์นำเสนอ":
            return p.slideFile != null && p.slideFile.trim() !== "";

          case "Source code":
            return (
              (p.zipFile != null && p.zipFile.trim() !== "") ||
              (p.github != null && p.github.trim() !== "")
            );

          default:
            return true;
        }
      });
    }

    return matchSearch && matchYear && matchDocument;
  });

  const sortedProjects = filteredProjects.sort((a, b) =>
    sortOption === "newest" ? b.year - a.year : a.year - b.year
  );

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

  const displayedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVisitProject = async (id: number) => {
    try {
      // บันทึกประวัติแบบ background
      axios.post(
        `http://localhost:8081/api/history/${id}`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("History error:", err);
    }

    // ไปหน้าโปรเจกต์ทันที
    navigate(`/project/${id}`);
  };

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
          initialFilters={{
            programPath: programFilter || null,
            researchYear: yearFilterType || null,
            researchYearSub: yearRange,
            searchField: searchField || null,
            searchKeyword: documentFilter || [],
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
              onNavigate={(id) => handleVisitProject(Number(id))}
              isFavorite={favorites.includes(project.projectID)}
              onToggleFavorite={
                ["Admin", "Student"].includes(currentUser?.role || "")
                  ? toggleFavorite
                  : undefined
              }
              role={currentUser?.role || "Guest"}
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
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;
