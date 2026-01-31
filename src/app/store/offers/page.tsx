"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const STATUS_TABS = [
  { value: undefined, label: "すべて" },
  { value: "PENDING" as const, label: "待機中" },
  { value: "ACCEPTED" as const, label: "承諾" },
  { value: "REJECTED" as const, label: "辞退" },
  { value: "EXPIRED" as const, label: "期限切れ" },
];

export default function StoreOffersPage() {
  const [status, setStatus] = useState<"PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | undefined>(
    undefined
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.store.getSentOffers.useInfiniteQuery(
      { status, limit: 20 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    );

  const offers = data?.pages.flatMap((page) => page.offers) ?? [];

  const getStatusBadge = (offerStatus: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-700",
      ACCEPTED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700",
      EXPIRED: "bg-gray-100 text-gray-500",
    };
    const labels: Record<string, string> = {
      PENDING: "待機中",
      ACCEPTED: "承諾",
      REJECTED: "辞退",
      EXPIRED: "期限切れ",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[offerStatus]}`}>
        {labels[offerStatus]}
      </span>
    );
  };

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
        <h1 className="text-2xl font-bold text-gray-900">オファー管理</h1>
        <p className="text-gray-600 mt-1">送信したオファーの状況を確認できます</p>
      </div>

      {/* ステータスタブ */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
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

      {/* オファー一覧 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-600">オファーがありません</p>
          <p className="text-sm text-gray-500 mt-1">キャストを検索してオファーを送りましょう</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <Card key={offer.id} className="p-4">
              <div className="flex gap-4">
                {/* キャスト写真 */}
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  {offer.cast?.photos?.[0] ? (
                    <img
                      src={offer.cast.photos[0]}
                      alt={offer.cast.nickname}
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

                {/* オファー情報 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {offer.cast?.nickname ?? "キャスト"}
                        </h3>
                        {offer.cast?.rank && getRankBadge(offer.cast.rank)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {offer.cast?.age}歳
                      </p>
                    </div>
                    {getStatusBadge(offer.status)}
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 line-clamp-2">{offer.message}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      送信日: {new Date(offer.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                    {offer.status === "PENDING" && (
                      <p className="text-xs text-yellow-600">
                        有効期限: {new Date(offer.expiresAt).toLocaleDateString("ja-JP")}
                      </p>
                    )}
                  </div>
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
