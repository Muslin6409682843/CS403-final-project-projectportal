import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ProjectHeader from "../components/project/ProjectHeader";
import ProjectAbstract from "../components/project/ProjectAbstract";
import ProjectInfo from "../components/project/ProjectInfo";
import ProjectActionButtons from "../components/project/ProjectActionButtons";

import type { ProjectDTO } from "../dto/ProjectDTO";
import { FaStar } from "react-icons/fa";

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/projects/${id}`,
          { withCredentials: true }
        );

        const raw = response.data;

        // ⭐ Map Backend → Frontend DTO
        const mapped: ProjectDTO = {
          projectID: raw.projectID,
          projectNameTH: raw.titleTh ?? "",
          projectNameEN: raw.titleEn ?? "",

          abstractTh: raw.abstractTh ?? "",
          abstractEn: raw.abstractEn ?? "",

          keywordsTH: raw.keywordTh ?? "",
          keywordsEN: raw.keywordEn ?? "",

          members: raw.member?.split(",") ?? [],
          advisor: raw.advisor ?? "",
          coAdvisors: raw.coAdvisor?.split(",") ?? [],

          category: raw.category ?? "",
          year: raw.year ? String(raw.year) : "",

          github: raw.github ?? "",

          file: raw.file ?? "",
          slideFile: raw.slideFile ?? "",
          zipFile: raw.zipFile ?? "",
        };

        setProject(mapped);

        // ⭐ โหลดรายการ Favorite
        const favRes = await axios.get(
          "http://localhost:8081/api/bookmark",
          { withCredentials: true }
        );

        // ⭐ แปลง response → array ของ projectId
        let favIds: number[] = [];

        if (Array.isArray(favRes.data)) {
          // backend ส่งเป็น array ของ object
          favIds = favRes.data.map((b: any) => Number(b.projectId));
        } else if (Array.isArray(favRes.data.bookmarks)) {
          // backend ส่งเป็น { bookmarks: [...] }
          favIds = favRes.data.bookmarks.map((b: any) => Number(b.projectId));
        }

        setIsFavorite(favIds.includes(Number(raw.projectID)));
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลโครงงานได้");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  // ⭐ Toggle Favorite
  const toggleFavorite = async () => {
    if (!project) return;

    try {
      if (isFavorite) {
        await axios.delete(
          `http://localhost:8081/api/bookmark/${project.projectID}`,
          { withCredentials: true }
        );
        setIsFavorite(false);
      } else {
        await axios.post(
          `http://localhost:8081/api/bookmark/${project.projectID}`,
          {},
          { withCredentials: true }
        );
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถเปลี่ยนสถานะ Favorite ได้");
    }
  };

  // Loading & Error Handling
  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (error || !project) return <p>{error || "ไม่พบโครงงาน"}</p>;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100vw",
          background: "linear-gradient(to bottom, #fff9f0, #ffe0b2)",
          display: "flex",
          justifyContent: "flex-start",
          padding: "40px 0",
        }}
      >
        <div style={{ width: "80%", maxWidth: "1000px", marginLeft: "10%" }}>
          <ProjectHeader
            titleTh={project.projectNameTH}
            titleEn={project.projectNameEN}
            author={project.members.join(", ")}
            advisor={project.advisor}
            year={project.year ? `ปีการศึกษา: ${project.year}` : ""}
          />

          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            style={{
              position: "absolute",
              top: "40px",
              right: "10%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "28px",
              color: isFavorite ? "#FFD700" : "#ccc",
            }}
            title="เพิ่ม/ลบ Favorite"
          >
            <FaStar />
          </button>
        </div>
      </div>

      <ProjectActionButtons project={project} />

      {/* Abstract + Info */}
      <div
        style={{
          width: "80%",
          maxWidth: "1000px",
          marginLeft: "10%",
          marginTop: "40px",
        }}
      >
        <ProjectAbstract
          abstractTh={project.abstractTh}
          abstractEn={project.abstractEn}
        />
        <ProjectInfo project={project} />
      </div>
    </div>
  );
};

export default Project;
