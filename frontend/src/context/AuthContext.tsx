import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null;
  setAuth: (status: boolean, role: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  setAuth: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // ✅ ตรวจ session ทุกครั้งที่เปิดเว็บ
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/check-session", { withCredentials: true })
      .then((res) => {
        if (res.data.status) {
          setIsLoggedIn(true);
          setRole(res.data.role);
        } else {
          setIsLoggedIn(false);
          setRole(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setRole(null);
      });
  }, []);

  const setAuth = (status: boolean, userRole: string | null) => {
    setIsLoggedIn(status);
    setRole(userRole);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
