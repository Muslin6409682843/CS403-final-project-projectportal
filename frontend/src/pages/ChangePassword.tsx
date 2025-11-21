import React, { useState } from "react";
import AccountSideBar from "../components/AccountSideBar";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  // ----- State -----
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("❌ รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      setIsError(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // ส่ง cookie/session ด้วย
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

    const data = await res.text(); // หรือ .json() ถ้า backend ส่ง JSON
    if (res.ok) {
      setMessage("✅ เปลี่ยนรหัสผ่านสำเร็จ");
      setIsError(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setMessage(data); // แสดงข้อความที่ backend ส่งมา
      setIsError(true);
    }

    } catch (error) {
      console.error(error);
      setMessage("❌ เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
      setIsError(true);
    }
  };

  // ----- Navigate to Forgot Password -----
  const navigate = useNavigate();
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 80px)",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <AccountSideBar />

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
            <h2 style={{ margin: 0, textAlign: "center" }}>เปลี่ยนรหัสผ่าน</h2>

            {/* แสดงข้อความ success / error */}
            {message && (
              <div
                style={{
                  color: isError ? "red" : "green",
                  fontWeight: 500,
                  marginBottom: "0.5rem",
                  textAlign: "center",
                }}
              >
                {message}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "0.5rem" }}>รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "4px",
                  }}
                >
                  <span
                    onClick={handleForgotPassword}
                    style={{
                      fontSize: "14px",
                      color: "#FD7521",
                      cursor: "pointer",
                    }}
                  >
                    ลืมรหัสผ่าน?
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "0.5rem" }}>รหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "0.5rem" }}>ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px",
                  backgroundColor: "#FD7521",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                บันทึกรหัสผ่านใหม่
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
