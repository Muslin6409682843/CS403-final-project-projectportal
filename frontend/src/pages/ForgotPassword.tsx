import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";

function ForgotPassword() {


  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        

        <div
          className="main-background"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >


        <h2 style={{ margin: 0, textAlign: "center" }}>ลืมรหัสผ่าน</h2>

        <form>
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


        {/* แนะนำ */}
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "16px",
            color: "#FD7521",
            fontWeight: "bold",
          }}
        >
          → แนะนำ ติดต่อเจ้าหน้าที่
        </div>
        
        {/* ติดต่อเจ้าหน้าที่ */}
        <Link to="/about" style={{ textDecoration: "none" }}>
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
            ติดต่อเจ้าหน้าที่
          </button>
        </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
