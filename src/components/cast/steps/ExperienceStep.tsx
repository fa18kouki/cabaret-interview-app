"use client";

import { Wine } from "lucide-react";
import { ExperienceInput } from "../ExperienceInput";
import type { ProfileFormData } from "../ProfileWizard";

interface ExperienceStepProps {
  data: ProfileFormData;
  onDataChange: (data: Partial<ProfileFormData>) => void;
}

const ALCOHOL_OPTIONS = [
  { value: "NONE", label: "飲めない" },
  { value: "WEAK", label: "弱い" },
  { value: "MODERATE", label: "普通" },
  { value: "STRONG", label: "強い" },
] as const;

export function ExperienceStep({ data, onDataChange }: ExperienceStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-lg font-bold text-gray-900">経験・スキル</h2>
        <p className="text-sm text-gray-500">
          ランク査定の参考になります（任意）
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            過去の経験
          </label>
          <ExperienceInput
            experiences={data.experiences}
            onExperiencesChange={(experiences) => onDataChange({ experiences })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              総経験年数
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={50}
                value={data.totalExperienceYears ?? ""}
                onChange={(e) =>
                  onDataChange({
                    totalExperienceYears: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="3"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <span className="shrink-0 text-sm text-gray-500">年</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              過去の最高時給
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={500}
                value={data.previousHourlyRate ?? ""}
                onChange={(e) =>
                  onDataChange({
                    previousHourlyRate: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="5000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <span className="shrink-0 text-sm text-gray-500">円</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              月間売上実績
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                step={10000}
                value={data.monthlySales ?? ""}
                onChange={(e) =>
                  onDataChange({
                    monthlySales: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="500000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <span className="shrink-0 text-sm text-gray-500">円</span>
            </div>
            <p className="mt-1 text-xs text-pink-500">
              ランク査定の重要な指標です
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              月間指名本数
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={data.monthlyNominations ?? ""}
                onChange={(e) =>
                  onDataChange({
                    monthlyNominations: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="30"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
              <span className="shrink-0 text-sm text-gray-500">本</span>
            </div>
            <p className="mt-1 text-xs text-pink-500">
              ランク査定の重要な指標です
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Wine className="h-4 w-4" />
            お酒の強さ
          </label>
          <div className="flex flex-wrap gap-2">
            {ALCOHOL_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onDataChange({ alcoholTolerance: option.value })}
                className={`rounded-full px-4 py-2 text-sm transition-colors ${
                  data.alcoholTolerance === option.value
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
