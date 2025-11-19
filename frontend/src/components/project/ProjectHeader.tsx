import React from "react";

interface ProjectHeaderProps {
  titleTh: string;
  titleEn: string;
  author: string;
  advisor: string;
  year: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  titleTh,
  titleEn,
  author,
  advisor,
  year,
}) => {
  return (
    <div>
      <h1
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#1835a9ff",
          marginBottom: "30px",
          textAlign: "left",
        }}
      >
        {titleTh} <br />
        <span style={{ fontSize: "22px", fontWeight: "normal" }}>
          ({titleEn})
        </span>
      </h1>

      <div
        style={{
          fontSize: "16px",
          color: "#000",
          lineHeight: "1.4",
          textAlign: "left", // ✅ ชิดซ้าย
        }}
      >
        <p>ผู้จัดทำ: {author}</p>
        <p>อาจารย์ที่ปรึกษา: {advisor}</p>
        <p>{year}</p>
      </div>
    </div>
  );
};

export default ProjectHeader;
