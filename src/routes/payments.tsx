import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { QrCode, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, Panel, Stat, axis, chartTooltip } from "@/components/kit";
import { TxTable } from "@/components/tx-table";
import { hourly, transactions } from "@/lib/mock";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payments — Odyssey Core" },
      { name: "description", content: "Manage Pix charges, QR codes and Pix Automático with real-time conversion metrics." },
      { property: "og:title", content: "Payments — Odyssey Core" },
      { property: "og:description", content: "Pix payments, charges and operational detail." },
    ],
  }),
  component: Page,
});

function Page() {
  const [open, setOpen] = useState(false);
  const pix = transactions.filter((t) => t.rail.startsWith("Pix"));
  return (
    <>
      <PageHeader eyebrow="Operate" title="Payments" desc="Pix charges, dynamic QR codes and recurring Pix Automático."
        actions={<Button size="sm" onClick={() => setOpen(true)}><Plus className="size-4" />Create Pix charge</Button>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Pix received · 30d" value="R$ 60.2M" delta={11.9} />
        <Stat label="Charges created" value="284,102" delta={7.2} />
        <Stat label="Conversion" value="87.3%" delta={1.4} hint="QR → paid" />
        <Stat label="Median confirm" value="1.8s" delta={-4.0} hint="faster" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Panel title="Throughput by hour · Pix (TPS)" className="xl:col-span-2">
          <div className="h-[220px]">
            <ResponsiveContainer>
              <BarChart data={hourly} margin={{ left: -20 }}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" {...axis} interval={2} />
                <YAxis {...axis} />
                <Tooltip {...chartTooltip} />
                <Bar dataKey="tps" name="TPS" fill="var(--mint)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Payment methods mix">
          {[["Pix dynamic QR", 54, "var(--mint)"], ["Pix key", 22, "var(--orbit)"], ["Pix Automático", 13, "var(--chart-4)"], ["Pix Cobrança", 11, "var(--amber)"]].map(([l, v, c]) => (
            <div key={l as string} className="mb-4 last:mb-0">
              <div className="mb-1.5 flex justify-between text-sm"><span>{l}</span><span className="tabular-nums text-muted-foreground">{v}%</span></div>
              <div className="h-1.5 rounded-full bg-muted"><div className="h-full rounded-full transition-all" style={{ width: `${v}%`, background: c as string }} /></div>
            </div>
          ))}
        </Panel>
      </div>
      <TxTable data={pix} title="Payments" />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-border bg-popover">
          <DialogHeader><DialogTitle className="font-display">New Pix charge</DialogTitle><DialogDescription>Generates a dynamic QR code with a 30-minute expiry.</DialogDescription></DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setOpen(false); toast.success("Charge created", { description: "QR code copied to clipboard." }); }}>
            <div className="space-y-1.5"><Label>Amount (BRL)</Label><Input defaultValue="1.250,00" /></div>
            <div className="space-y-1.5"><Label>Description</Label><Input defaultValue="Order #48219" /></div>
            <div className="flex items-center gap-4 rounded-xl border border-dashed border-border p-4">
              <QrCode className="size-12 text-mint" strokeWidth={1.2} />
              <p className="text-xs text-muted-foreground">QR preview and copy-and-paste code appear after creation.</p>
            </div>
            <Button type="submit" className="w-full">Generate charge</Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
