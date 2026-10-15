import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Banknote } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, Stat, StatusBadge, axis, chartTooltip } from "@/components/kit";
import { TxTable } from "@/components/tx-table";
import { cn } from "@/lib/utils";
import { brl, compact, transactions, volumeSeries } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Odyssey Core" },
      { name: "description", content: "Available balance, paid transactions, average ticket, refunds, payment methods and sales volume." },
      { property: "og:title", content: "Overview — Odyssey Core" },
      { property: "og:description", content: "Your sales, balance and payment performance at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Overview,
});

const ranges = { "7D": 7, "14D": 14, "30D": 30 } as const;

const methods = [
  { name: "Pix", value: 58.4, color: "var(--mint)" },
  { name: "Card", value: 21.7, color: "var(--orbit)" },
  { name: "Boleto", value: 9.3, color: "var(--amber)" },
  { name: "Stablecoins", value: 7.1, color: "var(--chart-4)" },
  { name: "TED", value: 3.5, color: "var(--chart-5)" },
];

const statusKeys = ["settled", "pending", "processing", "failed", "refunded"] as const;
const statusColor: Record<string, string> = { settled: "bg-mint", pending: "bg-chart-5", processing: "bg-orbit", failed: "bg-destructive", refunded: "bg-amber" };

function Overview() {
  const [range, setRange] = useState<keyof typeof ranges>("30D");
  const series = volumeSeries.slice(-ranges[range]).map((d) => ({ day: d.day, sales: d.pix + d.stable + d.other }));
  const spark = volumeSeries.map((d) => d.pix + d.stable + d.other);
  const counts = statusKeys.map((k) => ({ k, n: transactions.filter((t) => t.status === k).length }));
  const total = transactions.length;

  return (
    <>
      <PageHeader
        eyebrow="Thursday, Oct 15 · Live"
        title="Good afternoon, Diego"
        desc="Your sales, balance and payment performance at a glance."
        actions={<>
          <Button variant="outline" size="sm" asChild><Link to="/transactions">Transactions</Link></Button>
          <Button size="sm" onClick={() => toast.success("Withdrawal requested", { description: "Funds arrive in your bank account via Pix in seconds." })}><Banknote className="size-4" />Withdraw</Button>
        </>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Available balance" value="R$ 1.284.902,17" hint="ready to withdraw" />
        <Stat label="Paid transactions" value="R$ 86.312.440,90" delta={14.2} hint="last 30 days" spark={spark} />
        <Stat label="Average ticket" value="R$ 224,70" delta={2.3} hint="per paid transaction" />
        <Stat label="Number of paid transactions" value="384.117" delta={9.6} hint="last 30 days" spark={volumeSeries.map((d) => d.other)} />
        <Stat label="Refunds" value="R$ 412.380,55" delta={-3.1} hint="of paid volume" />
        <Stat label="Success rate" value="99,41%" delta={0.3} hint="target 99.0%" />
      </div>

      <Panel
        title="Sales volume"
        action={<div className="flex rounded-lg border border-border p-0.5">{(Object.keys(ranges) as (keyof typeof ranges)[]).map((k) => (
          <button key={k} onClick={() => setRange(k)} className={cn("rounded-md px-2 py-0.5 text-xs", range === k ? "bg-accent text-foreground" : "text-muted-foreground")}>{k}</button>
        ))}</div>}
      >
        <div className="h-[280px]">
          <ResponsiveContainer>
            <AreaChart data={series} margin={{ left: -10, right: 4 }}>
              <defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--mint)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--mint)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" {...axis} minTickGap={24} />
              <YAxis {...axis} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
              <Tooltip {...chartTooltip} formatter={(v: number) => brl(v)} />
              <Area type="monotone" dataKey="sales" name="Sales" stroke="var(--mint)" strokeWidth={2} fill="url(#gs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Payment methods">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="size-[180px] shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={methods} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2} stroke="none">
                    {methods.map((m) => <Cell key={m.name} fill={m.color} />)}
                  </Pie>
                  <Tooltip {...chartTooltip} formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="w-full space-y-3">
              {methods.map((m) => (
                <li key={m.name} className="flex items-center gap-3 text-sm">
                  <span className="size-2.5 rounded-sm" style={{ background: m.color }} />
                  <span className="flex-1">{m.name}</span>
                  <span className="tabular-nums text-muted-foreground">{compact(86_312_440 * m.value / 100)}</span>
                  <span className="w-12 text-right font-medium tabular-nums">{m.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>

        <Panel title="Transaction status" action={<Link to="/transactions" className="flex items-center gap-1 text-xs text-orbit hover:underline">View all <ArrowRight className="size-3" /></Link>}>
          <div className="mb-5 flex h-2.5 overflow-hidden rounded-full bg-muted">
            {counts.map((c) => <div key={c.k} className={statusColor[c.k]} style={{ width: `${(c.n / total) * 100}%` }} />)}
          </div>
          <ul className="space-y-3">
            {counts.map((c) => (
              <li key={c.k} className="flex items-center justify-between text-sm">
                <StatusBadge status={c.k} />
                <span className="flex items-center gap-4 tabular-nums"><span className="text-muted-foreground">{c.n}</span><span className="w-14 text-right font-medium">{((c.n / total) * 100).toFixed(1)}%</span></span>
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
