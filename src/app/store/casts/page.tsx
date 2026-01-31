"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const AREAS = [
  "新宿",
  "歌舞伎町",
  "渋谷",
  "六本木",
  "銀座",
  "池袋",
  "横浜",
  "名古屋",
  "大阪",
  "福岡",
];

const RANKS = [
  { value: "", label: "すべて" },
  { value: "PLATINUM", label: "プラチナ" },
  { value: "GOLD", label: "ゴールド" },
  { value: "SILVER", label: "シルバー" },
  { value: "BRONZE", label: "ブロンズ" },
  { value: "UNRANKED", label: "ランクなし" },
];

export default function CastsSearchPage() {
  const [filters, setFilters] = useState({
    area: "",
    minAge: undefined as number | undefined,
    maxAge: undefined as number | undefined,
    rank: "" as "" | "UNRANKED" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM",
  });
  const [selectedCast, setSelectedCast] = useState<string | null>(null);
  const [offerMessage, setOfferMessage] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.store.searchCasts.useInfiniteQuery(
      {
        ...filters,
        rank: filters.rank || undefined,
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const sendOffer = trpc.store.sendOffer.useMutation({
    onSuccess: () => {
      alert("オファーを送信しました");
      setSelectedCast(null);
      setOfferMessage("");
    },
    onError: (error) => {
      alert(`エラー: ${error.message}`);
    },
  });

  const handleSendOffer = () => {
    if (!selectedCast || !offerMessage.trim()) return;
    sendOffer.mutate({
      castId: selectedCast,
      message: offerMessage,
    });
  };

  const casts = data?.pages.flatMap((page) => page.casts) ?? [];

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
      UNRANKED: "ランクなし",
    };
    return (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[rank] ?? styles.UNRANKED}`}>
        {labels[rank] ?? "ランクなし"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">キャスト検索</h1>
        <p className="text-gray-600 mt-1">条件に合ったキャストを探してオファーを送りましょう</p>
      </div>

      {/* フィルター */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">エリア</label>
            <select
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">すべて</option>
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={filters.minAge ?? ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minAge: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="18"
                min={18}
                max={99}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">〜</span>
              <input
                type="number"
                value={filters.maxAge ?? ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxAge: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="99"
                min={18}
                max={99}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ランク</label>
            <select
              value={filters.rank}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  rank: e.target.value as typeof filters.rank,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {RANKS.map((rank) => (
                <option key={rank.value} value={rank.value}>
                  {rank.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 検索結果 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : casts.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-gray-600">条件に合うキャストが見つかりませんでした</p>
          <p className="text-sm text-gray-500 mt-1">検索条件を変更してみてください</p>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {casts.map((cast) => (
              <Card key={cast.id} className="overflow-hidden">
                <div className="aspect-[3/4] bg-gray-200 relative">
                  {cast.photos?.[0] ? (
                    <img
                      src={cast.photos[0]}
                      alt={cast.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    {getRankBadge(cast.rank)}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{cast.nickname}</h3>
                    <span className="text-sm text-gray-500">{cast.age}歳</span>
                  </div>

                  {cast.desiredAreas && cast.desiredAreas.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {cast.desiredAreas.slice(0, 3).map((area) => (
                        <span
                          key={area}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {area}
                        </span>
                      ))}
                      {cast.desiredAreas.length > 3 && (
                        <span className="px-2 py-0.5 text-gray-400 text-xs">
                          +{cast.desiredAreas.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedCast(cast.id)}
                    className="w-full"
                    size="sm"
                  >
                    オファーを送る
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                もっと見る
              </Button>
            </div>
          )}
        </>
      )}

      {/* オファーモーダル */}
      {selectedCast && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              オファーを送信
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メッセージ <span className="text-red-500">*</span>
              </label>
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="キャストへのメッセージを入力してください"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-sm text-gray-500 mt-1">
                店舗の魅力や希望条件などを伝えましょう
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCast(null);
                  setOfferMessage("");
                }}
                className="flex-1"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleSendOffer}
                isLoading={sendOffer.isPending}
                disabled={!offerMessage.trim()}
                className="flex-1"
              >
                送信する
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
