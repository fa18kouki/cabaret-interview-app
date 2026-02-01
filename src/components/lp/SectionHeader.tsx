type SectionHeaderProps = {
  tag?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
};

export function SectionHeader({
  tag,
  title,
  subtitle,
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {tag && (
        <p
          className={`text-base font-semibold ${dark ? "text-white/80" : "text-pink-500"}`}
        >
          {tag}
        </p>
      )}
      <h2
        className={`text-3xl md:text-5xl font-bold ${dark ? "text-white" : "text-gray-900"}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base ${dark ? "text-white/80" : "text-gray-600"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
