// FooterKeywords.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const FooterKeywords: React.FC = () => {
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    const fetchKeywords = async () => {
      try {
        const cached = localStorage.getItem("footerKeywords");
        const expire = localStorage.getItem("footerKeywordsExpire");

        // ใช้ cache ถ้ายังไม่หมดอายุ
        if (cached && expire && new Date().getTime() < parseInt(expire)) {
          setKeywords(JSON.parse(cached));
          return;
        }

        const res = await axios.get<string[]>(
          "http://localhost:8081/api/projects/keywords/popular",
          { withCredentials: true }
        );

        setKeywords(res.data);

        // เก็บ cache 1 เดือน
        const expireTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem("footerKeywords", JSON.stringify(res.data));
        localStorage.setItem("footerKeywordsExpire", expireTime.toString());
      } catch (err) {
        console.error("ไม่สามารถโหลด keywords:", err);
      }
    };

    fetchKeywords();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f8f8f8",
        padding: "20px",
        display: "flex",
        gap: "15px",
        flexWrap: "wrap",
      }}
    >
      {keywords.map((kw, idx) => (
        <span
          key={idx}
          style={{
            backgroundColor: "#ffd54f",
            padding: "5px 10px",
            borderRadius: "15px",
            cursor: "pointer",
          }}
        >
          {kw}
        </span>
      ))}
    </div>
  );
};

export default FooterKeywords;
