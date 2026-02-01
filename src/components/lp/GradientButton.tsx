import Link from "next/link";

type GradientButtonProps = {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "white";
  size?: "md" | "lg";
  className?: string;
};

export function GradientButton({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
}: GradientButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105";

  const sizeStyles = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-pink-500 to-pink-400 text-white",
    secondary:
      "bg-white border-2 border-pink-200 text-pink-500 hover:border-pink-300",
    white:
      "bg-white text-pink-600 hover:bg-pink-50",
  };

  return (
    <Link
      href={href}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
