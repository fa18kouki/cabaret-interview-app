import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-(--text-sub)">{title}</p>
      {description && <p className="text-sm text-(--text-sub) mt-1">{description}</p>}
      {action && (
        <div className="mt-4">
          <Link href={action.href}>
            <Button variant="outline">{action.label}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
