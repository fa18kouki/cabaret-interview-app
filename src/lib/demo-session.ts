"use client";

import { createContext, useContext } from "react";

export type DemoRole = "CAST" | "STORE";

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: DemoRole;
}

export interface DemoSession {
  user: DemoUser;
  expires: string;
}

// セッションキー
const SESSION_KEY = "demo_session";

// ランダムID生成
export function generateDemoUserId(): string {
  return `demo_${Math.random().toString(36).substring(2, 15)}`;
}

// デモセッション作成
export function createDemoSession(role: DemoRole): DemoSession {
  const userId = generateDemoUserId();
  const session: DemoSession = {
    user: {
      id: userId,
      email: `${userId}@demo.local`,
      name: role === "CAST" ? "デモキャスト" : "デモ店舗",
      role,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

// デモセッション取得
export function getDemoSession(): DemoSession | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const session = JSON.parse(stored) as DemoSession;
    // 有効期限チェック
    if (new Date(session.expires) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

// デモセッションクリア
export function clearDemoSession(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Context
interface DemoSessionContextType {
  session: DemoSession | null;
  login: (role: DemoRole) => void;
  logout: () => void;
}

export const DemoSessionContext = createContext<DemoSessionContextType>({
  session: null,
  login: () => {},
  logout: () => {},
});

export const useDemoSession = () => useContext(DemoSessionContext);
