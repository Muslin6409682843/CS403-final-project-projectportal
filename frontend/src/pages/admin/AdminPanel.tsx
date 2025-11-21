import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
} from "@mui/material";
import { People, VerifiedUser, MenuBook, Logout } from "@mui/icons-material";
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

  const cardData = [
    {
      title: "ผู้สมัครรออนุมัติ",
      description: "ดูรายการผู้สมัครที่ยังไม่ได้อนุมัติ",
      icon: <People sx={{ fontSize: 40, color: "#1976d2" }} />,
      onClick: () => navigate("/admin/pending-users"),
    },
    {
      title: "จัดการผู้ใช้งาน",
      description: "จัดการข้อมูลผู้ใช้งานทั้งหมด",
      icon: <VerifiedUser sx={{ fontSize: 40, color: "#2e7d32" }} />,
      onClick: () => navigate("/admin/approved-users"),
    },
    {
      title: "โครงงานนักศึกษา",
      description: "จัดการข้อมูลโครงงานทั้งหมด",
      icon: <MenuBook sx={{ fontSize: 40, color: "#f57c00" }} />,
      onClick: () => navigate("/admin/projects"),
    },
  ];

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="80vh"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Box maxWidth={1200} width="100%">
        {/* Header */}
        <Typography variant="h4" fontWeight="bold" mb={4} textAlign="center">
          🧭 Admin Dashboard
        </Typography>

        {/* Card Grid แบบ flex */}
        <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4}>
          {cardData.map((card) => (
            <Box key={card.title} width={{ xs: "100%", sm: "48%", md: "30%" }}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
                onClick={card.onClick}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {card.icon}
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {card.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {card.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Logout Button */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="contained"
            color="error"
            startIcon={<Logout />}
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </Button>
        </Box>

        {/* Logout Modal */}
        {showLogoutModal &&
          createPortal(
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                bgcolor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
              }}
            >
              <Box
                sx={{
                  bgcolor: "background.paper",
                  p: 4,
                  borderRadius: 2,
                  width: { xs: "90%", sm: 400 },
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" mb={3}>
                  คุณต้องการออกจากระบบใช่ไหม?
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    onClick={handleLogoutConfirm}
                    variant="contained"
                    color="error"
                  >
                    ยืนยัน
                  </Button>
                  <Button
                    onClick={() => setShowLogoutModal(false)}
                    variant="outlined"
                  >
                    ยกเลิก
                  </Button>
                </Stack>
              </Box>
            </Box>,
            document.body
          )}
      </Box>
    </Box>
  );
};

export default AdminPanel;
