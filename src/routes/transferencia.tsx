import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wallet, ArrowLeft, Send, Eye, CheckCircle2 } from "lucide-react";
import { TopBar } from "@/components/top-bar";
import { Stepper } from "@/components/stepper";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/transferencia")({
  head: () => ({ meta: [{ title: "Transferência PIX — Cashyin" }] }),
  component: TransferenciaPage,
});

const steps = ["Dados", "Verificação", "Confirmação"];

function TransferenciaPage() {
  const [step, setStep] = useState(0);
  const [key, setKey] = useState("");
  const [amount, setAmount] = useState("");
  const numeric = parseFloat(amount.replace(/\D/g, "")) / 100 || 0;

  return (
    <>
      <TopBar title="Transferência PIX" subtitle="Realize transferências via PIX para qualquer banco" />
      <div className="px-8 pb-10">
        <div className="mx-auto max-w-2xl">
          <Stepper steps={steps} current={step} />

          {step === 0 && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-5 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                    Saldo Disponível
                  </div>
                  <div className="text-xl font-bold">R$ 0,00</div>
                </div>
                <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground">
                  <Eye className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-lg border bg-card p-5">
                <label className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Chave PIX do destinatário
                </label>
                <input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                  className="mt-2 w-full rounded-md border bg-card px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="rounded-lg border bg-card p-5">
                <label className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Valor da Transferência
                </label>
                <input
                  inputMode="numeric"
                  value={amount ? `R$ ${numeric.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : ""}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="R$ 0,00"
                  className="mt-2 w-full bg-transparent text-3xl font-bold outline-none placeholder:text-muted-foreground/40"
                />
                <div className="mt-1 text-xs text-muted-foreground">Mínimo R$ 1,00</div>
              </div>

              <div className="flex gap-3">
                <button
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-md border bg-card px-4 py-3 text-sm font-medium text-muted-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </button>
                <button
                  disabled={!key || numeric < 1}
                  onClick={() => setStep(1)}
                  className={cn(
                    "flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium",
                    key && numeric >= 1
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Continuar <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-lg border bg-card p-6 space-y-4">
              <h3 className="font-bold">Confirme os dados</h3>
              <Row label="Destinatário" value={key} />
              <Row label="Chave PIX" value={key} />
              <Row
                label="Valor"
                value={`R$ ${numeric.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              />
              <Row label="Tipo" value="Transferência PIX" />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 rounded-md border bg-card px-4 py-3 text-sm font-medium hover:bg-muted"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Confirmar transferência
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-lg border bg-card p-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-xl font-bold">Transferência realizada</h3>
              <p className="text-sm text-muted-foreground">
                R$ {numeric.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} enviado para{" "}
                <span className="font-medium text-foreground">{key}</span>.
              </p>
              <button
                onClick={() => {
                  setStep(0);
                  setKey("");
                  setAmount("");
                }}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Nova transferência
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b pb-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
