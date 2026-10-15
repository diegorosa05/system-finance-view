import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mono, PageHeader, Panel, Stat, StatusBadge } from "@/components/kit";
import { brl, settlements } from "@/lib/mock";

export const Route = createFileRoute("/settlement")({
  head: () => ({
    meta: [
      { title: "Settlement — Odyssey Core" },
      { name: "description", content: "Reconciliation, settlement windows, pending amounts and exception handling." },
      { property: "og:title", content: "Settlement — Odyssey Core" },
      { property: "og:description", content: "Reconcile every route, every day." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="Odyssey Ledger" title="Settlement" desc="Daily reconciliation between rail confirmations and ledger entries."
        actions={<Button size="sm" onClick={() => toast.success("Reconciliation started", { description: "Window Oct 15 · 13,102 entries" })}>Run reconciliation</Button>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Pending" value="R$ 2.48M" hint="window 18:00" />
        <Stat label="Settled · 30d" value="R$ 81.9M" delta={12.4} />
        <Stat label="Match rate" value="99.98%" delta={0.01} />
        <Stat label="Open exceptions" value="3" delta={-40} hint="vs. last week" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="Today's window">
          <div className="font-display text-2xl font-semibold tabular-nums">{brl(settlements[0]!.net)}</div>
          <div className="mt-1 text-xs text-muted-foreground">Net after fees · {settlements[0]!.txCount.toLocaleString()} transactions</div>
          <Progress value={72} className="mt-5 h-1.5 bg-muted [&>div]:bg-mint" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>72% matched</span><span>closes 18:00 BRT</span></div>
          <ol className="mt-6 space-y-3 text-sm">
            {["Rail confirmations ingested", "Ledger entries posted", "Matching in progress", "Payout to bank account"].map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span className={`grid size-5 place-items-center rounded-full ${i < 2 ? "bg-mint/15 text-mint" : i === 2 ? "bg-orbit/15 text-orbit" : "bg-muted text-muted-foreground"}`}>
                  {i < 2 ? <Check className="size-3" /> : <span className={`size-1.5 rounded-full bg-current ${i === 2 ? "pulse-dot" : ""}`} />}
                </span>
                <span className={i > 2 ? "text-muted-foreground" : ""}>{s}</span>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Settlement history" className="xl:col-span-2" bodyClass="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead><tr className="label-caps text-left [&>th]:px-5 [&>th]:py-3 [&>th]:font-medium"><th>Batch</th><th>Date</th><th>Txs</th><th className="text-right">Gross</th><th className="text-right">Net</th><th>Status</th></tr></thead>
              <tbody>
                {settlements.map((s) => (
                  <tr key={s.id} className="border-t border-border hover:bg-accent/40">
                    <td className="px-5 py-3"><Mono>{s.id}</Mono></td>
                    <td className="px-5 py-3 text-muted-foreground">{s.date.toLocaleDateString("en-US", { month: "short", day: "2-digit", timeZone: "UTC" })}</td>
                    <td className="px-5 py-3 tabular-nums">{s.txCount.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{brl(s.gross)}</td>
                    <td className="px-5 py-3 text-right font-medium tabular-nums">{brl(s.net)}</td>
                    <td className="px-5 py-3">
                      {s.status === "exception"
                        ? <button onClick={() => toast.warning(`${s.mismatches} mismatched entries`, { description: "Assigned to reconciliation queue." })}><StatusBadge status="exception" /></button>
                        : <StatusBadge status={s.status} />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </>
  );
}
