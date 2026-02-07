"use client";

import { Calendar, CheckCircle2, Clock } from "lucide-react";
import type { ProfileFormData } from "../ProfileWizard";

interface AvailabilityStepProps {
  data: ProfileFormData;
  onDataChange: (data: Partial<ProfileFormData>) => void;
}

export function AvailabilityStep({ data, onDataChange }: AvailabilityStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-lg font-bold text-gray-900">稼働状況</h2>
        <p className="text-sm text-gray-500">
          即戦力として稼働できるかの確認です
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            即日稼働可能
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() =>
                onDataChange({ isAvailableNow: true, downtimeUntil: undefined })
              }
              className={`flex-1 rounded-lg border-2 px-4 py-4 text-center transition-colors ${
                data.isAvailableNow === true
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`text-lg font-bold ${
                  data.isAvailableNow === true
                    ? "text-green-700"
                    : "text-gray-700"
                }`}
              >
                すぐ働ける
              </div>
              <p className="mt-1 text-xs text-gray-500">
                面接後すぐに出勤可能
              </p>
            </button>
            <button
              type="button"
              onClick={() => onDataChange({ isAvailableNow: false })}
              className={`flex-1 rounded-lg border-2 px-4 py-4 text-center transition-colors ${
                data.isAvailableNow === false
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className={`text-lg font-bold ${
                  data.isAvailableNow === false
                    ? "text-orange-700"
                    : "text-gray-700"
                }`}
              >
                少し先から
              </div>
              <p className="mt-1 text-xs text-gray-500">
                準備期間が必要
              </p>
            </button>
          </div>
        </div>

        {data.isAvailableNow === false && (
          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="h-4 w-4" />
              稼働開始可能日
            </label>
            <input
              type="date"
              value={data.downtimeUntil || ""}
              onChange={(e) => onDataChange({ downtimeUntil: e.target.value })}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <p className="mt-1 text-xs text-gray-400">
              整形のダウンタイム等、稼働できない期間がある場合は入力してください
            </p>
          </div>
        )}

        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 shrink-0 text-gray-400" />
            <div>
              <p className="font-medium text-gray-700">ダウンタイムについて</p>
              <p className="mt-1 text-sm text-gray-500">
                整形手術などで一時的に稼働できない期間がある場合は、
                稼働開始可能日を設定してください。
                店舗側に即戦力かどうかの目安として表示されます。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <p className="text-center text-sm font-medium text-green-800">
          これで入力は完了です！
        </p>
        <p className="mt-1 text-center text-xs text-green-600">
          「完了」ボタンを押してプロフィールを保存してください
        </p>
      </div>
    </div>
  );
}
