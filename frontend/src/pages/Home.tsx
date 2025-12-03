// Home.tsx
import React, { useState } from "react";
import "../assets/background.css";
import { useNavigate } from "react-router-dom";
import FooterKeywords from "../components/FooterKeywords";

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/browse?search=${encodeURIComponent(query)}`);
  };

  return (
    <div
      className="main-background"
      style={{
        position: "fixed",  
        width: "100%",
        minHeight: "100vh",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: "140px",
      }}
    >
      {/* ⭐ ส่วนที่ต้องตรงกลางจอ ⭐ */}
      <div
        style={{
          height: "70vh", 
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* Header */}
        <h1
          style={{
            marginBottom: "30px",
            fontSize: "36px",
            color: "#333",
          }}
        >
          ค้นหาโครงงานพิเศษ
        </h1>

        {/* Search Box */}
        <form
          onSubmit={handleSubmit} 
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "15px",
            marginBottom: "1rem",
          }}
        >
          <input
            type="text"
            placeholder="ค้นหา..."
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
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
          onClick={() => navigate("/browse")}
        >
          ค้นหาแบบละเอียด
        </button>
      </div>

      {/* ⭐ กล่อง Keyword อยู่ด้านล่าง ⭐ */}
      <footer
        style={{
          position: "fixed",  
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          padding: "20px 40px",
          boxSizing: "border-box",
          borderTop: "1px solid #eee",
          zIndex: 1000,        
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "10px",
          }}
        >
          ค้นหาโครงงานพิเศษ
        </h2>

        <FooterKeywords />
      </footer>
    </div>
  );
}

export default Home;
