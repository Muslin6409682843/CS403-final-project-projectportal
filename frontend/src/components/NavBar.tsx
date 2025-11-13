import { useState, useEffect } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface NavItem {
  label: string;
  path: string;
}

interface NavBarProps {
  logoSrcPath: string;
}

const navItems: NavItem[] = [
  { label: "สำรวจ", path: "/browse" },
  { label: "ภาพรวมโครงงาน", path: "/overview" },
  { label: "เกี่ยวกับ CSTU", path: "/about" },
];

function NavBar({ logoSrcPath }: NavBarProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();

  const handleAccountClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      if (role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/favorite");
      }
    }
  };

  return (
    <nav
      className="navbar navbar-expand-md navbar-light sticky-top"
      style={{
        padding: "1rem 2rem",
        fontSize: "1.1rem",
        height: "80px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "#fff",
      }}
    >
      <div className="d-flex align-items-center w-100">
        {/* โลโก้ของเว็บ (กดแล้วไปหน้าแรก) */}
        <Link to="/" className="navbar-brand">
          <img
            src={logoSrcPath}
            style={{ height: "50px", width: "auto" }}
            className="d-inline-block align-top align-center"
            alt="CSTU logo"
          />
        </Link>

        {/* รายการเมนูที่รับมาจาก navItems */}
        <ul
          className="navbar-nav d-flex gap-4 mb-0 ms-4"
          style={{ listStyleType: "none" }}
        >
          {navItems.map((item, index) => (
            <li
              key={item.label}
              className="nav-item"
              onClick={() => setSelectedIndex(index)}
            >
              <Link
                className={
                  selectedIndex === index
                    ? "nav-link active fw-bold"
                    : "nav-link"
                }
                to={item.path}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* ปุ่ม Log in */}
        <button
          className="btn-login ms-auto"
          onClick={handleAccountClick}
          type="button"
          style={{
            borderRadius: "20px",
            backgroundColor: "#FD7521",
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: "1rem",
            padding: "10px 25px",
            border: "none",
          }}
        >
          {isLoggedIn ? "บัญชีของฉัน" : "เข้าสู่ระบบ"}
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
