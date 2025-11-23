import React, { useState, useEffect } from "react";
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
  member: string;
  advisor: string;
  year: number;
}

function Favorite() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [favoriteIDs, setFavoriteIDs] = useState<number[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<Project[]>([]);

  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  const itemsPerPage = 10;

  // โหลด session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/check-session", {
          withCredentials: true,
        });

        if (res.data.status)
          setCurrentUser({
            username: res.data.username,
            role: res.data.role,
          });
      } catch (err) {
        console.error("Session error:", err);
      }
    };

    fetchSession();
  }, []);

  // โหลด favorite IDs
  useEffect(() => {
    if (!currentUser || !["Admin", "Student"].includes(currentUser.role)) {
      setFavoriteIDs([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const res = await axios.get<number[]>(
          "http://localhost:8081/api/bookmark",
          {
            withCredentials: true,
          }
        );
        setFavoriteIDs(res.data);
      } catch (err) {
        console.error("Load favorite IDs failed:", err);
      }
    };

    fetchFavorites();
  }, [currentUser]);

  // โหลดข้อมูลโปรเจกต์ของ favorite IDs
  useEffect(() => {
    const fetchFavoriteProjects = async () => {
      try {
        if (!favoriteIDs || favoriteIDs.length === 0) {
          setFavoriteProjects([]);
          return;
        }

        const res = await axios.get<Project[]>(
          "http://localhost:8081/api/projects/list",
          {
            params: { ids: favoriteIDs },
            paramsSerializer: (params) =>
              params.ids.map((id: number) => `ids=${id}`).join("&"),
            withCredentials: true,
          }
        );
        setFavoriteProjects(res.data);
      } catch (err) {
        console.error("Load favorite projects failed:", err);
        setFavoriteProjects([]);
      }
    };

    fetchFavoriteProjects();
  }, [favoriteIDs]);

  // ---- Search ----
  const filtered = favoriteProjects.filter((p) =>
    p.titleTh.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ---- Sorting ----
  const sorted = filtered.sort((a, b) =>
    sortOption === "newest" ? b.year - a.year : a.year - b.year
  );

  // ---- Pagination ----
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const displayed = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFavorite = async (projectId: number) => {
    if (!currentUser) return;

    try {
      if (favoriteIDs.includes(projectId)) {
        // ---- Unfavorite ----
        await axios.delete(`http://localhost:8081/api/bookmark/${projectId}`, {
          withCredentials: true,
        });

        // update state
        setFavoriteIDs((prev) => prev.filter((id) => id !== projectId));
      } else {
        // ---- Add Favorite (ไม่ค่อยใช้ในหน้านี้ แต่เผื่อไว้) ----
        await axios.post(
          `http://localhost:8081/api/bookmark/${projectId}`,
          {},
          { withCredentials: true }
        );

        setFavoriteIDs((prev) => [...prev, projectId]);
      }
    } catch (err) {
      console.error("Toggle favorite error:", err);
    }
  };

  //ผู้เยี่ยมชมไม่สามารถใช้ฟีเจอร์ได้

  if (currentUser && currentUser.role === "Guest") {
    return (
      <div
        style={{
          display: "flex",
          height: "calc(100vh - 80px)",
          overflow: "hidden",
        }}
      >
        <AccountSideBar />

        <div
          className="main-background"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.3rem",
            fontWeight: 500,
          }}
        >
          <p>ฟีเจอร์นี้ไม่สามารถใช้งานได้สำหรับผู้เยี่ยมชม</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        overflow: "hidden",
      }}
    >
      <AccountSideBar />

      <div
        className="main-background"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem 2rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextSearch
          value={searchQuery}
          onSearch={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
        />

        {/* Title + Sorting */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "1rem 0",
          }}
        >
          <h2 style={{ margin: 0 }}>รายการโปรด</h2>
          <Sorting value={sortOption} onChange={setSortOption} />
        </div>

        {/* Project List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {displayed.map((p) => (
            <ProjectCard
              key={p.projectID}
              id={p.projectID}
              title={p.titleTh}
              author={p.member}
              advisor={p.advisor}
              year={p.year}
              isFavorite={favoriteIDs.includes(p.projectID)}
              onToggleFavorite={(id) => toggleFavorite(Number(id))}
              onNavigate={(id) => (window.location.href = `/project/${id}`)}
              role={currentUser?.role || "Guest"}
            />
          ))}

          {displayed.length === 0 && (
            <p>คุณยังไม่มีโครงงานที่บันทึกไว้ในรายการโปรด</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

export default Favorite;
