import React, { useState, useEffect } from "react";

export interface ProjectData {
  title: string;
  projectNameTH: string;
  projectNameEN: string;
  members: string[];
  advisor: string;
  coAdvisors?: string[];
  year: string;
  category?: string;
  abstractTh: string;
  abstractEn?: string;
  keywordsTH?: string;
  keywordsEN?: string;

  // fallback ชื่อจาก backend
  keywordTh?: string;
  keywordsEn?: string;

  github?: string;

  titleFile?: File | null;
  slideFileObj?: File | null;
  zipFileObj?: File | null;

  oldTitleFile?: string;
  oldSlideFile?: string;
  oldZipFile?: string;

  codeUploadType?: "github" | "zip" | "";
}

interface ProjectFormProps {
  initialData?: ProjectData;
  onSubmit: (data: ProjectData) => void;
  onDelete?: () => void;
  onChangeDirty?: () => void;
}

const EditProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSubmit,
  onDelete,
  onChangeDirty,
}) => {
  const [form, setForm] = useState<ProjectData>({
    title: initialData?.title || "",
    projectNameTH: initialData?.projectNameTH || "",
    projectNameEN: initialData?.projectNameEN || "",
    members: initialData?.members || [""],
    advisor: initialData?.advisor || "",
    coAdvisors: initialData?.coAdvisors || [],
    year: initialData?.year || "",
    category: initialData?.category || "",
    abstractTh: initialData?.abstractTh || "",
    abstractEn: initialData?.abstractEn || "",
    keywordsTH: initialData?.keywordsTH || "",
    keywordsEN: initialData?.keywordsEN || "",
    github: initialData?.github || "",
    titleFile: initialData?.titleFile || null,
    slideFileObj: initialData?.slideFileObj || null,
    zipFileObj: initialData?.zipFileObj || null,
    oldTitleFile: initialData?.oldTitleFile || "",
    oldSlideFile: initialData?.oldSlideFile || "",
    oldZipFile: initialData?.oldZipFile || "",
  });

  const [titleFile, setTitleFile] = useState<File | null>(
    form.titleFile || null
  );
  const [slideFileObj, setSlideFileObj] = useState<File | null>(
    form.slideFileObj || null
  );
  const [zipFileObj, setZipFileObj] = useState<File | null>(
    form.zipFileObj || null
  );

  const [advisorPosition, setAdvisorPosition] = useState(
    initialData?.advisor ? initialData.advisor.split(" ")[0] : ""
  );
  const [advisorName, setAdvisorName] = useState(
    initialData?.advisor
      ? initialData.advisor.split(" ").slice(1).join(" ")
      : ""
  );
  const [customAdvisorPosition, setCustomAdvisorPosition] = useState("");

  const [coAdvisors, setCoAdvisors] = useState(
    initialData?.coAdvisors
      ? initialData.coAdvisors.map((c) => {
          const [pos, ...nameParts] = c.split(" ");
          return {
            position: pos,
            customPosition: "",
            name: nameParts.join(" "),
          };
        })
      : [{ position: "", customPosition: "", name: "" }]
  );

  const [keywordsTH, setKeywordsTH] = useState(
    initialData?.keywordsTH ?? initialData?.keywordTh ?? ""
  );
  const [keywordsEN, setKeywordsEN] = useState(
    initialData?.keywordsEN ?? initialData?.keywordsEn ?? ""
  );

  const [codeUploadType, setCodeUploadType] = useState<"github" | "zip" | "">(
    ""
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSubmitAlertModal, setShowSubmitAlertModal] = useState(false);

  const positions = [
    "",
    "อ.",
    "ดร.",
    "ผศ.ดร.",
    "รศ.ดร.",
    "ศ.ดร.",
    "อื่นๆ (ระบุ)",
  ];

  const categoryOptions = [
    "Software",
    "Hardware",
    "AI/ML",
    "Research",
    "อื่นๆ (ระบุ)",
  ];
  const [category, setCategory] = useState(initialData?.category || "");
  const [customCategory, setCustomCategory] = useState("");

  const currentYear = new Date().getFullYear();
  const thaiYears: number[] = [];
  for (let y = currentYear + 543; y >= 2543; y--) thaiYears.push(y);

  // ---------- Set initial code upload type ----------
  useEffect(() => {
    if (initialData) {
      if (initialData.github && initialData.github.trim() !== "") {
        setCodeUploadType("github");
      } else if (initialData.zipFileObj || initialData.oldZipFile) {
        setCodeUploadType("zip");
      } else {
        setCodeUploadType(""); // ไม่เลือกอะไร
      }
    }
  }, [initialData]);

  // ---------- Validation ----------
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title && !form.oldTitleFile)
      newErrors.title = "กรุณาอัปโหลดไฟล์ PDF ของโครงงาน";
    if (!form.projectNameTH)
      newErrors.projectNameTH = "กรุณากรอกชื่อโครงงาน (ภาษาไทย)";
    if (!form.projectNameEN)
      newErrors.projectNameEN = "กรุณากรอกชื่อโครงงาน (ภาษาอังกฤษ)";

    const memberErrors = form.members.filter((m) => !m.trim());
    if (memberErrors.length === form.members.length)
      newErrors.members = "กรุณากรอกชื่อผู้จัดทำอย่างน้อย 1 คน";

    if (
      !advisorPosition &&
      !advisorName.trim() &&
      !customAdvisorPosition.trim()
    )
      newErrors.advisor = "กรุณากรอกตำแหน่งและชื่ออาจารย์";
    else if (!advisorPosition) newErrors.advisor = "กรุณาเลือกตำแหน่งอาจารย์";
    else if (
      advisorPosition === "อื่นๆ (ระบุ)" &&
      !customAdvisorPosition.trim()
    )
      newErrors.advisor = "กรุณากรอกตำแหน่งอาจารย์";
    else if (!advisorName.trim()) newErrors.advisor = "กรุณากรอกชื่ออาจารย์";

    coAdvisors.forEach((c, idx) => {
      if (c.position === "" && c.name.trim() === "") return;
      if (c.position === "")
        newErrors[`coAdvisor-${idx}`] = "กรุณาเลือกตำแหน่งอาจารย์ที่ปรึกษาร่วม";
      else if (c.position === "อื่นๆ (ระบุ)" && !c.customPosition.trim())
        newErrors[`coAdvisor-${idx}`] = "กรุณากรอกตำแหน่งอาจารย์ที่ปรึกษาร่วม";
      else if (!c.name.trim())
        newErrors[`coAdvisor-${idx}`] = "กรุณากรอกชื่ออาจารย์ที่ปรึกษาร่วม";
    });

    if (!form.year) newErrors.year = "กรุณาเลือกปีการศึกษา";
    if (!form.category?.trim()) newErrors.category = "กรุณาเลือกหมวดหมู่";
    if (!form.abstractTh.trim()) newErrors.abstractTh = "กรุณากรอกบทคัดย่อ";
    if (!keywordsTH.trim()) newErrors.keywordsTH = "กรุณากรอกคำสำคัญ";

    setErrors(newErrors);
  }, [
    form,
    advisorPosition,
    advisorName,
    customAdvisorPosition,
    coAdvisors,
    keywordsTH,
    category,
    customCategory,
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index?: number
  ) => {
    const { name, value } = e.target;
    if (name === "members" && index !== undefined) {
      const newMembers = [...form.members];
      newMembers[index] = value;
      setForm({ ...form, members: newMembers });
    } else {
      setForm({ ...form, [name]: value });
    }
    onChangeDirty?.();
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "project" | "slide" | "zip"
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      if (type === "project") {
        setForm({ ...form, title: "" });
        setTitleFile(null);
      }
      if (type === "slide") {
        setForm({ ...form, slideFileObj: null });
        setSlideFileObj(null);
      }
      if (type === "zip") {
        setForm({ ...form, zipFileObj: null });
        setZipFileObj(null);
      }
      return;
    }

    if (
      (type === "project" || type === "slide") &&
      file.type !== "application/pdf"
    ) {
      alert("กรุณาเลือกไฟล์ PDF เท่านั้น");
      return;
    }

    if (type === "project") {
      setForm({ ...form, title: file.name, oldTitleFile: "" });
      setTitleFile(file);
    } else if (type === "slide") {
      setForm({ ...form, slideFileObj: file, oldSlideFile: "" });
      setSlideFileObj(file);
    } else if (type === "zip") {
      setForm({ ...form, zipFileObj: file, oldZipFile: "" });
      setZipFileObj(file);
    }

    onChangeDirty?.();
  };

  const handleAddMember = () => {
    if (form.members.length < 2)
      setForm({ ...form, members: [...form.members, ""] });
  };

  const handleAddCoAdvisor = () => {
    if (coAdvisors.length < 5)
      setCoAdvisors([
        ...coAdvisors,
        { position: "", customPosition: "", name: "" },
      ]);
  };

  const handleCoAdvisorChange = (
    idx: number,
    field: "position" | "name" | "customPosition",
    value: string
  ) => {
    const newCoAdvisors = [...coAdvisors];
    newCoAdvisors[idx][field] = value;
    setCoAdvisors(newCoAdvisors);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      const advisorFull =
        advisorPosition === "อื่นๆ (ระบุ)"
          ? customAdvisorPosition + " " + advisorName.trim()
          : advisorPosition + " " + advisorName.trim();
      const coAdvisorFull = coAdvisors
        .filter((c) => c.name.trim() !== "")
        .map((c) =>
          c.position === "อื่นๆ (ระบุ)"
            ? c.customPosition + " " + c.name.trim()
            : c.position + " " + c.name.trim()
        );
      const finalCategory =
        category === "อื่นๆ (ระบุ)" ? customCategory.trim() : category;
      const filteredMembers = form.members.filter((m) => m.trim() !== "");

      onSubmit({
        ...form,
        members: filteredMembers,
        advisor: advisorFull,
        coAdvisors: coAdvisorFull,
        keywordsTH: keywordsTH.trim(),
        keywordsEN: keywordsEN.trim(),
        titleFile,
        slideFileObj,
        zipFileObj,
        github: form.github?.trim() || "",
        category: finalCategory,
        codeUploadType,
      });
    } else {
      setShowSubmitAlertModal(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        maxWidth: "500px",
      }}
    >
      {/* Upload Project PDF */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        อัปโหลดไฟล์โครงงาน (PDF)
      </label>

      {form.oldTitleFile && !titleFile && (
        <p style={{ fontSize: "1rem" }}>
          ไฟล์เดิม:{" "}
          <a
            href={`http://localhost:8081/upload/${form.oldTitleFile}`}
            target="_blank"
            rel="noreferrer"
          >
            {form.oldTitleFile}
          </a>
        </p>
      )}

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileUpload(e, "project")}
        style={{ padding: "0.5rem 0", fontSize: "1rem" }}
      />
      {titleFile && (
        <p style={{ fontSize: "1rem" }}>ไฟล์ที่เลือก: {titleFile.name}</p>
      )}

      {/* Project Names */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        ชื่อโครงงาน (ภาษาไทย)
      </label>
      <input
        type="text"
        name="projectNameTH"
        value={form.projectNameTH}
        onChange={handleChange}
        style={{ fontSize: "1rem", padding: "0.4rem" }}
      />
      {errors.projectNameTH && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>
          {errors.projectNameTH}
        </span>
      )}

      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        ชื่อโครงงาน (ภาษาอังกฤษ)
      </label>
      <input
        type="text"
        name="projectNameEN"
        value={form.projectNameEN}
        onChange={handleChange}
        style={{ fontSize: "1rem", padding: "0.4rem" }}
      />
      {errors.projectNameEN && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>
          {errors.projectNameEN}
        </span>
      )}

      {/* Members */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>ผู้จัดทำ</label>
      {form.members.map((member, idx) => (
        <input
          key={idx}
          type="text"
          name="members"
          value={member}
          onChange={(e) => handleChange(e, idx)}
          style={{
            fontSize: "1rem",
            padding: "0.4rem",
            marginBottom: "0.25rem",
          }}
        />
      ))}
      {form.members.length < 2 && (
        <button
          type="button"
          onClick={handleAddMember}
          style={{
            padding: "6px 12px",
            backgroundColor: "#FD7521",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          + เพิ่มผู้จัดทำ
        </button>
      )}
      {errors.members && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>
          {errors.members}
        </span>
      )}

      {/* Advisor */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        อาจารย์ที่ปรึกษา
      </label>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
        {advisorPosition === "อื่นๆ (ระบุ)" ? (
          <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
            <input
              type="text"
              placeholder="กรอกตำแหน่งอาจารย์"
              value={customAdvisorPosition}
              onChange={(e) => setCustomAdvisorPosition(e.target.value)}
              style={{ fontSize: "1rem", padding: "0.4rem", flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setAdvisorPosition("")} // กลับไป dropdown
              style={{
                fontSize: "0.9rem",
                padding: "0.4rem 0.8rem",
                backgroundColor: "#eee",
                border: "1px solid #ccc",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              🔁 เลือกจากรายการ
            </button>
          </div>
        ) : (
          <select
            value={advisorPosition}
            onChange={(e) => {
              const value = e.target.value;
              setAdvisorPosition(value);
              if (value !== "อื่นๆ (ระบุ)") setCustomAdvisorPosition("");
            }}
            style={{ fontSize: "1rem", padding: "0.4rem", flex: 1 }}
          >
            {positions.map((pos, i) => (
              <option key={i} value={pos}>
                {pos || "-- เลือกตำแหน่งอาจารย์ --"}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          value={advisorName}
          onChange={(e) => setAdvisorName(e.target.value)}
          placeholder="ชื่ออาจารย์"
          style={{ fontSize: "1rem", padding: "0.4rem", flex: 2 }}
        />
      </div>
      {errors.advisor && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>
          {errors.advisor}
        </span>
      )}

      {/* Co-Advisors */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        อาจารย์ที่ปรึกษาร่วม (ไม่บังคับ)
      </label>
      {coAdvisors.map((co, idx) => (
        <div
          key={idx}
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "0.25rem",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {co.position === "อื่นๆ (ระบุ)" ? (
              <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
                <input
                  type="text"
                  placeholder="กรอกตำแหน่งอาจารย์"
                  value={co.customPosition}
                  onChange={(e) =>
                    handleCoAdvisorChange(idx, "customPosition", e.target.value)
                  }
                  style={{ fontSize: "1rem", padding: "0.4rem", flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleCoAdvisorChange(idx, "position", "")}
                  style={{
                    fontSize: "0.9rem",
                    padding: "0.4rem 0.8rem",
                    backgroundColor: "#eee",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  🔁 เลือกจากรายการ
                </button>
              </div>
            ) : (
              <select
                value={co.position}
                onChange={(e) => {
                  const value = e.target.value;
                  handleCoAdvisorChange(idx, "position", value);
                  if (value !== "อื่นๆ (ระบุ)") {
                    handleCoAdvisorChange(idx, "customPosition", "");
                  }
                }}
                style={{ fontSize: "1rem", padding: "0.4rem", flex: 1 }}
              >
                {positions.map((pos, i) => (
                  <option key={i} value={pos}>
                    {pos || "-- เลือกตำแหน่งอาจารย์ --"}
                  </option>
                ))}
              </select>
            )}

            <input
              type="text"
              value={co.name}
              onChange={(e) =>
                handleCoAdvisorChange(idx, "name", e.target.value)
              }
              placeholder="ชื่ออาจารย์ที่ปรึกษาร่วม"
              style={{ fontSize: "1rem", padding: "0.4rem", flex: 2 }}
            />
          </div>

          {/* ใส่ Error Message ตรงนี้ */}
          {errors[`coAdvisor-${idx}`] && (
            <span style={{ color: "red", fontSize: "0.95rem" }}>
              {errors[`coAdvisor-${idx}`]}
            </span>
          )}
        </div>
      ))}

      {coAdvisors.length < 5 && (
        <button
          type="button"
          onClick={handleAddCoAdvisor}
          style={{
            padding: "6px 12px",
            backgroundColor: "#FD7521",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: 600,
            cursor: "pointer",
            alignSelf: "flex-start",
          }}
        >
          + เพิ่มอาจารย์ที่ปรึกษาร่วม
        </button>
      )}

      {/* Year */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>ปีการศึกษา</label>
      <select
        name="year"
        value={form.year}
        onChange={handleChange}
        style={{ fontSize: "1rem", padding: "0.4rem" }}
      >
        <option value="">-- เลือกปี --</option>
        {thaiYears.map((year) => (
          <option key={year} value={year.toString()}>
            {year}
          </option>
        ))}
      </select>
      {errors.year && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>{errors.year}</span>
      )}

      {/* Category */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>หมวดหมู่</label>
      {category === "อื่นๆ (ระบุ)" ? (
        <div style={{ display: "flex", gap: "0.5rem", flex: 1 }}>
          <input
            type="text"
            placeholder="กรอกหมวดหมู่"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            style={{ fontSize: "1rem", padding: "0.4rem", flex: 1 }}
          />
          <button
            type="button"
            onClick={() => setCategory("")} // กลับไป dropdown
            style={{
              fontSize: "0.9rem",
              padding: "0.4rem 0.8rem",
              backgroundColor: "#eee",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            🔁 เลือกจากรายการ
          </button>
        </div>
      ) : (
        <select
          value={category}
          onChange={(e) => {
            const value = e.target.value;
            setCategory(value);
            if (value !== "อื่นๆ (ระบุ)") setCustomCategory("");
          }}
          style={{ fontSize: "1rem", padding: "0.4rem", flex: 1 }}
        >
          <option value="">-- เลือกหมวดหมู่ --</option>
          {categoryOptions.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      )}
      {errors.category && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>
          {errors.category}
        </span>
      )}

      {/* Abstract (TH) */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>บทคัดย่อ</label>
      <textarea
        name="abstractTh"
        value={form.abstractTh}
        onChange={handleChange}
        rows={8}
        style={{ fontSize: "1rem", padding: "0.6rem", lineHeight: 1.5 }}
      />
      {errors.abstractTh && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>
          {errors.abstractTh}
        </span>
      )}

      {/* Keywords TH */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>คำสำคัญ</label>
      <input
        type="text"
        value={keywordsTH}
        onChange={(e) => setKeywordsTH(e.target.value)}
        placeholder="เช่น AI, Machine Learning, Computer Vision"
        style={{ fontSize: "1rem", padding: "0.4rem" }}
      />
      {errors.keywordsTH && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>
          {errors.keywordsTH}
        </span>
      )}

      {/* Abstract (EN) */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        บทคัดย่อ - ภาษาอังกฤษ (ไม่บังคับ)
      </label>
      <textarea
        name="abstractEn"
        value={form.abstractEn}
        onChange={handleChange}
        rows={8}
        style={{ fontSize: "1rem", padding: "0.6rem", lineHeight: 1.5 }}
      />

      {/* Keywords EN */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        Keywords (ไม่บังคับ)
      </label>
      <input
        type="text"
        value={keywordsEN}
        onChange={(e) => setKeywordsEN(e.target.value)}
        placeholder="e.g., AI, Machine Learning, Computer Vision"
        style={{ fontSize: "1rem", padding: "0.4rem" }}
      />

      {/* Upload Slide */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        อัปโหลดสไลด์นำเสนอ (PDF) (ไม่บังคับ)
      </label>

      {form.oldSlideFile && !slideFileObj && (
        <p style={{ fontSize: "1rem" }}>
          ไฟล์เดิม:{" "}
          <a
            href={`http://localhost:8081/upload/${form.oldSlideFile}`}
            target="_blank"
            rel="noreferrer"
          >
            {form.oldSlideFile}
          </a>
        </p>
      )}

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileUpload(e, "slide")}
        style={{ padding: "0.5rem 0", fontSize: "1rem" }}
      />
      {slideFileObj && (
        <p style={{ fontSize: "1rem" }}>ไฟล์ที่เลือก: {slideFileObj.name}</p>
      )}

      {/* Upload Code */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        อัปโหลดโค้ด (ไม่บังคับ)
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label>
          <input
            type="radio"
            name="codeUploadType"
            value="github"
            checked={codeUploadType === "github"}
            onChange={() => setCodeUploadType("github")}
          />{" "}
          GitHub Link
        </label>
        {codeUploadType === "github" && (
          <input
            type="text"
            name="github"
            placeholder="ใส่ GitHub Repository URL"
            value={form.github}
            onChange={handleChange}
            style={{ fontSize: "1rem", padding: "0.4rem" }}
          />
        )}

        <label>
          <input
            type="radio"
            name="codeUploadType"
            value="zip"
            checked={codeUploadType === "zip"}
            onChange={() => setCodeUploadType("zip")}
          />{" "}
          Zip File
        </label>
        {codeUploadType === "zip" && (
          <>
            <input
              type="file"
              accept=".zip"
              onChange={(e) => handleFileUpload(e, "zip")}
              style={{ padding: "0.5rem 0", fontSize: "1rem" }}
            />
            {form.zipFileObj && (
              <p style={{ fontSize: "1rem" }}>
                ไฟล์ที่เลือก: {form.zipFileObj.name}
              </p>
            )}
            {!form.zipFileObj && form.oldZipFile && (
              <p style={{ fontSize: "1rem" }}>
                ไฟล์เดิม:{" "}
                <a
                  href={`http://localhost:8081/upload/${form.oldZipFile}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {form.oldZipFile}
                </a>
              </p>
            )}
          </>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        style={{
          padding: "10px 18px",
          backgroundColor: "#FD7521",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        บันทึกโครงงาน
      </button>

      {/* Delete Button (optional) */}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          style={{
            padding: "10px 18px",
            backgroundColor: "#e63946",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "0.5rem",
          }}
        >
          ลบโครงงาน
        </button>
      )}

      {/* Modal: Submit Alert */}
      {showSubmitAlertModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "1.5rem",
              borderRadius: "12px",
              width: "400px",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "1rem", color: "red" }}>
              กรอกข้อมูลไม่ครบ
            </h3>
            <p>กรุณากรอกข้อมูลที่จำเป็นให้ครบก่อนบันทึก</p>
            <button
              type="button"
              onClick={() => setShowSubmitAlertModal(false)}
              style={{
                marginTop: "1rem",
                padding: "8px 16px",
                backgroundColor: "#FD7521",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default EditProjectForm;
