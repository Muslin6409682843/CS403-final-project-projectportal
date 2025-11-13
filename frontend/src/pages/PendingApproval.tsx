import React from "react";
import { useNavigate } from "react-router-dom";

const PendingApproval: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#333", fontSize: "28px", marginBottom: "20px" }}>
        ระบบจะทำการอนุมัติสมาชิกภายใน 5 วัน
      </h1>
      <p style={{ color: "#555", fontSize: "18px", marginBottom: "30px" }}>
        หากภายใน 5 วันยังไม่สามารถเข้าสู่ระบบได้ หมายถึงการสมัครถูกปฏิเสธ
        (สามารถสมัครใหม่ได้)
      </p>

      <button
        onClick={() => navigate("/about")}
        style={{
          backgroundColor: "#FD7521",
          color: "white",
          border: "none",
          padding: "12px 25px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        หากมีข้อสงสัยเพิ่มเติม ติดต่อเราได้ที่นี่
      </button>
    </div>
  );
};

export default PendingApproval;
