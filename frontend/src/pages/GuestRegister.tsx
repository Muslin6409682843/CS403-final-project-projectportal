import React, { useState } from "react";
import "../assets/background.css";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const GuestRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    nameTh: "",
    nameEn: "",
    gender: "",
    tel: "",
    email: "",
    institute: "",
    role: "Guest",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerMessage, setRegisterMessage] = useState("");

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const usernameRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/;
    const thaiRegex = /^[ก-๙\s]+$/;
    const englishRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // ✅ ตรวจสอบว่ากรอกทุกช่อง
    if (!formData.username.trim()) newErrors.username = "กรุณากรอกชื่อผู้ใช้";
    if (!formData.password.trim()) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    if (!formData.nameTh.trim()) newErrors.nameTh = "กรุณากรอกชื่อภาษาไทย";
    if (!formData.nameEn.trim()) newErrors.nameEn = "กรุณากรอกชื่อภาษาอังกฤษ";
    if (!formData.gender.trim()) newErrors.gender = "กรุณาเลือกเพศ";
    if (!formData.tel.trim()) newErrors.tel = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.email.trim()) newErrors.email = "กรุณากรอกอีเมล";
    if (!formData.institute.trim())
      newErrors.institute = "กรุณากรอกหน่วยงาน / สังกัด";

    // ✅ ตรวจสอบรูปแบบข้อมูล
    if (formData.username && !usernameRegex.test(formData.username))
      newErrors.username = "Username ต้องเป็นตัวอักษรอังกฤษ ตัวเลข หรือ symbol";
    if (formData.password && !usernameRegex.test(formData.password))
      newErrors.password = "Password ต้องเป็นตัวอักษรอังกฤษ ตัวเลข หรือ symbol";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (formData.nameTh && !thaiRegex.test(formData.nameTh))
      newErrors.nameTh = "กรุณากรอกชื่อ-นามสกุลภาษาไทยให้ถูกต้อง";
    if (formData.nameEn && !englishRegex.test(formData.nameEn))
      newErrors.nameEn = "กรุณากรอกชื่อ-นามสกุลภาษาอังกฤษให้ถูกต้อง";
    if (formData.tel && !phoneRegex.test(formData.tel))
      newErrors.tel = "เบอร์โทรต้องเป็นตัวเลข 10 หลัก";
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

  // 🚀 ส่งข้อมูลไป Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/users/register-guest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.text();
      if (response.ok) {
        handleRegisterSuccess();
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          nameTh: "",
          nameEn: "",
          gender: "",
          tel: "",
          email: "",
          institute: "",
          role: "Guest",
        });
      } else {
        alert(`❌ สมัครไม่สำเร็จ: ${data}`);
      }
    } catch (err) {
      console.error(err);
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
          สมัครสมาชิกสำหรับ Guest
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <InputField
            id="username"
            label="ชื่อผู้ใช้"
            placeholder="ตั้งชื่อผู้ใช้"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
          />

          <InputField
            id="password"
            label="รหัสผ่าน"
            type="password"
            placeholder="กรอกรหัสผ่าน"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <InputField
            id="confirmPassword"
            label="ยืนยันรหัสผ่าน"
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />

          <InputField
            id="nameTh"
            label="ชื่อ-นามสกุล (ภาษาไทย)"
            placeholder="กรอกชื่อ-นามสกุลภาษาไทย"
            value={formData.nameTh}
            onChange={handleChange}
            error={errors.nameTh}
          />

          <InputField
            id="nameEn"
            label="ชื่อ-นามสกุล (ภาษาอังกฤษ)"
            placeholder="กรอกชื่อ-นามสกุลภาษาอังกฤษ"
            value={formData.nameEn}
            onChange={handleChange}
            error={errors.nameEn}
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
              <option value="Male">ชาย</option>
              <option value="Female">หญิง</option>
              <option value="Other">อื่นๆ</option>
            </select>
            {errors.gender && (
              <span style={{ color: "red", fontSize: "12px" }}>
                {errors.gender}
              </span>
            )}
          </div>

          <InputField
            id="tel"
            label="เบอร์โทรศัพท์"
            placeholder="เช่น 0891234567"
            value={formData.tel}
            onChange={handleChange}
            error={errors.tel}
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
            id="institute"
            label="หน่วยงาน / สังกัด"
            placeholder="กรอกชื่อหน่วยงาน"
            value={formData.institute}
            onChange={handleChange}
            error={errors.institute}
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
            {loading ? "กำลังส่งข้อมูล..." : "สมัครสมาชิก"}
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

// 🧩 Component InputField
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

export default GuestRegister;
