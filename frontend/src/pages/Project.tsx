import React from "react";
import ProjectHeader from "../components/project/ProjectHeader";

const Project: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#fff", // ✅ พื้นหลังหลักสีขาว
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100vw",
          background: "linear-gradient(to bottom, #fff9f0, #ffe0b2)",
          display: "flex",
          justifyContent: "flex-start", // ✅ ชิดซ้าย
          padding: "40px 0",
        }}
      >
        <div style={{ width: "80%", maxWidth: "1000px", marginLeft: "10%" }}>
          <ProjectHeader
            titleTh="ระบบจัดการข้อมูลพนักงาน"
            titleEn="Employee Information Management System"
            author="นายมุสลิน พัฒนิจ และคณะ"
            advisor="อาจารย์ ดร.สมชาย ใจดี"
            year="ปีการศึกษาที่เสนอ: 2568"
          />
        </div>
      </div>

      {/* ✅ เนื้อหาหลัก */}
      <div
        style={{
          width: "80%",
          maxWidth: "1000px",
          margin: "40px auto",
        }}
      >
        <p style={{ fontSize: "16px", color: "#000" }}>
          (พื้นที่สำหรับรายละเอียดโครงงาน เช่น บทคัดย่อ วัตถุประสงค์ เนื้อหา
          ฯลฯ)
        </p>
      </div>
    </div>
  );
};

export default Project;
