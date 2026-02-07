"use client";

import Link from "next/link";
import { useTheme } from "@/lib/theme-provider";

export function FixedCTA() {
  const { isDark } = useTheme();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 pt-8 pb-4 px-4 pointer-events-none ${
        isDark
          ? "bg-gradient-to-t from-black via-black to-transparent"
          : "bg-gradient-to-t from-white via-white to-transparent"
      }`}
    >
      <div className="max-w-lg mx-auto pointer-events-auto">
        <Link
          href="/diagnosis"
          className={`flex items-center justify-between w-full font-semibold py-4 px-6 rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
            isDark
              ? "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-cyan-500/25"
              : "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-500/25"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="text-left">
              <p className={`text-xs ${isDark ? "text-cyan-100" : "text-pink-100"}`}>
                自分の市場価値を知る
              </p>
              <p className="text-white font-semibold">AI時給診断をスタートする</p>
            </div>
          </div>
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
