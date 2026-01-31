"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";

const AREAS = [
  "六本木", "銀座", "歌舞伎町", "渋谷", "新宿",
  "池袋", "上野", "錦糸町", "横浜", "大阪",
];

export default function CastProfilePage() {
  const router = useRouter();
  const { data: profile, isLoading } = trpc.cast.getProfile.useQuery();
  const utils = trpc.useUtils();

  const upsertProfile = trpc.cast.upsertProfile.useMutation({
    onSuccess: () => {
      utils.cast.getProfile.invalidate();
      router.push("/dashboard");
    },
  });

  const [form, setForm] = useState({
    nickname: "",
    age: 18,
    description: "",
    desiredAreas: [] as string[],
    desiredSalary: undefined as number | undefined,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        nickname: profile.nickname,
        age: profile.age,
        description: profile.description ?? "",
        desiredAreas: profile.desiredAreas,
        desiredSalary: profile.desiredSalary ?? undefined,
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    upsertProfile.mutate({
      nickname: form.nickname,
      age: form.age,
      description: form.description || undefined,
      desiredAreas: form.desiredAreas,
      desiredSalary: form.desiredSalary,
    });
  };

  const toggleArea = (area: string) => {
    setForm((prev) => ({
      ...prev,
      desiredAreas: prev.desiredAreas.includes(area)
        ? prev.desiredAreas.filter((a) => a !== area)
        : [...prev.desiredAreas, area],
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {profile ? "プロフィール編集" : "プロフィール作成"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">基本情報</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="ニックネーム"
              id="nickname"
              value={form.nickname}
              onChange={(e) => setForm({ ...form, nickname: e.target.value })}
              placeholder="例: レイナ"
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                年齢
              </label>
              <input
                type="number"
                min={18}
                max={99}
                value={form.age}
                onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 18 })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                自己紹介
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="自己PRを入力してください"
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">希望条件</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                希望エリア（複数選択可）
              </label>
              <div className="flex flex-wrap gap-2">
                {AREAS.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      form.desiredAreas.includes(area)
                        ? "bg-pink-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                希望時給（円）
              </label>
              <input
                type="number"
                min={0}
                step={1000}
                value={form.desiredSalary ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    desiredSalary: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="例: 5000"
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            isLoading={upsertProfile.isPending}
            className="flex-1"
          >
            {profile ? "更新する" : "登録する"}
          </Button>
        </div>
      </form>
    </div>
  );
}
