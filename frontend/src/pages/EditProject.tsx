import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm, { type ProjectData } from "../components/ProjectForm";
import { createPortal } from "react-dom";
import axios from "axios";

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isDirty, setIsDirty] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [initialData, setInitialData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลโครงงานจาก backend
  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:8081/api/admin/projects/${id}`, {
          withCredentials: true,
        });

        const data: ProjectData = {
          title: res.data.file || "",
          projectNameTH: res.data.titleTh,
          projectNameEN: res.data.titleEn,
          members: res.data.coAdvisor ? res.data.coAdvisor.split(",").map((c: string) => c.trim()) : [],
          advisor: res.data.advisor,
          coAdvisors: res.data.coAdvisor ? res.data.coAdvisor.split(",").map((c: string) => c.trim()) : [],
          year: res.data.category,
          abstract: res.data.abstractTh,
          abstractEN: res.data.abstractEn,
          keywordsTH: res.data.keywordsTH || "",
          keywordsEN: res.data.keywordsEN || "",
          titleFile: null,
          slideFileObj: null,
          zipFileObj: null,
        };

        setInitialData(data);
      } catch (err) {
        console.error(err);
        alert("ไม่สามารถโหลดข้อมูลโครงงานได้");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

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
      if (!id) return;

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("projectNameTH", data.projectNameTH);
      formData.append("projectNameEN", data.projectNameEN);
      formData.append("members", JSON.stringify(data.members));
      formData.append("advisor", data.advisor);
      formData.append("coAdvisors", JSON.stringify(data.coAdvisors || []));
      formData.append("year", data.year);
      formData.append("abstractTh", data.abstract);
      formData.append("abstractEn", data.abstractEN || "");
      formData.append("keywordsTH", data.keywordsTH || "");
      formData.append("keywordsEN", data.keywordsEN || "");

      if (data.titleFile) formData.append("file", data.titleFile);
      if (data.slideFileObj) formData.append("slideFile", data.slideFileObj);
      if (data.zipFileObj) formData.append("zipFile", data.zipFileObj);

      const res = await axios.put(
        `http://localhost:8081/api/admin/projects/edit/${id}`,
        formData,
        { withCredentials: true }
      );

      alert("แก้ไขโครงงานสำเร็จ");
      navigate("/admin/projects");
    } catch (err: any) {
      console.error(err);
      alert("ไม่สามารถแก้ไขโครงงานได้: " + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>กำลังโหลดข้อมูลโครงงาน...</div>;
  }

  if (!initialData) {
    return <div style={{ padding: "2rem" }}>ไม่พบข้อมูลโครงงาน</div>;
  }

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
          flex: 1,
          padding: "2rem",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        <button
          onClick={handleBackClick}
          style={{
            marginBottom: "1rem",
            padding: "0.3rem 0.6rem",
            backgroundColor: "#eee",
            border: "none",
            borderRadius: "6px",
            color: "#000000",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            width: "fit-content",
          }}
        >
          ← กลับไปหน้าโครงงานของฉัน
        </button>

        <h2>แก้ไขโครงงาน</h2>

        <div style={{ marginTop: "2rem" }}>
          <ProjectForm
            initialData={initialData}
            onSubmit={handleSubmit}
            onDelete={undefined}
            onChangeDirty={() => setIsDirty(true)}
          />
        </div>
      </div>

      {/* Modal Confirm Back */}
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
              zIndex: 999999,
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
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              }}
            >
              <h2 style={{ marginBottom: "1.5rem" }}>
                คุณไม่ต้องการบันทึกการแก้ไขโครงงานใช่หรือไม่?
              </h2>
              <button
                onClick={confirmBack}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#FD7521",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
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
                  color: "#333",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 500,
                  cursor: "pointer",
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

export default EditProject;
