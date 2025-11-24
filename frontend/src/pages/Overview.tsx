import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

interface Project {
  projectID: number;
  titleTh: string;
  year: number;
  category: string;
  keywordTh: string;
}

interface DownloadHistory {
  projectId: number;
  projectTitleTh?: string;
  project?: {
    projectID: number;
    titleTh: string;
  };
}


function Overview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [downloads, setDownloads] = useState<DownloadHistory[]>([]);

  useEffect(() => {
    // โหลดโปรเจกต์
    fetch("http://localhost:8081/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));

    // โหลด download history (public endpoint)
    fetch("http://localhost:8081/api/download-history", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setDownloads(data))
      .catch((err) => console.error(err));
  }, []);

  // --- จำนวนโปรเจกต์ต่อปี ---
  const years = [...new Set(projects.map((p) => p.year))];
  const projectsPerYear = years.map(
    (y) => projects.filter((p) => p.year === y).length
  );
  const yearData = {
    labels: years,
    datasets: [
      {
        label: "จำนวนโปรเจกต์",
        data: projectsPerYear,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // --- สัดส่วนโปรเจกต์ตามหมวดหมู่ ---
  const categories = [...new Set(projects.map((p) => p.category))];
  const projectsPerCategory = categories.map(
    (c) => projects.filter((p) => p.category === c).length
  );
  const categoryData = {
    labels: categories,
    datasets: [
      {
        label: "หมวดหมู่โปรเจกต์",
        data: projectsPerCategory,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8A2BE2"],
      },
    ],
  };

  // --- Top Keywords ---
  const keywordCount: { [key: string]: number } = {};
  projects.forEach((p) => {
    if (p.keywordTh) {
      p.keywordTh.split(",").forEach((kw) => {
        const key = kw.trim();
        if (key && key !== "-") {
          keywordCount[key] = (keywordCount[key] || 0) + 1;
        }
      });
    }
  });
  const topKeywords = Object.entries(keywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  const keywordData = {
    labels: topKeywords.map((k) => k[0]),
    datasets: [
      {
        label: "จำนวนโปรเจกต์",
        data: topKeywords.map((k) => k[1]),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
    ],
  };

  // --- Top 5 Downloaded Projects ---
  const topDownloadedData = React.useMemo(() => {
  if (projects.length === 0 || downloads.length === 0) return { labels: [], datasets: [] };

  const downloadCount: { [projectId: number]: { title: string; count: number } } = {};

  downloads.forEach((d) => {
    // projectId = undefined  d.project?.projectID มีค่า
    const id = d.projectId ?? d.project?.projectID;

    if (!id) return; // ข้ามถ้าไม่มี ID

    const project = projects.find((p) => p.projectID === id);

    if (!downloadCount[id]) {
      downloadCount[id] = {
        title: project?.titleTh || d.project?.titleTh || `ID ${id}`,
        count: 0,
      };
    }

    downloadCount[id].count += 1;
  });

  const topDownloaded = Object.entries(downloadCount)
    .map(([id, { title, count }]) => ({ id, title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    labels: topDownloaded.map((d) => `${d.title}`),
    datasets: [
      {
        label: "จำนวนครั้งดาวน์โหลด",
        data: topDownloaded.map((d) => d.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  };
}, [projects, downloads]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        gap: "2rem",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <h2>ภาพรวมโปรเจกต์</h2>

      <div style={{ width: "80%", maxWidth: "600px" }}>
        <h4>จำนวนโปรเจกต์ต่อปี</h4>
        <Bar data={yearData} />
      </div>

      <div style={{ width: "80%", maxWidth: "600px" }}>
        <h4>สัดส่วนโปรเจกต์ตามหมวดหมู่</h4>
        <Pie data={categoryData} />
      </div>

      <div style={{ width: "80%", maxWidth: "600px" }}>
        <h4>Top 5 Keywords</h4>
        <Bar data={keywordData} />
      </div>

      <div style={{ width: "80%", maxWidth: "600px" }}>
        <h4>Top 5 โครงงานที่ถูกดาวน์โหลดมากที่สุด</h4>
        <Bar data={topDownloadedData} />
      </div>
    </div>
  );
}

export default Overview;
