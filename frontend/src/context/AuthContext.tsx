import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null;
  guestExpireAt: string | null;
  setAuth: (
    status: boolean,
    role: string | null,
    guestExpireAt?: string | null
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  guestExpireAt: null,
  setAuth: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [guestExpireAt, setGuestExpireAt] = useState<string | null>(null);

  // ✅ ตรวจ session ทุกครั้งที่เปิดเว็บ
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/check-session", { withCredentials: true })
      .then((res) => {
        if (res.data.status) {
          setIsLoggedIn(true);
          setRole(res.data.role);
          setGuestExpireAt(res.data.guestExpireAt || null);
        } else {
          setIsLoggedIn(false);
          setRole(null);
          setGuestExpireAt(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setRole(null);
        setGuestExpireAt(null);
      });
  }, []);

  const setAuth = (
    status: boolean,
    userRole: string | null,
    guestExpireAt?: string | null
  ) => {
    setIsLoggedIn(status);
    setRole(userRole);
    setGuestExpireAt(guestExpireAt || null);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole(null);
    setGuestExpireAt(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, role, guestExpireAt, setAuth, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
