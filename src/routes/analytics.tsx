import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, Stat, axis, chartTooltip } from "@/components/kit";
import { compact, railsInfra, volumeSeries } from "@/lib/mock";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Odyssey Core" },
      { name: "description", content: "Revenue, take rate, rail mix and merchant performance reports." },
      { property: "og:title", content: "Analytics — Odyssey Core" },
      { property: "og:description", content: "Financial metrics and performance reports." },
    ],
  }),
  component: Page,
});

const mix = railsInfra.map((r, i) => ({ name: r.code, value: r.share, c: ["var(--mint)", "var(--chart-4)", "var(--orbit)", "var(--amber)", "var(--chart-5)", "var(--muted)"][i] }));
const merchants = [["Nuvem Commerce", 12.4], ["Selva Marketplace", 9.8], ["Kairo Games", 7.1], ["Lumen Saúde", 6.2], ["Cora Mobilidade", 5.5], ["Fluxo Energia", 4.3]] as const;

function Page() {
  const rev = volumeSeries.map((d) => ({ day: d.day, rev: Math.round((d.pix + d.stable + d.other) * 0.0049) }));
  return (
    <>
      <PageHeader eyebrow="Insights" title="Analytics" desc="Financial metrics, rail performance and reporting."
        actions={<>
          <Tabs defaultValue="30d"><TabsList className="bg-muted"><TabsTrigger value="7d">7d</TabsTrigger><TabsTrigger value="30d">30d</TabsTrigger><TabsTrigger value="90d">90d</TabsTrigger></TabsList></Tabs>
          <Button size="sm" variant="outline" onClick={() => toast.success("Report generated", { description: "Odyssey_Report_Oct2026.pdf" })}><Download className="size-4" />Report</Button>
        </>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Net revenue" value="R$ 422.9k" delta={13.1} />
        <Stat label="Take rate" value="0.49%" delta={0} />
        <Stat label="Active merchants" value="1,284" delta={6.7} />
        <Stat label="Chargeback rate" value="0.04%" delta={-12} hint="improving" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="Net revenue" className="xl:col-span-2">
          <div className="h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={rev} margin={{ left: -10 }}>
                <defs><linearGradient id="rv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--orbit)" stopOpacity={0.35} /><stop offset="100%" stopColor="var(--orbit)" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" {...axis} minTickGap={24} />
                <YAxis {...axis} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip {...chartTooltip} formatter={(v: number) => compact(v)} />
                <Area dataKey="rev" name="Revenue" type="monotone" stroke="var(--orbit)" strokeWidth={2} fill="url(#rv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Rail mix">
          <div className="relative h-[180px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={mix} dataKey="value" innerRadius={58} outerRadius={78} paddingAngle={2} stroke="none">
                  {mix.map((m) => <Cell key={m.name} fill={m.c} />)}
                </Pie>
                <Tooltip {...chartTooltip} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center"><div><div className="font-display text-xl font-semibold">6</div><div className="label-caps">rails</div></div></div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
            {mix.map((m) => <span key={m.name} className="flex items-center gap-1.5 text-muted-foreground"><span className="size-2 rounded-sm" style={{ background: m.c }} />{m.name} {m.value}%</span>)}
          </div>
        </Panel>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Panel title="Top merchants by volume (R$ M)">
          <div className="h-[240px]">
            <ResponsiveContainer>
              <BarChart data={merchants.map(([n, v]) => ({ n, v }))} layout="vertical" margin={{ left: 30 }}>
                <XAxis type="number" {...axis} />
                <YAxis type="category" dataKey="n" {...axis} width={110} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="v" name="R$ M" fill="var(--mint)" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Approval funnel">
          {[["Initiated", 100], ["Routed", 99.7], ["Confirmed by rail", 99.4], ["Settled in ledger", 99.38]].map(([l, v], i) => (
            <div key={l} className="mb-5 last:mb-0">
              <div className="mb-1.5 flex justify-between text-sm"><span>{l}</span><span className="tabular-nums text-muted-foreground">{v}%</span></div>
              <div className="h-7 overflow-hidden rounded-md bg-muted"><div className="h-full rounded-md" style={{ width: `${(v as number) - i * 6}%`, background: "linear-gradient(90deg, var(--orbit), var(--mint))", opacity: 0.85 - i * 0.12 }} /></div>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}
