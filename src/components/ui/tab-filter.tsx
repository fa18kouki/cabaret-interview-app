interface Tab {
  value: string;
  label: string;
}

type TabVariant = "default" | "pill";

const variantStyles: Record<TabVariant, { active: string; inactive: string; shape: string }> = {
  default: {
    active: "bg-pink-600 text-white",
    inactive: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    shape: "rounded-lg",
  },
  pill: {
    active: "bg-pink-600 text-white",
    inactive: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    shape: "rounded-full",
  },
};

interface TabFilterProps {
  tabs: Tab[];
  activeValue: string;
  onChange: (value: string) => void;
  variant?: TabVariant;
  className?: string;
}

export function TabFilter({ tabs, activeValue, onChange, variant = "default", className = "" }: TabFilterProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 ${styles.shape} text-sm font-medium whitespace-nowrap transition-colors ${
            activeValue === tab.value ? styles.active : styles.inactive
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
