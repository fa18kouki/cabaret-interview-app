import { GradientButton } from "./GradientButton";

function CheckIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-pink-100 to-purple-100">
      {/* Decorative blurred circles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-40 right-20 w-40 h-40 bg-pink-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-purple-200 rounded-full blur-3xl opacity-40" />
      <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-pink-400 rounded-full blur-3xl opacity-50" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left content */}
          <div className="flex-1 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg mb-8">
              <CheckIcon />
              <span>完全無料で診断</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-gray-900">夜職、</span>
              <br />
              <span className="text-pink-500">はじめるなら</span>
              <br />
              <span className="text-gray-900">LUMINA</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              カンタンな質問に答えるだけで、
              <br className="hidden md:block" />
              あなたにピッタリのお店が見つかる。
              <br className="hidden md:block" />
              まずは無料診断から。
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              <GradientButton href="/login" size="lg">
                無料で適性診断をはじめる
              </GradientButton>
              <GradientButton href="/login" variant="secondary" size="lg">
                LINEで相談する
              </GradientButton>
            </div>

            {/* Note */}
            <p className="text-sm text-gray-500">
              所要時間: たった3分 / 完全匿名OK
            </p>
          </div>

          {/* Right content - Hero image with badges */}
          <div className="flex-1 relative">
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/champagne-night-view.png"
                  alt="LUMINA - エレガントな雰囲気"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Badge: 登録者数 No.1 */}
              <div className="absolute top-0 right-0 sm:-top-4 sm:-right-4 md:top-0 md:right-0 rotate-3">
                <div className="bg-pink-400 text-white px-4 py-3 rounded-2xl shadow-xl font-bold text-sm md:text-base">
                  登録者数 No.1
                </div>
              </div>

              {/* Badge: マッチング実績 */}
              <div className="absolute bottom-0 left-0 sm:-bottom-4 sm:-left-4 md:bottom-4 md:-left-8 -rotate-3">
                <div className="bg-white px-4 py-3 rounded-2xl shadow-xl">
                  <p className="text-pink-500 font-bold text-xl md:text-2xl">
                    22万件+
                  </p>
                  <p className="text-gray-600 text-sm">マッチング実績</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
