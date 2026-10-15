import { createFileRoute } from "@tanstack/react-router";
import { GitFork, Plus } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { AccountBanner } from "@/components/account-banner";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";

export const Route = createFileRoute("/splits")({
  head: () => ({ meta: [{ title: "Splits — Cashyin" }] }),
  component: SplitsPage,
});

function SplitsPage() {
  return (
    <>
      <TopBar title="Splits" subtitle="Configure divisões automáticas de pagamento" />
      <AccountBanner />
      <div className="px-8 pb-10">
        <div className="rounded-lg border bg-card">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
              Splits configurados
            </div>
            <button
              onClick={() => toast.success("Em breve: criação de splits")}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" /> Novo split
            </button>
          </div>
          <EmptyState
            icon={GitFork}
            title="Nenhum split criado"
            description="Crie regras para dividir automaticamente o valor das transações entre múltiplos recebedores."
          />
        </div>
      </div>
    </>
  );
}
