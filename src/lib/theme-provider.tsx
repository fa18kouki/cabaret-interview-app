"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  isDark: true,
});

// 18:00〜6:00はダークテーマ、それ以外はライトテーマ
function getThemeByTime(): Theme {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark"); // SSR時はダークをデフォルト
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // クライアントサイドで時間に基づいてテーマを設定
    setTheme(getThemeByTime());
    setMounted(true);

    // 1分ごとにテーマをチェック（時間帯の境界を跨ぐ場合に対応）
    const interval = setInterval(() => {
      setTheme(getThemeByTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // マウント前はSSRと一致させるためダークを返す
  const currentTheme = mounted ? theme : "dark";

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, isDark: currentTheme === "dark" }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
