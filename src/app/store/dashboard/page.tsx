"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

export default function StoreDashboardPage() {
  const { data: profile, isLoading: profileLoading } = trpc.store.getProfile.useQuery();
  const { data: offersData, isLoading: offersLoading } = trpc.store.getSentOffers.useQuery({
    limit: 5,
  });
  const { data: matchesData, isLoading: matchesLoading } = trpc.match.getMatches.useQuery({
    status: "ACCEPTED",
    limit: 5,
  });

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">店舗情報を登録しましょう</h1>
        <p className="text-gray-600 mb-6">
          キャストを検索してオファーを送るには、まず店舗情報の登録が必要です。
        </p>
        <Link
          href="/store/profile"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          店舗情報を登録する
        </Link>
      </div>
    );
  }

  const pendingOffers = offersData?.offers?.filter(o => o.status === "PENDING").length ?? 0;
  const acceptedMatches = matchesData?.matches?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-600 mt-1">
          {profile.name}さん、おかえりなさい
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingOffers}</p>
              <p className="text-xs text-gray-500">待機中オファー</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{acceptedMatches}</p>
              <p className="text-xs text-gray-500">マッチング成立</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">今週の面接</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-xs text-gray-500">採用済み</p>
            </div>
          </div>
        </Card>
      </div>

      {/* クイックアクション */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/store/casts">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">キャストを探す</h3>
                <p className="text-sm text-gray-600">条件に合ったキャストを検索</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/store/offers">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">オファー管理</h3>
                <p className="text-sm text-gray-600">送信したオファーを確認</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* 最近のマッチング */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最近のマッチング</h2>
          <Link href="/store/matches" className="text-sm text-blue-600 hover:underline">
            すべて見る
          </Link>
        </div>

        {matchesLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : matchesData?.matches?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>まだマッチングがありません</p>
            <p className="text-sm mt-1">キャストを検索してオファーを送りましょう</p>
          </div>
        ) : (
          <div className="space-y-3">
            {matchesData?.matches?.map((match) => (
              <Link
                key={match.id}
                href={`/store/chat/${match.id}`}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {match.cast?.photos?.[0] ? (
                    <img
                      src={match.cast.photos[0]}
                      alt={match.cast.nickname}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {match.cast?.nickname ?? "キャスト"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {match.cast?.age}歳
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
