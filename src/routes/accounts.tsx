import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mono, PageHeader, Panel, axis, chartTooltip } from "@/components/kit";
import { TxTable } from "@/components/tx-table";
import { cn } from "@/lib/utils";
import { accounts, brl, transactions, volumeSeries } from "@/lib/mock";

export const Route = createFileRoute("/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — Odyssey Core" },
      { name: "description", content: "Balances, sub-ledgers and stablecoin treasury accounts in one view." },
      { property: "og:title", content: "Accounts — Odyssey Core" },
      { property: "og:description", content: "Balances and movements on Odyssey Ledger." },
    ],
  }),
  component: Page,
});

function Page() {
  const [sel, setSel] = useState(accounts[0].id);
  const acc = accounts.find((a) => a.id === sel)!;
  const total = accounts.filter((a) => a.currency === "BRL").reduce((s, a) => s + a.balance, 0);
  const bal = volumeSeries.map((d, i) => ({ day: d.day, v: acc.balance * (0.86 + i * 0.005) + (d.pix % 50000) }));
  return (
    <>
      <PageHeader eyebrow="Odyssey Ledger" title="Accounts" desc={`Total BRL position ${brl(total)} across ${accounts.length} accounts.`}
        actions={<Button size="sm" variant="outline" onClick={() => toast.success("Sub-ledger created")}><Plus className="size-4" />New sub-ledger</Button>} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {accounts.map((a) => (
          <button key={a.id} onClick={() => setSel(a.id)}
            className={cn("panel rise p-4 text-left transition-all", sel === a.id ? "glow-mint" : "hover:border-orbit/30")}>
            <div className="flex items-center justify-between"><span className="label-caps">{a.type}</span><Mono className="text-[10.5px]">{a.currency}</Mono></div>
            <div className="mt-3 truncate text-sm font-medium">{a.name}</div>
            <div className="mt-1 font-display text-lg font-semibold tabular-nums">{brl(a.balance, a.currency)}</div>
            <div className={cn("mt-1 text-xs", a.change >= 0 ? "text-mint" : "text-amber")}>{a.change >= 0 ? "+" : ""}{a.change}% this month</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title={`${acc.name} · balance`} className="xl:col-span-2">
          <div className="h-[220px]">
            <ResponsiveContainer>
              <LineChart data={bal}>
                <XAxis dataKey="day" {...axis} minTickGap={30} />
                <Tooltip {...chartTooltip} formatter={(v: number) => brl(v, acc.currency)} />
                <Line dataKey="v" name="Balance" stroke="var(--orbit)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Account details">
          <dl className="space-y-3 text-sm">
            {[["Account ID", acc.id], ["Provider", acc.bank], ["Available", brl(acc.available, acc.currency)], ["Held", brl(acc.balance - acc.available, acc.currency)], ["Currency", acc.currency]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right tabular-nums">{k === "Account ID" ? <Mono>{v}</Mono> : v}</dd></div>
            ))}
          </dl>
        </Panel>
      </div>
      <h2 className="text-base font-semibold">Movements</h2>
      <TxTable data={transactions.slice(10, 70)} title="Movements" />
    </>
  );
}
