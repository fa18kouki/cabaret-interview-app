"use client";

import { useState, useEffect, ReactNode } from "react";
import {
  DemoSessionContext,
  DemoSession,
  DemoRole,
  getDemoSession,
  createDemoSession,
  clearDemoSession,
} from "./demo-session";

interface DemoProviderProps {
  children: ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初期セッション読み込み
    const stored = getDemoSession();
    setSession(stored);
    setIsLoading(false);
  }, []);

  const login = (role: DemoRole) => {
    const newSession = createDemoSession(role);
    setSession(newSession);
  };

  const logout = () => {
    clearDemoSession();
    setSession(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
      </div>
    );
  }

  return (
    <DemoSessionContext.Provider value={{ session, login, logout }}>
      {children}
    </DemoSessionContext.Provider>
  );
}
