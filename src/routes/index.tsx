import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, Stat, StatusBadge, axis, chartTooltip } from "@/components/kit";
import { TxTable } from "@/components/tx-table";
import { cn } from "@/lib/utils";
import { compact, railsInfra, transactions, volumeSeries } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Odyssey Core" },
      { name: "description", content: "Operational overview of volume, success rate and settlement across every payment rail." },
      { property: "og:title", content: "Overview — Odyssey Core" },
      { property: "og:description", content: "Every route accounted for: volume, performance and recent transactions." },
    ],
  }),
  component: Overview,
});

const ranges = { "7D": 7, "14D": 14, "30D": 30 } as const;

function Overview() {
  const [range, setRange] = useState<keyof typeof ranges>("30D");
  const series = volumeSeries.slice(-ranges[range]);
  const spark = volumeSeries.map((d) => d.pix);
  return (
    <>
      <PageHeader
        eyebrow="Thursday, Oct 15 · Live"
        title="Good afternoon, Diego"
        desc="Build, route and reconcile financial flows through one programmable core."
        actions={<>
          <Button variant="outline" size="sm" asChild><Link to="/developers">Explore the API</Link></Button>
          <Button size="sm" onClick={() => toast.success("Pix charge created", { description: "QR code ready to share." })}><Plus className="size-4" />New charge</Button>
        </>}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Processed volume · 30d" value="R$ 86.3M" delta={14.2} hint="vs. prev. period" spark={spark} />
        <Stat label="Transactions" value="412,908" delta={9.6} hint="13.7k / day" spark={volumeSeries.map((d) => d.other)} />
        <Stat label="Success rate" value="99.41%" delta={0.3} hint="target 99.0%" />
        <Stat label="Pending settlement" value="R$ 2.48M" delta={-3.1} hint="next window 18:00" spark={volumeSeries.map((d) => d.stable).reverse()} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title="Transaction volume"
          action={<div className="flex rounded-lg border border-border p-0.5">{(Object.keys(ranges) as (keyof typeof ranges)[]).map((k) => (
            <button key={k} onClick={() => setRange(k)} className={cn("rounded-md px-2 py-0.5 text-xs", range === k ? "bg-accent text-foreground" : "text-muted-foreground")}>{k}</button>
          ))}</div>}
        >
          <div className="mb-4 flex flex-wrap gap-5 text-xs">
            {[["Pix", "var(--mint)"], ["Stablecoins", "var(--orbit)"], ["Other rails", "var(--chart-5)"]].map(([l, c]) => (
              <span key={l} className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-sm" style={{ background: c }} />{l}</span>
            ))}
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer>
              <AreaChart data={series} margin={{ left: -10, right: 4 }}>
                <defs>
                  {[["g1", "var(--mint)"], ["g2", "var(--orbit)"]].map(([id, c]) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity={0.28} /><stop offset="100%" stopColor={c} stopOpacity={0} /></linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" {...axis} minTickGap={24} />
                <YAxis {...axis} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
                <Tooltip {...chartTooltip} formatter={(v: number) => compact(v)} />
                <Area type="monotone" dataKey="pix" name="Pix" stroke="var(--mint)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="stable" name="Stablecoins" stroke="var(--orbit)" strokeWidth={2} fill="url(#g2)" />
                <Area type="monotone" dataKey="other" name="Other" stroke="var(--chart-5)" strokeWidth={1.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Route health" action={<Link to="/rails" className="flex items-center gap-1 text-xs text-orbit hover:underline">All rails <ArrowRight className="size-3" /></Link>}>
          <RouteDiagram />
          <ul className="mt-4 space-y-2.5">
            {railsInfra.slice(0, 4).map((r) => (
              <li key={r.code} className="flex items-center justify-between text-sm">
                <span>{r.name}</span>
                <span className="flex items-center gap-3"><span className="text-xs tabular-nums text-muted-foreground">{r.uptime}%</span><StatusBadge status={r.status} /></span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Recent transactions</h2>
        <Link to="/transactions" className="flex items-center gap-1 text-xs text-orbit hover:underline">View all <ArrowRight className="size-3" /></Link>
      </div>
      <TxTable data={transactions.slice(0, 6)} pageSize={6} compact />
    </>
  );
}

function RouteDiagram() {
  const nodes = [
    { x: 40, y: 30, l: "PIX" }, { x: 260, y: 30, l: "USDC" }, { x: 40, y: 130, l: "TED" }, { x: 260, y: 130, l: "USDT" },
  ];
  return (
    <svg viewBox="0 0 300 160" className="h-auto w-full">
      <circle cx="150" cy="80" r="46" fill="none" stroke="var(--border)" />
      <path d="M196 80a46 46 0 1 1-13.5-32.5" fill="none" stroke="var(--mint)" strokeWidth="1.5" />
      {nodes.map((n, i) => (
        <g key={n.l}>
          <path d={`M${n.x} ${n.y} Q150 80 150 80`} stroke={i === 3 ? "var(--amber)" : i % 2 ? "var(--orbit)" : "var(--mint)"} strokeWidth="1" fill="none" className="route-flow" />
          <rect x={n.x - 20} y={n.y - 11} width="40" height="22" rx="11" fill="var(--surface-2)" stroke="var(--border)" />
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="9" fontFamily="IBM Plex Mono" fill="var(--muted-foreground)">{n.l}</text>
        </g>
      ))}
      <rect x="138" y="68" width="24" height="24" rx="5" fill="var(--cloud)" />
      <text x="150" y="152" textAnchor="middle" fontSize="8.5" fill="var(--muted-foreground)" letterSpacing="1.5">ODYSSEY RAILS</text>
    </svg>
  );
}
