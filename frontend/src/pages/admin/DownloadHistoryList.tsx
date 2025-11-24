import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress } from "@mui/material";

interface DownloadHistory {
  userId: number;
  projectId: number;
  username?: string;
  downloadDateTime: string;
  projectTitleTh?: string;
  projectTitleEn?: string;
  count?: number; // จำนวนครั้งดาวน์โหลด
}

const DownloadHistoryList: React.FC = () => {
  const [history, setHistory] = useState<DownloadHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/api/admin/download-history", {
        withCredentials: true,
      });

      // map ข้อมูลพื้นฐาน
      const data: DownloadHistory[] = res.data.map((h: any) => ({
        userId: h.user?.userId,
        username: h.user?.username,
        projectId: h.project?.projectID,
        projectTitleTh: h.project?.titleTh,
        projectTitleEn: h.project?.titleEn,
        downloadDateTime: h.downloadDateTime,
      }));

      // นับจำนวนครั้งดาวน์โหลด
      const countMap = new Map<string, number>();
      data.forEach((h) => {
        const key = `${h.userId}-${h.projectId}`;
        countMap.set(key, (countMap.get(key) || 0) + 1);
      });

      // เพิ่ม count ลงในแต่ละ row
      const dataWithCount = data.map((h) => ({
        ...h,
        count: countMap.get(`${h.userId}-${h.projectId}`) || 0,
      }));

      setHistory(dataWithCount);
    } catch (err) {
      console.error("Fetch Download History Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((h) => {
    const query = search.trim().toLowerCase();
    return (
      h.projectTitleTh?.toLowerCase().includes(query) ||
      h.projectTitleEn?.toLowerCase().includes(query)
    );
  });

  const columns = [
    { field: "userId", headerName: "User ID", width: 100 },
    { field: "projectId", headerName: "Project ID", width: 100 },
    { field: "username", headerName: "ชื่อผู้ใช้", width: 150 },
    { field: "projectTitleTh", headerName: "ชื่อโครงงาน (TH)", width: 300 },
    { field: "projectTitleEn", headerName: "ชื่อโครงงาน (EN)", width: 300 },
    {
      field: "downloadDateTime",
      headerName: "วันที่ดาวน์โหลด",
      width: 180,
      renderCell: (params: any) =>
        params.value
          ? new Date(params.value).toLocaleString("th-TH", { hour12: false })
          : "—",
    },
    {
      field: "count",
      headerName: "จำนวนครั้งดาวน์โหลด",
      width: 180,
    },
  ];

  return (
    <Box p={4}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        ประวัติการดาวน์โหลด
      </Typography>

      <Box mb={2}>
        <input
          type="text"
          placeholder="ค้นหาโครงงาน..."
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
            rows={filteredHistory}
            columns={columns}
            getRowId={(row) =>
              `${row.userId}-${row.projectId}-${new Date(row.downloadDateTime).getTime()}`
            }
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default DownloadHistoryList;
