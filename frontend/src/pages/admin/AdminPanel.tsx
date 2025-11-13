import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Stack } from "@mui/material";
import { createPortal } from "react-dom";
import { useAuth } from "../../context/AuthContext";

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logout();
    navigate("/login");
  };

  return (
    <>
      <Box className="p-6">
        <Typography variant="h5" fontWeight="bold" mb={2}>
          🧭 Admin Dashboard
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/pending-users")}
          >
            ดูรายการผู้สมัครที่รออนุมัติ
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate("/admin/approved-users")}
          >
            จัดการผู้ใช้งานทั้งหมด
          </Button>
          <Button variant="outlined" onClick={() => navigate("/admin/reports")}>
            ดูรายงานระบบ
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </Button>
        </Stack>
      </Box>

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
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "3rem 2rem",
                borderRadius: "16px",
                maxWidth: "400px",
                width: "90%",
                textAlign: "center",
              }}
            >
              <h2>คุณต้องการออกจากระบบใช่ไหม?</h2>
              <Button
                onClick={handleLogoutConfirm}
                variant="contained"
                color="error"
                sx={{ marginRight: "1rem" }}
              >
                ยืนยัน
              </Button>
              <Button
                onClick={() => setShowLogoutModal(false)}
                variant="outlined"
              >
                ยกเลิก
              </Button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default AdminPanel;
