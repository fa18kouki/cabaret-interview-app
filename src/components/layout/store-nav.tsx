"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  MessageSquare,
  Store,
  Settings,
  LogOut,
} from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";

const navItems = [
  { href: "/store/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/store/casts", label: "応募者管理", icon: Users },
  { href: "/store/interviews", label: "面接管理", icon: CalendarCheck },
  { href: "/store/matches", label: "メッセージ", icon: MessageSquare },
  { href: "/store/profile", label: "店舗情報", icon: Store },
];

export function StoreNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useDemoSession();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="w-[220px] lg:w-[260px] bg-white h-full flex flex-col gap-2.5 py-8 px-4 lg:px-5 border-r border-[#EAEAEA] shrink-0">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium text-sm transition-all
              ${isActive ? "bg-[var(--primary-bg)] text-[var(--primary)] font-bold" : "text-[var(--text-sub)] hover:bg-[#FAFAFA] hover:text-[var(--primary)]"}
            `}
          >
            <Icon className="w-5 h-5 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}

      <div className="mt-auto pt-2">
        <Link
          href="/store/settings"
          className={`
            flex items-center gap-4 px-5 py-3.5 rounded-xl font-medium text-sm transition-all
            ${pathname === "/store/settings" ? "bg-[var(--primary-bg)] text-[var(--primary)] font-bold" : "text-[var(--text-sub)] hover:bg-[#FAFAFA] hover:text-[var(--primary)]"}
          `}
        >
          <Settings className="w-5 h-5 shrink-0" aria-hidden />
          設定
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 w-full px-5 py-3.5 rounded-xl font-medium text-sm text-[var(--text-sub)] hover:bg-[#FAFAFA] hover:text-[var(--primary)] transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" aria-hidden />
          ログアウト
        </button>
      </div>
    </nav>
  );
}
