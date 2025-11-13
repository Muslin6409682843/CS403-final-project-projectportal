import React, { useState } from "react";
import AccountSideBar from "../components/AccountSideBar";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/background.css";

function ChangePassword() {
  // ----- State -----
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    // TODO: ส่งข้อมูลไป backend ทีหลัง
    alert("เปลี่ยนรหัสผ่านเรียบร้อย (mock frontend)");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleForgotPassword = () => {
    alert("ลืมรหัสผ่าน? ฟังก์ชันนี้ยังไม่เชื่อม backend");
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
        {/* Sidebar */}
        <AccountSideBar />

        {/* Main Content */}
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
          {/* กล่องฟอร์ม */}
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
            {/* Title */}
            <h2 style={{ margin: 0, textAlign: "center" }}>เปลี่ยนรหัสผ่าน</h2>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Current Password */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "0.5rem" }}>
                  รหัสผ่านปัจจุบัน
                </label>
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
                {/* ลิงก์ลืมรหัสผ่านชิดขวา */}
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

              {/* New Password */}
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

              {/* Confirm New Password */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={{ marginBottom: "0.5rem" }}>
                  ยืนยันรหัสผ่านใหม่
                </label>
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

              {/* Submit Button */}
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
