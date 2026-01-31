"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const AREAS = [
  "すべて", "六本木", "銀座", "歌舞伎町", "渋谷", "新宿",
  "池袋", "上野", "錦糸町", "横浜", "大阪",
];

export default function StoresPage() {
  const [selectedArea, setSelectedArea] = useState<string>("すべて");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.cast.searchStores.useInfiniteQuery(
      {
        area: selectedArea === "すべて" ? undefined : selectedArea,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const stores = data?.pages.flatMap((page) => page.stores) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">店舗を探す</h1>

      {/* エリアフィルター */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedArea === area
                  ? "bg-pink-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* 店舗一覧 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
        </div>
      ) : stores.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">該当する店舗が見つかりませんでした</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {stores.map((store) => (
            <Card key={store.id} className="overflow-hidden">
              <div className="md:flex">
                {/* 店舗画像 */}
                <div className="md:w-48 h-40 md:h-auto bg-gray-200 flex items-center justify-center">
                  {store.photos?.[0] ? (
                    <img
                      src={store.photos[0]}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                    </svg>
                  )}
                </div>

                {/* 店舗情報 */}
                <CardContent className="flex-1 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{store.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {store.area}
                      </p>
                    </div>
                    {store.isVerified && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        認証済
                      </span>
                    )}
                  </div>

                  {store.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {store.description}
                    </p>
                  )}

                  {store.salarySystem && (
                    <p className="text-sm text-pink-600 font-medium mt-2">
                      {store.salarySystem}
                    </p>
                  )}

                  {store.benefits && store.benefits.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {store.benefits.slice(0, 3).map((benefit, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                        >
                          {benefit}
                        </span>
                      ))}
                      {store.benefits.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{store.benefits.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </div>
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
