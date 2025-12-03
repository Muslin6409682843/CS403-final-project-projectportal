import React, { useState } from "react";
import "../assets/background.css"; 
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

const Student: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<"student" | "staff">("student");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    staffId: "",
    username: "",
    password: "",
    confirmPassword: "",
    fullNameTH: "",
    fullNameEN: "",
    gender: "",
    phone: "",
    email: "",
    faculty: "",
    major: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");

  // ✅ ตรวจสอบข้อมูลก่อนส่ง
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const usernameRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/;
    const passwordRegex = usernameRegex;
    const thaiRegex = /^[ก-๙\s]+$/;
    const englishRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const [key, value] of Object.entries(formData)) {
      if (role === "student" && key === "staffId") continue;
      if (role === "staff" && key === "studentId") continue;
      if (!value.trim()) newErrors[key] = "กรุณากรอกข้อมูลให้ครบทุกช่อง";
    }

    if (formData.username && !usernameRegex.test(formData.username))
      newErrors.username =
        "Username ต้องเป็นภาษาอังกฤษ ตัวเลข หรือ symbol เท่านั้น";

    if (formData.password && !passwordRegex.test(formData.password))
      newErrors.password =
        "Password ต้องเป็นภาษาอังกฤษ ตัวเลข หรือ symbol เท่านั้น";

    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Password ไม่ตรงกัน";

    if (formData.fullNameTH && !thaiRegex.test(formData.fullNameTH))
      newErrors.fullNameTH = "กรุณากรอกชื่อ-นามสกุลภาษาไทยให้ถูกต้อง";

    if (formData.fullNameEN && !englishRegex.test(formData.fullNameEN))
      newErrors.fullNameEN = "กรุณากรอกชื่อ-นามสกุลภาษาอังกฤษให้ถูกต้อง";

    if (formData.phone && !phoneRegex.test(formData.phone))
      newErrors.phone = "เบอร์โทรต้องเป็นตัวเลข 10 หลักเท่านั้น";

    if (formData.email && !emailRegex.test(formData.email))
      newErrors.email = "อีเมลไม่ถูกต้อง";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // ✅ เชื่อมต่อ Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const payload = {
      username: formData.username,
      password: formData.password,
      nameTh: formData.fullNameTH,
      nameEn: formData.fullNameEN,
      gender: formData.gender,
      tel: formData.phone,
      email: formData.email,
      faculty: formData.faculty,
      department: formData.major,
      role: role === "student" ? "Student" : "Staff",
      userCode: role === "student" ? formData.studentId : formData.staffId,
    };

    try {
      const res = await fetch("http://localhost:8081/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.text();

      if (res.ok) {
        handleRegisterSuccess();
        // เคลียร์ฟอร์ม
        setFormData({
          studentId: "",
          staffId: "",
          username: "",
          password: "",
          confirmPassword: "",
          fullNameTH: "",
          fullNameEN: "",
          gender: "",
          phone: "",
          email: "",
          faculty: "",
          major: "",
        });
      } else {
        alert(`❌ สมัครสมาชิกไม่สำเร็จ: ${data}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
    navigate("/");
  };

  return (
    <div
      className="main-background"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        paddingTop: "100px",
        paddingBottom: "40px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          minWidth: "350px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h2 style={{ fontSize: "32px", textAlign: "center", color: "#333" }}>
          สมัครสมาชิกสำหรับ
          <br />
          นักศึกษา/บุคลากร
        </h2>

        {/* ปุ่มเลือกประเภท */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            type="button"
            onClick={() => setRole("student")}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "20px",
              border:
                role === "student" ? "1px solid #ff6b00" : "1px solid #ccc",
              background: role === "student" ? "#ff6b00" : "#f8f8f8",
              color: role === "student" ? "#fff" : "#000",
              cursor: "pointer",
              fontSize: "14px",
              transition: "0.2s",
            }}
          >
            นักศึกษา
          </button>
          <button
            type="button"
            onClick={() => setRole("staff")}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "20px",
              border: role === "staff" ? "1px solid #ff6b00" : "1px solid #ccc",
              background: role === "staff" ? "#ff6b00" : "#f8f8f8",
              color: role === "staff" ? "#fff" : "#000",
              cursor: "pointer",
              fontSize: "14px",
              transition: "0.2s",
            }}
          >
            บุคลากร
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          {role === "student" && (
            <InputField
              id="studentId"
              label="รหัสนักศึกษา"
              placeholder="กรอกรหัสนักศึกษา"
              value={formData.studentId}
              onChange={handleChange}
              error={errors.studentId}
            />
          )}
          {role === "staff" && (
            <InputField
              id="staffId"
              label="รหัสเจ้าหน้าที่"
              placeholder="กรอกรหัสเจ้าหน้าที่"
              value={formData.staffId}
              onChange={handleChange}
              error={errors.staffId}
            />
          )}

          <InputField
            id="username"
            label="Username"
            placeholder="ตั้งชื่อผู้ใช้"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="รหัสผ่าน"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <InputField
            id="confirmPassword"
            label="ยืนยัน Password"
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <InputField
            id="fullNameTH"
            label="ชื่อ-นามสกุล (ภาษาไทย)"
            placeholder="กรอกชื่อ-นามสกุลภาษาไทย"
            value={formData.fullNameTH}
            onChange={handleChange}
            error={errors.fullNameTH}
          />

          <InputField
            id="fullNameEN"
            label="ชื่อ-นามสกุล (ภาษาอังกฤษ)"
            placeholder="กรอกชื่อ-นามสกุลภาษาอังกฤษ"
            value={formData.fullNameEN}
            onChange={handleChange}
            error={errors.fullNameEN}
          />

          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="gender" style={{ fontSize: "14px", color: "#333" }}>
              เพศ
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={handleChange}
              style={{
                padding: "8px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                fontSize: "14px",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#ff9800")}
              onBlur={(e) => (e.target.style.borderColor = "#ccc")}
            >
              <option value="">-- เลือกเพศ --</option>
              <option value="Female">หญิง</option>
              <option value="Male">ชาย</option>
              <option value="Other">อื่นๆ</option>
            </select>
            {errors.gender && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.gender}
              </span>
            )}
          </div>

          <InputField
            id="phone"
            label="เบอร์โทร"
            placeholder="เช่น 0891234567"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <InputField
            id="email"
            label="อีเมล"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <InputField
            id="faculty"
            label="คณะ"
            placeholder="กรอกชื่อคณะ"
            value={formData.faculty}
            onChange={handleChange}
            error={errors.faculty}
          />

          <InputField
            id="major"
            label="สาขา"
            placeholder="กรอกชื่อสาขา"
            value={formData.major}
            onChange={handleChange}
            error={errors.major}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 0",
              border: "none",
              borderRadius: "25px",
              background: loading ? "#ccc" : "#ffc107",
              color: "#fff",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.2s",
            }}
          >
            {loading ? "กำลังส่งข้อมูล..." : "ยืนยัน"}
          </button>
        </form>
      </div>
      {showRegisterModal &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999999,
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "3rem 2rem",
                borderRadius: "16px",
                textAlign: "center",
                maxWidth: "400px",
                width: "90%",
                boxShadow: "0 0 15px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{ fontSize: "16px", lineHeight: "1.6", color: "#333" }}
              >
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "18px",
                    marginBottom: "0.8rem",
                  }}
                >
                  ✅ สมัครสมาชิกสำเร็จ!
                </p>
                <p>
                  รอแอดมินอนุมัติภายใน 5 วัน <br /> หากยัง login ไม่ได้หลังจาก 5
                  วัน ถือว่าถูกปฏิเสธ
                  <br />
                  (สามารถสมัครใหม่ได้)
                </p>
              </div>

              <button
                onClick={closeRegisterModal}
                style={{
                  marginTop: "1.5rem",
                  padding: "12px 24px",
                  backgroundColor: "#FD7521",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ปิด
              </button>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

// 🧩 Component InputField ย่อย
interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label
      htmlFor={id}
      style={{ marginBottom: "5px", fontSize: "14px", color: "#333" }}
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        padding: "8px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
      }}
    />
    {error && <span style={{ color: "red", fontSize: "12px" }}>{error}</span>}
  </div>
);

export default Student;
