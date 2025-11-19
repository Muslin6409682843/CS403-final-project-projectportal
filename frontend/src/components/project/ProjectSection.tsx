import React from "react";

interface SectionItem {
  subtitle: string;
  content: string;
}

interface ProjectSectionProps {
  title: string;
  items: SectionItem[];
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ title, items }) => {
  return (
    <div style={{ marginBottom: "40px", maxWidth: "75vw" }}>
      {/* หัวข้อใหญ่ */}
      <h2
        style={{
          fontSize: "22px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        {title}
      </h2>

      {/* กรอบของแต่ละหัวข้อย่อย */}
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #A5A5A5",
            borderRadius: "30px",
            padding: "25px",
            marginBottom: "25px",
            boxSizing: "border-box",
          }}
        >
          {/* subtitle + content อยู่บรรทัดเดียว */}
          <div
            style={{
              display: "flex",
              gap: "80px", // 👈 ช่องว่างระหว่าง subtitle ↔ content
              fontSize: "18px",
              lineHeight: 1.8,
              flexWrap: "wrap", // ถ้า content ยาวมากให้ขึ้นบรรทัดใหม่
            }}
          >
            {/* subtitle ฝั่งซ้าย */}
            <span
              style={{
                fontWeight: "bold",
                minWidth: "140px",
                whiteSpace: "nowrap", // ห้ามตัดคำ subtitle
              }}
            >
              {item.subtitle}
            </span>

            {/* content ฝั่งขวา (สามารถขึ้นบรรทัดใหม่ได้) */}
            <span style={{ flex: 1, wordBreak: "break-word" }}>
              {item.content}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectSection;
