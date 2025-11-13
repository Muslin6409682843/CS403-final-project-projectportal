import { Routes, Route } from "react-router-dom";
import Browse from "../pages/Browse";
import Favorite from "../pages/Favorite";
import ChangePassword from "../pages/ChangePassword";
import History from "../pages/History";
import MyProjects from "../pages/MyProjects";
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
import AdminRoute from "../route/AdminRoute";
import PendingApproval from "../pages/PendingApproval";
import ProtectedRoute from "../route/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<Browse />} />
      <Route
        path="/favorite"
        element={
          <ProtectedRoute>
            <Favorite />
          </ProtectedRoute>
        }
      />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/history" element={<History />} />
      <Route path="/my-projects" element={<MyProjects />} />
      <Route path="/add-project" element={<AddProject />} />
      <Route path="/edit-project/:id" element={<EditProject />} />
      <Route path="/tu-login" element={<TULogin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student" element={<Student />} />
      <Route path="/guest" element={<Guest />} />
      <Route path="/about" element={<AboutCSTU />} />
      <Route path="/guest-register" element={<GuestRegister />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      {/* Admin pages → ห่อด้วย AdminRoute */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/pending-users"
        element={
          <AdminRoute>
            <PendingUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/approved-users"
        element={
          <AdminRoute>
            <ApprovedUsers />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
