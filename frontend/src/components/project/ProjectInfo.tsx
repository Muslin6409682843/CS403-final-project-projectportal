import React from "react";
import ProjectSection from "./ProjectSection";
import type { ProjectDTO } from "../../dto/ProjectDTO";

interface ProjectInfoProps {
  project: ProjectDTO;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  // -------------------------
  // กรอบคำสำคัญ + Keywords
  // -------------------------
  const keywordItems = [
    { subtitle: "คำสำคัญ", content: project.keywordsTH || "-" },
    { subtitle: "Keywords", content: project.keywordsEN || "-" },
  ];

  // -------------------------
  // รายละเอียดโครงงาน
  // -------------------------
  const detailItems = [
    { subtitle: "ผู้จัดทำ", content: project.members.join(", ") },
    { subtitle: "อาจารย์ที่ปรึกษา", content: project.advisor },
  ];

  if (project.coAdvisors && project.coAdvisors.length > 0) {
    detailItems.push({
      subtitle: "อาจารย์ที่ปรึกษาร่วม",
      content: project.coAdvisors.join(", "),
    });
  }

  detailItems.push({
    subtitle: "ประเภทโครงงาน",
    content: project.category || "-",
  });
  detailItems.push({ subtitle: "ปีการศึกษา", content: project.year || "-" });

  return (
    <div>
      {/* กรอบคำสำคัญ + Keywords */}
      <ProjectSection title="คำสำคัญ" items={keywordItems} />

      {/* กรอบรายละเอียดโครงงาน */}
      <ProjectSection title="รายละเอียดโครงงาน" items={detailItems} />
    </div>
  );
};

export default ProjectInfo; 
