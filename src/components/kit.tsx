import logoLight from "@/assets/logo-light.png.asset.json";
import logoDark from "@/assets/logo-dark.png.asset.json";
import logoIcon from "@/assets/logo-icon.png.asset.json";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function Logo({ collapsed }: { collapsed?: boolean }) {
  if (collapsed) return <img src={logoIcon.url} alt="Odyssey Core" className="size-8 shrink-0 object-contain" />;
  return (
    <>
      <img src={logoLight.url} alt="Odyssey Core" className="h-7 w-auto dark:hidden" />
      <img src={logoDark.url} alt="Odyssey Core" className="hidden h-7 w-auto dark:block" />
    </>
  );
}

export function PageHeader({ title, desc, actions }: { eyebrow?: string; title: string; desc?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0">
        <h1 className="font-sans text-xl font-medium tracking-tight">{title}</h1>
        {desc && <p className="mt-0.5 max-w-xl text-sm text-muted-foreground">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className, bodyClass }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-sans text-[15px] font-medium tracking-normal">{title}</h3>
          {action}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

export function Stat({ label, value, delta, hint }: { label: string; value: string; delta?: number; hint?: string; spark?: number[] }) {
  const up = (delta ?? 0) >= 0;
  return (
    <div className="rounded-2xl border border-border bg-card p-1">
      <div className="h-full rounded-xl bg-muted/60 p-5">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-[26px] font-medium tracking-tight tabular-nums">{value}</span>
          {delta !== undefined && <span className={cn("text-xs font-medium", up ? "text-mint" : "text-destructive")}>{up ? "+" : ""}{delta}%</span>}
          {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
        </div>
      </div>
    </div>
  );
}

function Spark({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / (max - min || 1)) * 26}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="absolute right-5 top-[52px] h-8 w-20 opacity-70">
      <polyline points={pts} fill="none" stroke={up ? "var(--mint)" : "var(--amber)"} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const statusMap: Record<string, string> = {
  settled: "text-mint bg-mint/10 ring-mint/20",
  reconciled: "text-mint bg-mint/10 ring-mint/20",
  operational: "text-mint bg-mint/10 ring-mint/20",
  active: "text-mint bg-mint/10 ring-mint/20",
  completed: "text-mint bg-mint/10 ring-mint/20",
  pending: "text-cloud bg-cloud/5 ring-cloud/15",
  processing: "text-orbit bg-orbit/10 ring-orbit/25",
  scheduled: "text-orbit bg-orbit/10 ring-orbit/25",
  degraded: "text-amber bg-amber/10 ring-amber/25",
  exception: "text-amber bg-amber/10 ring-amber/25",
  maintenance: "text-amber bg-amber/10 ring-amber/25",
  refunded: "text-muted-foreground bg-muted ring-border",
  failed: "text-destructive bg-destructive/10 ring-destructive/25",
  failing: "text-destructive bg-destructive/10 ring-destructive/25",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset", statusMap[status] ?? statusMap["pending"])}>
      <span className={cn("size-1.5 rounded-full bg-current", status === "processing" && "pulse-dot")} />
      {status}
    </span>
  );
}

export function RailTag({ rail }: { rail: string }) {
  const stable = rail.startsWith("US");
  return (
    <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10.5px]", stable ? "border-orbit/30 text-orbit" : "border-border text-muted-foreground")}>
      {rail}
    </span>
  );
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("font-mono text-[12px] text-muted-foreground", className)}>{children}</span>;
}

export function Empty({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <svg viewBox="0 0 64 64" className="size-14 opacity-70">
        <circle cx="32" cy="32" r="22" fill="none" stroke="var(--border)" strokeWidth="1.5" />
        <path d="M54 32a22 22 0 0 1-22 22" fill="none" stroke="var(--orbit)" strokeWidth="1.5" className="route-flow" />
        <rect x="28" y="28" width="8" height="8" rx="2" fill="var(--muted-foreground)" />
      </svg>
      <div className="text-sm font-medium">{title}</div>
      <div className="max-w-xs text-xs text-muted-foreground">{desc}</div>
    </div>
  );
}

export const chartTooltip = {
  contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 12, color: "var(--foreground)" },
  labelStyle: { color: "var(--muted-foreground)", marginBottom: 4 },
  cursor: { stroke: "var(--border)", fill: "var(--accent)", fillOpacity: 0.3 },
};
export const axis = { stroke: "var(--muted-foreground)", fontSize: 11, tickLine: false, axisLine: false } as const;
