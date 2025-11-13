import React from "react";
import "../assets/background.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (
    <div
      className="main-background"
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "36px",
            color: "#333",
          }}
        >
          ค้นหาโครงงานพิเศษ
        </h1>

        {/* Search Box */}
        <form
          style={{
            display: "flex", // ทำให้ form เป็น flex
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            marginBottom: "1rem",
            width: "100%", // กว้างเต็ม container
          }}
        >
          <input
            type="text"
            placeholder="ค้นหา..."
            style={{
              padding: "15px 20px",
              fontSize: "18px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              width: "500px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "15px 25px",
              fontSize: "18px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#FD7521",
              color: "white",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFB347")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#FD7521")
            }
          >
            ค้นหา
          </button>
        </form>

        {/* Advanced Search */}
        <button
          style={{
            marginTop: "20px",
            padding: "15px 30px",
            fontSize: "18px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#007bff")
          }
          onClick={() => navigate("/browse")} // ✅ เมื่อคลิกให้ไปหน้า browse
        >
          ค้นหาแบบละเอียด
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          backgroundColor: "white",
          padding: "20px 20px 60px 20px",
          borderTop: "1px solid #ddd",
          fontSize: "14px",
          color: "#333",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <h1
          style={{
            marginLeft: "20px",
            fontSize: "20px",
            marginBottom: "10px",
          }}
        >
          ค้นหาโครงงานพิเศษ
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            padding: "0 20px",
            alignContent: "start",
          }}
        >
          <div style={{ fontSize: "16px", padding: "10px", cursor: "pointer" }}>
            Artificial Intelligence (AI)
          </div>
          <div style={{ fontSize: "16px", padding: "10px", cursor: "pointer" }}>
            Cybersecurity
          </div>
          <div style={{ fontSize: "16px", padding: "10px", cursor: "pointer" }}>
            Mobile Application Development
          </div>
          <div style={{ fontSize: "16px", padding: "10px", cursor: "pointer" }}>
            Recommendation System
          </div>
          <div style={{ fontSize: "16px", padding: "10px", cursor: "pointer" }}>
            Data Science
          </div>
          <div style={{ fontSize: "16px", padding: "10px", cursor: "pointer" }}>
            Robotics and Embedded System
          </div>
          <div style={{ fontSize: "16px", padding: "10px", cursor: "pointer" }}>
            Web Development
          </div>
          <div style={{ fontSize: "16px", padding: "10px", cursor: "pointer" }}>
            Chatbots & Conversational AI
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
