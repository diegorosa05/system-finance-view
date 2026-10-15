import { useState } from "react";
import { CheckCircle2, ArrowRight, X } from "lucide-react";

export function AccountBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div className="mx-8 mb-6 flex items-center justify-between gap-4 rounded-lg border bg-card px-5 py-3.5">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-success" />
        <div className="text-sm">
          <span className="font-bold">Conta Aprovada.</span>{" "}
          <span className="text-muted-foreground">
            A Cashyin deseja à você uma excelente jornada conosco.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Gerente de Contas <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
