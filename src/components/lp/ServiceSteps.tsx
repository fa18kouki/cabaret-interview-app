import { SectionHeader } from "./SectionHeader";

function SparklesIcon() {
  return (
    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    badge: "AI適性診断",
    title: "あなたにぴったりの診断",
    description: "カンタンな質問に答えるだけで、あなたの性格や希望にマッチするお店を診断。",
    icon: SparklesIcon,
    align: "right" as const,
  },
  {
    number: "02",
    badge: "厳選されたお店のみ",
    title: "安心・安全の優良店",
    description: "厳しい審査をクリアした優良店だけを掲載。未経験でも安心して働けます。",
    icon: ShieldCheckIcon,
    align: "left" as const,
  },
  {
    number: "03",
    badge: "個人情報は不要",
    title: "匿名で気軽に相談",
    description: "個人情報を登録する前に、気になるお店と匿名でチャット相談ができます。",
    icon: ChatBubbleIcon,
    align: "right" as const,
  },
];

export function ServiceSteps() {
  return (
    <section className="relative bg-white py-20 md:py-32 overflow-hidden">
      {/* Decorative blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-6xl mx-auto px-6">
        <SectionHeader
          tag="Service"
          title="3つのポイント"
          subtitle="あなたの不安を解消する、安心のサポート体制"
        />

        <div className="mt-16 space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`flex flex-col ${step.align === "left" ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8`}
            >
              {/* Number with icon */}
              <div className="relative flex-shrink-0">
                <span className="text-8xl md:text-9xl font-bold text-pink-100 select-none">
                  {step.number}
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-pink-400 flex items-center justify-center shadow-xl">
                    <step.icon />
                  </div>
                </div>
              </div>

              {/* Content card */}
              <div className="flex-1 bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-3xl p-8 md:p-10 shadow-lg">
                <span className="inline-block bg-pink-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                  {step.badge}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
