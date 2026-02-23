"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, Crown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useDemoSession } from "@/lib/demo-session";
import {
  createMockSubscription,
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanId,
} from "@/lib/mock-data";

export default function StoreSubscriptionPage() {
  const router = useRouter();
  const { session } = useDemoSession();
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanId>("FREE");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "STORE") {
      router.push("/dashboard");
    } else {
      const sub = createMockSubscription(session.user.id);
      setCurrentPlan(sub.plan);
    }
  }, [session, router]);

  if (!session || session.user.role !== "STORE") {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  const handlePlanAction = (planId: SubscriptionPlanId) => {
    if (planId === currentPlan) return;

    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === planId);
    if (!plan) return;

    setToast(
      `デモモード: ${plan.name}プランへの変更は、Stripe連携後にご利用いただけます。`
    );
    setTimeout(() => setToast(null), 4000);
  };

  const getButtonLabel = (planId: SubscriptionPlanId) => {
    if (planId === currentPlan) return "現在のプラン";
    const currentIndex = SUBSCRIPTION_PLANS.findIndex(
      (p) => p.id === currentPlan
    );
    const targetIndex = SUBSCRIPTION_PLANS.findIndex((p) => p.id === planId);
    return targetIndex > currentIndex ? "アップグレード" : "ダウングレード";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-(--text-main)">
        プラン・お支払い
      </h1>

      {/* 現在のプラン */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs text-(--text-sub) mb-1">現在のプラン</p>
        <p className="text-lg font-bold text-(--text-main)">
          {SUBSCRIPTION_PLANS.find((p) => p.id === currentPlan)?.name}プラン
        </p>
      </div>

      {/* プランカード */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const isRecommended = "recommended" in plan && plan.recommended;

          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 shadow-sm p-5 flex flex-col ${
                isRecommended
                  ? "border-(--primary)"
                  : isCurrent
                    ? "border-(--secondary-blue-text)"
                    : "border-gray-100"
              }`}
            >
              {isRecommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 bg-(--primary) text-white text-xs font-bold px-3 py-1 rounded-full">
                    <Crown className="w-3 h-3" />
                    おすすめ
                  </span>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-bold text-(--text-main)">
                  {plan.name}
                </h3>
                <p className="text-xs text-(--text-sub) mt-1">
                  {plan.description}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-2xl font-bold text-(--text-main)">
                  {plan.priceLabel}
                </span>
                {plan.price > 0 && (
                  <span className="text-sm text-(--text-sub)">/月</span>
                )}
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-(--text-main)"
                  >
                    <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanAction(plan.id)}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-gray-100 text-(--text-sub) cursor-default"
                    : isRecommended
                      ? "bg-(--primary) text-white hover:opacity-90"
                      : "bg-white border border-gray-200 text-(--text-main) hover:bg-gray-50"
                }`}
              >
                {getButtonLabel(plan.id)}
              </button>
            </div>
          );
        })}
      </div>

      {/* トースト */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-gray-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
