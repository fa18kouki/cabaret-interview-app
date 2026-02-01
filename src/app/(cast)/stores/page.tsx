"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";
import { getMockStoresForSearch } from "@/lib/mock-data";
import { TagFilter } from "@/components/cast/TagFilter";
import { StoreCard } from "@/components/cast/StoreCard";

// ローカル画像パス
const STORE_IMAGES = [
  "/service-scene-05.png",
  "/service-scene-06.png",
  "/service-scene-08.png",
  "/service-scene-09.png",
];

const FILTER_TAGS = [
  "すべて",
  "未経験歓迎",
  "日払いOK",
  "ドレス貸与",
  "送りあり",
  "高時給",
  "ノルマなし",
];

const STORE_TAGS: Record<string, string[]> = {
  "Club Elegant": ["未経験OK", "日払い"],
  "Lounge Royal": ["高時給", "送り有"],
  "Bar Luxe": ["アットホーム", "ノルマなし"],
  "Night Garden": ["自由出勤", "短期OK"],
};

export default function StoresPage() {
  const router = useRouter();
  const { session } = useDemoSession();
  const [selectedTag, setSelectedTag] = useState("すべて");
  const [searchQuery, setSearchQuery] = useState("");

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
  const allStores = getMockStoresForSearch();

  // フィルタリング
  const filteredStores = allStores.filter((store) => {
    const matchesSearch =
      searchQuery === "" ||
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.area.toLowerCase().includes(searchQuery.toLowerCase());

    // タグでフィルタリング（デモ用に簡易実装）
    const matchesTag =
      selectedTag === "すべて" ||
      (selectedTag === "未経験歓迎" &&
        STORE_TAGS[store.name]?.includes("未経験OK")) ||
      (selectedTag === "日払いOK" &&
        STORE_TAGS[store.name]?.includes("日払い")) ||
      (selectedTag === "高時給" && store.hourlyRateMin >= 4000) ||
      (selectedTag === "送りあり" &&
        STORE_TAGS[store.name]?.includes("送り有")) ||
      (selectedTag === "ノルマなし" &&
        STORE_TAGS[store.name]?.includes("ノルマなし"));

    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-4">
      {/* 検索ヘッダー */}
      <div className="sticky top-0 bg-(--bg-gray) pt-2 pb-3 -mx-4 px-4 z-10">
        {/* 検索バー */}
        <div className="flex gap-2.5 mb-4">
          <div className="flex-1 bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-2.5">
            <Search className="w-5 h-5 text-(--text-sub)" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="エリア、キーワードで検索..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-(--text-sub)"
            />
          </div>
          <button className="w-12 h-12 bg-(--primary-bg) rounded-xl flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5 text-(--primary)" />
          </button>
        </div>

        {/* タグフィルター */}
        <TagFilter
          tags={FILTER_TAGS}
          selectedTag={selectedTag}
          onSelectTag={setSelectedTag}
        />
      </div>

      {/* 店舗一覧 */}
      <div className="space-y-4 pb-4">
        {filteredStores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-(--text-sub)">該当する店舗が見つかりませんでした</p>
          </div>
        ) : (
          filteredStores.map((store, index) => (
            <StoreCard
              key={store.id}
              id={store.id}
              name={store.name}
              area={`${store.area} / 徒歩${Math.floor(Math.random() * 5) + 3}分`}
              salary={`時給 ${store.hourlyRateMin.toLocaleString()}円〜`}
              imageUrl={STORE_IMAGES[index % STORE_IMAGES.length]}
              tags={STORE_TAGS[store.name] || ["未経験OK"]}
              variant="horizontal"
            />
          ))
        )}
      </div>
    </div>
  );
}
