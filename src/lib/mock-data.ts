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

// キャスト検索結果（店舗用）
export function getMockCastsForSearch() {
  return Array.from({ length: 5 }, (_, i) => ({
    id: `cast_search_${i}`,
    nickname: `キャスト ${String.fromCharCode(65 + i)}`,
    age: 21 + i,
    height: 155 + i * 2,
    introduction: "よろしくお願いします！",
    workStyle: i % 2 === 0 ? ("FULL_TIME" as const) : ("PART_TIME" as const),
    desiredAreas: [MOCK_AREAS[i % MOCK_AREAS.length]],
    desiredHourlyRate: 4500 + i * 300,
    isSearchable: true,
  }));
}
