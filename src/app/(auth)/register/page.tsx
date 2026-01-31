"use client";

import { useState } from "react";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";

export default function RegisterPage() {
  const [userType, setUserType] = useState<"cast" | "store" | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">新規登録</h1>
          <p className="mt-2 text-gray-600">
            アカウントタイプを選択してください
          </p>
        </div>

        {!userType ? (
          <div className="mt-8 space-y-4">
            <button
              onClick={() => setUserType("cast")}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-pink-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">
                    キャストとして登録
                  </h3>
                  <p className="text-sm text-gray-500">お仕事を探している方</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setUserType("store")}
              className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">店舗として登録</h3>
                  <p className="text-sm text-gray-500">
                    キャストを募集している方
                  </p>
                </div>
              </div>
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <div className="text-center mb-6">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                  userType === "cast"
                    ? "bg-pink-100 text-pink-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {userType === "cast" ? "キャスト" : "店舗"}として登録
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-center text-gray-600">
                SNSアカウントで簡単登録
              </p>

              <SocialLoginButtons
                callbackUrl={
                  userType === "cast" ? "/cast/profile" : "/store/profile"
                }
              />

              <button
                onClick={() => setUserType(null)}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-4"
              >
                ← 戻る
              </button>
            </div>
          </div>
        )}

        <div className="text-center text-sm">
          <span className="text-gray-500">すでにアカウントをお持ちですか？</span>{" "}
          <a href="/login" className="text-pink-600 hover:text-pink-700">
            ログイン
          </a>
        </div>
      </div>
    </div>
  );
}
