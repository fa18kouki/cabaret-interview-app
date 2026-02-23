"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";
import { RankBadge } from "@/components/ui/rank-badge";
import { CastCard } from "@/components/store/cast-card";
import { trpc } from "@/lib/trpc";
import { useDemoSession } from "@/lib/demo-session";
import { getMockCastsForSearch } from "@/lib/mock-data";
import { Search, X, Wine } from "lucide-react";
import { AREAS } from "@/lib/constants";

const RANKS = [
  { value: "", label: "すべて" },
  { value: "S_RANK", label: "Sランク" },
  { value: "PLATINUM", label: "プラチナ" },
  { value: "GOLD", label: "ゴールド" },
  { value: "SILVER", label: "シルバー" },
  { value: "BRONZE", label: "ブロンズ" },
  { value: "UNRANKED", label: "ランクなし" },
];

const ALCOHOL_LABELS: Record<string, string> = {
  STRONG: "強い",
  MODERATE: "普通",
  WEAK: "弱い",
  NONE: "飲めない",
};

type CastRank = "UNRANKED" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "S_RANK";

type CastData = ReturnType<typeof getMockCastsForSearch>[number];

export default function CastsSearchPage() {
  const { session: demoSession } = useDemoSession();
  const isDemo = !!demoSession;

  const [filters, setFilters] = useState({
    area: "",
    minAge: undefined as number | undefined,
    maxAge: undefined as number | undefined,
    rank: "" as "" | CastRank,
  });
  const [selectedCast, setSelectedCast] = useState<string | null>(null);
  const [detailCast, setDetailCast] = useState<CastData | null>(null);
  const [offerMessage, setOfferMessage] = useState("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.store.searchCasts.useInfiniteQuery(
      {
        ...filters,
        rank: (filters.rank || undefined) as "UNRANKED" | "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | undefined,
        limit: 20,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !isDemo,
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
    if (isDemo) {
      alert("デモモードではオファー送信はできません");
      setSelectedCast(null);
      setOfferMessage("");
      return;
    }
    sendOffer.mutate({
      castId: selectedCast,
      message: offerMessage,
    });
  };

  const mockCasts = useMemo(() => {
    if (!isDemo) return [];
    const all = getMockCastsForSearch();
    return all.filter((cast) => {
      if (filters.area && !cast.desiredAreas.includes(filters.area)) return false;
      if (filters.minAge && cast.age < filters.minAge) return false;
      if (filters.maxAge && cast.age > filters.maxAge) return false;
      if (filters.rank && cast.rank !== filters.rank) return false;
      return true;
    });
  }, [isDemo, filters]);

  const casts = isDemo
    ? mockCasts
    : (data?.pages.flatMap((page) => page.casts) ?? []);

  const handleDetail = (castId: string) => {
    const cast = casts.find((c) => c.id === castId);
    if (cast) setDetailCast(cast as CastData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-(--text-main)">キャスト検索</h1>
        <p className="text-(--text-sub) mt-1">条件に合ったキャストを探してオファーを送りましょう</p>
      </div>

      {/* フィルター */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-(--text-main) mb-1">エリア</label>
            <select
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
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
            <label className="block text-sm font-medium text-(--text-main) mb-1">年齢</label>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
              />
              <span className="text-(--text-sub)">〜</span>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-main) mb-1">ランク</label>
            <select
              value={filters.rank}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  rank: e.target.value as typeof filters.rank,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
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

      {/* 結果 */}
      {!isDemo && isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      ) : casts.length === 0 ? (
        <EmptyState
          icon={Search}
          title="条件に合うキャストが見つかりませんでした"
          description="検索条件を変更してみてください"
        />
      ) : (
        <>
          <p className="text-sm text-(--text-sub)">
            {casts.length}件のキャストが見つかりました
          </p>

          <div className="grid lg:grid-cols-2 gap-4">
            {casts.map((cast) => (
              <CastCard
                key={cast.id}
                cast={cast}
                onDetail={handleDetail}
                onOffer={setSelectedCast}
              />
            ))}
          </div>

          {!isDemo && hasNextPage && (
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

      {/* 詳細モーダル */}
      {detailCast && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* ヘッダー画像 */}
            <div className="relative aspect-[16/9] bg-gray-200">
              {detailCast.photos[0] ? (
                <img
                  src={detailCast.photos[0]}
                  alt={detailCast.nickname}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Photo
                </div>
              )}
              <button
                onClick={() => setDetailCast(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* 名前・年齢・ランク */}
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-(--text-main)">
                  {detailCast.nickname}
                </h2>
                <span className="text-(--text-sub)">{detailCast.age}歳</span>
                <RankBadge rank={detailCast.rank} size="md" />
              </div>

              {/* 基本情報 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-(--bg-gray) rounded-lg p-3">
                  <p className="text-xs text-(--text-sub) mb-0.5">経験年数</p>
                  <p className="text-sm font-medium text-(--text-main)">
                    {detailCast.totalExperienceYears != null && detailCast.totalExperienceYears > 0
                      ? `${detailCast.totalExperienceYears}年`
                      : "未経験"}
                  </p>
                </div>
                <div className="bg-(--bg-gray) rounded-lg p-3">
                  <p className="text-xs text-(--text-sub) mb-0.5">前職時給</p>
                  <p className="text-sm font-medium text-(--text-main)">
                    {detailCast.previousHourlyRate != null
                      ? `¥${detailCast.previousHourlyRate.toLocaleString()}`
                      : "−"}
                  </p>
                </div>
                {detailCast.monthlySales != null && (
                  <div className="bg-(--bg-gray) rounded-lg p-3">
                    <p className="text-xs text-(--text-sub) mb-0.5">月間売上</p>
                    <p className="text-sm font-medium text-(--text-main)">
                      ¥{detailCast.monthlySales.toLocaleString()}
                    </p>
                  </div>
                )}
                {detailCast.monthlyNominations != null && (
                  <div className="bg-(--bg-gray) rounded-lg p-3">
                    <p className="text-xs text-(--text-sub) mb-0.5">月間指名数</p>
                    <p className="text-sm font-medium text-(--text-main)">
                      {detailCast.monthlyNominations}本
                    </p>
                  </div>
                )}
              </div>

              {/* お酒の強さ */}
              {detailCast.alcoholTolerance && (
                <div className="flex items-center gap-2">
                  <Wine className="w-4 h-4 text-(--text-sub)" />
                  <span className="text-sm text-(--text-sub)">お酒:</span>
                  <span className="text-sm text-(--text-main) font-medium">
                    {ALCOHOL_LABELS[detailCast.alcoholTolerance] ?? detailCast.alcoholTolerance}
                  </span>
                </div>
              )}

              {/* 希望エリア */}
              {detailCast.desiredAreas.length > 0 && (
                <div>
                  <p className="text-xs text-(--text-sub) mb-1.5">希望エリア</p>
                  <div className="flex flex-wrap gap-1.5">
                    {detailCast.desiredAreas.map((area) => (
                      <span
                        key={area}
                        className="px-2.5 py-1 bg-(--primary-bg) text-(--primary) text-xs rounded font-medium"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 自己紹介 */}
              {detailCast.description && (
                <div>
                  <p className="text-xs text-(--text-sub) mb-1.5">自己紹介</p>
                  <p className="text-sm text-(--text-main) leading-relaxed">
                    {detailCast.description}
                  </p>
                </div>
              )}

              {/* アクション */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setDetailCast(null)}
                  className="flex-1"
                >
                  閉じる
                </Button>
                <Button
                  onClick={() => {
                    setDetailCast(null);
                    setSelectedCast(detailCast.id);
                  }}
                  className="flex-1"
                >
                  オファーを送る
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* オファーモーダル */}
      {selectedCast && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-(--text-main) mb-4">
              オファーを送信
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-(--text-main) mb-1">
                メッセージ <span className="text-red-500">*</span>
              </label>
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="キャストへのメッセージを入力してください"
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--primary) resize-none"
              />
              <p className="text-sm text-(--text-sub) mt-1">
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
