import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/background.css";
import axios from "axios";

const Guest: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    if (!username.trim() || !password.trim()) {
      setErrors({
        username: !username.trim() ? "กรุณากรอก Username" : undefined,
        password: !password.trim() ? "กรุณากรอก Password" : undefined,
      });
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8081/api/guest-login",
        { username, password },
        { withCredentials: true } // ส่ง cookie/session ได้
      );

      if (res.data.status) {
        localStorage.setItem("role", res.data.role); // เก็บ role
        navigate(res.data.redirect); // redirect ตาม backend
      } else {
        setApiError(res.data.error);
      }
    } catch (err: any) {
      console.error(err);
      setApiError("เกิดข้อผิดพลาดในการเชื่อมต่อ server");
    }
  };

  return (
    <div
      className="main-background"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          minWidth: "350px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            textAlign: "center",
            color: "#333",
          }}
        >
          เข้าสู่ระบบ สำหรับผู้เยี่ยมชม
        </h2>

        {/* Username */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="username"
            style={{ marginBottom: "5px", fontSize: "16px" }}
          >
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "12px 15px",
              fontSize: "16px",
              borderRadius: "8px",
              border: errors.username ? "1px solid red" : "1px solid #ccc",
            }}
          />
          {errors.username && (
            <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.username}
            </span>
          )}
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label
            htmlFor="password"
            style={{ marginBottom: "5px", fontSize: "16px" }}
          >
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px 15px",
              fontSize: "16px",
              borderRadius: "8px",
              border: errors.password ? "1px solid red" : "1px solid #ccc",
            }}
          />
          {errors.password && (
            <span style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
              {errors.password}
            </span>
          )}
        </div>

        {apiError && (
          <span style={{ color: "red", fontSize: "14px", textAlign: "center" }}>
            {apiError}
          </span>
        )}

        {/* ปุ่มเข้าสู่ระบบ */}
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            fontSize: "18px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#FD7521",
            color: "white",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#ffd600")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#FD7521")
          }
        >
          เข้าสู่ระบบ
        </button>

        {/* ลิงก์ล่าง */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          <a
            href="#"
            style={{
              color: "#007bff",
              textDecoration: "none",
            }}
          >
            ลืมรหัสผ่าน
          </a>

          <Link
            to="/guest-register"
            style={{
              color: "#28a745",
              textDecoration: "none",
            }}
          >
            ยังไม่ได้ลงทะเบียน? คลิกที่นี่
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Guest;
