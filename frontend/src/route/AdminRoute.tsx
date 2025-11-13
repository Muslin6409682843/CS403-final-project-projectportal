// AdminRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "Admin" ? <>{children}</> : <Navigate to="/" />;
};

export default AdminRoute;
