import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutGrid, ArrowLeftRight, QrCode, Wallet, Send, Network, Scale, LineChart, Code2, Settings,
  PanelLeftClose, PanelLeftOpen, Search, Bell, Menu, ChevronDown, LogOut, User, Sun, Moon, Languages,
} from "lucide-react";
import { usePrefs, type Lang } from "@/lib/prefs";
import { cn } from "@/lib/utils";
import { Logo } from "./kit";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const nav = [
  { group: "Operate", items: [
    { to: "/", label: "Overview", icon: LayoutGrid },
    { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
    { to: "/payments", label: "Payments", icon: QrCode },
    { to: "/accounts", label: "Accounts", icon: Wallet },
    { to: "/transfers", label: "Transfers", icon: Send },
  ]},
  { group: "Infrastructure", items: [
    { to: "/rails", label: "Payment Rails", icon: Network },
    { to: "/settlement", label: "Settlement", icon: Scale },
    { to: "/analytics", label: "Analytics", icon: LineChart },
  ]},
  { group: "Build", items: [
    { to: "/developers", label: "API & Developers", icon: Code2 },
    { to: "/settings", label: "Settings", icon: Settings },
  ]},
] as const;

function NavList({ collapsed, onNav }: { collapsed: boolean; onNav?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
      {nav.map((g) => (
        <div key={g.group}>
          {!collapsed && <div className="label-caps px-2.5 pb-2">{g.group}</div>}
          <ul className="flex flex-col gap-0.5">
            {g.items.map((it) => {
              const active = it.to === "/" ? path === "/" : path.startsWith(it.to);
              const link = (
                <Link
                  to={it.to}
                  onClick={onNav}
                  className={cn(
                    "group relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-[13px] transition-colors",
                    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    collapsed && "justify-center px-0",
                  )}
                >
                  {active && <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-mint" />}
                  <it.icon className={cn("size-[17px] shrink-0", active ? "text-mint" : "")} strokeWidth={1.7} />
                  {!collapsed && <span className="truncate">{it.label}</span>}
                </Link>
              );
              return (
                <li key={it.to}>
                  {collapsed ? (
                    <Tooltip><TooltipTrigger asChild>{link}</TooltipTrigger><TooltipContent side="right">{it.label}</TooltipContent></Tooltip>
                  ) : link}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function StatusFooter({ collapsed }: { collapsed: boolean }) {
  if (collapsed) return <div className="flex justify-center py-4"><span className="size-2 rounded-full bg-mint pulse-dot" /></div>;
  return (
    <div className="m-3 rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
      <div className="flex items-center gap-2 text-xs font-medium"><span className="size-1.5 rounded-full bg-mint pulse-dot" />All systems operational</div>
      <div className="mt-1 text-[11px] text-muted-foreground">Every route accounted for.</div>
    </div>
  );
}

const langs: { id: Lang; label: string; short: string }[] = [
  { id: "pt", label: "Português", short: "PT" }, { id: "en", label: "English", short: "EN" }, { id: "zh", label: "中文", short: "中文" },
];

function PrefControls() {
  const { lang, setLang, theme, setTheme } = usePrefs();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium hover:bg-accent" aria-label="Language">
          <Languages className="size-4" /><span data-no-translate>{langs.find((l) => l.id === lang)?.short}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40" data-no-translate>
          {langs.map((l) => (
            <DropdownMenuItem key={l.id} onClick={() => setLang(l.id)} className={cn(lang === l.id && "font-semibold")}>
              {l.label}{lang === l.id && <span className="ml-auto size-1.5 rounded-full bg-mint" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Toggle theme" title={theme === "dark" ? "Light mode" : "Dark mode"}>
        {theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
      </button>
    </>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [env, setEnv] = useState<"live" | "sandbox">("live");

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex min-h-screen">
        <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-300 lg:flex", collapsed ? "w-[68px]" : "w-[248px]")}>
          <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", collapsed ? "justify-center" : "justify-between")}>
            <Logo collapsed={collapsed} />
            {!collapsed && (
              <button onClick={() => setCollapsed(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground" aria-label="Collapse sidebar">
                <PanelLeftClose className="size-4" />
              </button>
            )}
          </div>
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="mx-auto mt-3 rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground" aria-label="Expand sidebar">
              <PanelLeftOpen className="size-4" />
            </button>
          )}
          <NavList collapsed={collapsed} />
          <StatusFooter collapsed={collapsed} />
        </aside>

        <Sheet open={mobile} onOpenChange={setMobile}>
          <SheetContent side="left" className="flex w-[260px] flex-col bg-sidebar p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex h-16 items-center border-b border-sidebar-border px-4"><Logo /></div>
            <NavList collapsed={false} onNav={() => setMobile(false)} />
            <StatusFooter collapsed={false} />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-8">
            <button onClick={() => setMobile(true)} className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden" aria-label="Open menu"><Menu className="size-5" /></button>
            <button
              onClick={() => toast("Command palette", { description: "⌘K search is simulated in this mockup." })}
              className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-surface/60 px-3 text-sm text-muted-foreground transition-colors hover:border-orbit/30 md:max-w-md"
            >
              <Search className="size-4 shrink-0" />
              <span className="truncate">Search transactions, E2E IDs, accounts…</span>
              <kbd className="ml-auto hidden rounded border border-border px-1.5 font-mono text-[10px] sm:inline">⌘K</kbd>
            </button>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <div className="hidden items-center rounded-lg border border-border p-0.5 sm:flex">
                {(["live", "sandbox"] as const).map((e) => (
                  <button key={e} onClick={() => { setEnv(e); toast.success(`Switched to ${e} environment`); }}
                    className={cn("rounded-md px-2.5 py-1 text-xs capitalize transition-colors", env === e ? (e === "live" ? "bg-mint/15 text-mint" : "bg-amber/15 text-amber") : "text-muted-foreground hover:text-foreground")}>
                    {e}
                  </button>
                ))}
              </div>
              <PrefControls />
              <button onClick={() => toast("3 new alerts", { description: "USDT on Tron is running with elevated latency." })} className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Notifications">
                <Bell className="size-[18px]" />
                <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-amber" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-accent">
                  <span className="grid size-7 place-items-center rounded-md bg-orbit/20 text-xs font-semibold text-orbit">DR</span>
                  <span className="hidden text-left md:block">
                    <span className="block text-xs font-medium leading-tight">Diego Rosa</span>
                    <span className="block text-[11px] leading-tight text-muted-foreground">Odyssey · Admin</span>
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>diego@odyssey.com</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild><Link to="/settings"><User className="mr-2 size-4" />Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/developers"><Code2 className="mr-2 size-4" />API keys</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast("Signed out (simulated)")}><LogOut className="mr-2 size-4" />Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1400px] flex-1 space-y-6 px-4 py-6 md:px-8 md:py-8">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
