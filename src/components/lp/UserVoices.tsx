import { SectionHeader } from "./SectionHeader";

function QuoteIcon() {
  return (
    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

const voices = [
  {
    id: 1,
    name: "Aさん",
    age: "21歳",
    occupation: "大学生",
    comment: "学業と両立しながら働けています！匿名で相談できたので、不安なく始められました。",
    image: "https://placehold.co/309x256/fce7f3/f472b6?text=User+A",
  },
  {
    id: 2,
    name: "Mさん",
    age: "23歳",
    occupation: "フリーター",
    comment: "未経験でしたが、優良店を紹介してもらえて安心です。スタッフの方も親切でした。",
    image: "https://placehold.co/309x256/fce7f3/f472b6?text=User+M",
  },
  {
    id: 3,
    name: "Yさん",
    age: "20歳",
    occupation: "大学生",
    comment: "診断で自分に合うお店が見つかりました。自分のペースで働けるので続けやすいです！",
    image: "https://placehold.co/309x256/fce7f3/f472b6?text=User+Y",
  },
];

export function UserVoices() {
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader
          tag="Column"
          title="利用者の声"
          subtitle="実際にご利用いただいた方々のリアルな声"
        />

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {voices.map((voice) => (
            <div
              key={voice.id}
              className="relative bg-gradient-to-br from-pink-50 to-white border-2 border-pink-100 rounded-3xl overflow-hidden shadow-lg"
            >
              {/* Image with overlay */}
              <div className="relative h-64">
                <img
                  src={voice.image}
                  alt={voice.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>

              {/* Quote icon */}
              <div className="absolute top-52 left-6">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center shadow-xl">
                  <QuoteIcon />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 pt-10">
                {/* Name and age */}
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {voice.name}
                  </h3>
                  <span className="bg-pink-100 text-pink-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {voice.age}
                  </span>
                </div>

                {/* Occupation */}
                <p className="text-sm text-gray-500 mb-4">{voice.occupation}</p>

                {/* Comment */}
                <p className="text-base text-gray-700 leading-relaxed">
                  {voice.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
