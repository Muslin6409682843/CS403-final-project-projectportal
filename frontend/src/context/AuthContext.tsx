import { createContext, useContext, useState, ReactNode } from "react";

// 1️⃣ กำหนด interface
interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null;
  setAuth: (loggedIn: boolean, role: string | null) => void;
}

// 2️⃣ สร้าง context พร้อมค่า default
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  role: null,
  setAuth: () => {},
});

// 3️⃣ สร้าง provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const setAuth = (loggedIn: boolean, role: string | null) => {
    setIsLoggedIn(loggedIn);
    setRole(role);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4️⃣ สร้าง hook สำหรับเรียกใช้ context
export const useAuth = () => useContext(AuthContext);
