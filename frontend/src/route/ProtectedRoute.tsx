import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute ใช้ควบคุมสิทธิ์การเข้าหน้าเว็บ
 * @param allowedRoles: รายชื่อ role ที่อนุญาต เช่น ["Admin"] หรือ ["Student", "Guest"]
 * @param children: หน้าเว็บที่จะให้แสดงถ้ามีสิทธิ์
 */
interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { isLoggedIn, role } = useAuth();
  const location = useLocation();

  // ❌ ถ้ายังไม่ได้ล็อกอิน → ส่งไปหน้า /login พร้อมจำหน้าที่จะกลับมา
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ❌ ถ้ามี allowedRoles แล้ว role ปัจจุบันไม่อยู่ในนั้น → ส่งกลับหน้าแรก
  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/" replace />;
  }

  // ✅ ผ่านทุกเงื่อนไข → แสดงหน้าได้
  return children;
};

export default ProtectedRoute;
