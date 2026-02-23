"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Mail, Phone, Shield } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { useDemoSession } from "@/lib/demo-session";
import { createMockStoreSettings } from "@/lib/mock-data";

interface NotificationSettings {
  newApplicant: boolean;
  offerResponse: boolean;
  interviewReminder: boolean;
  messageReceived: boolean;
  systemAnnouncement: boolean;
}

const NOTIFICATION_ITEMS: {
  key: keyof NotificationSettings;
  label: string;
  description: string;
}[] = [
  {
    key: "newApplicant",
    label: "新規応募通知",
    description: "新しい応募があった時に通知を受け取る",
  },
  {
    key: "offerResponse",
    label: "オファー回答通知",
    description: "キャストがオファーに回答した時に通知を受け取る",
  },
  {
    key: "interviewReminder",
    label: "面接リマインダー",
    description: "面接予定の前日にリマインダーを受け取る",
  },
  {
    key: "messageReceived",
    label: "メッセージ受信通知",
    description: "新しいメッセージを受信した時に通知を受け取る",
  },
  {
    key: "systemAnnouncement",
    label: "システムお知らせ",
    description: "サービスの更新やメンテナンス情報を受け取る",
  },
];

export default function StoreSettingsPage() {
  const router = useRouter();
  const { session } = useDemoSession();
  const [notifications, setNotifications] =
    useState<NotificationSettings | null>(null);
  const [account, setAccount] = useState<{
    email: string;
    phone: string;
  } | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "STORE") {
      router.push("/dashboard");
    } else {
      const settings = createMockStoreSettings(session.user.id);
      setNotifications(settings.notifications);
      setAccount(settings.account);
    }
  }, [session, router]);

  if (!session || session.user.role !== "STORE" || !notifications || !account) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  const handleToggle = (key: keyof NotificationSettings) => {
    setNotifications((prev) =>
      prev ? { ...prev, [key]: !prev[key] } : prev
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-main)">設定</h1>

      {/* 通知設定 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Bell className="w-5 h-5 text-(--primary)" />
          <h2 className="font-bold text-(--text-main)">通知設定</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {NOTIFICATION_ITEMS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between px-5 py-4"
            >
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-(--text-main)">
                  {item.label}
                </p>
                <p className="text-xs text-(--text-sub) mt-0.5">
                  {item.description}
                </p>
              </div>
              <ToggleSwitch
                checked={notifications[item.key]}
                onChange={() => handleToggle(item.key)}
                label={item.label}
              />
            </div>
          ))}
        </div>
      </div>

      {/* アカウント情報 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <Shield className="w-5 h-5 text-(--primary)" />
          <h2 className="font-bold text-(--text-main)">アカウント情報</h2>
        </div>
        <div className="divide-y divide-gray-50">
          <div className="flex items-center gap-3 px-5 py-4">
            <Mail className="w-4 h-4 text-(--text-sub)" />
            <div>
              <p className="text-xs text-(--text-sub)">メールアドレス</p>
              <p className="text-sm font-medium text-(--text-main)">
                {account.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-5 py-4">
            <Phone className="w-4 h-4 text-(--text-sub)" />
            <div>
              <p className="text-xs text-(--text-sub)">電話番号</p>
              <p className="text-sm font-medium text-(--text-main)">
                {account.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
