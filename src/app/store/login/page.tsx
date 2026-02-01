"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDemoSession } from "@/lib/demo-session";

export default function StoreLoginPage() {
  const router = useRouter();
  const { login } = useDemoSession();

  const handleStoreLogin = () => {
    login("STORE");
    router.push("/store/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">店長ログイン</h1>
          <p className="mt-2 text-gray-600">
            店舗管理画面にログインします
          </p>
        </div>

        <div className="mt-8">
          <button
            type="button"
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
            店長としてログイン
          </button>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
