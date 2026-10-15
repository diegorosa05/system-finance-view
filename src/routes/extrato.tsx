import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { AccountBanner } from "@/components/account-banner";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/extrato")({
  head: () => ({ meta: [{ title: "Extrato — Cashyin" }] }),
  component: ExtratoPage,
});

function ExtratoPage() {
  return (
    <>
      <TopBar title="Extrato" subtitle="Histórico completo de movimentações da sua conta" />
      <AccountBanner />
      <div className="px-8 pb-10">
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="border-b px-5 py-4 flex items-center justify-between">
            <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              Movimentações
            </div>
            <div className="text-sm text-muted-foreground">Saldo: <span className="font-bold text-foreground">R$ 0,00</span></div>
          </div>
          <EmptyState
            icon={Receipt}
            title="Nenhuma movimentação"
            description="Quando houver entradas ou saídas, elas aparecerão aqui em ordem cronológica."
          />
        </div>
      </div>
    </>
  );
}
