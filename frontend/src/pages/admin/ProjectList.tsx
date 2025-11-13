import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Button, Chip, CircularProgress, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Project {
  projectID: number;
  titleTh: string;
  titleEn: string;
  advisor: string;
  coAdvisor: string;
  category: string;
  createDate: string;
  uploadFile: string | null;
  uploadCode: string | null;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8081/api/admin/projects", {
        withCredentials: true,
      });
      setProjects(response.data);
    } catch (err) {
      console.error("Fetch Projects Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("คุณต้องการลบโครงงานนี้หรือไม่?")) return;
    try {
      await axios.delete(`http://localhost:8081/api/admin/projects/${id}`, {
        withCredentials: true,
      });
      alert("ลบโครงงานเรียบร้อยแล้ว");
      fetchProjects();
    } catch (err) {
      console.error("Delete Project Error:", err);
      alert("เกิดข้อผิดพลาดในการลบโครงงาน");
    }
  };

  const filteredProjects = projects.filter((p) => {
    const query = search.trim().toLowerCase();
    return (
      p.titleTh.toLowerCase().includes(query) ||
      p.titleEn.toLowerCase().includes(query) ||
      (p.category && p.category.toLowerCase().includes(query))
    );
  });

  const columns = [
    { field: "projectID", headerName: "ID", width: 70 },
    { field: "titleTh", headerName: "ชื่อโครงงาน (TH)", flex: 1 },
    { field: "titleEn", headerName: "ชื่อโครงงาน (EN)", flex: 1 },
    { field: "advisor", headerName: "อาจารย์ที่ปรึกษา", width: 200 },
    { field: "coAdvisor", headerName: "ผู้ช่วยที่ปรึกษา", width: 200 },
    { field: "category", headerName: "ปี", width: 150 },
    {
      field: "createDate",
      headerName: "วันที่สร้าง",
      width: 180,
      renderCell: (params: any) =>
        params.value ? new Date(params.value).toLocaleString("th-TH", { hour12: false }) : "—",
    },
    {
      field: "uploadFile",
      headerName: "ไฟล์ PDF",
      width: 150,
      renderCell: (params: any) =>
        params.value ? (
          <Button
            variant="outlined"
            size="small"
            href={`http://localhost:8081/upload/${params.value}`}
            target="_blank"
            title={params.value}
          >
            เปิดไฟล์
          </Button>
        ) : (
          <Chip label="ไม่มีไฟล์" size="small" />
        ),
    },
    {
      field: "uploadCode",
      headerName: "ไฟล์ Code/Zip",
      width: 150,
      renderCell: (params: any) =>
        params.value ? (
          <Button
            variant="outlined"
            size="small"
            href={`http://localhost:8081/upload/${params.value}`}
            target="_blank"
            title={params.value}
          >
            เปิดไฟล์
          </Button>
        ) : (
          <Chip label="ไม่มีไฟล์" size="small" />
        ),
    },
    {
      field: "actions",
      headerName: "การจัดการ",
      width: 200,
      sortable: false,
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={() => navigate(`/admin/edit-project/${params.row.projectID}`)}
          >
            แก้ไข
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.projectID)}
          >
            ลบ
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          รายการโครงงานทั้งหมด
        </Typography>

        <Button
        variant="contained"
        onClick={() => navigate("/admin/add-project")}
        sx={{
        borderRadius: "20px",
        backgroundColor: "#FD7521",
        color: "#FFFFFF",
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: "1rem",
        padding: "10px 25px",
        border: "none",
        boxShadow: "0px 4px 10px rgba(253, 117, 33, 0.3)",
        textTransform: "none",
        "&:hover": {
        backgroundColor: "#e96515", // สีตอน hover
        boxShadow: "0px 6px 12px rgba(253, 117, 33, 0.4)",
            },
        }}
        >
        ➕ เพิ่มโครงงานใหม่
        </Button>

      </Box>

      <Box mb={2}>
        <input
          type="text"
          placeholder="ค้นหาชื่อโครงงาน / หมวดหมู่..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box style={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={filteredProjects}
            columns={columns}
            getRowId={(row) => row.projectID}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProjectList;
