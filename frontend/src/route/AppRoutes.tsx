import { Routes, Route } from "react-router-dom";
import Browse from "../pages/Browse";
import Favorite from "../pages/Favorite";
import ChangePassword from "../pages/ChangePassword";
import History from "../pages/History";
import Project from "../pages/Project";
import AddProject from "../pages/AddProject";
import EditProject from "../pages/EditProject";
import Home from "../pages/Home";
import TULogin from "../pages/TULogin";
import Login from "../pages/Login";
import Student from "../pages/Student";
import Guest from "../pages/Guest";
import AboutCSTU from "../pages/AboutCSTU";
import GuestRegister from "../pages/GuestRegister";
import AdminPanel from "../pages/admin/AdminPanel";
import PendingUsers from "../pages/admin/PendingUsers";
import ApprovedUsers from "../pages/admin/ApprovedUsers";
import PendingApproval from "../pages/PendingApproval";
import ProtectedRoute from "../route/ProtectedRoute";
import ProjectList from "../pages/admin/ProjectList";
import ForgotPassword from "../pages/ForgotPassword";
import Overview from "../pages/Overview";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route
        path="/favorite"
        element={
          <ProtectedRoute allowedRoles={["Student", "Staff", "Guest"]}>
            <Favorite />
          </ProtectedRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute allowedRoles={["Student", "Staff", "Guest"]}>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/history" element={<History />} />
      <Route path="/project/:id" element={<Project />} />
      <Route path="/add-project" element={<AddProject />} />
      <Route path="/edit-project/:id" element={<EditProject />} />
      <Route path="/tu-login" element={<TULogin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<Student />} />
      <Route path="/guest" element={<Guest />} />
      <Route path="/about" element={<AboutCSTU />} />
      <Route path="/guest-register" element={<GuestRegister />} />
      <Route path="/pending-approval" element={<PendingApproval />} />
      <Route path="/overview" element={<Overview />} />

      {/* 🔹 Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/pending-users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <PendingUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/approved-users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ApprovedUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <ProjectList />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/add-project" element={<AddProject />} />
      <Route path="/admin/edit-project/:id" element={<EditProject />} />
    </Routes>
  );
}

export default AppRoutes;
