import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid/models/colDef";
import ConfirmDialog from "../../components/admin/ConfirmDialog";
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  Stack,
  Button,
} from "@mui/material";

import RoleFilter from "../../components/admin/RoleFilter";

interface User {
  userId: number;
  userCode: string;
  username: string;
  nameTh: string;
  nameEn: string;
  gender: string;
  tel: string;
  email: string;
  faculty: string;
  department: string;
  institute: string;
  role: string;
  approved: boolean;
  guestExpireAt?: string;
}

const ApprovedUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("All");
  const [search, setSearch] = useState("");

  const [confirm, setConfirm] = useState<{ open: boolean; id: number | null }>({
    open: false,
    id: null,
  });

  // ✅ ดึงข้อมูลผู้ใช้ที่ approved แล้วจาก backend
  const fetchApprovedUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get<User[]>(
        "http://localhost:8081/api/admin/approved-users",
        { withCredentials: true }
      );
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Error fetching approved users:", error);
    } finally {
      setLoading(false);
    }
  };

  // ลบผู้ใช้
  const deleteUser = async (id: number) => {
    if (!id) return;

    try {
      await axios.delete(`http://localhost:8081/api/admin/users/${id}`, {
        withCredentials: true,
      });
      fetchApprovedUsers(); // รีเฟรชตาราง
    } catch (err) {
      console.error("❌ Delete User Error:", err);
      alert("❌ ลบผู้ใช้ไม่สำเร็จ");
    } finally {
      setConfirm({ open: false, id: null });
    }
  };

  // เปลี่ยนรหัสผ่านผู้ใช้เป็น 1234
  const changePassword = async (id: number) => {
    if (!id) return;

    try {
      await axios.put(
        `http://localhost:8081/api/admin/users/${id}/password`,
        { newPassword: "1234" },
        { withCredentials: true }
      );

      alert("🔐 เปลี่ยนรหัสผ่านเป็น 1234 สำเร็จ");
    } catch (err) {
      console.error("❌ Change Password Error:", err);
      alert("❌ เปลี่ยนรหัสผ่านไม่สำเร็จ");
    }
  };

  // โหลดข้อมูลตอนเปิดหน้า
  useEffect(() => {
    fetchApprovedUsers();
  }, []);

  // ✅ Filter + Search
  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === "All" || u.role === filterRole;
    const matchSearch =
      (u.userCode?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      u.username.toLowerCase().includes(search.toLowerCase() ?? false) ||
      u.email.toLowerCase().includes(search.toLowerCase() ?? false) ||
      u.nameTh.toLowerCase().includes(search.toLowerCase() ?? false) ||
      u.nameEn.toLowerCase().includes(search.toLowerCase() ?? false);
    return matchRole && matchSearch;
  });

  // ✅ กำหนด column ของตาราง
  const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 80 },
    { field: "userCode", headerName: "รหัสนักศึกษา/อาจารย์", width: 180 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "nameTh", headerName: "ชื่อ (TH)", width: 150 },
    { field: "nameEn", headerName: "ชื่อ (EN)", width: 150 },
    { field: "gender", headerName: "เพศ", width: 100 },
    { field: "tel", headerName: "เบอร์โทร", width: 140 },
    { field: "email", headerName: "อีเมล", width: 200 },
    { field: "faculty", headerName: "คณะ", width: 150 },
    { field: "department", headerName: "ภาควิชา", width: 150 },
    { field: "institute", headerName: "สถาบัน", width: 150 },
    {
      field: "role",
      headerName: "บทบาท",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "Admin"
              ? "secondary"
              : params.value === "Guest"
              ? "info"
              : "primary"
          }
        />
      ),
    },
    { field: "guestExpireAt", headerName: "Guest Expire", width: 180 },
    {
      field: "approved",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Approved" : "Pending"}
          color={params.value ? "success" : "warning"}
        />
      ),
    },

    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* ปุ่มเปลี่ยนรหัสผ่าน */}
          {params.row.role !== "Admin" && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              sx={{ minWidth: 120 }}
              onClick={() => {
                changePassword(params.row.userId);
              }}
            >
              เปลี่ยนรหัสผ่าน
            </Button>
          )}

          {/* ปุ่มลบ */}
          {params.row.role !== "Admin" && (
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{ minWidth: 100 }}
              onClick={() => setConfirm({ open: true, id: params.row.userId })}
            >
              ลบ
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box className="p-6">
      <Typography variant="h5" fontWeight="bold" mb={2}>
        ✅ Approved Users
      </Typography>

      {/* 🔍 ใช้ RoleFilter เดิม */}
      <RoleFilter
        filterRole={filterRole}
        setFilterRole={setFilterRole}
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <Box className="flex justify-center mt-6">
          <CircularProgress />
        </Box>
      ) : (
        <div style={{ height: 550, width: "100%", marginTop: "1rem" }}>
          <DataGrid
            rows={filteredUsers}
            columns={columns}
            getRowId={(row) => row.userId}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
            }}
          />
        </div>
      )}
      {/* ✅ ConfirmDialog สำหรับลบผู้ใช้ */}
      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, id: null })}
        onConfirm={() => deleteUser(confirm.id!)}
        action="delete"
      />
    </Box>
  );
};

export default ApprovedUsers;
