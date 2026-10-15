import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Eye, QrCode, CreditCard, Barcode } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { AccountBanner } from "@/components/account-banner";
import { StatCard } from "@/components/stat-card";
import { salesVolume, user } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — Odyssey Core" },
      { name: "description", content: "Visão geral do seu negócio na Odyssey Core." },
    ],
  }),
  component: HomePage,
});

const statusData = [
  { name: "Pagas", value: 0, color: "var(--color-info)" },
  { name: "Pendentes", value: 1, color: "var(--color-warning)" },
];

function HomePage() {
  return (
    <>
      <TopBar title="Início" subtitle="Visão geral do seu negócio" showDateTabs />
      <AccountBanner />

      <div className="px-8 pb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold">Bom dia, {user.fullName}</h2>
              <p className="text-sm text-muted-foreground">
                Confira tudo que está acontecendo na sua operação
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                Volume de Vendas
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesVolume}>
                  <defs>
                    <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="hour"
                    stroke="var(--color-muted-foreground)"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    interval={2}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#vol)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5">
            <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-4">
              Status das Transações
            </div>
            <div className="flex items-center gap-8">
              <div className="h-32 w-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                  0%
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <Row color="bg-info" label="Pagas" value="R$ 0,00" pct="0%" />
                <Row color="bg-warning" label="Pendentes" value="R$ 0,00" pct="100%" />
                <div className="border-t pt-3 flex items-center justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>R$ 0,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-5 flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                Saldo Disponível
              </div>
              <div className="mt-1 text-2xl font-bold">R$ 0,00</div>
            </div>
            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <StatCard label="Transações Pagas" value="R$ 0,00" highlighted />
          <StatCard label="Ticket Médio" value="R$ 0,00" />
          <StatCard label="Número de Transações Pagas" value="0" />
          <StatCard
            label="Valor em Estornos"
            value={
              <span>
                R$ 0 <span className="text-sm font-normal text-muted-foreground">0%</span>
              </span>
            }
          />

          <div className="rounded-lg border bg-card p-5">
            <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-3">
              Métodos de Pagamento
            </div>
            <div className="space-y-3 text-sm">
              <MethodRow icon={<QrCode className="h-4 w-4" />} label="PIX" pct="0.0%" />
              <MethodRow icon={<CreditCard className="h-4 w-4" />} label="Cartão" pct="0.0%" />
              <MethodRow icon={<Barcode className="h-4 w-4" />} label="Boleto" pct="0.0%" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Row({ color, label, value, pct }: { color: string; label: string; value: string; pct: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-medium">{value}</span>
        <span className="text-muted-foreground w-10 text-right">{pct}</span>
      </div>
    </div>
  );
}

function MethodRow({ icon, label, pct }: { icon: React.ReactNode; label: string; pct: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-foreground">{label}</span>
      </div>
      <span className="font-medium">{pct}</span>
    </div>
  );
}
