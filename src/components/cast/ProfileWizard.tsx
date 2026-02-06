"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Experience } from "./ExperienceInput";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { ContactStep } from "./steps/ContactStep";
import { ExperienceStep } from "./steps/ExperienceStep";
import { PreferenceStep } from "./steps/PreferenceStep";
import { SelfPRStep } from "./steps/SelfPRStep";
import { AvailabilityStep } from "./steps/AvailabilityStep";

export interface ProfileFormData {
  // 基本情報
  nickname: string;
  age: number;
  birthDate?: string;
  description?: string;
  photos: string[];

  // 連絡先
  instagramId?: string;
  lineId?: string;
  currentListingUrl?: string;

  // 経験・スキル
  experiences: Experience[];
  totalExperienceYears?: number;
  previousHourlyRate?: number;
  monthlySales?: number;
  monthlyNominations?: number;
  alcoholTolerance?: "NONE" | "WEAK" | "MODERATE" | "STRONG";

  // 希望条件
  desiredAreas?: string[];
  desiredHourlyRate?: number;
  desiredMonthlyIncome?: number;
  availableDaysPerWeek?: number;
  preferredAtmosphere?: string[];
  preferredClientele?: string[];

  // リスク回避
  downtimeUntil?: string;
  isAvailableNow?: boolean;

  // 自己PR
  birthdaySales?: number;
  hasVipClients?: boolean;
  vipClientDescription?: string;
  socialFollowers?: number;
}

const STEPS = [
  { id: 1, title: "基本情報" },
  { id: 2, title: "連絡先" },
  { id: 3, title: "経験" },
  { id: 4, title: "希望" },
  { id: 5, title: "自己PR" },
  { id: 6, title: "稼働" },
];

interface ProfileWizardProps {
  initialData?: Partial<ProfileFormData>;
  onSubmit: (data: ProfileFormData) => Promise<void>;
  onCancel: () => void;
}

export function ProfileWizard({
  initialData,
  onSubmit,
  onCancel,
}: ProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: initialData?.nickname || "",
    age: initialData?.age || 18,
    birthDate: initialData?.birthDate,
    description: initialData?.description,
    photos: initialData?.photos || [],
    instagramId: initialData?.instagramId,
    lineId: initialData?.lineId,
    currentListingUrl: initialData?.currentListingUrl,
    experiences: initialData?.experiences || [],
    totalExperienceYears: initialData?.totalExperienceYears,
    previousHourlyRate: initialData?.previousHourlyRate,
    monthlySales: initialData?.monthlySales,
    monthlyNominations: initialData?.monthlyNominations,
    alcoholTolerance: initialData?.alcoholTolerance,
    desiredAreas: initialData?.desiredAreas || [],
    desiredHourlyRate: initialData?.desiredHourlyRate,
    desiredMonthlyIncome: initialData?.desiredMonthlyIncome,
    availableDaysPerWeek: initialData?.availableDaysPerWeek ?? 3,
    preferredAtmosphere: initialData?.preferredAtmosphere || [],
    preferredClientele: initialData?.preferredClientele || [],
    downtimeUntil: initialData?.downtimeUntil,
    isAvailableNow: initialData?.isAvailableNow ?? true,
    birthdaySales: initialData?.birthdaySales,
    hasVipClients: initialData?.hasVipClients ?? false,
    vipClientDescription: initialData?.vipClientDescription,
    socialFollowers: initialData?.socialFollowers,
  });

  const handleDataChange = useCallback(
    (updates: Partial<ProfileFormData>) => {
      setFormData((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1:
        if (!formData.nickname.trim()) {
          return "ニックネームを入力してください";
        }
        if (formData.nickname.length > 50) {
          return "ニックネームは50文字以内で入力してください";
        }
        if (formData.age < 18 || formData.age > 99) {
          return "年齢は18〜99歳の範囲で入力してください";
        }
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const validationError = validateStep(currentStep);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "保存に失敗しました。再度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep data={formData} onDataChange={handleDataChange} />
        );
      case 2:
        return <ContactStep data={formData} onDataChange={handleDataChange} />;
      case 3:
        return (
          <ExperienceStep data={formData} onDataChange={handleDataChange} />
        );
      case 4:
        return (
          <PreferenceStep data={formData} onDataChange={handleDataChange} />
        );
      case 5:
        return <SelfPRStep data={formData} onDataChange={handleDataChange} />;
      case 6:
        return (
          <AvailabilityStep data={formData} onDataChange={handleDataChange} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* ステップ進捗バー */}
      <div className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-1">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  step.id === currentStep
                    ? "bg-pink-500 text-white"
                    : step.id < currentStep
                    ? "bg-pink-200 text-pink-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id}
              </div>
              <span
                className={`hidden text-xs sm:block ${
                  step.id === currentStep
                    ? "font-medium text-pink-600"
                    : "text-gray-400"
                }`}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* フォームコンテンツ */}
      <div className="flex-1 overflow-auto px-4 py-6">
        <div className="mx-auto max-w-lg">{renderStep()}</div>
      </div>

      {/* エラー表示 */}
      {error && (
        <div className="mx-4 mb-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {error}
        </div>
      )}

      {/* フッターナビゲーション */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          {currentStep === 1 ? (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1 rounded-lg px-4 py-3 text-sm text-gray-500 transition-colors hover:bg-gray-100"
            >
              キャンセル
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1 rounded-lg px-4 py-3 text-sm text-gray-500 transition-colors hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
              戻る
            </button>
          )}

          {currentStep < STEPS.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1 rounded-lg bg-pink-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-600"
            >
              次へ
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-pink-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                "完了"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
