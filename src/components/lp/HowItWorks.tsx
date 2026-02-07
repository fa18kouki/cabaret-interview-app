"use client";

import { useTheme } from "@/lib/theme-provider";

export function HowItWorks() {
  const { isDark } = useTheme();

  const steps = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      label: "AIが",
      highlight: "時給診断",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
          />
        </svg>
      ),
      label: "ランク",
      highlight: "算出",
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      label: "オファーor",
      highlight: "店舗検索",
    },
  ];

  return (
    <section className={`py-12 md:py-16 ${isDark ? "bg-gray-950" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* セクションヘッダー */}
        <div className="text-center mb-10">
          <span className={`text-sm tracking-widest uppercase ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            HOW IT WORKS
          </span>
        </div>

        {/* ステップ */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              {/* ステップカード */}
              <div
                className={`rounded-2xl p-6 text-center min-w-[140px] border ${
                  isDark
                    ? "bg-gray-900 border-gray-800"
                    : "bg-pink-50 border-pink-100"
                }`}
              >
                <div
                  className={`w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                    isDark
                      ? "bg-gray-800 text-cyan-400"
                      : "bg-pink-100 text-pink-500"
                  }`}
                >
                  {step.icon}
                </div>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {step.label}
                </p>
                <p className={`font-semibold ${isDark ? "text-cyan-400" : "text-pink-500"}`}>
                  {step.highlight}
                </p>
              </div>

              {/* 矢印（最後以外） */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex items-center px-3">
                  <svg
                    className={`w-6 h-6 ${isDark ? "text-gray-600" : "text-gray-300"}`}
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
                </div>
              )}

              {/* モバイル用矢印 */}
              {index < steps.length - 1 && (
                <div className="md:hidden py-2">
                  <svg
                    className={`w-6 h-6 rotate-90 ${isDark ? "text-gray-600" : "text-gray-300"}`}
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
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
