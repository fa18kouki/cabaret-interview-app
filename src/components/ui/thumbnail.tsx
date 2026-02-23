import { Building2, User } from "lucide-react";

type ThumbnailSize = "sm" | "md" | "lg";
type ThumbnailShape = "square" | "circle";
type FallbackType = "store" | "user";

const sizeStyles: Record<ThumbnailSize, { container: string; icon: string }> = {
  sm: { container: "w-10 h-10", icon: "w-5 h-5" },
  md: { container: "w-16 h-16", icon: "w-8 h-8" },
  lg: { container: "w-20 h-20", icon: "w-10 h-10" },
};

const shapeStyles: Record<ThumbnailShape, string> = {
  square: "rounded-lg",
  circle: "rounded-full",
};

const FALLBACK_ICONS: Record<FallbackType, typeof Building2> = {
  store: Building2,
  user: User,
};

interface ThumbnailProps {
  src?: string | null;
  alt: string;
  size?: ThumbnailSize;
  shape?: ThumbnailShape;
  fallbackType?: FallbackType;
  className?: string;
}

export function Thumbnail({
  src,
  alt,
  size = "md",
  shape = "square",
  fallbackType = "user",
  className = "",
}: ThumbnailProps) {
  const { container, icon } = sizeStyles[size];
  const shapeClass = shapeStyles[shape];
  const FallbackIcon = FALLBACK_ICONS[fallbackType];

  return (
    <div
      className={`bg-gray-200 flex-shrink-0 flex items-center justify-center overflow-hidden ${container} ${shapeClass} ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <FallbackIcon className={`${icon} text-gray-400`} />
      )}
    </div>
  );
}
