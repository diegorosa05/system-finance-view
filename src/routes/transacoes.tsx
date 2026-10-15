import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Download, Calendar, Coins, List, BarChart3 } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { AccountBanner } from "@/components/account-banner";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/transacoes")({
  head: () => ({
    meta: [{ title: "Transações — Cashyin" }],
  }),
  component: TransacoesPage,
});

function TransacoesPage() {
  const [tab, setTab] = useState("todos");
  const [view, setView] = useState<"lista" | "analise">("lista");
  const [period, setPeriod] = useState("mes");

  return (
    <>
      <TopBar title="Transações" subtitle="Gerencie todas as suas transações" />
      <AccountBanner />

      <div className="px-8 pb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat color="bg-primary" label="Transações" value="0" />
          <Stat color="bg-warning" label="Pendentes" value="0" valueColor="text-warning" />
          <Stat color="bg-success" label="Concluídas" value="0" valueColor="text-success" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" /> 01/05/2026 - 31/05/2026
          </button>
          {[
            { id: "hoje", label: "Hoje" },
            { id: "7dias", label: "7 dias" },
            { id: "mes", label: "Este mês" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm",
                period === p.id ? "bg-primary text-primary-foreground border-primary" : "bg-card"
              )}
            >
              {p.label}
            </button>
          ))}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Busque por ID, cliente ou método de pagamento..."
              className="w-full rounded-md border bg-card pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={() => toast.success("Exportação iniciada")}
            className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm"
          >
            <Download className="h-4 w-4" /> Exportar
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 rounded-md bg-muted p-1">
            {[
              { id: "todos", label: "Todos" },
              { id: "pendentes", label: "Pendentes" },
              { id: "concluidas", label: "Concluídas" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded px-3 py-1.5 text-sm",
                  tab === t.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 rounded-md bg-muted p-1">
            <button
              onClick={() => setView("lista")}
              className={cn(
                "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm",
                view === "lista" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <List className="h-3.5 w-3.5" /> Lista
            </button>
            <button
              onClick={() => setView("analise")}
              className={cn(
                "flex items-center gap-1.5 rounded px-3 py-1.5 text-sm",
                view === "analise" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              )}
            >
              <BarChart3 className="h-3.5 w-3.5" /> Análise
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <EmptyState
            icon={Coins}
            title="Transações não encontradas"
            description="Nenhuma transação corresponde aos filtros aplicados. Tente ajustar os critérios de busca."
          />
        </div>
      </div>
    </>
  );
}

function Stat({
  color,
  label,
  value,
  valueColor,
}: {
  color: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-card p-5">
      <div className={cn("absolute inset-x-0 top-0 h-1", color)} />
      <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </div>
      <div className={cn("mt-1 text-2xl font-bold", valueColor)}>{value}</div>
    </div>
  );
}
