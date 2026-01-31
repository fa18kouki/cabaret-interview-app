"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDemoSession } from "@/lib/demo-session";
import {
  createMockCastProfile,
  createMockOffersForCast,
  createMockMatchesForCast,
} from "@/lib/mock-data";

export default function CastDashboard() {
  const router = useRouter();
  const { session } = useDemoSession();

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "CAST") {
      router.push("/store/dashboard");
    }
  }, [session, router]);

  if (!session || session.user.role !== "CAST") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
      </div>
    );
  }

  // デモモード: モックデータを使用
  const profile = createMockCastProfile(session.user.id);
  const pendingOffers = createMockOffersForCast(session.user.id).filter(
    (o) => o.status === "PENDING"
  );
  const activeMatches = createMockMatchesForCast(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          こんにちは、{profile.nickname}さん
        </h1>
        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
          デモモード
        </span>
      </div>

      {/* ステータスカード */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-pink-600">
              {pendingOffers.length}
            </p>
            <p className="text-sm text-gray-600">新着オファー</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {activeMatches.length}
            </p>
            <p className="text-sm text-gray-600">マッチング中</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-green-600">未</p>
            <p className="text-sm text-gray-600">本人確認</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 text-center">
            <p className="text-3xl font-bold text-purple-600">N</p>
            <p className="text-sm text-gray-600">ランク</p>
          </CardContent>
        </Card>
      </div>

      {/* 新着オファー */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">新着オファー</h2>
            <Link
              href="/offers"
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              すべて見る →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {pendingOffers.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              新着オファーはありません
            </p>
          ) : (
            <ul className="space-y-3">
              {pendingOffers.map((offer) => (
                <li
                  key={offer.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {offer.store.name}
                    </p>
                    <p className="text-sm text-gray-500">{offer.store.area}</p>
                  </div>
                  <Link
                    href="/offers"
                    className="text-sm text-pink-600 hover:text-pink-700"
                  >
                    詳細
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* マッチング中 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">マッチング中の店舗</h2>
            <Link
              href="/matches"
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              すべて見る →
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {activeMatches.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              マッチング中の店舗はありません
            </p>
          ) : (
            <ul className="space-y-3">
              {activeMatches.map((match) => (
                <li
                  key={match.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {match.store.name}
                    </p>
                    <p className="text-sm text-gray-500">{match.store.area}</p>
                  </div>
                  <Link
                    href={`/chat/${match.id}`}
                    className="px-3 py-1.5 bg-pink-100 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-200 transition-colors"
                  >
                    チャット
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
