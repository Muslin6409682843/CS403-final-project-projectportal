import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import AppRoutes from "./route/AppRoutes";
import logoPath from "./assets/logo.png";

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 นาที

function AppContent() {
  const navigate = useNavigate();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 🧩 ฟังก์ชัน Logout (ใช้ร่วมกันทุกกรณี)
  const logout = async () => {
    try {
      await fetch("http://localhost:8081/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
    localStorage.clear();
    navigate("/login");
  };

  // 🕒 ตรวจจับ inactivity (15 นาทีไม่ขยับ -> logout)
  const resetTimer = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      console.log("Session timeout");
      logout();
    }, SESSION_TIMEOUT);
  };

  useEffect(() => {
  const activityEvents = ["mousemove", "keydown", "click", "scroll", "touchstart"];
  activityEvents.forEach((event) => window.addEventListener(event, resetTimer));
  resetTimer();

    // logout เมื่อปิด tab/browser
  const handleUnload = () => {
    const url = "http://localhost:8081/api/logout";
    navigator.sendBeacon(url); // ส่ง logout request
  };
  window.addEventListener("beforeunload", handleUnload);

  return () => {
    activityEvents.forEach((event) => window.removeEventListener(event, resetTimer));
    window.removeEventListener("beforeunload", handleUnload);
    if (timer.current) clearTimeout(timer.current);
  };
}, []);

  return (
    <>
      <NavBar logoSrcPath={logoPath} />
      <div style={{ paddingTop: "80px" }}>
        <AppRoutes />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
