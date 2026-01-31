"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

const AREAS = [
  "新宿",
  "歌舞伎町",
  "渋谷",
  "六本木",
  "銀座",
  "池袋",
  "上野",
  "錦糸町",
  "横浜",
  "川崎",
  "大宮",
  "千葉",
  "船橋",
  "名古屋",
  "栄",
  "大阪",
  "梅田",
  "難波",
  "京都",
  "神戸",
  "福岡",
  "中洲",
  "札幌",
  "すすきの",
  "仙台",
  "広島",
];

const BENEFITS = [
  "日払いOK",
  "週払いOK",
  "送り迎えあり",
  "ヘアメイク完備",
  "衣装貸出あり",
  "ノルマなし",
  "罰金なし",
  "終電上がりOK",
  "週1日からOK",
  "短期OK",
  "体験入店歓迎",
  "未経験歓迎",
  "経験者優遇",
  "友達紹介制度",
  "寮完備",
  "託児所補助",
];

export default function StoreProfilePage() {
  const { data: profile, isLoading } = trpc.store.getProfile.useQuery();
  const utils = trpc.useUtils();

  const [formData, setFormData] = useState({
    name: "",
    area: "",
    address: "",
    description: "",
    businessHours: "",
    salarySystem: "",
    benefits: [] as string[],
  });

  const upsertProfile = trpc.store.upsertProfile.useMutation({
    onSuccess: () => {
      utils.store.getProfile.invalidate();
      alert("プロフィールを保存しました");
    },
    onError: (error) => {
      alert(`エラーが発生しました: ${error.message}`);
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name ?? "",
        area: profile.area ?? "",
        address: profile.address ?? "",
        description: profile.description ?? "",
        businessHours: profile.businessHours ?? "",
        salarySystem: profile.salarySystem ?? "",
        benefits: profile.benefits ?? [],
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertProfile.mutate(formData);
  };

  const toggleBenefit = (benefit: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">店舗情報</h1>
        <p className="text-gray-600 mt-1">
          店舗の基本情報と求人条件を設定します
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                店舗名 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="例: クラブ エレガンス"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                エリア <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">選択してください</option>
                {AREAS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                住所 <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="例: 東京都新宿区歌舞伎町1-1-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                営業時間
              </label>
              <Input
                type="text"
                value={formData.businessHours}
                onChange={(e) => setFormData({ ...formData, businessHours: e.target.value })}
                placeholder="例: 20:00〜LAST"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                店舗紹介
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="店舗の特徴やアピールポイントを入力してください"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </Card>

        {/* 給与体系 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">給与体系</h2>
          <div>
            <textarea
              value={formData.salarySystem}
              onChange={(e) => setFormData({ ...formData, salarySystem: e.target.value })}
              placeholder="例: 時給4,000円〜10,000円（経験・能力による）&#10;バック: ドリンクバック500円/杯、同伴バック3,000円&#10;日給保証: 20,000円〜（体験入店時）"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              時給、バック、保証など給与に関する情報を入力してください
            </p>
          </div>
        </Card>

        {/* 待遇・福利厚生 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">待遇・福利厚生</h2>
          <div className="flex flex-wrap gap-2">
            {BENEFITS.map((benefit) => (
              <button
                key={benefit}
                type="button"
                onClick={() => toggleBenefit(benefit)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  formData.benefits.includes(benefit)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {benefit}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            該当する待遇をタップして選択してください
          </p>
        </Card>

        {/* 保存ボタン */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            isLoading={upsertProfile.isPending}
            className="px-8"
          >
            保存する
          </Button>
        </div>
      </form>
    </div>
  );
}
