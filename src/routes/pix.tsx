import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Sparkles, Check } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/pix")({
  head: () => ({ meta: [{ title: "Adquirente PIX — Cashyin" }] }),
  component: PixPage,
});

const options = [{ id: "pay2m", name: "PAY2M - FYHUB" }];

function PixPage() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <TopBar title="PIX" />
      <div className="px-8 pb-10">
        <div className="rounded-lg border bg-card p-8 max-w-5xl">
          <h2 className="text-xl font-bold">Adquirente PIX</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Gerencie por qual processador os pagamentos PIX da sua empresa entram.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-semibold">Configuração fora da lista atual</div>
                <div className="text-muted-foreground mt-1">
                  A sua conta está associada à adquirente (id interno 44), que não aparece entre as
                  opções disponíveis. Escolha uma adquirente abaixo e salve para atualizar, ou
                  contacte o suporte.
                </div>
              </div>
            </div>

            <div className="flex gap-3 rounded-lg border bg-muted/40 p-4">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold">Em breve:</span>{" "}
                <span className="text-muted-foreground">
                  taxa de conversão por adquirente nesta tela, para você comparar desempenho com
                  mais clareza.
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {options.map((opt) => {
                const active = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-5 text-center transition-all",
                      active ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"
                    )}
                  >
                    <div className="font-bold">{opt.name}</div>
                    <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border-2",
                          active ? "border-primary bg-primary" : "border-border"
                        )}
                      >
                        {active && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <span>{active ? "Selecionado" : "Toque para selecionar."}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className={cn("text-sm", selected ? "text-success" : "text-destructive")}>
                {selected
                  ? "Pronto para salvar a configuração."
                  : "Selecione uma adquirente da lista e salve para atualizar a configuração."}
              </div>
              <button
                disabled={!selected}
                onClick={() => toast.success("Preferência salva")}
                className={cn(
                  "rounded-md px-5 py-2.5 text-sm font-medium",
                  selected
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Salvar preferência
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
