import { Building2, User2, Calendar } from "lucide-react";
import { user } from "@/lib/mock-data";

interface TopBarProps {
  title: string;
  subtitle?: string;
  showDateTabs?: boolean;
}

export function TopBar({ title, subtitle, showDateTabs }: TopBarProps) {
  return (
    <header className="flex items-start justify-between gap-4 px-8 pt-6 pb-2">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {showDateTabs && (
          <>
            <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>31 mai 2026</span>
            </div>
            <div className="flex rounded-md border bg-card overflow-hidden text-sm">
              <button className="bg-primary text-primary-foreground px-3 py-2">Hoje</button>
              <button className="px-3 py-2 hover:bg-muted">Semana</button>
              <button className="px-3 py-2 hover:bg-muted">Mês</button>
            </div>
          </>
        )}
        <button className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm font-medium">
          <Building2 className="h-4 w-4" />
          <span className="max-w-[140px] truncate">{user.account}</span>
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-md border bg-card">
          <User2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
