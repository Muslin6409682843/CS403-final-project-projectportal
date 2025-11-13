import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Stack } from "@mui/material";

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box className="p-6">
      <Typography variant="h5" fontWeight="bold" mb={2}>
        🧭 Admin Dashboard
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/admin/pending-users")}
        >
          ดูรายการผู้สมัครที่รออนุมัติ
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/admin/approved-users")}
        >
          จัดการผู้ใช้งานทั้งหมด
        </Button>

        <Button
          variant="outlined"
          color="info"
          onClick={() => navigate("/admin/reports")}
        >
          ดูรายงานระบบ
        </Button>
      </Stack>
    </Box>
  );
};

export default AdminPanel;
