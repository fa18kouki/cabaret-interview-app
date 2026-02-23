type BadgeSize = "sm" | "md";

const RANK_STYLES: Record<string, string> = {
  S_RANK: "bg-pink-100 text-pink-700",
  PLATINUM: "bg-purple-100 text-purple-700",
  GOLD: "bg-yellow-100 text-yellow-700",
  SILVER: "bg-gray-200 text-gray-700",
  BRONZE: "bg-orange-100 text-orange-700",
  UNRANKED: "bg-gray-100 text-gray-500",
};

const RANK_LABELS: Record<string, string> = {
  S_RANK: "Sランク",
  PLATINUM: "プラチナ",
  GOLD: "ゴールド",
  SILVER: "シルバー",
  BRONZE: "ブロンズ",
  UNRANKED: "ランクなし",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

interface RankBadgeProps {
  rank: string;
  size?: BadgeSize;
  className?: string;
}

export function RankBadge({ rank, size = "sm", className = "" }: RankBadgeProps) {
  return (
    <span
      className={`inline-block rounded font-medium ${sizeStyles[size]} ${RANK_STYLES[rank] ?? RANK_STYLES.UNRANKED} ${className}`}
    >
      {RANK_LABELS[rank] ?? "ランクなし"}
    </span>
  );
}
