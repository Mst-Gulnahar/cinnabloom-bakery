"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loginUser: (token: string, user: User) => void;
  logoutUser: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Ensure the cookie exists on page reload for Middleware
      document.cookie = `token=${storedToken}; path=/; max-age=86400; SameSite=Lax;`;
    }
    setLoading(false);
  }, []);

  const loginUser = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    
    // Save to localStorage
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    // 🔑 SAVE TO COOKIE FOR NEXT.JS MIDDLEWARE
    document.cookie = `token=${newToken}; path=/; max-age=86400; SameSite=Lax;`;

    router.push("/");
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 🔑 CLEAR COOKIE FOR NEXT.JS MIDDLEWARE
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};