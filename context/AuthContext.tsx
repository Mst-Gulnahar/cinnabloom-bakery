"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
  photoUrl?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  token: string | null;
  loginUser: (token: string, user: User, redirectTo?: string) => void;
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
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser && storedUser !== "undefined") {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        document.cookie = `token=${storedToken}; path=/; max-age=86400; SameSite=Lax;`;
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;";
      }
    } catch (e) {
      console.error("Error reading auth state:", e);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = (newToken: string, newUser: User, redirectTo: string = "/") => {
    setToken(newToken);
    setUser(newUser);

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    document.cookie = `token=${newToken}; path=/; max-age=86400; SameSite=Lax;`;

    router.push(redirectTo);
    router.refresh();
  };

  const logoutUser = () => {
    // 1. Reset state instantly
    setToken(null);
    setUser(null);

    // 2. Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // 3. Clear cookie cleanly across root path
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax;";

    // 4. Force reset scroll position in case modal locks were lingering
    if (typeof document !== "undefined") {
      document.body.style.overflow = "unset";
    }

    // 5. Navigate & purge Next.js router client cache
    router.push("/login");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};