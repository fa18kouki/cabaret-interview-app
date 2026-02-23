"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  FileEdit,
  Search,
  Mail,
  ChevronRight,
  Clock,
  Calendar,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import { useDemoSession } from "@/lib/demo-session";
import {
  getMockRecentApplicants,
  getMockUpcomingInterviews,
} from "@/lib/mock-data";

function formatApplicantDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}/${m}/${day} ${h}:${min}`;
}

function formatInterviewDate(d: Date) {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const w = weekdays[d.getDay()];
  return `${m}月${day}日(${w})`;
}

export default function StoreDashboardPage() {
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
        <Spinner />
      </div>
    );
  }

  const applicants = getMockRecentApplicants();
  const interviews = getMockUpcomingInterviews();
  const newApplicantsCount = 12;
  const interviewsThisWeek = 5;
  const hiredThisMonth = 3;
  const unreadMessagesCount = 8;

  return (
    <div className="space-y-10">
      {/* 統計カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-start justify-between hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
          <div>
            <h3 className="text-sm text-(--text-sub) font-medium mb-2">
              新規応募
            </h3>
            <div className="text-[32px] font-bold text-(--text-main) leading-tight">
              {newApplicantsCount}
              <span className="text-base font-normal ml-1">件</span>
            </div>
            <div className="text-xs text-(--text-sub) mt-1">今週</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-(--primary-bg) text-(--primary) flex items-center justify-center">
            <UserPlus className="w-6 h-6" aria-hidden />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-start justify-between hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
          <div>
            <h3 className="text-sm text-(--text-sub) font-medium mb-2">
              面接予定
            </h3>
            <div className="text-[32px] font-bold text-(--text-main) leading-tight">
              {interviewsThisWeek}
              <span className="text-base font-normal ml-1">件</span>
            </div>
            <div className="text-xs text-(--text-sub) mt-1">今週</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-(--secondary-blue) text-(--secondary-blue-text) flex items-center justify-center">
            <CalendarDays className="w-6 h-6" aria-hidden />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-start justify-between hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
          <div>
            <h3 className="text-sm text-(--text-sub) font-medium mb-2">
              採用決定
            </h3>
            <div className="text-[32px] font-bold text-(--text-main) leading-tight">
              {hiredThisMonth}
              <span className="text-base font-normal ml-1">名</span>
            </div>
            <div className="text-xs text-(--text-sub) mt-1">今月</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-(--secondary-green) text-(--secondary-green-text) flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" aria-hidden />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-start justify-between hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all">
          <div>
            <h3 className="text-sm text-(--text-sub) font-medium mb-2">
              未読メッセージ
            </h3>
            <div className="text-[32px] font-bold text-(--text-main) leading-tight">
              {unreadMessagesCount}
              <span className="text-base font-normal ml-1">件</span>
            </div>
            <div className="text-xs text-orange-500 mt-1">要対応</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" aria-hidden />
          </div>
        </div>
      </div>

      {/* 2カラム: 最近の応募者 + 今週の面接予定 */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* 最近の応募者 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-(--text-main) flex items-center gap-2">
              <span className="block w-1 h-5 bg-(--primary) rounded-sm" />
              最近の応募者
            </h2>
            <Link
              href="/store/casts"
              className="text-sm text-(--secondary-blue-text) font-medium hover:underline"
            >
              すべて見る <ChevronRight className="inline w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 text-[13px] text-(--text-sub) font-medium border-b border-gray-200">
                    応募日時
                  </th>
                  <th className="text-left py-3 px-4 text-[13px] text-(--text-sub) font-medium border-b border-gray-200">
                    名前
                  </th>
                  <th className="text-left py-3 px-4 text-[13px] text-(--text-sub) font-medium border-b border-gray-200">
                    年齢
                  </th>
                  <th className="text-left py-3 px-4 text-[13px] text-(--text-sub) font-medium border-b border-gray-200">
                    診断結果
                  </th>
                  <th className="text-left py-3 px-4 text-[13px] text-(--text-sub) font-medium border-b border-gray-200">
                    ステータス
                  </th>
                  <th className="text-left py-3 px-4 text-[13px] text-(--text-sub) font-medium border-b border-gray-200">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-(--text-main) border-b border-gray-100">
                      {formatApplicantDate(row.appliedAt)}
                    </td>
                    <td className="py-4 px-4 text-sm text-(--text-main) border-b border-gray-100 max-w-[150px] truncate">
                      {row.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-(--text-main) border-b border-gray-100">
                      {row.age}歳
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-(--primary) border-b border-gray-100">
                      マッチ度 {row.matchRate}%
                    </td>
                    <td className="py-4 px-4 border-b border-gray-100">
                      <StatusBadge status={row.status} variant="applicant" size="md" />
                    </td>
                    <td className="py-4 px-4 border-b border-gray-100">
                      <button
                        type="button"
                        className="py-1.5 px-4 rounded-2xl text-xs font-medium border border-gray-200 bg-white text-(--text-main) hover:border-(--primary) hover:text-(--primary) hover:bg-(--primary-bg) transition-colors"
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* クイックアクション */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-(--text-main) flex items-center gap-2 mb-5">
              <span className="block w-1 h-5 bg-(--primary) rounded-sm" />
              クイックアクション
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <Link
                href="/store/profile"
                className="flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl text-white font-bold text-[15px] bg-(--primary) hover:opacity-90 hover:-translate-y-0.5 transition-all"
              >
                <FileEdit className="w-5 h-5" aria-hidden />
                求人情報を更新
              </Link>
              <Link
                href="/store/casts"
                className="flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl text-white font-bold text-[15px] bg-(--secondary-blue-text) hover:opacity-90 hover:-translate-y-0.5 transition-all"
              >
                <Search className="w-5 h-5" aria-hidden />
                応募者を検索
              </Link>
              <Link
                href="/store/matches"
                className="flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl font-bold text-[15px] text-(--text-main) bg-(--primary-bg) border border-(--primary-light) hover:opacity-90 hover:-translate-y-0.5 transition-all"
              >
                <Mail className="w-5 h-5" aria-hidden />
                メッセージを送信
              </Link>
            </div>
          </div>
        </div>

        {/* 今週の面接予定 */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_4px_15px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-(--text-main) flex items-center gap-2">
              <span className="block w-1 h-5 bg-(--primary) rounded-sm" />
              今週の面接予定
            </h2>
            <Link
              href="/store/interviews"
              className="text-sm text-(--secondary-blue-text) font-medium hover:underline"
            >
              カレンダー <Calendar className="inline w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col gap-4">
            {interviews.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-[13px] text-(--text-sub)">
                  <Clock className="w-4 h-4 shrink-0" aria-hidden />
                  {formatInterviewDate(item.date)} {item.time}
                  <span className="ml-auto shrink-0">
                    <StatusBadge status={item.status} variant="interview" size="md" />
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-base text-(--text-main)">
                    {item.candidateName} ({item.age})
                  </span>
                  <span className="text-(--primary) font-semibold text-sm">
                    {item.matchRate}%
                  </span>
                </div>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    className="flex-1 py-2 text-center rounded-[20px] text-[13px] font-medium bg-white text-(--primary) border border-(--primary) hover:opacity-90 transition-opacity"
                  >
                    詳細
                  </button>
                  <Link
                    href="/store/matches"
                    className="flex-1 py-2 text-center rounded-[20px] text-[13px] font-medium bg-(--primary) text-white hover:opacity-90 transition-opacity"
                  >
                    メッセージ
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
