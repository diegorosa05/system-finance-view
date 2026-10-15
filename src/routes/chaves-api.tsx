import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Eye, EyeOff, Plus, KeyRound } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { apiKeys } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chaves-api")({
  head: () => ({ meta: [{ title: "Chaves de API — Cashyin" }] }),
  component: ChavesPage,
});

function ChavesPage() {
  const [reveal, setReveal] = useState<Record<string, boolean>>({});

  const copy = (v: string) => {
    navigator.clipboard?.writeText(v);
    toast.success("Chave copiada");
  };

  return (
    <>
      <TopBar title="Chaves de API" subtitle="Use estas chaves para integrar a Cashyin ao seu sistema" />
      <div className="px-8 pb-10 space-y-6">
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary" />
              <span className="font-semibold">Suas chaves</span>
            </div>
            <button
              onClick={() => toast.success("Nova chave gerada")}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Gerar nova chave
            </button>
          </div>
          <div className="divide-y">
            {apiKeys.map((k) => {
              const isSecret = k.type === "secret";
              const visible = reveal[k.id];
              const display = isSecret && !visible ? "•".repeat(48) : k.value;
              return (
                <div key={k.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{k.name}</span>
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                          isSecret
                            ? "bg-destructive/10 text-destructive"
                            : "bg-success/10 text-success"
                        )}
                      >
                        {k.type}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground truncate">
                      {display}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Criada em {new Date(k.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  {isSecret && (
                    <button
                      onClick={() => setReveal((r) => ({ ...r, [k.id]: !r[k.id] }))}
                      className="p-2 rounded-md hover:bg-muted text-muted-foreground"
                    >
                      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => copy(k.value)}
                    className="p-2 rounded-md hover:bg-muted text-muted-foreground"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm">
          <span className="font-semibold">Atenção:</span>{" "}
          <span className="text-muted-foreground">
            nunca compartilhe sua chave secreta. Ela concede acesso total à sua conta.
          </span>
        </div>
      </div>
    </>
  );
}
