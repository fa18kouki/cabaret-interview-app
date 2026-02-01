"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDemoSession } from "@/lib/demo-session";

export default function StoreInterviewsPage() {
  const router = useRouter();
  const { session } = useDemoSession();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "STORE") {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (!session || session.user.role !== "STORE") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--text-main)]">
        面接管理
      </h1>
      <p className="text-[var(--text-sub)]">
        面接予定の一覧・カレンダーは準備中です。
      </p>
      <Link
        href="/store/dashboard"
        className="text-[#4A90E2] font-medium hover:underline"
      >
        ダッシュボードに戻る
      </Link>
    </div>
  );
}
