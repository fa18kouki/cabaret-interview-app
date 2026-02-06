"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useDiagnosis } from "@/lib/diagnosis-provider";

// モック店舗データ
const MOCK_STORES = [
  {
    id: "store_1",
    name: "Club VENUS - 銀座本店",
    area: "銀座",
    storeType: "キャバクラ",
    tags: ["日払いOK", "未経験歓迎"],
    hourlyRate: 8000,
    backRate: 60,
    image: "/champagne-night-view.png",
    description: "銀座エリアNo.1の高級クラブ。未経験でも丁寧にサポートします。",
  },
  {
    id: "store_2",
    name: "Lounge Royal - 六本木",
    area: "六本木",
    storeType: "ラウンジ",
    tags: ["高時給", "駅チカ"],
    hourlyRate: 6000,
    backRate: 50,
    image: "/champagne-night-view.png",
    description: "六本木駅徒歩1分の好立地。落ち着いた雰囲気のラウンジです。",
  },
  {
    id: "store_3",
    name: "Night Garden - 新宿",
    area: "新宿",
    storeType: "キャバクラ",
    tags: ["週1OK", "送迎あり"],
    hourlyRate: 5000,
    backRate: 45,
    image: "/champagne-night-view.png",
    description: "新宿歌舞伎町の人気店。週1日からOKなので副業にもぴったり。",
  },
];

export default function DiagnosisOffersPage() {
  const router = useRouter();
  const { session } = useDiagnosis();
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  useEffect(() => {
    // セッションがない場合は診断ページへリダイレクト
    if (!session?.result) {
      router.push("/diagnosis");
      return;
    }

    // アニメーション開始
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, [session, router]);

  const handleAcceptOffer = (storeId: string) => {
    setSelectedStoreId(storeId);
    // LINE登録ページへ遷移（診断IDとオファーIDを渡す）
    router.push(`/login?diagnosisId=${session?.id}&offerId=${storeId}`);
  };

  if (!session?.result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            LUMINA
          </Link>
          <span className="text-xs text-gray-400">マッチング店舗</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* 結果サマリー */}
        <div
          className={`bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-2xl p-4 border border-gray-800 transition-all duration-500 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">あなたの推定時給</p>
              <p className="text-2xl font-bold text-white">
                {session.result.estimatedHourlyRate.toLocaleString()}円〜
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">ランク</p>
              <p className="text-2xl font-bold text-cyan-400">
                {session.result.estimatedRank}
              </p>
            </div>
          </div>
        </div>

        {/* セクションヘッダー */}
        <div
          className={`transition-all duration-500 delay-100 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h2 className="text-white font-semibold text-lg">
            あなたにおすすめの店舗
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            診断結果をもとに、相性の良い店舗をピックアップしました
          </p>
        </div>

        {/* 店舗カード一覧 */}
        <div className="space-y-4">
          {MOCK_STORES.map((store, index) => (
            <div
              key={store.id}
              className={`bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 transition-all duration-500 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              {/* 店舗画像 */}
              <div className="relative h-40">
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  className="object-cover"
                />
                {/* タグ */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {store.storeType}
                  </span>
                  {store.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-black/70 text-white text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 店舗情報 */}
              <div className="p-4">
                <h3 className="text-white font-semibold text-lg">
                  {store.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  📍 {store.area}
                </p>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                  {store.description}
                </p>

                {/* 時給・バック率 */}
                <div className="flex gap-4 mt-4">
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-gray-400 text-xs">時給保証</p>
                    <p className="text-cyan-400 font-bold text-lg">
                      {store.hourlyRate.toLocaleString()}円〜
                    </p>
                  </div>
                  <div className="flex-1 bg-gray-800 rounded-xl p-3 text-center">
                    <p className="text-gray-400 text-xs">バック率</p>
                    <p className="text-pink-400 font-bold text-lg">
                      最大{store.backRate}%
                    </p>
                  </div>
                </div>

                {/* オファー受諾ボタン */}
                <button
                  onClick={() => handleAcceptOffer(store.id)}
                  disabled={selectedStoreId !== null}
                  className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-3 px-6 rounded-xl text-center hover:from-cyan-600 hover:to-cyan-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedStoreId === store.id
                    ? "処理中..."
                    : "このお店に応募する"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 固定フッター */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-8 pb-4 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">
                  応募にはLINE登録が必要です
                </p>
                <p className="text-gray-400 text-xs">
                  登録後、お店との連絡が可能になります
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
