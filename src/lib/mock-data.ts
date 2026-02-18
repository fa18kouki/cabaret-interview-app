// デモモード用モックデータ

export const MOCK_AREAS = [
  "新宿",
  "渋谷",
  "六本木",
  "銀座",
  "池袋",
  "歌舞伎町",
  "赤坂",
  "恵比寿",
];

// キャストプロフィール
export function createMockCastProfile(userId: string) {
  return {
    id: `cast_${userId}`,
    userId,
    nickname: "デモキャスト",
    age: 25,
    height: 160,
    bust: null,
    cup: null,
    introduction: "デモモードのキャストプロフィールです。",
    workStyle: "FULL_TIME" as const,
    desiredAreas: ["新宿", "渋谷"],
    desiredHourlyRate: 5000,
    preferredContactMethod: "LINE" as const,
    photoUrls: [],
    isSearchable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// 店舗プロフィール
export function createMockStoreProfile(userId: string) {
  return {
    id: `store_${userId}`,
    userId,
    name: "デモ店舗",
    area: "新宿",
    address: "東京都新宿区歌舞伎町1-1-1",
    businessType: "CABARET" as const,
    description: "デモモードの店舗プロフィールです。",
    hourlyRateMin: 4000,
    hourlyRateMax: 8000,
    workingHours: "20:00〜翌5:00",
    benefits: ["送迎あり", "日払いOK", "ヘアメイク完備"],
    requirements: "18歳以上",
    contactMethod: "LINE" as const,
    photoUrls: [],
    isRecruiting: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const baseOfferData = [
  {
    id: "offer_1",
    status: "PENDING" as const,
    message: "ぜひ一度面接にお越しください！",
    proposedRate: 5000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "offer_2",
    status: "ACCEPTED" as const,
    message: "体験入店からでも大丈夫です。",
    proposedRate: 4500,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: "offer_3",
    status: "REJECTED" as const,
    message: "高時給保証します！",
    proposedRate: 6000,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

// キャスト向けオファー（店舗情報付き）
export function createMockOffersForCast(userId: string) {
  return baseOfferData.map((offer, i) => ({
    ...offer,
    castId: `cast_${userId}`,
    storeId: `store_demo_${i}`,
    store: {
      id: `store_demo_${i}`,
      name: `デモ店舗 ${i + 1}`,
      area: MOCK_AREAS[i % MOCK_AREAS.length],
      businessType: "CABARET" as const,
    },
  }));
}

// 店舗向けオファー（キャスト情報付き）
export function createMockOffersForStore(userId: string) {
  return baseOfferData.map((offer, i) => ({
    ...offer,
    storeId: `store_${userId}`,
    castId: `cast_demo_${i}`,
    cast: {
      id: `cast_demo_${i}`,
      nickname: `デモキャスト ${i + 1}`,
      age: 22 + i,
      desiredAreas: [MOCK_AREAS[i % MOCK_AREAS.length]],
    },
  }));
}

const baseMatchData = [
  {
    id: "match_1",
    status: "ACCEPTED" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
  },
  {
    id: "match_2",
    status: "INTERVIEW_SCHEDULED" as const,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

// キャスト向けマッチング（店舗情報付き）
export function createMockMatchesForCast(userId: string) {
  return baseMatchData.map((match, i) => ({
    ...match,
    castId: `cast_${userId}`,
    storeId: `store_demo_${i}`,
    store: {
      id: `store_demo_${i}`,
      name: `マッチ店舗 ${i + 1}`,
      area: MOCK_AREAS[i % MOCK_AREAS.length],
      businessType: "CABARET" as const,
    },
  }));
}

// 店舗向けマッチング（キャスト情報付き）
export function createMockMatchesForStore(userId: string) {
  return baseMatchData.map((match, i) => ({
    ...match,
    storeId: `store_${userId}`,
    castId: `cast_demo_${i}`,
    cast: {
      id: `cast_demo_${i}`,
      nickname: `マッチキャスト ${i + 1}`,
      age: 23 + i,
      desiredAreas: [MOCK_AREAS[i % MOCK_AREAS.length]],
    },
  }));
}

// モックメッセージ
export function createMockMessages(matchId: string) {
  return [
    {
      id: "msg_1",
      matchId,
      senderId: "other",
      content: "はじめまして！お話できて嬉しいです。",
      createdAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: "msg_2",
      matchId,
      senderId: "me",
      content: "こちらこそよろしくお願いします！",
      createdAt: new Date(Date.now() - 1000 * 60 * 25),
    },
    {
      id: "msg_3",
      matchId,
      senderId: "other",
      content: "面接の日程はいつがご都合よろしいですか？",
      createdAt: new Date(Date.now() - 1000 * 60 * 10),
    },
  ];
}

// 店舗検索結果（キャスト用）
export function getMockStoresForSearch() {
  return MOCK_AREAS.slice(0, 5).map((area, i) => ({
    id: `store_search_${i}`,
    name: `${area}の人気店 ${i + 1}`,
    area,
    businessType: "CABARET" as const,
    description: `${area}エリアで人気のお店です。`,
    hourlyRateMin: 4000 + i * 500,
    hourlyRateMax: 7000 + i * 500,
    workingHours: "20:00〜翌5:00",
    benefits: ["送迎あり", "日払いOK"],
    isRecruiting: true,
  }));
}

// キャスト検索結果（店舗用 — Castスキーマ準拠）
export function getMockCastsForSearch() {
  const castData = [
    {
      nickname: "あいり",
      age: 22,
      rank: "GOLD" as const,
      desiredAreas: ["新宿", "歌舞伎町"],
      description: "新宿・歌舞伎町エリアで3年の経験があります。明るい性格で場を盛り上げるのが得意です！",
      totalExperienceYears: 3,
      previousHourlyRate: 4500,
      monthlySales: 800000,
      monthlyNominations: 15,
      alcoholTolerance: "STRONG" as const,
    },
    {
      nickname: "みさき",
      age: 24,
      rank: "PLATINUM" as const,
      desiredAreas: ["六本木", "銀座"],
      description: "六本木・銀座の高級店で5年勤務。指名本数トップクラスの実績あり。",
      totalExperienceYears: 5,
      previousHourlyRate: 7000,
      monthlySales: 2000000,
      monthlyNominations: 30,
      alcoholTolerance: "MODERATE" as const,
    },
    {
      nickname: "さくら",
      age: 20,
      rank: "SILVER" as const,
      desiredAreas: ["渋谷", "恵比寿"],
      description: "渋谷エリアでガールズバー経験1年。大学との両立をしています。",
      totalExperienceYears: 1,
      previousHourlyRate: 3000,
      monthlySales: 300000,
      monthlyNominations: 5,
      alcoholTolerance: "WEAK" as const,
    },
    {
      nickname: "れな",
      age: 23,
      rank: "GOLD" as const,
      desiredAreas: ["銀座", "赤坂"],
      description: "銀座・赤坂で4年の経験。会話力に自信あり、リピーター多数。",
      totalExperienceYears: 4,
      previousHourlyRate: 5500,
      monthlySales: 1200000,
      monthlyNominations: 20,
      alcoholTolerance: "MODERATE" as const,
    },
    {
      nickname: "ゆい",
      age: 21,
      rank: "BRONZE" as const,
      desiredAreas: ["池袋", "新宿"],
      description: "池袋エリアで半年ほど勤務。やる気は誰にも負けません！",
      totalExperienceYears: 0,
      previousHourlyRate: 3000,
      monthlySales: 200000,
      monthlyNominations: 3,
      alcoholTolerance: "WEAK" as const,
    },
    {
      nickname: "まお",
      age: 25,
      rank: "S_RANK" as const,
      desiredAreas: ["六本木", "銀座"],
      description: "六本木・銀座の最高級店で7年のキャリア。バースデー500万超え。",
      totalExperienceYears: 7,
      previousHourlyRate: 9000,
      monthlySales: 3000000,
      monthlyNominations: 40,
      alcoholTolerance: "STRONG" as const,
    },
    {
      nickname: "ひなた",
      age: 19,
      rank: "UNRANKED" as const,
      desiredAreas: ["渋谷"],
      description: "完全未経験ですが、接客業に興味があります。",
      totalExperienceYears: 0,
      previousHourlyRate: null,
      monthlySales: null,
      monthlyNominations: null,
      alcoholTolerance: "NONE" as const,
    },
    {
      nickname: "りこ",
      age: 26,
      rank: "SILVER" as const,
      desiredAreas: ["歌舞伎町", "池袋"],
      description: "歌舞伎町と池袋で2年の経験。出勤日数多めにできます。",
      totalExperienceYears: 2,
      previousHourlyRate: 4000,
      monthlySales: 500000,
      monthlyNominations: 10,
      alcoholTolerance: "MODERATE" as const,
    },
  ];

  return castData.map((cast, i) => ({
    id: `cast_mock_${i}`,
    nickname: cast.nickname,
    age: cast.age,
    photos: [] as string[],
    desiredAreas: cast.desiredAreas,
    rank: cast.rank,
    description: cast.description,
    totalExperienceYears: cast.totalExperienceYears,
    previousHourlyRate: cast.previousHourlyRate,
    monthlySales: cast.monthlySales,
    monthlyNominations: cast.monthlyNominations,
    alcoholTolerance: cast.alcoholTolerance,
  }));
}

// 店長用: 最近の応募者（診断結果・ステータス付き）
export type ApplicantStatus = "UNREAD" | "CONFIRMED" | "INTERVIEW_SCHEDULED";

export function getMockRecentApplicants() {
  const names = [
    { name: "鈴木 愛理", age: 21 },
    { name: "田中 美咲", age: 23 },
    { name: "高橋 さくら", age: 20 },
    { name: "伊藤 玲奈", age: 22 },
    { name: "渡辺 結衣", age: 24 },
  ];
  const statuses: ApplicantStatus[] = [
    "UNREAD",
    "CONFIRMED",
    "INTERVIEW_SCHEDULED",
    "CONFIRMED",
    "UNREAD",
  ];
  const matchRates = [85, 92, 78, 88, 75];
  const baseDate = new Date();
  return names.map((item, i) => ({
    id: `applicant_${i + 1}`,
    appliedAt: new Date(
      baseDate.getTime() - (4 - i) * 24 * 60 * 60 * 1000 - (i % 2) * 60 * 60 * 1000
    ),
    name: item.name,
    age: item.age,
    matchRate: matchRates[i],
    status: statuses[i],
  }));
}

// 店長用: 今週の面接予定
export type InterviewStatus = "CONFIRMED" | "PENDING";

function addDays(d: Date, days: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + days);
  return out;
}

export function getMockUpcomingInterviews() {
  const today = new Date();
  return [
    {
      id: "int_1",
      date: addDays(today, 0),
      time: "14:00",
      candidateName: "藤本 莉子",
      age: 21,
      matchRate: 85,
      status: "CONFIRMED" as InterviewStatus,
    },
    {
      id: "int_2",
      date: addDays(today, 1),
      time: "16:00",
      candidateName: "後藤 真希",
      age: 23,
      matchRate: 92,
      status: "CONFIRMED" as InterviewStatus,
    },
    {
      id: "int_3",
      date: addDays(today, 2),
      time: "15:00",
      candidateName: "林 杏奈",
      age: 20,
      matchRate: 88,
      status: "PENDING" as InterviewStatus,
    },
  ];
}
