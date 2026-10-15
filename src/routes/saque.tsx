import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Download,
  Wallet,
  ShieldAlert,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  ArrowUpRight,
  List,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { AccountBanner } from "@/components/account-banner";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/saque")({
  head: () => ({ meta: [{ title: "Saque — Cashyin" }] }),
  component: SaquePage,
});

function SaquePage() {
  const [tab, setTab] = useState("todos");
  const [view, setView] = useState<"lista" | "analise">("lista");

  return (
    <>
      <TopBar title="Transferências" subtitle="Gerencie suas transferências e saques" />
      <AccountBanner />

      <div className="px-8 pb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-lg border bg-card p-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Saldo Disponível
                  </div>
                  <div className="text-2xl font-bold">R$ 0,00</div>
                </div>
              </div>
              <button
                onClick={() => toast.info("Indo para transferência...")}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Transferir <DollarSign className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-card p-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-destructive" />
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-destructive/10">
                  <ShieldAlert className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Bloqueios Cautelares
                  </div>
                  <div className="text-2xl font-bold">R$ 0,00</div>
                </div>
              </div>
              <button className="inline-flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
                Ver detalhes <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MiniStat icon={CheckCircle2} color="text-success" label="Aprovados" value="0" />
          <MiniStat icon={Clock} color="text-warning" label="Pendentes" value="0" />
          <MiniStat icon={XCircle} color="text-destructive" label="Recusados" value="0" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {["Todos os períodos", "Hoje", "7 dias", "Este mês"].map((p, i) => (
            <button
              key={p}
              className={cn(
                "rounded-md border px-3 py-2 text-sm bg-card",
                i === 0 && "flex items-center gap-2"
              )}
            >
              {p}
            </button>
          ))}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Busque por ID da transferência ou status..."
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
              { id: "recusados", label: "Recusados" },
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
            icon={ArrowUpRight}
            title="Transferências não encontradas"
            description="Nenhuma transferência foi encontrada. Novas transferências aparecerão aqui quando realizadas."
          />
        </div>
      </div>
    </>
  );
}

function MiniStat({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: any;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4 flex items-center gap-3">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-md bg-muted", color)}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
          {label}
        </div>
        <div className="text-lg font-bold">{value}</div>
      </div>
    </div>
  );
}
