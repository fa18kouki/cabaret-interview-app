"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDiagnosis } from "@/lib/diagnosis-provider";
import type { CastRank } from "@/lib/diagnosis-session";

// ランクに応じた色とラベル
const RANK_CONFIG: Record<CastRank, { color: string; bgColor: string; label: string; description: string }> = {
  S: {
    color: "text-yellow-400",
    bgColor: "from-yellow-500/20 to-yellow-600/10",
    label: "Sランク",
    description: "トップクラスの実力！高級店での活躍が期待できます",
  },
  A: {
    color: "text-cyan-400",
    bgColor: "from-cyan-500/20 to-cyan-600/10",
    label: "Aランク",
    description: "高い実力があります！人気店で即戦力として活躍できます",
  },
  B: {
    color: "text-pink-400",
    bgColor: "from-pink-500/20 to-pink-600/10",
    label: "Bランク",
    description: "十分な実力があります！多くの店舗からオファーが届くでしょう",
  },
  C: {
    color: "text-gray-400",
    bgColor: "from-gray-500/20 to-gray-600/10",
    label: "Cランク",
    description: "これからの成長に期待！未経験歓迎の店舗をご紹介します",
  },
};

export default function DiagnosisResultPage() {
  const router = useRouter();
  const { session } = useDiagnosis();
  const [showAnimation, setShowAnimation] = useState(false);

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

  if (!session?.result) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const { result } = session;
  const rankConfig = RANK_CONFIG[result.estimatedRank];

  return (
    <div className="min-h-screen bg-black">
      {/* ヘッダー */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-white font-bold text-lg">
            LUMINA
          </Link>
          <span className="text-xs text-gray-400">診断結果</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* ランク表示 */}
        <div
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${rankConfig.bgColor} border border-gray-800 p-6 text-center transition-all duration-700 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%)]" />

          <p className="text-gray-400 text-sm mb-2">あなたの推定ランク</p>
          <div
            className={`text-7xl font-bold ${rankConfig.color} mb-2 drop-shadow-lg`}
          >
            {result.estimatedRank}
          </div>
          <p className={`text-lg font-semibold ${rankConfig.color}`}>
            {rankConfig.label}
          </p>
          <p className="text-gray-400 text-sm mt-2">{rankConfig.description}</p>
        </div>

        {/* 推定時給 */}
        <div
          className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 transition-all duration-700 delay-100 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="text-gray-400 text-sm mb-1">推定時給</p>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">
              {result.estimatedHourlyRate.toLocaleString()}
            </span>
            <span className="text-gray-400 text-lg">円〜</span>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-1">推定月収（週3日勤務の場合）</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-cyan-400">
                {result.estimatedMonthlyIncome.toLocaleString()}
              </span>
              <span className="text-gray-400">円</span>
            </div>
          </div>
        </div>

        {/* 分析結果 */}
        <div
          className={`bg-gray-900 rounded-2xl p-6 border border-gray-800 transition-all duration-700 delay-200 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h3 className="text-white font-semibold mb-4">AI分析結果</h3>

          {/* 強み */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">あなたの強み</p>
            <div className="flex flex-wrap gap-2">
              {result.analysis.strengths.map((strength, index) => (
                <span
                  key={index}
                  className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-sm"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>

          {/* 改善点 */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">伸びしろ</p>
            <div className="flex flex-wrap gap-2">
              {result.analysis.improvements.map((improvement, index) => (
                <span
                  key={index}
                  className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm"
                >
                  {improvement}
                </span>
              ))}
            </div>
          </div>

          {/* おすすめ */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              {result.analysis.recommendation}
            </p>
          </div>
        </div>

        {/* マッチング店舗数 */}
        <div
          className={`bg-gradient-to-r from-cyan-500/20 to-pink-500/20 rounded-2xl p-6 border border-gray-800 text-center transition-all duration-700 delay-300 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="text-gray-300 mb-2">あなたにマッチする店舗</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl font-bold text-white">
              {result.matchingStoreIds.length}
            </span>
            <span className="text-gray-400 text-lg">件</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            オファーを確認して、気になるお店に応募しましょう
          </p>
        </div>

        {/* CTA */}
        <div
          className={`space-y-3 transition-all duration-700 delay-400 ${showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Link
            href="/diagnosis/offers"
            className="block w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-4 px-6 rounded-xl text-center hover:from-cyan-600 hover:to-cyan-700 transition-all active:scale-[0.98]"
          >
            オファーを確認する
          </Link>
          <Link
            href="/"
            className="block w-full text-gray-400 text-sm text-center py-2 hover:text-gray-300 transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </main>
    </div>
  );
}
