import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import AccountSideBar from "../components/AccountSideBar";
import TextSearch from "../components/TextSearch";
import ProjectCard from "../components/ProjectCard";

import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";

interface Project {
  projectID: number;
  titleTh: string;
  titleEn: string;
  member: string;
  advisor: string;
  year: number;
  viewDateTime: string;
  file?: string;
  slideFile?: string;
  zipFile?: string;
  github?: string;
}

function History() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [historyIDs, setHistoryIDs] = useState<number[]>([]);
  const [historyProjects, setHistoryProjects] = useState<Project[]>([]);

  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: string;
  } | null>(null);

  const navigate = useNavigate();

  // โหลด session ผู้ใช้
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:8081/api/check-session", {
          withCredentials: true,
        });
        if (res.data.status) {
          setCurrentUser({
            username: res.data.username,
            role: res.data.role,
          });
        }
      } catch (err) {
        console.error("Session error:", err);
      }
    };
    fetchSession();
  }, []);

  // โหลด history IDs
  useEffect(() => {
    if (!currentUser || !["Admin", "Student"].includes(currentUser.role)) {
      setHistoryIDs([]);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get<number[]>(
          "http://localhost:8081/api/history",
          { withCredentials: true }
        );
        setHistoryIDs(res.data);
      } catch (err) {
        console.error("Load history failed:", err);
      }
    };

    fetchHistory();
  }, [currentUser]);

  // โหลดรายละเอียดโปรเจกต์จาก history IDs
  useEffect(() => {
    const fetchHistoryProjects = async () => {
      try {
        if (!historyIDs || historyIDs.length === 0) {
          setHistoryProjects([]);
          return;
        }

        const res = await axios.get<Project[]>(
          "http://localhost:8081/api/projects/list",
          {
            params: { ids: historyIDs },
            paramsSerializer: (params) =>
              params.ids.map((id: number) => `ids=${id}`).join("&"),
            withCredentials: true,
          }
        );

        const projectsMap = new Map<number, Project>();
        res.data.forEach((p) => projectsMap.set(p.projectID, p));

        // เรียงตาม historyIDs ที่ backend return (ล่าสุดเข้าชมบนสุด)
        const orderedProjects = historyIDs
          .map((id) => projectsMap.get(id))
          .filter((p): p is Project => p !== undefined);

        setHistoryProjects(orderedProjects);
      } catch (err) {
        console.error("Load history projects failed:", err);
        setHistoryProjects([]);
      }
    };

    fetchHistoryProjects();
  }, [historyIDs]);

  // ---- Search ----
  const filtered = historyProjects.filter((p) =>
    p.titleTh.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayed = filtered;

  // Guest ไม่ให้ใช้
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

        <h2 style={{ margin: "1rem 0" }}>ประวัติการเข้าชม</h2>

        {/* Project List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingBottom: "6rem",
          }}
        >
          {displayed.map((p) => (
            <ProjectCard
              key={p.projectID}
              id={p.projectID}
              title={p.titleTh}
              titleEn={p.titleEn}
              author={p.member}
              advisor={p.advisor}
              year={p.year}
              isFavorite={false}
              onToggleFavorite={() => {}}
              onNavigate={(id) => handleVisitProject(Number(id))}
              role={currentUser?.role || "Guest"}
              //ไอคอนแสดงไฟล์แนบที่มี
              files={{
                book: p.file,
                slide: p.slideFile,
                source: p.zipFile || p.github,
              }}
            />
          ))}

          {displayed.length === 0 && <p>ยังไม่มีประวัติการเข้าชม</p>}
        </div>
      </div>
    </div>
  );
}

export default History;
