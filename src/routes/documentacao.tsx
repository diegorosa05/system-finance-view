import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/top-bar";

export const Route = createFileRoute("/documentacao")({
  head: () => ({
    meta: [
      { title: "Documentação da API — Cashyin" },
      {
        name: "description",
        content:
          "Referência completa da API Cashyin: Pix Cash-in, Pix Cash-out, Saldo, Webhooks, autenticação e tratamento de erros.",
      },
    ],
  }),
  component: DocsPage,
});

const sections = [
  { id: "intro", title: "Introdução" },
  { id: "conventions", title: "Convenções" },
  { id: "auth", title: "Autenticação" },
  { id: "balance", title: "Saldo" },
  { id: "cash-in", title: "Pix Cash-in" },
  { id: "cash-out", title: "Pix Cash-out" },
  { id: "webhooks", title: "Webhooks" },
  { id: "fees", title: "Tarifas" },
  { id: "errors", title: "Erros" },
];

function DocsPage() {
  return (
    <>
      <TopBar
        title="Documentação da API"
        subtitle="Receba e envie Pix programaticamente com a API Cashyin v1"
      />
      <div className="px-8 pb-16 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 max-w-6xl">
        <aside className="lg:sticky lg:top-6 h-fit space-y-1 text-sm">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {s.title}
            </a>
          ))}
          <a
            href="https://docs.cashyin.com/docs"
            target="_blank"
            rel="noreferrer"
            className="mt-4 block rounded-md border px-3 py-2 text-center text-xs font-medium hover:bg-muted"
          >
            docs.cashyin.com ↗
          </a>
        </aside>

        <article className="space-y-12 text-sm leading-relaxed">
          <Section id="intro" title="Introdução">
            <p className="text-muted-foreground">
              A <strong>API Cashyin</strong> permite que sua aplicação receba e envie dinheiro via Pix
              de forma programática: gere cobranças Pix (QR Code) para receber pagamentos
              (<em>cash-in</em>), envie transferências Pix a partir do seu saldo (<em>cash-out</em>),
              consulte o saldo e acompanhe toda transação em tempo real via webhooks.
            </p>
            <KV
              rows={[
                ["Base URL (Produção)", "https://api.cashyin.com/v1"],
                ["Formato", "JSON · UTF-8"],
                ["Autenticação", "Bearer token (API Key)"],
                ["Moeda", "BRL (sempre em centavos)"],
                ["Datas", "ISO 8601 em UTC"],
              ]}
            />
          </Section>

          <Section id="conventions" title="Convenções">
            <h3 className="font-semibold mt-2">Valores monetários</h3>
            <p className="text-muted-foreground">
              Todos os valores são representados em <strong>centavos</strong> (inteiros) para evitar
              problemas de arredondamento.
            </p>
            <KV
              rows={[
                ["R$ 1,00", "100"],
                ["R$ 50,00", "5000"],
                ["R$ 1.250,99", "125099"],
              ]}
            />

            <h3 className="font-semibold mt-6">Identificadores</h3>
            <KV
              rows={[
                ["txid", "ID público do Pix gerado pela Cashyin (cash-in)"],
                ["id", "UUID v4 do cash-out"],
                ["external_ref", "Sua referência (ex.: número do pedido)"],
                ["e2e_id", "End-to-End ID do Pix (após liquidação)"],
              ]}
            />

            <h3 className="font-semibold mt-6">Idempotência</h3>
            <ul className="space-y-1 text-muted-foreground list-disc pl-5">
              <li>
                <strong className="text-foreground">Cash-in:</strong> usa o <code className="kbd">external_ref</code> como
                chave de retry — reenviar o mesmo valor retorna a cobrança original.
              </li>
              <li>
                <strong className="text-foreground">Cash-out:</strong> exige o header{" "}
                <code className="kbd">Idempotency-Key</code>. Mesma chave + mesmo body replica a resposta;
                mesma chave + body diferente retorna <code className="kbd">409</code>.
              </li>
            </ul>
          </Section>

          <Section id="auth" title="Autenticação">
            <p className="text-muted-foreground">
              Toda requisição a <code className="kbd">/v1/*</code> deve incluir sua API Key como{" "}
              <strong>Bearer token</strong> no header <code className="kbd">Authorization</code>. A chave
              começa com <code className="kbd">ck_</code> e é única por conta.
            </p>
            <Code>{`curl -X GET "https://api.cashyin.com/v1/balance" \\
  -H "Authorization: Bearer ck_your_api_key_here"`}</Code>
            <Callout tone="warning" title="Segurança">
              Nunca exponha sua API Key em código frontend (JavaScript do navegador, apps mobile).
              A API deve ser consumida exclusivamente a partir do seu <strong>backend</strong>.
            </Callout>
          </Section>

          <Section id="balance" title="Saldo">
            <Endpoint method="GET" path="/v1/balance" />
            <p className="text-muted-foreground">
              Retorna o saldo atual da conta autenticada, sempre em centavos.
            </p>
            <Code>{`curl https://api.cashyin.com/v1/balance \\
  -H "Authorization: Bearer ck_..."`}</Code>
            <p className="font-semibold mt-3">Resposta 200</p>
            <Code>{`{
  "available": 125099,
  "blocked": 0,
  "total": 125099,
  "currency": "BRL",
  "updated_at": "2026-05-29T07:09:26.615Z"
}`}</Code>
          </Section>

          <Section id="cash-in" title="Pix Cash-in (recebendo)">
            <p className="text-muted-foreground">
              Gere uma cobrança Pix com QR Code. Status inicial é <code className="kbd">pending</code>.
              Quando o pagamento é confirmado, o valor líquido (<code className="kbd">amount − fee</code>)
              é creditado e o webhook <code className="kbd">pix.cash_in.paid</code> é disparado.
            </p>

            <Endpoint method="POST" path="/v1/pix/cash-in/qrcode" />
            <p className="font-semibold mt-2">Body</p>
            <Code>{`{
  "amount": 15000,
  "external_ref": "order-12345",
  "description": "Pedido #12345",
  "expires_in": 3600,
  "payer": {
    "name": "Maria Silva",
    "document": "12345678900"
  }
}`}</Code>
            <p className="font-semibold mt-3">Resposta 201</p>
            <Code>{`{
  "txid": "2bfe903bb8c94121ac9be074c92062f4",
  "type": "cash_in",
  "amount": 15000,
  "external_ref": "order-12345",
  "status": "pending",
  "qr_code": "00020101021226850014br.gov.bcb.pix...",
  "qr_code_image": null,
  "expires_at": "2026-05-29T20:30:00.000Z",
  "created_at": "2026-05-29T19:30:00.000Z",
  "paid_at": null,
  "e2e_id": null,
  "payer": null,
  "description": "Pedido #12345"
}`}</Code>

            <Endpoint method="GET" path="/v1/pix/cash-in/{txid}" />
            <p className="text-muted-foreground">
              Consulta uma cobrança pelo <code className="kbd">txid</code>, escopada à sua conta.
            </p>

            <h3 className="font-semibold mt-4">Status possíveis</h3>
            <StatusList
              items={[
                ["pending", "Aguardando pagamento"],
                ["paid", "Pagamento confirmado e creditado"],
                ["expired", "QR Code expirou sem pagamento"],
                ["cancelled", "Cobrança cancelada"],
                ["failed", "Falha no processamento"],
                ["refunded", "Pagamento estornado ao pagador"],
              ]}
            />
          </Section>

          <Section id="cash-out" title="Pix Cash-out (enviando)">
            <p className="text-muted-foreground">
              Envia uma transferência Pix para a chave de destino. O valor é debitado do seu saldo
              imediatamente. Cash-out <strong>exige</strong> o header{" "}
              <code className="kbd">Idempotency-Key</code>.
            </p>

            <Endpoint method="POST" path="/v1/pix/cash-out" />
            <p className="font-semibold mt-2">Headers</p>
            <Code>{`Authorization: Bearer ck_...
Content-Type: application/json
Idempotency-Key: 9f3c8a4e-1d2b-4f5a-9c8d-7e6f5a4b3c2d`}</Code>

            <p className="font-semibold mt-3">Body</p>
            <Code>{`{
  "amount": 25000,
  "pix_key": "maria@email.com",
  "pix_key_type": "email",
  "external_ref": "withdrawal-789",
  "description": "Saque cliente #789"
}`}</Code>

            <p className="font-semibold mt-3">Resposta 201</p>
            <Code>{`{
  "id": "b3d4e5f6-7a8b-4c9d-aef0-1234567890ab",
  "type": "cash_out",
  "amount": 25000,
  "external_ref": "withdrawal-789",
  "status": "processing",
  "pix_key": "maria@email.com",
  "pix_key_type": "email",
  "e2e_id": null,
  "receiver": {
    "name": null,
    "document": null,
    "bank": null
  },
  "created_at": "2026-05-29T19:35:00.000Z",
  "completed_at": null
}`}</Code>

            <Endpoint method="GET" path="/v1/pix/cash-out/{id}" />
            <p className="text-muted-foreground">
              Consulta o cash-out pelo <code className="kbd">id</code>. Sempre leia o{" "}
              <code className="kbd">status</code> do body — o código HTTP reflete apenas a criação do
              recurso, nunca a finalidade do pagamento.
            </p>

            <h3 className="font-semibold mt-4">Status possíveis</h3>
            <StatusList
              items={[
                ["processing", "Transferência em processamento na rede Pix"],
                ["completed", "Transferência concluída com sucesso"],
                ["failed", "Falha — valor devolvido ao saldo automaticamente"],
                ["returned", "Devolvida pela instituição — valor devolvido ao saldo"],
              ]}
            />

            <Callout tone="info" title="Reembolso automático">
              Se um cash-out falhar (<code className="kbd">failed</code> ou{" "}
              <code className="kbd">returned</code>), o valor é devolvido automaticamente ao seu saldo.
            </Callout>
          </Section>

          <Section id="webhooks" title="Webhooks">
            <p className="text-muted-foreground">
              Cadastre um endpoint na seção <strong>Webhooks</strong> do painel para receber
              notificações em tempo real. Valide a assinatura com o header{" "}
              <code className="kbd">X-Cashyin-Signature</code> (HMAC-SHA256 do corpo cru).
            </p>

            <h3 className="font-semibold mt-2">Eventos disponíveis</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <EventGroup
                title="Cash-in"
                events={[
                  "pix.cash_in.paid",
                  "pix.cash_in.expired",
                  "pix.cash_in.cancelled",
                  "pix.cash_in.failed",
                  "pix.cash_in.refunded",
                ]}
              />
              <EventGroup
                title="Cash-out"
                events={[
                  "pix.cash_out.processing",
                  "pix.cash_out.completed",
                  "pix.cash_out.failed",
                  "pix.cash_out.returned",
                ]}
              />
            </div>

            <p className="font-semibold mt-4">Exemplo de payload</p>
            <Code>{`{
  "event": "pix.cash_in.paid",
  "created_at": "2026-05-29T19:42:11.000Z",
  "data": {
    "txid": "2bfe903bb8c94121ac9be074c92062f4",
    "type": "cash_in",
    "amount": 15000,
    "external_ref": "order-12345",
    "status": "paid",
    "e2e_id": "E12345678202605291942abcdef123456",
    "paid_at": "2026-05-29T19:42:10.000Z"
  }
}`}</Code>
          </Section>

          <Section id="fees" title="Tarifas">
            <KV
              rows={[
                ["Cash-in", "R$ 0,15 (15 centavos) por transação"],
                ["Cash-out", "R$ 0,15 (15 centavos) por transação"],
              ]}
            />
            <p className="text-muted-foreground mt-2">
              No cash-in, o valor líquido (<code className="kbd">amount − fee</code>) é creditado ao
              saldo. No cash-out, o valor solicitado é debitado e a tarifa é aplicada internamente —
              não aparece no contrato público.
            </p>
          </Section>

          <Section id="errors" title="Tratamento de erros">
            <p className="text-muted-foreground">Todo erro segue o mesmo envelope:</p>
            <Code>{`{
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição legível do erro.",
    "request_id": "req-abc123"
  }
}`}</Code>
            <h3 className="font-semibold mt-4">Códigos HTTP</h3>
            <StatusList
              items={[
                ["400", "Bad Request — corpo inválido"],
                ["401", "Unauthorized — API key ausente ou inválida"],
                ["402", "Payment Required — saldo insuficiente"],
                ["404", "Not Found — recurso inexistente"],
                ["409", "Conflict — Idempotency-Key reutilizada com body diferente"],
                ["422", "Unprocessable Entity — validação de negócio falhou"],
                ["429", "Too Many Requests — limite de requisições excedido"],
                ["500", "Internal Server Error"],
              ]}
            />
          </Section>
        </article>
      </div>
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4 tracking-tight">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="rounded-lg bg-primary text-primary-foreground p-4 overflow-x-auto text-xs font-mono leading-relaxed">
      {children}
    </pre>
  );
}

function Endpoint({ method, path }: { method: "GET" | "POST" | "PUT" | "DELETE"; path: string }) {
  const tone =
    method === "GET"
      ? "bg-success/15 text-success"
      : method === "POST"
        ? "bg-accent/20 text-primary"
        : "bg-warning/15 text-warning";
  return (
    <div className="flex items-center gap-3 rounded-md border bg-muted/40 px-3 py-2 font-mono text-sm">
      <span className={`rounded px-2 py-0.5 text-[11px] font-bold ${tone}`}>{method}</span>
      <span className="truncate">{path}</span>
    </div>
  );
}

function KV({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-lg border divide-y bg-card text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[180px_1fr] gap-4 px-4 py-2.5">
          <div className="font-medium">{k}</div>
          <div className="font-mono text-xs text-muted-foreground">{v}</div>
        </div>
      ))}
    </div>
  );
}

function StatusList({ items }: { items: [string, string][] }) {
  return (
    <ul className="space-y-1.5">
      {items.map(([code, desc]) => (
        <li key={code} className="flex gap-3 text-sm">
          <code className="kbd shrink-0 min-w-[90px] text-center">{code}</code>
          <span className="text-muted-foreground">{desc}</span>
        </li>
      ))}
    </ul>
  );
}

function EventGroup({ title, events }: { title: string; events: string[] }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase mb-2">
        {title}
      </div>
      <ul className="space-y-1">
        {events.map((e) => (
          <li key={e}>
            <code className="kbd text-xs">{e}</code>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Callout({
  tone,
  title,
  children,
}: {
  tone: "info" | "warning";
  title: string;
  children: React.ReactNode;
}) {
  const cls =
    tone === "warning"
      ? "border-warning/30 bg-warning/10"
      : "border-accent/30 bg-accent/10";
  return (
    <div className={`rounded-lg border p-4 text-sm ${cls}`}>
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
