"use client";

import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Bell, X } from "lucide-react";

export function NotificationToast() {
  const prevCountRef = useRef<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { data } = trpc.notification.getUnreadCount.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  useEffect(() => {
    const currentCount = data?.count ?? 0;

    if (prevCountRef.current !== null && currentCount > prevCountRef.current) {
      setToast("新しいオファーが届きました");
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }

    prevCountRef.current = currentCount;
  }, [data?.count]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] animate-in slide-in-from-top-2 fade-in duration-300">
      <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 min-w-[280px]">
        <div className="w-8 h-8 bg-(--primary-bg) rounded-full flex items-center justify-center flex-shrink-0">
          <Bell className="w-4 h-4 text-(--primary)" />
        </div>
        <span className="text-sm font-medium text-gray-900 flex-1">{toast}</span>
        <button
          onClick={() => setToast(null)}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
