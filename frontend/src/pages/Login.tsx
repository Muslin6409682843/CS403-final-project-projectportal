import React from "react";
import { Link } from "react-router-dom";
import "../assets/background.css"; // ใช้ background จาก main-background

function Login() {
  return (
    <div
      className="main-background"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {/* กล่องสมัครสมาชิก */}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "50px 50px", // เพิ่ม padding แนวนอนอีกเล็กน้อย
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
          minWidth: "320px", // กว้างขึ้นจาก 280px
          maxWidth: "380px", // กว้างขึ้นจาก 300px
          width: "100%",
        }}
      >
        {/* หัวข้อ */}
        <h2
          style={{
            fontSize: "28px",
            marginBottom: "35px",
            color: "#000",
          }}
        >
          เข้าสู่ระบบ
        </h2>

        {/* ปุ่มนักศึกษา / บุคลากร */}
        <Link to="/tu-login" style={{ textDecoration: "none" }}>
          <button
            style={{
              display: "block",
              width: "260px",
              padding: "16px 0",
              fontSize: "18px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              margin: "10px auto",
              backgroundColor: "#FD7521",
              color: "#fff",
              textDecoration: "none",
              transition:
                "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
            }}
            onMouseOver={(e) =>
              Object.assign((e.target as HTMLButtonElement).style, {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                backgroundColor: "#ffd600",
              })
            }
            onMouseOut={(e) =>
              Object.assign((e.target as HTMLButtonElement).style, {
                transform: "translateY(0)",
                boxShadow: "none",
                backgroundColor: "#FD7521",
              })
            }
          >
            นักศึกษา / บุคลากร
          </button>
        </Link>

        {/* ปุ่มผู้เยี่ยมชม */}
        <Link to="/guest" style={{ textDecoration: "none" }}>
          <button
            style={{
              display: "block",
              width: "260px",
              padding: "16px 0",
              fontSize: "18px",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              margin: "10px auto",
              backgroundColor: "#FD7521",
              color: "#fff",
              textDecoration: "none",
              transition:
                "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
            }}
            onMouseOver={(e) =>
              Object.assign((e.target as HTMLButtonElement).style, {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                backgroundColor: "#ffd600",
              })
            }
            onMouseOut={(e) =>
              Object.assign((e.target as HTMLButtonElement).style, {
                transform: "translateY(0)",
                boxShadow: "none",
                backgroundColor: "#FD7521",
              })
            }
          >
            ผู้เยี่ยมชม
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
