import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, Copy, CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Stepper } from "@/components/stepper";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/deposito")({
  head: () => ({ meta: [{ title: "Depósito — Cashyin" }] }),
  component: DepositoPage,
});

const steps = ["Dados", "QR Code", "Confirmação"];

function DepositoPage() {
  const [step, setStep] = useState(0);
  const [amount, setAmount] = useState("");
  const numeric = parseFloat(amount.replace(/\D/g, "")) / 100 || 0;

  return (
    <>
      <TopBar title="Depósito" subtitle="Realize depósitos via PIX na sua conta" />
      <div className="px-8 pb-10">
        <div className="mx-auto max-w-2xl">
          <Stepper steps={steps} current={step} />

          {step === 0 && (
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-lg border bg-card p-6">
                <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
                <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Valor do Depósito
                </div>
                <input
                  inputMode="numeric"
                  value={amount ? `R$ ${numeric.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="R$ 0,00"
                  className="mt-2 w-full bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground/40"
                />
                <div className="mt-2 text-xs text-muted-foreground">Mínimo R$ 1,00</div>
              </div>
              <button
                disabled={numeric < 1}
                onClick={() => setStep(1)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 rounded-md py-3.5 text-sm font-medium",
                  numeric >= 1
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <QrCode className="h-4 w-4" /> Gerar QR Code PIX
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-lg border bg-card p-8 text-center space-y-4">
              <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
                <QrCode className="h-32 w-32 text-primary" strokeWidth={1} />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Valor</div>
                <div className="text-2xl font-bold">
                  R$ {numeric.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText("00020126...cashyin-mock-pix-code");
                  toast.success("Código PIX copiado");
                }}
                className="inline-flex items-center gap-2 rounded-md border bg-card px-4 py-2 text-sm hover:bg-muted"
              >
                <Copy className="h-4 w-4" /> Copiar código PIX
              </button>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 rounded-md border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Já paguei
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-lg border bg-card p-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-xl font-bold">Depósito confirmado</h3>
              <p className="text-sm text-muted-foreground">
                R$ {numeric.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} foi creditado na
                sua conta.
              </p>
              <button
                onClick={() => {
                  setStep(0);
                  setAmount("");
                }}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Novo depósito
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
