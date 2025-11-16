import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProjectForm, { type ProjectData } from "../components/ProjectForm";
import { createPortal } from "react-dom";

const AddProject: React.FC = () => {
  const navigate = useNavigate();

  const [isDirty, setIsDirty] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);

  const handleBackClick = () => {
    if (!isDirty) {
      navigate("/admin/projects");
    } else {
      setShowBackModal(true);
    }
  };

  const confirmBack = () => {
    setShowBackModal(false);
    navigate("/admin/projects");
  };

  const handleSubmit = async (data: ProjectData) => {
    try {
      const formData = new FormData();

      // ฟิลด์ข้อความ
      formData.append("title", data.title);
      formData.append("projectNameTH", data.projectNameTH);
      formData.append("projectNameEN", data.projectNameEN);

      formData.append("members", JSON.stringify(data.members || []));
      formData.append("advisor", data.advisor || "");
      formData.append("coAdvisors", JSON.stringify(data.coAdvisors || []));

      formData.append("year", data.year || "");
      formData.append("category", data.category || "");

      formData.append("abstractTh", data.abstractTh || "");
      formData.append("abstractEn", data.abstractEn || "");


      formData.append("keywordsTH", data.keywordsTH || "");
      formData.append("keywordsEN", data.keywordsEN || "");

      formData.append("githubLink", data.github || "");

      // ไฟล์ PDF (ชื่อ file)
      if ((data as any).titleFile) {
        formData.append("file", (data as any).titleFile);
      }

      // SlideFile
      if ((data as any).slideFileObj) {
        formData.append("slideFile", (data as any).slideFileObj);
      }

      // ZipFile
      if ((data as any).zipFileObj) {
        formData.append("zipFile", (data as any).zipFileObj);
      }

      // Debug FormData
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch(
        "http://localhost:8081/api/admin/projects/add",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      navigate("/admin/projects");
    } catch (error: any) {
      console.error("เกิดข้อผิดพลาด:", error.message);
      alert("ไม่สามารถบันทึกโครงงานได้: " + error.message);
    }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)", overflow: "hidden" }}>
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto", backgroundColor: "#f8f9fa" }}>
        
        <button
          onClick={handleBackClick}
          style={{
            marginBottom: "1rem",
            padding: "0.3rem 0.6rem",
            backgroundColor: "#eee",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← กลับไปหน้าโครงงานของฉัน
        </button>

        <h2>เพิ่มโครงงานใหม่</h2>

        <div style={{ marginTop: "2rem" }}>
          <ProjectForm
            onSubmit={handleSubmit}
            onDelete={undefined}
            onChangeDirty={() => setIsDirty(true)}
          />
        </div>
      </div>

      {showBackModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "3rem 2rem",
                borderRadius: "16px",
                textAlign: "center",
                maxWidth: "400px",
                width: "90%",
              }}
            >
              <h2>คุณไม่ต้องการบันทึกการเพิ่มโครงงานใช่หรือไม่?</h2>

              <button
                onClick={confirmBack}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#FD7521",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  marginRight: "1rem",
                }}
              >
                ยืนยัน
              </button>

              <button
                onClick={() => setShowBackModal(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ddd",
                  borderRadius: "12px",
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AddProject;
