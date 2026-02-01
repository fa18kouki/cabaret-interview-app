"use client";

import { useState } from "react";

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const faqs = [
  {
    question: "Q. 本当に無料ですか？",
    answer: "A. はい、完全無料でご利用いただけます。診断から店舗とのやりとりまで、一切費用はかかりません。",
  },
  {
    question: "Q. 個人情報は安全ですか？",
    answer: "A. 個人情報の取り扱いには細心の注意を払っており、暗号化通信を使用しています。また、匿名でのやりとりが可能なため、面接を決定するまで個人情報を開示する必要はありません。",
  },
  {
    question: "Q. 無理な勧誘はありませんか？",
    answer: "A. いいえ、一切ありません。あなたのペースで、気になるお店とやりとりしていただけます。断る場合も、アプリ上で簡単にお断りできます。",
  },
  {
    question: "Q. 未経験でも大丈夫ですか？",
    answer: "A. もちろんです。未経験者歓迎のお店も多数掲載しており、研修制度が充実した店舗もご紹介できます。",
  },
  {
    question: "Q. 学業との両立はできますか？",
    answer: "A. できます。シフトの融通が利くお店や、短時間勤務OKのお店など、あなたのライフスタイルに合わせた働き方が可能なお店をご紹介します。",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            よくある質問
          </h2>
          <p className="text-base text-gray-600">
            皆さまからよく寄せられる質問にお答えします
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Question button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-base font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                  <p className="text-base text-gray-600 leading-relaxed pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
