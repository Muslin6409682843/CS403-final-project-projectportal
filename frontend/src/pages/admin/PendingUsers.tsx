import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid/models/colDef";

import {
  Button,
  Box,
  Typography,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";

import RoleFilter from "../../components/admin/RoleFilter";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

interface User {
  userId: number;
  userCode: string;
  username: string;
  nameTh: string;
  nameEn: string;
  gender: string;
  email: string;
  role: string;
  tel: string;
  faculty: string;
  department: string;
  institute: string;
  approved: boolean;
  approvalExpireAt: string;
}

const PendingUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("All");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<{
    open: boolean;
    action: "approve" | "reject" | null;
    id: number | null;
  }>({ open: false, action: null, id: null });

  // ✅ ดึงข้อมูลผู้ใช้ที่ pending จาก backend จริง
  const fetchPendingUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8081/api/admin/pending-users",
        { withCredentials: true }
      );
      console.log("📦 Pending Users Response:", response.data); 
      setUsers(response.data);
    } catch (err) {
      console.error("❌ Fetch Pending Users Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ อนุมัติผู้ใช้
  const approveUser = async (id: number) => {
    try {
      await axios.put(
        `http://localhost:8081/api/admin/approve/${id}`,
        {},
        { withCredentials: true }
      );
      alert("✅ Approve สำเร็จ");
      fetchPendingUsers(); 
    } catch (err) {
      console.error("❌ Approve Error:", err);
    }
  };

  // ✅ ปฏิเสธ (ลบ)
  const rejectUser = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8081/api/admin/reject/${id}`, {
        withCredentials: true,
      });
      fetchPendingUsers(); 
    } catch (err) {
      console.error("❌ Reject Error:", err);
    }
  };

  const handleAction = async () => {
    if (!confirm.id || !confirm.action) return;
    if (confirm.action === "approve") {
      await approveUser(confirm.id);
    } else if (confirm.action === "reject") {
      await rejectUser(confirm.id);
    }
    setConfirm({ open: false, action: null, id: null });
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const matchRole = filterRole === "All" || u.role === filterRole;
    const matchSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const columns: GridColDef[] = [
    { field: "userId", headerName: "ID", width: 70 },
    { field: "userCode", headerName: "รหัสนักศึกษา/อาจารย์", width: 180 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "nameTh", headerName: "ชื่อ (TH)", flex: 1 },
    { field: "nameEn", headerName: "ชื่อ (EN)", flex: 1 },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "tel", headerName: "Tel", width: 120 },
    { field: "faculty", headerName: "Faculty", flex: 1 },
    { field: "department", headerName: "Department", flex: 1 },
    { field: "institute", headerName: "Institute", flex: 1 },
    {
      field: "role",
      headerName: "Role",
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
    { field: "approvalExpireAt", headerName: "Approval Expire", width: 180 },

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
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() =>
              setConfirm({
                open: true,
                action: "approve",
                id: params.row.userId,
              })
            }
          >
            อนุมัติ
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() =>
              setConfirm({
                open: true,
                action: "reject",
                id: params.row.userId,
              })
            }
          >
            ปฎิเสธ
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className="p-6">
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Admin Panel – Pending Users
      </Typography>

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
          <DataGrid<User>
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

      <ConfirmDialog
        open={confirm.open}
        onClose={() => setConfirm({ open: false, action: null, id: null })}
        onConfirm={handleAction}
        action={confirm.action}
      />
    </Box>
  );
};

export default PendingUsers;
