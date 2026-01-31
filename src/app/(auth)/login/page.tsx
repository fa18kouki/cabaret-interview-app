"use client";

import { useRouter } from "next/navigation";
import { useDemoSession } from "@/lib/demo-session";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useDemoSession();

  const handleCastLogin = () => {
    login("CAST");
    router.push("/dashboard");
  };

  const handleStoreLogin = () => {
    login("STORE");
    router.push("/store/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">デモモード</h1>
          <p className="mt-2 text-gray-600">
            認証なしで簡単にアプリを試せます
          </p>
          <p className="mt-1 text-sm text-amber-600">
            データベース不要 - 全てモックデータで動作します
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={handleCastLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
          >
            <svg
              className="w-6 h-6"
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
            キャストとして始める
          </button>

          <button
            onClick={handleStoreLogin}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              className="w-6 h-6"
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
            店舗として始める
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            デモモードについて
          </h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 毎回新しいユーザーIDが生成されます</li>
            <li>• データはブラウザのローカルストレージに保存</li>
            <li>• 全機能をモックデータで体験できます</li>
            <li>• ブラウザを閉じるとセッションは24時間有効</li>
          </ul>
        </div>

        <div className="text-center">
          <a href="/" className="text-sm text-pink-600 hover:text-pink-700">
            トップページに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
