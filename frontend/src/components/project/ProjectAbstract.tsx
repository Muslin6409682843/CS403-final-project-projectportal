import React from "react";

interface ProjectAbstractProps {
  abstractTh: string;
  abstractEn: string;
}

const ProjectAbstract: React.FC<ProjectAbstractProps> = ({
  abstractTh,
  abstractEn,
}) => {
  const sectionSpacing = "40px";

  return (
    <div style={{ marginTop: sectionSpacing }}>
      {/* บทคัดย่อภาษาไทย */}
      <section style={{ marginBottom: sectionSpacing }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          บทคัดย่อ (ภาษาไทย)
        </h2>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.8",
            whiteSpace: "pre-line",
            color: "#444",
            maxWidth: "75vw",
            wordBreak: "break-word",
          }}
        >
          {abstractTh}
        </p>
      </section>

      {/* Abstract ภาษาอังกฤษ */}
      <section style={{ marginBottom: sectionSpacing }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#333",
            marginBottom: "10px",
          }}
        >
          Abstract (English)
        </h2>
        <p
          style={{
            fontSize: "16px",
            lineHeight: "1.8",
            whiteSpace: "pre-line",
            color: "#444",
            maxWidth: "75vw",
            wordBreak: "break-word",
          }}
        >
          {abstractEn}
        </p>
      </section>
    </div>
  );
};

export default ProjectAbstract;
