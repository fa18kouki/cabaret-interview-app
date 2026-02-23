/** システム共通エリアリスト（全ページで使用） */
export const AREAS = [
  // 関東
  "新宿",
  "歌舞伎町",
  "渋谷",
  "六本木",
  "銀座",
  "赤坂",
  "恵比寿",
  "池袋",
  "上野",
  "錦糸町",
  "横浜",
  "川崎",
  "大宮",
  "千葉",
  "船橋",
  // 中部
  "名古屋",
  "栄",
  // 関西
  "大阪",
  "梅田",
  "難波",
  "京都",
  "神戸",
  // 九州
  "福岡",
  "中洲",
  // 北海道・東北
  "札幌",
  "すすきの",
  "仙台",
  // 中国
  "広島",
] as const;

export type Area = (typeof AREAS)[number];

/** 業種リスト */
export const BUSINESS_TYPES = [
  { value: "CABARET", label: "キャバクラ" },
  { value: "CLUB", label: "クラブ" },
  { value: "LOUNGE", label: "ラウンジ" },
  { value: "GIRLS_BAR", label: "ガールズバー" },
  { value: "SNACK", label: "スナック" },
  { value: "OTHER", label: "その他" },
] as const;

export type BusinessType = (typeof BUSINESS_TYPES)[number]["value"];
