import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";

const AccountSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    { label: "รายการโปรด", path: "/favorite" },
    {
      label: "เปลี่ยนรหัสผ่าน",
      path: "https://accounts.tu.ac.th/Login.aspx",
      external: true,
    },
    { label: "ออกจากระบบ", path: "/logout" },
  ];

  const handleClick = (item: any) => {
    if (item.path === "/logout") {
      setShowLogoutModal(true);
    } else if (item.external) {
      window.open(item.path, "_blank"); // เปิดเว็บภายนอก
    } else {
      navigate(item.path);
    }
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout(); // ✅ context จะ reset state ให้เอง
    navigate("/login"); // เปลี่ยนหน้าไป login
  };

  return (
    <div
      style={{
        width: 400,
        padding: "2rem 1rem",
        backgroundColor: "#fff",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: "80px",
      }}
    >
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          marginTop: "2rem",
          gap: "0.75rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <button
                onClick={() => handleClick(item)}
                style={{
                  width: "100%",
                  backgroundColor: isActive ? "#FD7521" : "transparent",
                  color: isActive ? "#fff" : "#333",
                  border: "1px solid #ddd",
                  textAlign: "left",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  fontSize: "18px",
                  fontWeight: isActive ? 600 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>

      {showLogoutModal &&
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
                maxWidth: 400,
                width: "90%",
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              }}
            >
              <h2 style={{ marginBottom: "1.5rem" }}>
                คุณต้องการออกจากระบบใช่ไหม?
              </h2>
              <button
                onClick={handleLogoutConfirm}
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
                onClick={() => setShowLogoutModal(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#ddd",
                  color: "#333",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                ยกเลิก
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default AccountSideBar;
