"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, MapPin, Clock, FileText, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";
import { AREAS, BUSINESS_TYPES } from "@/lib/constants";

const STEPS = [
  { label: "基本情報", icon: Building2 },
  { label: "詳細情報", icon: FileText },
  { label: "登録完了", icon: Check },
];

export default function StoreRegisterPage() {
  const router = useRouter();
  const { login } = useDemoSession();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    storeName: "",
    area: "",
    businessType: "",
    address: "",
    businessHours: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.storeName.trim()) newErrors.storeName = "店舗名を入力してください";
    if (!formData.area) newErrors.area = "エリアを選択してください";
    if (!formData.businessType) newErrors.businessType = "業種を選択してください";
    if (!formData.address.trim()) newErrors.address = "住所を入力してください";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleRegister = () => {
    login("STORE");
    setStep(2);
  };

  const handleGoToDashboard = () => {
    router.push("/store/dashboard");
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="font-bold text-lg text-(--text-main)">LUMINA</span>
            <span className="text-xs text-(--text-sub) ml-1">店舗管理</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="max-w-lg w-full">
          {/* ステップインジケーター */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isCompleted = i < step;
              return (
                <div key={s.label} className="flex items-center gap-2">
                  {i > 0 && (
                    <div className={`w-8 h-0.5 ${isCompleted ? "bg-pink-600" : "bg-gray-200"}`} />
                  )}
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        isCompleted
                          ? "bg-pink-600 text-white"
                          : isActive
                            ? "bg-pink-100 text-pink-600 ring-2 ring-pink-600"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:inline ${
                        isActive ? "text-pink-600" : isCompleted ? "text-(--text-main)" : "text-(--text-sub)"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step 0: 基本情報 */}
          {step === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-(--text-main)">店舗の基本情報</h2>
                <p className="text-sm text-(--text-sub) mt-1">
                  まずは店舗の基本情報を入力してください
                </p>
              </div>

              <div className="space-y-4">
                {/* 店舗名 */}
                <div>
                  <label className="block text-sm font-medium text-(--text-main) mb-1">
                    店舗名 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => updateField("storeName", e.target.value)}
                      placeholder="例: クラブ エレガンス"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        errors.storeName ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.storeName && <p className="text-xs text-red-500 mt-1">{errors.storeName}</p>}
                </div>

                {/* エリア */}
                <div>
                  <label className="block text-sm font-medium text-(--text-main) mb-1">
                    エリア <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={formData.area}
                      onChange={(e) => updateField("area", e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none bg-white ${
                        errors.area ? "border-red-400" : "border-gray-200"
                      }`}
                    >
                      <option value="">選択してください</option>
                      {AREAS.map((area) => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
                </div>

                {/* 業種 */}
                <div>
                  <label className="block text-sm font-medium text-(--text-main) mb-1">
                    業種 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {BUSINESS_TYPES.map((bt) => (
                      <button
                        key={bt.value}
                        type="button"
                        onClick={() => updateField("businessType", bt.value)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors border ${
                          formData.businessType === bt.value
                            ? "bg-pink-50 border-pink-500 text-pink-700"
                            : "border-gray-200 text-(--text-sub) hover:bg-gray-50"
                        }`}
                      >
                        {bt.label}
                      </button>
                    ))}
                  </div>
                  {errors.businessType && <p className="text-xs text-red-500 mt-1">{errors.businessType}</p>}
                </div>

                {/* 住所 */}
                <div>
                  <label className="block text-sm font-medium text-(--text-main) mb-1">
                    住所 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="例: 東京都新宿区歌舞伎町1-1-1"
                    className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      errors.address ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-600 text-white font-medium text-sm hover:bg-pink-700 transition-colors"
              >
                次へ
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 1: 詳細情報 */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div>
                <h2 className="text-xl font-bold text-(--text-main)">詳細情報（任意）</h2>
                <p className="text-sm text-(--text-sub) mt-1">
                  あとから変更できます。スキップも可能です。
                </p>
              </div>

              <div className="space-y-4">
                {/* 営業時間 */}
                <div>
                  <label className="block text-sm font-medium text-(--text-main) mb-1">
                    営業時間
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.businessHours}
                      onChange={(e) => updateField("businessHours", e.target.value)}
                      placeholder="例: 20:00〜LAST"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                {/* 店舗紹介 */}
                <div>
                  <label className="block text-sm font-medium text-(--text-main) mb-1">
                    店舗紹介
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="店舗の特徴やアピールポイントを入力してください"
                    rows={4}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                  />
                </div>
              </div>

              {/* 入力内容プレビュー */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-(--text-sub) mb-2">入力内容</p>
                <div className="space-y-1 text-sm">
                  <p className="text-(--text-main)">
                    <span className="font-medium">{formData.storeName}</span>
                    <span className="text-(--text-sub) ml-2">
                      {BUSINESS_TYPES.find((bt) => bt.value === formData.businessType)?.label}
                    </span>
                  </p>
                  <p className="text-(--text-sub) text-xs">{formData.area} · {formData.address}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-(--text-sub) hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  戻る
                </button>
                <button
                  onClick={handleRegister}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-600 text-white font-medium text-sm hover:bg-pink-700 transition-colors"
                >
                  登録する
                </button>
              </div>
            </div>
          )}

          {/* Step 2: 登録完了 */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-5">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-(--text-main)">登録が完了しました</h2>
                <p className="text-sm text-(--text-sub) mt-2">
                  <span className="font-medium text-(--text-main)">{formData.storeName}</span> の登録が完了しました。
                  <br />
                  ダッシュボードからキャストの検索やオファー送信を始めましょう。
                </p>
              </div>

              <button
                onClick={handleGoToDashboard}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-pink-600 text-white font-medium text-sm hover:bg-pink-700 transition-colors"
              >
                ダッシュボードへ
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* フッターリンク */}
          {step < 2 && (
            <div className="text-center mt-6">
              <span className="text-sm text-(--text-sub)">すでにアカウントをお持ちですか？</span>{" "}
              <Link href="/store/login" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                ログイン
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
