import { useEffect, useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Download, ArrowDownLeft, ArrowUpRight, Copy, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { brl, fmtDate, type Tx } from "@/lib/mock";
import { Empty, Mono, RailTag, StatusBadge } from "./kit";

const statusOpts = ["all", "settled", "pending", "processing", "failed", "refunded"] as const;

export function TxTable({ data, pageSize = 10, title = "Transactions", compact }: { data: Tx[]; pageSize?: number; title?: string; compact?: boolean }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof statusOpts)[number]>("all");
  const [page, setPage] = useState(0);
  const [sel, setSel] = useState<Tx | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t); }, []);
  useEffect(() => setPage(0), [q, status]);

  const rows = useMemo(() => data.filter((t) =>
    (status === "all" || t.status === status) &&
    (!q || [t.id, t.counterparty, t.merchant, t.e2e, t.rail].join(" ").toLowerCase().includes(q.toLowerCase()))
  ), [data, q, status]);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const view = rows.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <section className="panel rise overflow-hidden">
      {!compact && (
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center">
          <div className="flex h-9 flex-1 items-center gap-2 rounded-lg border border-border bg-background/40 px-3 md:max-w-sm">
            <Search className="size-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {statusOpts.map((s) => (
              <button key={s} onClick={() => setStatus(s)} className={cn("shrink-0 rounded-md px-2.5 py-1.5 text-xs capitalize transition-colors", status === s ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>{s}</button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="md:ml-auto" onClick={() => toast.success("Export queued", { description: `${rows.length} rows · CSV will be emailed.` })}>
            <Download className="size-3.5" /> Export
          </Button>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="label-caps text-left [&>th]:px-4 [&>th]:py-3 [&>th]:font-medium">
              <th>Transaction</th><th>Counterparty</th><th>Rail</th><th>Status</th><th>Date</th><th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? Array.from({ length: Math.min(pageSize, 6) }).map((_, i) => (
              <tr key={i} className="border-t border-border"><td colSpan={6} className="px-4 py-3"><Skeleton className="h-5 w-full bg-muted" /></td></tr>
            )) : view.map((t) => (
              <tr key={t.id} onClick={() => setSel(t)} className="cursor-pointer border-t border-border transition-colors hover:bg-accent/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={cn("grid size-7 shrink-0 place-items-center rounded-md", t.direction === "in" ? "bg-mint/10 text-mint" : "bg-orbit/10 text-orbit")}>
                      {t.direction === "in" ? <ArrowDownLeft className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
                    </span>
                    <Mono>{t.id}</Mono>
                  </div>
                </td>
                <td className="px-4 py-3"><div className="font-medium">{t.counterparty}</div><div className="text-xs text-muted-foreground">{t.merchant}</div></td>
                <td className="px-4 py-3"><RailTag rail={t.rail} /></td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3 text-muted-foreground tabular-nums">{fmtDate(t.date)}</td>
                <td className={cn("px-4 py-3 text-right font-medium tabular-nums", t.direction === "in" ? "" : "text-muted-foreground")}>{t.direction === "out" ? "−" : ""}{brl(t.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && view.length === 0 && <Empty title="No transactions match" desc="Try a different search term or clear the status filter." />}
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span>{rows.length} results</span>
        <div className="flex items-center gap-2">
          <span className="tabular-nums">Page {page + 1} of {pages}</span>
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-md border border-border p-1 disabled:opacity-40 hover:bg-accent"><ChevronLeft className="size-3.5" /></button>
          <button disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)} className="rounded-md border border-border p-1 disabled:opacity-40 hover:bg-accent"><ChevronRight className="size-3.5" /></button>
        </div>
      </div>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full overflow-y-auto border-border bg-popover sm:max-w-md">
          {sel && <TxDetail t={sel} />}
        </SheetContent>
      </Sheet>
    </section>
  );
}

function TxDetail({ t }: { t: Tx }) {
  const steps = [
    { l: "Initiated", d: "API · POST /v1/payments" },
    { l: "Routed", d: `${t.rail} rail selected` },
    { l: "Confirmed", d: "Counterparty acknowledged" },
    { l: "Settled", d: "Ledger entry posted" },
  ];
  const reached = t.status === "settled" || t.status === "refunded" ? 4 : t.status === "processing" ? 2 : t.status === "pending" ? 1 : 2;
  return (
    <div className="space-y-6">
      <div>
        <SheetTitle className="font-display text-lg">Transaction detail</SheetTitle>
        <SheetDescription asChild><div className="mt-1"><Mono>{t.id}</Mono></div></SheetDescription>
      </div>
      <div className="rounded-xl border border-border bg-background/40 p-5">
        <div className="label-caps">Amount</div>
        <div className="mt-2 font-display text-3xl font-semibold tabular-nums">{brl(t.amount)}</div>
        <div className="mt-3 flex items-center gap-2"><StatusBadge status={t.status} /><RailTag rail={t.rail} /></div>
      </div>
      <div>
        <div className="label-caps mb-3">Lifecycle</div>
        <ol className="relative space-y-4 pl-6">
          <span className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
          {steps.map((s, i) => (
            <li key={s.l} className="relative">
              <span className={cn("absolute -left-6 top-0.5 size-3.5 rounded-full border-2", i < reached ? (t.status === "failed" && i === reached - 1 ? "border-destructive bg-destructive/30" : "border-mint bg-mint/30") : "border-border bg-background")} />
              <div className={cn("text-sm", i < reached ? "" : "text-muted-foreground")}>{s.l}</div>
              <div className="text-xs text-muted-foreground">{s.d}</div>
            </li>
          ))}
        </ol>
      </div>
      <dl className="divide-y divide-border rounded-xl border border-border text-sm">
        {[
          ["Counterparty", t.counterparty], ["Merchant", t.merchant], ["Direction", t.direction === "in" ? "Inbound" : "Outbound"],
          ["Fee", brl(t.fee)], ["Net", brl(t.amount - t.fee)], ["Created", fmtDate(t.date)],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="text-right tabular-nums">{v}</dd></div>
        ))}
        <div className="flex justify-between gap-4 px-4 py-2.5"><dt className="text-muted-foreground">E2E ID</dt><dd><Mono className="break-all">{t.e2e}</Mono></dd></div>
      </dl>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={() => { navigator.clipboard?.writeText(t.id); toast.success("ID copied"); }}><Copy className="size-4" />Copy ID</Button>
        <Button variant="outline" className="flex-1" disabled={t.status !== "settled"} onClick={() => toast.success("Refund requested", { description: brl(t.amount) })}><RotateCcw className="size-4" />Refund</Button>
      </div>
    </div>
  );
}
