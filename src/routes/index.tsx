import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Banknote, History, Search, Wallet, ArrowDownLeft, ArrowUpRight, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { RailTag, StatusBadge, axis, chartTooltip } from "@/components/kit";
import { cn } from "@/lib/utils";
import { brl, fmtDate, transactions, volumeSeries } from "@/lib/mock";

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
  { name: "Pix", pct: 58, total: 224_118, color: "var(--mint)" },
  { name: "Card", pct: 22, total: 84_506, color: "var(--amber)" },
  { name: "Boleto", pct: 12, total: 46_094, color: "var(--chart-4)" },
  { name: "Stablecoins", pct: 8, total: 29_399, color: "var(--orbit)" },
];

const statusKeys = ["settled", "pending", "processing", "failed", "refunded"] as const;

function Kpi({ label, value, delta, hint }: { label: string; value: string; delta: number; hint: string }) {
  const up = delta >= 0;
  return (
    <div className="rounded-xl bg-muted/60 p-5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 flex flex-wrap items-baseline gap-2">
        <span className="text-[26px] font-medium tracking-tight tabular-nums">{value}</span>
        <span className={cn("text-xs font-medium", up ? "text-mint" : "text-destructive")}>{up ? "+" : ""}{delta}%</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}

function Card({ title, icon, action, children, className }: { title: string; icon?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5", className)}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-sans text-[15px] font-medium tracking-normal">{icon}{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Overview() {
  const [range, setRange] = useState<keyof typeof ranges>("30D");
  const [q, setQ] = useState("");
  const series = volumeSeries.slice(-ranges[range]).map((d) => ({ day: d.day, sales: d.pix + d.stable + d.other }));
  const rangeTotal = series.reduce((a, d) => a + d.sales, 0);
  const counts = statusKeys.map((k) => ({ k, n: transactions.filter((t) => t.status === k).length }));
  const total = transactions.length;
  const recent = transactions.filter((t) => !q || [t.counterparty, t.merchant, t.id].join(" ").toLowerCase().includes(q.toLowerCase())).slice(0, 6);
  const balanceFill = 31; // of 40 bars

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl font-medium tracking-tight">Diego Rosa</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Welcome back to Odyssey 👋</p>
        </div>
        <Button size="sm" onClick={() => toast.success("Withdrawal requested", { description: "Funds arrive in your bank account via Pix in seconds." })}><Banknote className="size-4" />Withdraw</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="grid grid-cols-1 gap-1 rounded-2xl border border-border bg-card p-1 sm:grid-cols-2 xl:col-span-2">
          <Kpi label="Paid transactions" value="R$ 86.312.440" delta={8} hint="vs. last week" />
          <Kpi label="Number of paid transactions" value="384.117" delta={5} hint="vs. last week" />
          <Kpi label="Average ticket" value="R$ 224,70" delta={2.3} hint="vs. last week" />
          <Kpi label="Refunds" value="R$ 412.380" delta={-0.5} hint="this week" />
        </div>

        <Card title="Available balance" icon={<Wallet className="size-4 text-muted-foreground" />} action={<Button variant="outline" size="sm" asChild><Link to="/accounts">Details</Link></Button>}>
          <div className="text-[26px] font-medium tracking-tight tabular-nums">R$ 1.284.902,17</div>
          <p className="mt-1 text-xs text-muted-foreground">78% of your total balance is ready to withdraw.</p>
          <div className="mt-4 flex h-10 gap-[3px]">
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} className={cn("flex-1 rounded-[2px]", i < balanceFill ? "bg-orbit" : "bg-muted")} />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>Available</span><span>Held R$ 362.400</span></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="Sales volume"
          action={<div className="flex rounded-lg border border-border p-0.5">{(Object.keys(ranges) as (keyof typeof ranges)[]).map((k) => (
            <button key={k} onClick={() => setRange(k)} className={cn("rounded-md px-2.5 py-1 text-xs", range === k ? "bg-accent text-foreground" : "text-muted-foreground")}>{k}</button>
          ))}</div>}
        >
          <div className="-mt-2 mb-4 flex items-center gap-2">
            <span className="text-[28px] font-medium tracking-tight tabular-nums">{brl(rangeTotal)}</span>
            <span className="rounded-md bg-mint/10 px-1.5 py-0.5 text-xs font-medium text-mint">+2.1%</span>
            <span className="text-xs text-muted-foreground">vs. prev. period</span>
          </div>
          <div className="h-[240px]">
            <ResponsiveContainer>
              <LineChart data={series} margin={{ left: -10, right: 8 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="day" {...axis} minTickGap={24} />
                <YAxis {...axis} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} />
                <Tooltip {...chartTooltip} formatter={(v: number) => brl(v)} />
                <Line type="linear" dataKey="sales" name="Sales" stroke="var(--orbit)" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Payment methods" action={<Button variant="outline" size="sm" asChild><Link to="/payments">Details</Link></Button>}>
          <div className="flex h-8 gap-1">
            {methods.map((m) => <span key={m.name} className="rounded-md" style={{ width: `${m.pct}%`, background: m.color }} />)}
          </div>
          <table className="mt-5 w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground"><th className="pb-2 font-normal">Channels</th><th className="pb-2 font-normal">Percent</th><th className="pb-2 text-right font-normal">Total</th></tr></thead>
            <tbody>
              {methods.map((m) => (
                <tr key={m.name}>
                  <td className="py-2"><span className="flex items-center gap-2.5"><span className="size-2 rounded-full" style={{ background: m.color }} />{m.name}</span></td>
                  <td className="py-2 tabular-nums">{m.pct}%</td>
                  <td className="py-2 text-right tabular-nums">{m.total.toLocaleString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 border-t border-border pt-4">
            <div className="mb-2 text-xs text-muted-foreground">Transaction status</div>
            <div className="flex flex-wrap gap-1.5">
              {counts.map((c) => (
                <span key={c.k} className="flex items-center gap-1.5"><StatusBadge status={c.k} /><span className="text-xs tabular-nums text-muted-foreground">{((c.n / total) * 100).toFixed(0)}%</span></span>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <section>
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-border"><History className="size-4 text-muted-foreground" /></span>
            <div>
              <h2 className="font-sans text-[15px] font-medium tracking-normal">Recent transactions</h2>
              <p className="text-xs text-muted-foreground">Display the recent transactions in the table below.</p>
            </div>
          </div>
          <div className="flex gap-2 md:ml-auto">
            <div className="flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-card px-3 md:w-72">
              <Search className="size-4 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </div>
            <Button variant="outline" size="sm" className="h-9" asChild><Link to="/transactions">View all</Link></Button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="bg-muted/60 text-left text-xs text-muted-foreground [&>th]:px-4 [&>th]:py-3 [&>th]:font-normal">
                <th>Counterparty</th><th>Amount</th><th>Status</th><th>Date</th><th>Payment method</th><th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id} className="border-t border-border">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={cn("grid size-8 place-items-center rounded-full border border-border", t.direction === "in" ? "text-mint" : "text-orbit")}>
                        {t.direction === "in" ? <ArrowDownLeft className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
                      </span>
                      <div><div>{t.counterparty}</div><div className="text-xs text-muted-foreground">{t.merchant}</div></div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums">{t.direction === "out" ? "−" : ""}{brl(t.amount)}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                  <td className="px-4 py-3.5 tabular-nums text-muted-foreground">{fmtDate(t.date)}</td>
                  <td className="px-4 py-3.5"><RailTag rail={t.rail} /></td>
                  <td className="px-4 py-3.5"><button className="rounded p-1 text-muted-foreground hover:bg-accent" aria-label="More" onClick={() => toast(t.id)}><MoreVertical className="size-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {recent.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No transactions match</div>}
        </div>
      </section>
    </>
  );
}
