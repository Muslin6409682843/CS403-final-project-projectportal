import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectForm, { type ProjectData } from "../components/EditProjectForm";
import { createPortal } from "react-dom";
import axios from "axios";

const EditProject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isDirty, setIsDirty] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [initialData, setInitialData] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/admin/projects/${id}`,
          { withCredentials: true }
        );

        const data: ProjectData = {
          // ใช้ title เป็น "ชื่อไฟล์ PDF" ตามระบบเดิม
          title: res.data.file || "",
          projectNameTH: res.data.titleTh,
          projectNameEN: res.data.titleEn,
          members: res.data.member ? res.data.member.split(",").map((m: string) => m.trim()) : [],
          advisor: res.data.advisor || "",
          coAdvisors: res.data.coAdvisor ? res.data.coAdvisor.split(",").map((c: string) => c.trim()) : [],
          year: res.data.year || "",
          category: res.data.category || "",
          abstractTh: res.data.abstractTh || "",
          abstractEn: res.data.abstractEn || "",
          keywordsTH: res.data.keywordTh || "",
          keywordsEN: res.data.keywordEn || "",
          github: res.data.github || "",

          // ไฟล์ (ตอนโหลดยังไม่มี object เพราะต้องอัปหลังเลือกใหม่)
          titleFile: null,
          slideFileObj: null,
          zipFileObj: null,

          // เพิ่มชื่อไฟล์เก่ากลับไป (ให้หน้า form แสดงได้)
          oldTitleFile: res.data.file || "",
          oldSlideFile: res.data.slideFile || "",
          oldZipFile: res.data.zipFile || "",
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
    if (!isDirty) navigate("/admin/projects");
    else setShowBackModal(true);
  };

  const confirmBack = () => {
    setShowBackModal(false);
    navigate("/admin/projects");
  };

  const handleSubmit = async (data: ProjectData) => {
    try {
      if (!id) return;

      const formData = new FormData();

      // Title = ชื่อไฟล์ PDF 
      formData.append("title", data.title);

      formData.append("projectNameTH", data.projectNameTH);
      formData.append("projectNameEN", data.projectNameEN);
      formData.append("members", JSON.stringify(data.members));
      formData.append("advisor", data.advisor);
      formData.append("coAdvisors", JSON.stringify(data.coAdvisors || []));
      formData.append("year", data.year);
      formData.append("category", data.category || "");
      formData.append("abstractTh", data.abstractTh);
      formData.append("abstractEn", data.abstractEn || "");
      formData.append("keywordsTH", data.keywordsTH || "");
      formData.append("keywordsEN", data.keywordsEN || "");
      formData.append("github", data.github || "");

      // อัปโหลดไฟล์จริง
      if (data.titleFile) formData.append("file", data.titleFile);
      if (data.slideFileObj) formData.append("slideFile", data.slideFileObj);
      if (data.zipFileObj) formData.append("zipFile", data.zipFileObj);

      await axios.put(
        `http://localhost:8081/api/admin/projects/edit/${id}`,
        formData,
        { withCredentials: true }
      );

      alert("แก้ไขโครงงานสำเร็จ");
      navigate("/admin/projects");
    } catch (err: any) {
      console.error(err);
      alert(
        "ไม่สามารถแก้ไขโครงงานได้: " +
          (err.response?.data || err.message)
      );
    }
  };

  if (loading)
    return <div style={{ padding: "2rem" }}>กำลังโหลดข้อมูลโครงงาน...</div>;
  if (!initialData)
    return <div style={{ padding: "2rem" }}>ไม่พบข้อมูลโครงงาน</div>;

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
