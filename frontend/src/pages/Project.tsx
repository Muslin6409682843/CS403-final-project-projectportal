import React from "react";
import ProjectHeader from "../components/project/ProjectHeader";
import ProjectAbstract from "../components/project/ProjectAbstract";
import ProjectSection from "../components/project/ProjectSection";
import ProjectActionButtons from "../components/project/ProjectActionButtons";

const Project: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: "#fff", // ✅ พื้นหลังหลักสีขาว
        minHeight: "100vh",
        boxSizing: "border-box",
        position: "relative",
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
            year="ปีการศึกษา: 2568"
          />
        </div>
      </div>

      {/* ⬅ ปุ่มทางขวา */}
      <ProjectActionButtons />

      {/* ✅ เนื้อหาหลัก */}
      <div
        style={{
          width: "80%",
          maxWidth: "1000px",
          marginLeft: "10%",
          marginTop: "40px",
        }}
      >
        <ProjectAbstract
          abstractTh={`บทคัดย่อภาษาไทยของโครงงานนี้ ทดสอบความยาวววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววว
          สามารถเว้นบรรทัดได้ตามต้องการ
          และรองรับข้อความยาวๆ`}
          abstractEn={`This project aims to develop...
You can write multiple lines here as well.`}
        />

        <ProjectSection
          title="รายละเอียดโครงงาน"
          items={[
            {
              subtitle: "คำสำคัญ",
              content:
                "AI, Machine Learning, ทดสอบความยาวววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววววว",
            },
            {
              subtitle: "วัตถุประสงค์",
              content: "1. เพื่อพัฒนาระบบ...\n2. เพื่อเพิ่มประสิทธิภาพระบบ...",
            },
            {
              subtitle: "ขอบเขตของระบบ",
              content: "ระบบนี้ครอบคลุม...\nไม่ครอบคลุม...",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Project;
