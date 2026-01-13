import React, { useEffect, createContext, useContext, useState } from "react";
import type { UserResponse } from "../types/user";

type AuthContextType = {
  user: UserResponse | null;
  setUser: (user: UserResponse | null) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setLocalUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const setUser = (user: UserResponse | null) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
    setLocalUser(user);
  };

  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
  
    setLocalUser(JSON.parse(stored));
    setLoading(false);
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
