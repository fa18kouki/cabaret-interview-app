"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bot, Store, MessageSquare, UserCircle } from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";
import { createMockCastProfile, getMockStoresForSearch } from "@/lib/mock-data";
import { QuickActionCard } from "@/components/cast/QuickActionCard";
import { StoreCard } from "@/components/cast/StoreCard";

// ローカル画像パス
const STORE_IMAGES = [
  "/service-scene-01.png",
  "/service-scene-02.png",
  "/service-scene-03.png",
  "/service-scene-04.png",
];

const AVATAR_IMAGE = "/gold-dress-back.png";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-(--primary)" />
      </div>
    );
  }

  // デモモード: モックデータを使用
  const profile = createMockCastProfile(session.user.id);
  const recommendedStores = getMockStoresForSearch().slice(0, 4);

  return (
    <div className="space-y-6 pb-4">
      {/* ヘッダー */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-sm text-(--text-sub)">今日も頑張ろう！</p>
          <h1 className="text-2xl font-bold text-(--text-main)">
            こんにちは、{profile.nickname}さん
          </h1>
        </div>
        <div className="relative">
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-(--primary)">
            <Image
              src={AVATAR_IMAGE}
              alt="プロフィール"
              width={44}
              height={44}
              className="object-cover"
            />
          </div>
          {/* オンラインインジケーター */}
          <div className="absolute top-0 right-0 w-3 h-3 bg-(--primary) rounded-full border-2 border-white" />
        </div>
      </div>

      {/* クイックアクション */}
      <div className="grid grid-cols-2 gap-4">
        <QuickActionCard
          href="/ai-diagnosis"
          label="AI診断"
          icon={Bot}
          variant="pink"
        />
        <QuickActionCard
          href="/stores"
          label="店舗検索"
          icon={Store}
          variant="blue"
        />
        <QuickActionCard
          href="/matches"
          label="メッセージ"
          icon={MessageSquare}
          variant="green"
        />
        <QuickActionCard
          href="/profile"
          label="マイページ"
          icon={UserCircle}
          variant="purple"
        />
      </div>

      {/* おすすめ店舗 */}
      <section>
        <h2 className="text-lg font-bold text-(--text-main) mb-4 px-1">
          あなたにおすすめ
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {recommendedStores.map((store, index) => (
            <StoreCard
              key={store.id}
              id={store.id}
              name={store.name}
              area={`${store.area} 徒歩${Math.floor(Math.random() * 5) + 3}分`}
              salary={`時給 ${store.hourlyRateMin.toLocaleString()}円〜`}
              imageUrl={STORE_IMAGES[index % STORE_IMAGES.length]}
              variant="vertical"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
