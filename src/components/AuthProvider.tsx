"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { TelegramUser } from "@/types";

const STORAGE_KEY = "telex_telegram_user";

interface AuthContextType {
  user: TelegramUser | null;
  login: (user: TelegramUser) => void;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as TelegramUser;
        if (parsed.id && parsed.auth_date) setUser(parsed);
      }
    } catch (_) {}
    setIsReady(true);
  }, []);

  const login = useCallback((u: TelegramUser) => {
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch (_) {}
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
