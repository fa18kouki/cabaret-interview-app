"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";

const STATUS_TABS: { value: OfferStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "すべて" },
  { value: "PENDING", label: "未回答" },
  { value: "ACCEPTED", label: "承諾済" },
  { value: "REJECTED", label: "辞退済" },
];

export default function OffersPage() {
  const [statusFilter, setStatusFilter] = useState<OfferStatus | "ALL">("ALL");
  const utils = trpc.useUtils();

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.cast.getOffers.useInfiniteQuery(
      {
        status: statusFilter === "ALL" ? undefined : statusFilter,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const respondToOffer = trpc.cast.respondToOffer.useMutation({
    onSuccess: () => {
      utils.cast.getOffers.invalidate();
      utils.match.getMatches.invalidate();
    },
  });

  const offers = data?.pages.flatMap((page) => page.offers) ?? [];

  const handleRespond = (offerId: string, accept: boolean) => {
    if (confirm(accept ? "このオファーを承諾しますか？" : "このオファーを辞退しますか？")) {
      respondToOffer.mutate({ offerId, accept });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">オファー</h1>

      {/* ステータスタブ */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? "bg-pink-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* オファー一覧 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
        </div>
      ) : offers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500">オファーはありません</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  {/* 店舗画像 */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {offer.store.photos?.[0] ? (
                      <img
                        src={offer.store.photos[0]}
                        alt={offer.store.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                      </svg>
                    )}
                  </div>

                  {/* オファー情報 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{offer.store.name}</h3>
                        <p className="text-sm text-gray-500">{offer.store.area}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          offer.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : offer.status === "ACCEPTED"
                            ? "bg-green-100 text-green-700"
                            : offer.status === "REJECTED"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {offer.status === "PENDING"
                          ? "未回答"
                          : offer.status === "ACCEPTED"
                          ? "承諾済"
                          : offer.status === "REJECTED"
                          ? "辞退済"
                          : "期限切れ"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {offer.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(offer.createdAt).toLocaleDateString("ja-JP")}
                    </p>

                    {offer.status === "PENDING" && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleRespond(offer.id, true)}
                          isLoading={respondToOffer.isPending}
                        >
                          承諾する
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRespond(offer.id, false)}
                          isLoading={respondToOffer.isPending}
                        >
                          辞退する
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {hasNextPage && (
            <div className="text-center pt-4">
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
