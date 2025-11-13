import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/background.css";
import axios from "axios";

function TULogin() {
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

    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) newErrors.username = "กรุณากรอก Username";
    if (!password.trim()) newErrors.password = "กรุณากรอก Password";

    setErrors(newErrors);
    setApiError("");

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await axios.post(
          "http://localhost:8081/api/login",
          { username, password },
          { withCredentials: true }
        );

        if (res.status === 200 && res.data.status) {
          console.log("Login successful:", res.data);

          // ✅ เก็บ role ลง localStorage สำหรับทุก role
          localStorage.setItem("role", res.data.role);

          // navigate ตาม backend
          navigate(res.data.redirect);
        } else {
          setApiError(res.data.error || "Login failed");
        }
      } catch (err: any) {
        console.error("Login exception:", err);
        setApiError("เกิดข้อผิดพลาดในการเชื่อมต่อ server");
      }
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
          เข้าสู่ระบบ สำหรับนักศึกษาและบุคลากร
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
            value={username} // <-- เพิ่มตรงนี้
            onChange={(e) => setUsername(e.target.value)} // <-- เพิ่มตรงนี้
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
            value={password} // <-- เพิ่มตรงนี้
            onChange={(e) => setPassword(e.target.value)} // <-- เพิ่มตรงนี้
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          <a
            href="https://accounts.tu.ac.th/Login.aspx"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            ลืมรหัสผ่าน
          </a>

          <Link
            to="/student"
            style={{
              color: "#28a745",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            ยังไม่ได้ลงทะเบียน? คลิกที่นี่
          </Link>
        </div>
      </form>
    </div>
  );
}

export default TULogin;
