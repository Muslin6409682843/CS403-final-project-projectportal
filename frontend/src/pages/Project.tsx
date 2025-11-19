import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ProjectHeader from "../components/project/ProjectHeader";
import ProjectAbstract from "../components/project/ProjectAbstract";
import ProjectInfo from "../components/project/ProjectInfo";
import ProjectActionButtons from "../components/project/ProjectActionButtons";

import type { ProjectDTO } from "../dto/ProjectDTO";

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/projects/${id}`
        );

        const raw = response.data;

        // ⭐ MAP backend → frontend DTO
        const mapped: ProjectDTO = {
          projectID: raw.projectID,
          projectNameTH: raw.titleTh,
          projectNameEN: raw.titleEn,

          abstractTh: raw.abstractTh || "",
          abstractEn: raw.abstractEn || "",

          keywordsTH: raw.keywordTh || "",
          keywordsEN: raw.keywordEn || "",

          members: raw.member ? raw.member.split(",") : [],
          advisor: raw.advisor || "",
          coAdvisors: raw.coAdvisor ? raw.coAdvisor.split(",") : [],

          category: raw.category || "",
          year: raw.year ? String(raw.year) : "",

          github: raw.github || "",

          file: raw.file || "",
          slideFile: raw.slideFile || "",
          zipFile: raw.zipFile || "",
        };

        setProject(mapped);
      } catch (err) {
        console.error(err);
        setError("ไม่สามารถโหลดข้อมูลโครงงานได้");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

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
        </div>
      </div>

      <ProjectActionButtons />

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
