import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  topBar?: "primary" | "warning" | "success" | "destructive" | "info";
  highlighted?: boolean;
  icon?: ReactNode;
  className?: string;
}

const barColors = {
  primary: "bg-primary",
  warning: "bg-warning",
  success: "bg-success",
  destructive: "bg-destructive",
  info: "bg-info",
};

export function StatCard({
  label,
  value,
  hint,
  topBar,
  highlighted,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card p-5",
        highlighted && "ring-2 ring-info/40",
        className
      )}
    >
      {topBar && <div className={cn("absolute inset-x-0 top-0 h-1", barColors[topBar])} />}
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            {label}
          </div>
          <div className="mt-1 text-2xl font-bold">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
      </div>
    </div>
  );
}
