function DevicePhoneMobileIcon() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );
}

function AdjustmentsIcon() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  );
}

function ChatBubbleLeftRightIcon() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function CalendarDaysIcon() {
  return (
    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

const features = [
  {
    icon: DevicePhoneMobileIcon,
    title: "アプリで完全無料",
    description: "LINEでカンタンに登録・診断できます",
  },
  {
    icon: AdjustmentsIcon,
    title: "条件で絞り込み",
    description: "エリアや時給など詳細検索が可能",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "気軽にチャット相談",
    description: "お店と匿名でやりとりできる",
  },
  {
    icon: CalendarDaysIcon,
    title: "面接日程も調整",
    description: "アプリ内で面接の予約まで完結",
  },
];

export function AppFeatures() {
  return (
    <section className="relative bg-gradient-to-br from-pink-500 via-pink-400 to-purple-400 py-20 md:py-32 overflow-hidden">
      {/* Decorative blurs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl opacity-10" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-white rounded-full blur-3xl opacity-10" />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-white/20 text-white px-6 py-2 rounded-full text-base font-semibold mb-6">
            Application
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            使いやすいアプリで
            <br />
            スムーズにお仕事探し
          </h2>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white/95 rounded-2xl p-6 shadow-xl text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-400 flex items-center justify-center shadow-lg">
                <feature.icon />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Phone mockups */}
        <div className="flex justify-center gap-6 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-48 md:w-52 bg-white rounded-3xl shadow-2xl p-3 flex-shrink-0"
            >
              <div className="h-80 md:h-96 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
                <div className="space-y-4 w-full px-6">
                  {i === 1 && (
                    <>
                      <div className="w-16 h-16 mx-auto rounded-full bg-pink-500" />
                      <div className="w-16 h-4 mx-auto rounded bg-pink-200" />
                      <div className="w-12 h-4 mx-auto rounded bg-pink-200" />
                    </>
                  )}
                  {i === 2 && (
                    <>
                      <div className="w-full h-20 rounded-xl bg-pink-200" />
                      <div className="w-full h-20 rounded-xl bg-pink-200" />
                      <div className="w-full h-20 rounded-xl bg-pink-200" />
                    </>
                  )}
                  {i === 3 && (
                    <>
                      <div className="w-full h-3 rounded bg-pink-200" />
                      <div className="w-4/5 h-3 rounded bg-pink-200" />
                      <div className="w-3/5 h-3 rounded bg-pink-200" />
                      <div className="w-full h-16 rounded-xl bg-pink-300 mt-4" />
                      <div className="w-full h-3 rounded bg-pink-200" />
                      <div className="w-4/5 h-3 rounded bg-pink-200" />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
