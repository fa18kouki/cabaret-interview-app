"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StoreNav } from "@/components/layout/store-nav";
import { StoreTopbar } from "@/components/layout/store-topbar";

export function StoreLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/store/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col">
      <StoreTopbar />
      <div className="flex flex-1 pt-[70px] min-h-[calc(100vh-70px)]">
        <aside className="hidden md:flex md:w-[260px] md:shrink-0">
          <StoreNav />
        </aside>
        <main className="flex-1 p-6 md:p-10 overflow-y-auto min-w-0">
          {children}
        </main>
      </div>
      {/* モバイル用: 下部ナビ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-[999]">
        <Link
          href="/store/dashboard"
          className="flex flex-col items-center gap-0.5 text-xs text-[var(--text-sub)] hover:text-[var(--primary)]"
        >
          ダッシュボード
        </Link>
        <Link
          href="/store/casts"
          className="flex flex-col items-center gap-0.5 text-xs text-[var(--text-sub)] hover:text-[var(--primary)]"
        >
          応募者
        </Link>
        <Link
          href="/store/matches"
          className="flex flex-col items-center gap-0.5 text-xs text-[var(--text-sub)] hover:text-[var(--primary)]"
        >
          メッセージ
        </Link>
        <Link
          href="/store/profile"
          className="flex flex-col items-center gap-0.5 text-xs text-[var(--text-sub)] hover:text-[var(--primary)]"
        >
          店舗
        </Link>
      </nav>
      <div className="h-16 md:hidden" aria-hidden />
    </div>
  );
}
