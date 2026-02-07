"use client";

import { Store, Bell, ChevronDown } from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";
import { createMockStoreProfile } from "@/lib/mock-data";

export function StoreTopbar() {
  const { session } = useDemoSession();
  const profile = session?.user?.id
    ? createMockStoreProfile(session.user.id)
    : null;
  const storeDisplayName = profile?.name ?? "店舗";

  return (
    <header className="fixed top-0 left-0 right-0 h-16 sm:h-[70px] bg-white flex items-center justify-between px-4 sm:px-6 shadow-[0_2px_10px_rgba(0,0,0,0.05)] z-[1000]">
      <div className="flex items-center gap-2.5">
        <img src="/Favicon_16x16.png" alt="" className="w-6 h-6 rounded object-contain" aria-hidden />
        <span className="text-xl font-bold text-[var(--text-main)] tracking-wide">
          LUMINA 管理画面
        </span>
      </div>

      <div className="flex items-center gap-5 text-[var(--text-sub)] bg-[var(--bg-gray)] px-5 py-2 rounded-[20px] font-medium text-base">
        <Store className="w-4 h-4" aria-hidden />
        {storeDisplayName}
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          className="relative text-[var(--text-sub)] hover:text-[var(--primary)] transition-colors p-1"
          aria-label="通知"
        >
          <Bell className="w-[22px] h-[22px]" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--primary)] rounded-full" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2.5 cursor-pointer"
          aria-label="ユーザーメニュー"
        >
          <div className="w-10 h-10 bg-[var(--primary-light)] rounded-full flex items-center justify-center text-[var(--primary)] font-bold">
            店長
          </div>
          <ChevronDown className="w-5 h-5 text-[var(--text-sub)]" />
        </button>
      </div>
    </header>
  );
}
