import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { createPortal } from "react-dom";

interface MyProjectCardProps {
  id: string | number;
  title: string;
  author: string;
  advisor: string;
  year: string | number;
  uploadedAt?: string;
  onNavigate?: (id: string | number) => void;

  onDelete?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
}

const MyProjectCard: React.FC<MyProjectCardProps> = ({
  id,
  title,
  author,
  advisor,
  year,
  onNavigate,
  onDelete,
  onEdit,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "30px",
          padding: "1.5rem",
          marginBottom: "1.5rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        {/* หัวข้อโปรเจกต์ */}
        <h2 style={{ marginBottom: "1rem", paddingRight: "2rem" }}>
          <span
            onClick={() => onNavigate?.(id)}
            style={{
              color: "#33469A",
              cursor: "pointer",
              textDecoration: "none",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = "#22306D";
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = "#33469A";
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            {title}
          </span>
        </h2>

        {/* รายละเอียด */}
        <p style={{ margin: "0.3rem 0", fontSize: "14px", color: "#000000" }}>
          <strong>ผู้จัดทำ:</strong> {author}
        </p>
        <p style={{ margin: "0.3rem 0", fontSize: "14px", color: "#000000" }}>
          <strong>อาจารย์ที่ปรึกษา:</strong> {advisor}
        </p>
        <p style={{ margin: "0.3rem 0", fontSize: "14px", color: "#000000" }}>
          <strong>ปีที่เผยแพร่:</strong> {year}
        </p>

        {/* ปุ่มแก้ไข + ลบ */}
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            right: "20px",
            display: "flex",
            gap: "0.75rem",
          }}
        >
          <button
            onClick={() => onEdit?.(id)}
            style={{
              backgroundColor: "#33469A",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.4rem 0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <FaEdit /> แก้ไขโครงงาน
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "0.4rem 0.8rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <FaTrash /> ลบโครงงาน
          </button>
        </div>
      </div>

      {/* Modal ยืนยันการลบ */}
      {showDeleteModal &&
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
                คุณต้องการลบโครงงานนี้ใช่ไหม?
              </h2>
              <button
                onClick={() => {
                  onDelete?.(id);
                  setShowDeleteModal(false);
                }}
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
                onClick={() => setShowDeleteModal(false)}
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
    </>
  );
};

export default MyProjectCard;
