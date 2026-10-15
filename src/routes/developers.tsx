import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Eye, EyeOff, Plus, BookOpen, Webhook, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mono, PageHeader, Panel, Stat, StatusBadge } from "@/components/kit";
import { cn } from "@/lib/utils";
import { apiKeys, apiLogs, fmtDate, webhooks } from "@/lib/mock";

export const Route = createFileRoute("/developers")({
  head: () => ({
    meta: [
      { title: "API & Developers — Odyssey Core" },
      { name: "description", content: "API keys, webhooks, request logs and documentation for Odyssey Connect." },
      { property: "og:title", content: "API & Developers — Odyssey Core" },
      { property: "og:description", content: "Built for engineers and operators." },
    ],
  }),
  component: Page,
});

const snippet = `curl https://api.odysseycore.dev/v1/payments \\
  -H "Authorization: Bearer ody_live_7Hq2••••" \\
  -d amount=125000 \\
  -d currency=BRL \\
  -d rail=pix \\
  -d "description=Order #48219"`;

function Page() {
  const [shown, setShown] = useState<string | null>(null);
  return (
    <>
      <PageHeader eyebrow="Odyssey Connect" title="API & Developers" desc="Built for engineers and operators. Keys, webhooks, logs and docs."
        actions={<><Button size="sm" variant="outline" onClick={() => toast("Opening docs (simulated)")}><BookOpen className="size-4" />Docs</Button>
          <Button size="sm" onClick={() => toast.success("API key created", { description: "ody_live_Qz8m•••• — copy it now." })}><Plus className="size-4" />Create key</Button></>} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Requests · 24h" value="2.84M" delta={8.8} />
        <Stat label="Error rate" value="0.21%" delta={-0.05} />
        <Stat label="p95 latency" value="138ms" delta={-3.2} />
        <Stat label="Webhook delivery" value="99.1%" delta={0.4} />
      </div>
      <Tabs defaultValue="keys" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="keys"><KeyRound className="mr-1.5 size-3.5" />API keys</TabsTrigger>
          <TabsTrigger value="webhooks"><Webhook className="mr-1.5 size-3.5" />Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="keys" className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <Panel title="Secret keys" className="xl:col-span-3" bodyClass="p-0">
            <ul className="divide-y divide-border">
              {apiKeys.map((k) => (
                <li key={k.prefix} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{k.name}</div>
                    <Mono>{shown === k.prefix ? `${k.prefix}a91fK2mXp0Lq` : `${k.prefix}••••••••••••`}</Mono>
                    <div className="mt-1.5 flex flex-wrap gap-1">{k.scopes.map((s) => <span key={s} className="rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground">{s}</span>)}</div>
                  </div>
                  <div className="text-xs text-muted-foreground sm:text-right"><div>Last used {k.lastUsed}</div><div>Created {k.created}</div></div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setShown(shown === k.prefix ? null : k.prefix)}>{shown === k.prefix ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button>
                    <Button size="icon" variant="ghost" onClick={() => toast.success("Key copied")}><Copy className="size-4" /></Button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Quickstart · create a Pix payment" className="xl:col-span-2" action={<button onClick={() => toast.success("Snippet copied")} className="text-muted-foreground hover:text-foreground"><Copy className="size-3.5" /></button>}>
            <pre className="overflow-x-auto rounded-lg bg-background/60 p-4 font-mono text-[12px] leading-relaxed text-cloud"><code>{snippet}</code></pre>
            <div className="mt-3 text-xs text-muted-foreground">Response: <span className="font-mono text-mint">201 Created</span> · payment.id, qr_code, expires_at</div>
          </Panel>
        </TabsContent>
        <TabsContent value="webhooks">
          <Panel title="Endpoints" bodyClass="p-0" action={<Button size="sm" variant="outline" onClick={() => toast.success("Test event sent")}>Send test event</Button>}>
            <ul className="divide-y divide-border">
              {webhooks.map((w) => (
                <li key={w.url} className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-center md:gap-6">
                  <div className="min-w-0 flex-1"><Mono className="block truncate text-foreground">{w.url}</Mono><div className="mt-1 text-xs text-muted-foreground">{w.events.join(", ")}</div></div>
                  <span className="text-sm tabular-nums">{w.success}% delivered</span>
                  <StatusBadge status={w.status} />
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>
        <TabsContent value="logs">
          <Panel title="Request log" bodyClass="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] font-mono text-[12px]">
                <tbody>
                  {apiLogs.map((l) => (
                    <tr key={l.id} className="border-t border-border first:border-0 hover:bg-accent/40">
                      <td className="px-5 py-2.5"><span className={cn("rounded px-1.5 py-0.5", l.status! < 300 ? "bg-mint/10 text-mint" : l.status! < 500 ? "bg-amber/10 text-amber" : "bg-destructive/10 text-destructive")}>{l.status}</span></td>
                      <td className="px-3 py-2.5 text-orbit">{l.method}</td>
                      <td className="px-3 py-2.5">{l.path}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{l.id}</td>
                      <td className="px-3 py-2.5 text-right text-muted-foreground">{l.ms}ms</td>
                      <td className="px-5 py-2.5 text-right text-muted-foreground">{fmtDate(l.time)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}
