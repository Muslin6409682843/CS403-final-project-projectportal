// src/route/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const role = localStorage.getItem("role");

  // อนุญาตเฉพาะ Student / Staff / Guest
  if (role === "Student" || role === "Staff" || role === "Guest") {
    return <>{children}</>;
  }

  // ไม่ใช่ 3 role นี้ → ส่งกลับหน้า login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
