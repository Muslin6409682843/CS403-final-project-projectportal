import React from "react";
import { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement,ArcElement, Title, Tooltip, Legend);


interface Project {
  year: number;
  category: string;
  keywordTh: string;
}
function Overview() {

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("http://localhost:8081/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((err) => console.error(err));
  }, []);

  /*
  const [keywords, setKeywords] = useState<string[]>([]);

useEffect(() => {
  fetch("http://localhost:8081/api/keywords/popular")
    .then((res) => res.json())
    .then((data) => setKeywords(data))
    .catch((err) => console.error(err));
}, []);*/


  // Yearly 
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

  
  // Category Distribution
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

  // Top Keywords (Bar chart)
  const keywordCount: { [key: string]: number } = {};

  projects.forEach((p) => {
    if (p.keywordTh) {
      p.keywordTh.split(",").forEach((kw) => {
        const key = kw.trim();
        if (key) {
          keywordCount[key] = (keywordCount[key] || 0) + 1;
        }
      });
    }
  });

  const topKeywords = Object.entries(keywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5
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
    </div>
  );
}

export default Overview;
