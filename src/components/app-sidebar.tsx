import { Link, useRouterState } from "@tanstack/react-router";
import logoDark from "@/assets/brand/logo-dark.svg";
import {
  LayoutGrid,
  ArrowLeftRight,
  DollarSign,
  Receipt,
  AlertTriangle,
  GitFork,
  Wallet,
  Send,
  Code2,
  Webhook,
  FileText,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { user } from "@/lib/mock-data";

const groups = [
  {
    items: [{ title: "Início", url: "/", icon: LayoutGrid }],
  },
  {
    label: "PAGAMENTOS",
    items: [
      { title: "Transações", url: "/transacoes", icon: ArrowLeftRight },
      { title: "Saque", url: "/saque", icon: DollarSign },
      { title: "Extrato", url: "/extrato", icon: Receipt },
      { title: "Infrações", url: "/infracoes", icon: AlertTriangle },
      { title: "Splits", url: "/splits", icon: GitFork },
    ],
  },
  {
    label: "ADQUIRENTES",
    items: [{ title: "PIX", url: "/pix", icon: Sparkles }],
  },
  {
    label: "BANKING",
    items: [
      { title: "Depósito", url: "/deposito", icon: Wallet },
      { title: "Transferência", url: "/transferencia", icon: Send },
    ],
  },
  {
    label: "DESENVOLVEDORES",
    items: [
      { title: "Chaves de API", url: "/chaves-api", icon: Code2 },
      { title: "Webhooks", url: "/webhooks", icon: Webhook },
      { title: "Documentação", url: "/documentacao", icon: FileText },
    ],
  },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex items-center px-6 h-16 border-b">
        <img src={logoDark} alt="Cashyin" className="h-7 w-auto" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {groups.map((g, idx) => (
          <div key={idx}>
            {g.label && (
              <div className="px-3 mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground">
                {g.label}
              </div>
            )}
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = pathname === item.url;
                return (
                  <li key={item.url}>
                    <Link
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t p-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
          JN
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{user.name}</div>
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
        </div>
        <button
          aria-label="Sair"
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
