import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Webhook as WebhookIcon } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { webhooks as initial } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/webhooks")({
  head: () => ({ meta: [{ title: "Webhooks — Cashyin" }] }),
  component: WebhooksPage,
});

function WebhooksPage() {
  const [items, setItems] = useState(initial);
  const [url, setUrl] = useState("");

  const add = () => {
    if (!url) return;
    setItems((s) => [
      ...s,
      { id: `wh_${Date.now()}`, url, events: ["payment.succeeded"], active: true },
    ]);
    setUrl("");
    toast.success("Webhook adicionado");
  };

  const remove = (id: string) => {
    setItems((s) => s.filter((w) => w.id !== id));
    toast.success("Webhook removido");
  };

  return (
    <>
      <TopBar title="Webhooks" subtitle="Receba notificações em tempo real sobre eventos da sua conta" />
      <div className="px-8 pb-10 space-y-6">
        <div className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <WebhookIcon className="h-4 w-4 text-primary" />
            <span className="font-semibold">Adicionar endpoint</span>
          </div>
          <div className="flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://seu-dominio.com/webhook"
              className="flex-1 rounded-md border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={add}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Adicionar
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="border-b px-5 py-4 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            Endpoints registrados ({items.length})
          </div>
          <div className="divide-y">
            {items.map((w) => (
              <div key={w.id} className="px-5 py-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm truncate">{w.url}</span>
                    <span className="rounded bg-success/10 text-success px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                      Ativo
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Eventos: {w.events.join(", ")}
                  </div>
                </div>
                <button
                  onClick={() => remove(w.id)}
                  className="p-2 rounded-md hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                Nenhum webhook cadastrado ainda.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
