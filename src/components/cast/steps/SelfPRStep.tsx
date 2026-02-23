"use client";

import { Star, Users, Share2 } from "lucide-react";
import type { ProfileFormData } from "../ProfileWizard";

interface SelfPRStepProps {
  data: ProfileFormData;
  onDataChange: (data: Partial<ProfileFormData>) => void;
}

export function SelfPRStep({ data, onDataChange }: SelfPRStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-lg font-bold text-gray-900">自己PR</h2>
        <p className="text-sm text-gray-500">
          Sランク認定の重要な指標になります（任意）
        </p>
      </div>

      <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 p-4">
        <div className="flex items-start gap-3">
          <Star className="h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="font-medium text-amber-800">Sランクを目指すには</p>
            <p className="mt-1 text-sm text-amber-700">
              生誕売上、太客の有無、SNSフォロワー数などが査定の参考になります。
              入力することで店舗からの注目度が上がります。
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Star className="h-4 w-4 text-amber-500" />
            生誕（バースデーイベント）売上実績
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step={100000}
              value={data.birthdaySales ?? ""}
              onChange={(e) =>
                onDataChange({
                  birthdaySales: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              placeholder="3000000"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <span className="shrink-0 text-sm text-gray-500">円</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            バースデーイベントでの売上見込みの参考になります
          </p>
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="h-4 w-4 text-purple-500" />
            太客の有無
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => onDataChange({ hasVipClients: true })}
              className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                data.hasVipClients === true
                  ? "border-pink-500 bg-pink-50 text-pink-700"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              いる
            </button>
            <button
              type="button"
              onClick={() =>
                onDataChange({ hasVipClients: false, vipClientDescription: "" })
              }
              className={`flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors ${
                data.hasVipClients === false
                  ? "border-pink-500 bg-pink-50 text-pink-700"
                  : "border-gray-200 text-gray-700 hover:border-gray-300"
              }`}
            >
              いない
            </button>
          </div>
        </div>

        {data.hasVipClients && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              太客の詳細（任意）
            </label>
            <textarea
              value={data.vipClientDescription || ""}
              onChange={(e) =>
                onDataChange({ vipClientDescription: e.target.value })
              }
              placeholder="例：上場企業の役員、芸能関係者など（具体名は不要）"
              rows={3}
              maxLength={500}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              有名人、企業社長、政治家など。具体名は不要です。
            </p>
          </div>
        )}

        <div>
          <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
            <Share2 className="h-4 w-4 text-(--primary)" />
            SNSフォロワー数
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              value={data.socialFollowers ?? ""}
              onChange={(e) =>
                onDataChange({
                  socialFollowers: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              placeholder="10000"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <span className="shrink-0 text-sm text-gray-500">人</span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Instagram等のフォロワー数（合計）
          </p>
        </div>
      </div>
    </div>
  );
}
