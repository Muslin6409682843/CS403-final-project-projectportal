import React, { useState, useEffect } from "react";

export interface ProjectData {
  title: string;
  projectNameTH: string;
  projectNameEN: string;
  members: string[];
  advisor: string; // "ตำแหน่ง ชื่อ"
  coAdvisors?: string[]; // ["ตำแหน่ง ชื่อ", ...]
  year: string;
  abstract: string;
  abstractEN?: string; // เพิ่มบทคัดย่อภาษาอังกฤษ (ไม่บังคับ)
  slideFile?: string; // ชื่อไฟล์สไลด์ (ไม่บังคับ)
  githubLink?: string; // GitHub Link (ไม่บังคับ)
  zipFile?: string; // Zip File (ไม่บังคับ)
  uploadedAt?: string;
  keywordsTH?: string; // เพิ่ม
  keywordsEN?: string;
}

interface ProjectFormProps {
  initialData?: ProjectData;
  onSubmit: (data: ProjectData) => void;
  onDelete?: () => void;
  onChangeDirty?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
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
    abstract: initialData?.abstract || "",
    abstractEN: initialData?.abstractEN || "",
    slideFile: initialData?.slideFile || "",
    githubLink: initialData?.githubLink || "",
    zipFile: initialData?.zipFile || "",
  });

  // Advisor หลัก
  const [advisorPosition, setAdvisorPosition] = useState(
    initialData?.advisor ? initialData.advisor.split(" ")[0] : ""
  );
  const [advisorName, setAdvisorName] = useState(
    initialData?.advisor
      ? initialData.advisor.split(" ").slice(1).join(" ")
      : ""
  );
  const [customAdvisorPosition, setCustomAdvisorPosition] = useState("");

  // Advisor ร่วม
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [keywordsTH, setKeywordsTH] = useState(initialData?.keywordsTH || "");
  const [keywordsEN, setKeywordsEN] = useState(initialData?.keywordsEN || "");

  const [showSubmitAlertModal, setShowSubmitAlertModal] = useState(false);

  const [codeUploadType, setCodeUploadType] = useState<"github" | "zip" | "">(
    ""
  );

  const positions = [
    "",
    "อ.",
    "อ.ดร.",
    "ผศ.ดร.",
    "รศ.ดร.",
    "ศ.ดร.",
    "อื่นๆ (ระบุ)",
  ];

  // ปี พ.ศ.
  const currentYear = new Date().getFullYear();
  const thaiYears: number[] = [];
  for (let y = currentYear + 543; y >= 2543; y--) {
    thaiYears.push(y);
  }

  // Validate
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title) newErrors.title = "กรุณาอัปโหลดไฟล์ PDF ของโครงงาน";

    if (!form.projectNameTH)
      newErrors.projectNameTH = "กรุณากรอกชื่อโครงงาน (ภาษาไทย)";
    else if (/[a-zA-Z]/.test(form.projectNameTH))
      newErrors.projectNameTH = "ชื่อโครงงาน (ไทย) ห้ามมีตัวอักษรภาษาอังกฤษ";

    if (!form.projectNameEN)
      newErrors.projectNameEN = "กรุณากรอกชื่อโครงงาน (ภาษาอังกฤษ)";

    const memberErrors = form.members.filter((m) => !m.trim());
    if (memberErrors.length === form.members.length)
      newErrors.members = "กรุณากรอกชื่อผู้จัดทำอย่างน้อย 1 คน";

    if (
      !advisorPosition &&
      !advisorName.trim() &&
      !customAdvisorPosition.trim()
    ) {
      newErrors.advisor = "กรุณากรอกตำแหน่งและชื่ออาจารย์";
    } else if (!advisorPosition) {
      newErrors.advisor = "กรุณาเลือกตำแหน่งอาจารย์";
    } else if (
      advisorPosition === "อื่นๆ (ระบุ)" &&
      !customAdvisorPosition.trim()
    ) {
      newErrors.advisor = "กรุณากรอกตำแหน่งอาจารย์";
    } else if (!advisorName.trim()) {
      newErrors.advisor = "กรุณากรอกชื่ออาจารย์";
    }

    coAdvisors.forEach((c, idx) => {
      if (c.position === "" && c.name.trim() === "") return; // ไม่บังคับถ้าว่างทั้งคู่

      if (c.position === "") {
        newErrors[`coAdvisor-${idx}`] = "กรุณาเลือกตำแหน่งอาจารย์ที่ปรึกษาร่วม";
      } else if (c.position === "อื่นๆ (ระบุ)" && !c.customPosition.trim()) {
        newErrors[`coAdvisor-${idx}`] = "กรุณากรอกตำแหน่งอาจารย์ที่ปรึกษาร่วม";
      } else if (!c.name.trim()) {
        newErrors[`coAdvisor-${idx}`] = "กรุณากรอกชื่ออาจารย์ที่ปรึกษาร่วม";
      }
    });

    if (!form.year) newErrors.year = "กรุณาเลือกปีการศึกษา";

    if (!form.abstract.trim()) newErrors.abstract = "กรุณากรอกบทคัดย่อ";

    if (!keywordsTH.trim()) {
      newErrors.keywordsTH = "กรุณากรอกคำสำคัญ";
    }

    setErrors(newErrors);
  }, [
    form,
    advisorPosition,
    advisorName,
    customAdvisorPosition,
    coAdvisors,
    keywordsTH,
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
      setForm((prev) => ({ ...prev, members: newMembers }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (onChangeDirty) onChangeDirty();
  };

  const handleAddMember = () => {
    if (form.members.length < 2)
      setForm((prev) => ({ ...prev, members: [...prev.members, ""] }));
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "project" | "slide" | "zip"
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      // ถ้ายกเลิกการเลือกไฟล์ — เคลียร์ค่าใน form
      if (type === "project") setForm((prev) => ({ ...prev, title: "" }));
      if (type === "slide") setForm((prev) => ({ ...prev, slideFile: "" }));
      if (type === "zip") setForm((prev) => ({ ...prev, zipFile: "" }));
      return;
    }

    // ตรวจสอบว่าเป็น PDF เท่านั้นสำหรับโครงงานและสไลด์
    if (
      (type === "project" || type === "slide") &&
      file.type !== "application/pdf"
    ) {
      alert("กรุณาเลือกไฟล์ PDF เท่านั้น");
      return;
    }

    if (type === "project") {
      setForm((prev) => ({ ...prev, title: file.name }));
    } else if (type === "slide") {
      setForm((prev) => ({ ...prev, slideFile: file.name }));
    } else if (type === "zip") {
      setForm((prev) => ({ ...prev, zipFile: file.name }));
    }

    if (onChangeDirty) onChangeDirty();
  };

  // Co-Advisors
  const handleAddCoAdvisor = () => {
    if (coAdvisors.length < 5) {
      setCoAdvisors((prev) => [
        ...prev,
        { position: "", customPosition: "", name: "" },
      ]);
    }
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
      const advisorFull = advisorPosition + " " + advisorName.trim();
      const coAdvisorFull = coAdvisors
        .filter((c) => c.name.trim() !== "")
        .map((c) => c.position + " " + c.name.trim());
      onSubmit({
        ...form,
        advisor: advisorFull,
        coAdvisors: coAdvisorFull,
        keywordsTH: keywordsTH.trim(),
        keywordsEN: keywordsEN.trim(),
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
      {/* Upload PDF Project */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>
        อัปโหลดรูปเล่มโครงงาน (PDF)
      </label>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileUpload(e, "project")}
        style={{ padding: "0.5rem 0", fontSize: "1rem" }}
      />
      {errors.title && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>
          {errors.title}
        </span>
      )}
      {form.title && (
        <p style={{ fontSize: "1rem" }}>ไฟล์ที่เลือก: {form.title}</p>
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

      {/* Abstract (TH) */}
      <label style={{ fontSize: "1.1rem", fontWeight: 600 }}>บทคัดย่อ</label>
      <textarea
        name="abstract"
        value={form.abstract}
        onChange={handleChange}
        rows={8}
        style={{ fontSize: "1rem", padding: "0.6rem", lineHeight: 1.5 }}
      />
      {errors.abstract && (
        <span style={{ color: "red", fontSize: "0.95rem" }}>
          {errors.abstract}
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
        name="abstractEN"
        value={form.abstractEN}
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
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileUpload(e, "slide")}
        style={{ padding: "0.5rem 0", fontSize: "1rem" }}
      />
      {form.slideFile && (
        <p style={{ fontSize: "1rem" }}>ไฟล์ที่เลือก: {form.slideFile}</p>
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
            name="githubLink"
            placeholder="ใส่ GitHub Repository URL"
            value={form.githubLink}
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
            {form.zipFile && (
              <p style={{ fontSize: "1rem" }}>ไฟล์ที่เลือก: {form.zipFile}</p>
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

export default ProjectForm;
