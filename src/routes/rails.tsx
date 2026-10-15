import { createFileRoute } from "@tanstack/react-router";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Mono, PageHeader, Panel, Stat, StatusBadge, axis, chartTooltip } from "@/components/kit";
import { compact, hourly, railsInfra } from "@/lib/mock";

export const Route = createFileRoute("/rails")({
  head: () => ({
    meta: [
      { title: "Payment Rails — Odyssey Core" },
      { name: "description", content: "Routing, uptime and latency for Pix, stablecoin and bank rails on Odyssey Rails." },
      { property: "og:title", content: "Payment Rails — Odyssey Core" },
      { property: "og:description", content: "Integrate once. Extend everywhere." },
    ],
  }),
  component: Page,
});

const fmtLat = (ms: number) => (ms >= 3600000 ? "D+1" : ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`);

function Page() {
  return (
    <>
      <PageHeader eyebrow="Odyssey Rails" title="Payment Rails" desc="Integrate once. Extend everywhere — unified primitives over every route." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Active rails" value="6" hint="1 degraded" />
        <Stat label="Weighted uptime" value="99.93%" delta={0.02} />
        <Stat label="Smart-routed" value="31.2%" delta={4.4} hint="via fallback" />
        <Stat label="p95 latency · Pix" value="412ms" delta={-6.0} />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {railsInfra.map((r) => (
          <div key={r.code} className="panel rise p-5">
            <div className="flex items-start justify-between gap-3">
              <div><Mono>{r.code}</Mono><div className="mt-1 font-display text-base font-semibold">{r.name}</div></div>
              <StatusBadge status={r.status} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
              <div><div className="label-caps">Uptime</div><div className="mt-1 tabular-nums">{r.uptime}%</div></div>
              <div><div className="label-caps">Latency</div><div className="mt-1 tabular-nums">{fmtLat(r.latency)}</div></div>
              <div><div className="label-caps">Volume</div><div className="mt-1 tabular-nums">{compact(r.volume)}</div></div>
            </div>
            <div className="mt-4 flex gap-[2px]">
              {Array.from({ length: 40 }).map((_, i) => (
                <span key={i} className={`h-6 flex-1 rounded-[2px] ${r.status === "degraded" && i > 34 ? "bg-amber/70" : r.status === "maintenance" && i === 38 ? "bg-amber/70" : "bg-mint/60"}`} />
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
              <span>{r.share}% of routed volume</span>
              <label className="flex items-center gap-2">Routing <Switch defaultChecked={r.status !== "maintenance"} onCheckedChange={(v) => toast(`${r.name} routing ${v ? "enabled" : "paused"}`)} /></label>
            </div>
          </div>
        ))}
      </div>
      <Panel title="Platform latency · last 24h (ms)">
        <div className="h-[240px]">
          <ResponsiveContainer>
            <LineChart data={hourly} margin={{ left: -20 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="hour" {...axis} interval={2} />
              <YAxis {...axis} />
              <Tooltip {...chartTooltip} />
              <Line dataKey="latency" name="p50 ms" stroke="var(--orbit)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </>
  );
}
