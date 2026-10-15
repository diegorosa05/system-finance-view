import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mono, PageHeader, Panel, Stat } from "@/components/kit";
import { TxTable } from "@/components/tx-table";
import { recipients, transactions } from "@/lib/mock";

export const Route = createFileRoute("/transfers")({
  head: () => ({
    meta: [
      { title: "Transfers — Odyssey Core" },
      { name: "description", content: "Send Pix, TED and stablecoin transfers and track every payout status." },
      { property: "og:title", content: "Transfers — Odyssey Core" },
      { property: "og:description", content: "Move value with clarity." },
    ],
  }),
  component: Page,
});

function Page() {
  const [to, setTo] = useState(recipients[0]!.name);
  const [sending, setSending] = useState(false);
  const out = transactions.filter((t) => t.direction === "out");
  return (
    <>
      <PageHeader eyebrow="Operate" title="Transfers" desc="Move value with clarity — payouts across Pix, TED and stablecoin rails." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Sent · 30d" value="R$ 18.4M" delta={5.3} />
        <Stat label="Payouts" value="21,440" delta={3.9} />
        <Stat label="Scheduled" value="38" hint="next in 2h" />
        <Stat label="Avg. completion" value="4.2s" delta={-8.1} hint="faster" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="New transfer">
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault(); setSending(true);
            setTimeout(() => { setSending(false); toast.success("Transfer submitted", { description: `Routing to ${to} via Pix.` }); }, 900);
          }}>
            <div className="space-y-1.5"><Label>Recipient</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{recipients.map((r) => <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Amount</Label><Input defaultValue="R$ 12.400,00" /></div>
            <div className="space-y-1.5"><Label>Source account</Label>
              <Select defaultValue="op"><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="op">Operating — BRL</SelectItem><SelectItem value="usdc">Treasury — USDC</SelectItem></SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={sending}><Send className="size-4" />{sending ? "Routing…" : "Send transfer"}</Button>
          </form>
        </Panel>
        <Panel title="Saved recipients" className="xl:col-span-2" bodyClass="p-0">
          <ul className="divide-y divide-border">
            {recipients.map((r) => (
              <li key={r.name} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-accent/40">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-surface-2 text-xs font-semibold">{r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}</span>
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{r.name}</div><Mono>{r.type} · {r.key}</Mono></div>
                <div className="hidden text-right text-xs text-muted-foreground sm:block"><div>{r.bank}</div><div>Last {r.last}</div></div>
                <Button size="sm" variant="ghost" onClick={() => setTo(r.name)}>Select</Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <h2 className="text-base font-semibold">Transfer history</h2>
      <TxTable data={out} title="Transfers" />
    </>
  );
}
