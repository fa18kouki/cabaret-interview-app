"use client";

import { PhotoUploader } from "../PhotoUploader";
import type { ProfileFormData } from "../ProfileWizard";

interface BasicInfoStepProps {
  data: ProfileFormData;
  onDataChange: (data: Partial<ProfileFormData>) => void;
}

export function BasicInfoStep({ data, onDataChange }: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 text-lg font-bold text-gray-900">基本情報</h2>
        <p className="text-sm text-gray-500">
          あなたのプロフィールを入力してください
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            ニックネーム <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.nickname}
            onChange={(e) => onDataChange({ nickname: e.target.value })}
            placeholder="源氏名を入力"
            maxLength={50}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            匿名性を担保するためのニックネームです
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              年齢 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={18}
              max={99}
              value={data.age}
              onChange={(e) =>
                onDataChange({ age: parseInt(e.target.value) || 18 })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              生年月日
            </label>
            <input
              type="date"
              value={data.birthDate || ""}
              onChange={(e) => onDataChange({ birthDate: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            自己紹介
          </label>
          <textarea
            value={data.description || ""}
            onChange={(e) => onDataChange({ description: e.target.value })}
            placeholder="あなたの魅力をアピールしてください"
            rows={4}
            maxLength={1000}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {data.description?.length || 0}/1000
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            プロフィール写真
          </label>
          <PhotoUploader
            photos={data.photos}
            onPhotosChange={(photos) => onDataChange({ photos })}
          />
        </div>
      </div>
    </div>
  );
}
