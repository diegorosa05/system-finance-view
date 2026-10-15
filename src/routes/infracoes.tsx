import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { AccountBanner } from "@/components/account-banner";
import { EmptyState } from "@/components/empty-state";

export const Route = createFileRoute("/infracoes")({
  head: () => ({ meta: [{ title: "Infrações — Cashyin" }] }),
  component: InfracoesPage,
});

function InfracoesPage() {
  return (
    <>
      <TopBar title="Infrações" subtitle="Acompanhe chargebacks e disputas das suas transações" />
      <AccountBanner />
      <div className="px-8 pb-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Abertas", value: "0", color: "bg-warning" },
            { label: "Em análise", value: "0", color: "bg-info" },
            { label: "Resolvidas", value: "0", color: "bg-success" },
          ].map((s) => (
            <div key={s.label} className="relative overflow-hidden rounded-lg border bg-card p-5">
              <div className={`absolute inset-x-0 top-0 h-1 ${s.color}`} />
              <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                {s.label}
              </div>
              <div className="mt-1 text-2xl font-bold">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-card">
          <EmptyState
            icon={AlertTriangle}
            title="Nenhuma infração registrada"
            description="Você não possui contestações ou chargebacks no momento. Continue assim!"
          />
        </div>
      </div>
    </>
  );
}
