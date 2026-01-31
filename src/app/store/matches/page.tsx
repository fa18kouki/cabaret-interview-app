"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const STATUS_TABS = [
  { value: "ACCEPTED" as const, label: "マッチング成立" },
  { value: "PENDING" as const, label: "承諾待ち" },
  { value: "REJECTED" as const, label: "辞退済み" },
];

export default function StoreMatchesPage() {
  const [status, setStatus] = useState<"PENDING" | "ACCEPTED" | "REJECTED">("ACCEPTED");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.match.getMatches.useInfiniteQuery(
      { status, limit: 20 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const matches = data?.pages.flatMap((page) => page.matches) ?? [];

  const getRankBadge = (rank: string) => {
    const styles: Record<string, string> = {
      PLATINUM: "bg-purple-100 text-purple-700",
      GOLD: "bg-yellow-100 text-yellow-700",
      SILVER: "bg-gray-200 text-gray-700",
      BRONZE: "bg-orange-100 text-orange-700",
      UNRANKED: "bg-gray-100 text-gray-500",
    };
    const labels: Record<string, string> = {
      PLATINUM: "プラチナ",
      GOLD: "ゴールド",
      SILVER: "シルバー",
      BRONZE: "ブロンズ",
      UNRANKED: "-",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[rank] ?? styles.UNRANKED}`}>
        {labels[rank] ?? "-"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">マッチング</h1>
        <p className="text-gray-600 mt-1">マッチングしたキャストとやりとりできます</p>
      </div>

      {/* ステータスタブ */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              status === tab.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* マッチング一覧 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-gray-600">
            {status === "ACCEPTED" && "マッチングしたキャストがいません"}
            {status === "PENDING" && "承諾待ちのマッチングがありません"}
            {status === "REJECTED" && "辞退されたマッチングがありません"}
          </p>
          {status === "ACCEPTED" && (
            <Link href="/store/casts" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
              キャストを検索する →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <Card key={match.id} className="p-4">
              <div className="flex gap-4">
                {/* キャスト写真 */}
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                  {match.cast?.photos?.[0] ? (
                    <img
                      src={match.cast.photos[0]}
                      alt={match.cast.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* キャスト情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {match.cast?.nickname ?? "キャスト"}
                    </h3>
                    {match.cast?.rank && getRankBadge(match.cast.rank)}
                  </div>
                  <p className="text-sm text-gray-500">{match.cast?.age}歳</p>
                  <p className="text-xs text-gray-400 mt-1">
                    マッチング日: {new Date(match.createdAt).toLocaleDateString("ja-JP")}
                  </p>
                </div>

                {/* アクション */}
                <div className="flex items-center">
                  {status === "ACCEPTED" && (
                    <Link href={`/store/chat/${match.id}`}>
                      <Button size="sm">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        チャット
                      </Button>
                    </Link>
                  )}
                  {status === "PENDING" && (
                    <span className="text-sm text-yellow-600">返答待ち</span>
                  )}
                  {status === "REJECTED" && (
                    <span className="text-sm text-gray-400">辞退済み</span>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                もっと見る
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
