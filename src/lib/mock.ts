// Deterministic mock data (seeded) so SSR and client render identically.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const r = rng(42);
const pick = <T,>(a: readonly T[]) => a[Math.floor(r() * a.length)];

export type Status = "settled" | "pending" | "processing" | "failed" | "refunded";
export type Rail = "Pix" | "Pix Automático" | "USDC" | "USDT" | "TED" | "Boleto";

const merchants = [
  "Nuvem Commerce", "Lumen Saúde", "Vértice Logística", "Ápice Educação", "Cora Mobilidade",
  "Fluxo Energia", "Pampa Agro", "Brisa Viagens", "Orla Foods", "Kairo Games", "Terra Seguros",
  "Navi Fintech", "Selva Marketplace", "Atlas Imóveis", "Prisma Studio",
];
const people = [
  "Ana Ribeiro", "Bruno Lima", "Carla Mendes", "Diego Rosa", "Eduarda Alves", "Felipe Costa",
  "Gabriela Nunes", "Henrique Souza", "Isabela Rocha", "João Martins", "Larissa Pires", "Marcos Teixeira",
];
const rails: Rail[] = ["Pix", "Pix", "Pix", "Pix Automático", "USDC", "USDT", "TED", "Boleto"];
const statuses: Status[] = ["settled", "settled", "settled", "settled", "pending", "processing", "failed", "refunded"];

export type Tx = {
  id: string; e2e: string; date: Date; counterparty: string; merchant: string;
  rail: Rail; amount: number; fee: number; status: Status; direction: "in" | "out";
};

const hex = (n: number) => Array.from({ length: n }, () => Math.floor(r() * 16).toString(16)).join("");
const base = new Date("2026-10-15T15:00:00Z").getTime();

export const transactions: Tx[] = Array.from({ length: 140 }, (_, i) => {
  const amount = Math.round((r() < 0.15 ? 20000 + r() * 180000 : 40 + r() * 6000) * 100) / 100;
  return {
    id: `txn_${hex(4)}${hex(8)}`,
    e2e: `E${Math.floor(10000000 + r() * 89999999)}2026101${hex(6).toUpperCase()}`,
    date: new Date(base - i * (18 + r() * 70) * 60000),
    counterparty: pick(people),
    merchant: pick(merchants),
    rail: pick(rails),
    amount,
    fee: Math.round(amount * 0.0049 * 100) / 100,
    status: pick(statuses),
    direction: r() < 0.72 ? "in" : "out",
  };
});

export const volumeSeries = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(base - (29 - i) * 86400000);
  const trend = 1 + i * 0.025;
  return {
    day: d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
    pix: Math.round((1.6 + r() * 0.7) * trend * 1_000_000),
    stable: Math.round((0.35 + r() * 0.3) * trend * 1_000_000),
    other: Math.round((0.2 + r() * 0.15) * 1_000_000),
  };
});

export const hourly = Array.from({ length: 24 }, (_, h) => ({
  hour: `${String(h).padStart(2, "0")}h`,
  tps: Math.round(40 + Math.sin((h - 6) / 3.8) * 30 + r() * 18 + (h > 8 && h < 20 ? 40 : 0)),
  latency: Math.round(110 + r() * 60 + (h === 12 ? 40 : 0)),
}));

export const accounts = [
  { id: "acc_main", name: "Operating — BRL", currency: "BRL", balance: 4_823_190.42, available: 4_612_004.1, type: "Operating", bank: "Odyssey Ledger", change: 4.2 },
  { id: "acc_settle", name: "Settlement reserve", currency: "BRL", balance: 1_240_000, available: 1_240_000, type: "Reserve", bank: "Odyssey Ledger", change: 0 },
  { id: "acc_usdc", name: "Treasury — USDC", currency: "USDC", balance: 612_430.18, available: 598_002.77, type: "Stablecoin", bank: "Base · Circle", change: 12.8 },
  { id: "acc_usdt", name: "Treasury — USDT", currency: "USDT", balance: 184_220.5, available: 184_220.5, type: "Stablecoin", bank: "Tron", change: -2.1 },
  { id: "acc_split", name: "Split partners", currency: "BRL", balance: 318_774.9, available: 290_112.3, type: "Sub-ledger", bank: "Odyssey Ledger", change: 7.5 },
];

export const recipients = [
  { name: "Vértice Logística LTDA", key: "12.345.678/0001-90", type: "CNPJ", bank: "Itaú", last: "Oct 14" },
  { name: "Ana Ribeiro", key: "ana@ribeiro.com.br", type: "E-mail", bank: "Nubank", last: "Oct 13" },
  { name: "Pampa Agro S.A.", key: "+55 51 99812-3321", type: "Phone", bank: "Sicredi", last: "Oct 12" },
  { name: "Circle Treasury", key: "0x8a…f31C", type: "Wallet", bank: "Base", last: "Oct 11" },
  { name: "Orla Foods", key: "7b1c-9e2a-…-44d0", type: "EVP", bank: "Bradesco", last: "Oct 09" },
];

export const railsInfra = [
  { name: "Pix (SPI)", code: "PIX", status: "operational", uptime: 99.99, latency: 182, share: 61, volume: 52_400_000 },
  { name: "Pix Automático", code: "PIXA", status: "operational", uptime: 99.97, latency: 240, share: 9, volume: 7_800_000 },
  { name: "USDC on Base", code: "USDC", status: "operational", uptime: 99.95, latency: 2100, share: 14, volume: 12_100_000 },
  { name: "USDT on Tron", code: "USDT", status: "degraded", uptime: 99.62, latency: 4800, share: 6, volume: 5_200_000 },
  { name: "TED (STR)", code: "TED", status: "operational", uptime: 99.9, latency: 3600, share: 7, volume: 6_100_000 },
  { name: "Boleto", code: "BOL", status: "maintenance", uptime: 99.4, latency: 86400, share: 3, volume: 2_600_000 },
] as const;

export const settlements = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(base - i * 86400000);
  const gross = Math.round((2.1 + r() * 0.8) * 1_000_000);
  const fees = Math.round(gross * 0.0049);
  return {
    id: `stl_${hex(10)}`,
    date: d,
    gross, fees, net: gross - fees,
    txCount: Math.round(9000 + r() * 4000),
    status: i === 0 ? "pending" : i === 1 ? "processing" : i === 5 ? "exception" : "reconciled",
    mismatches: i === 5 ? 3 : 0,
  };
});

export const apiKeys = [
  { name: "Production — core", prefix: "ody_live_7Hq2", created: "Aug 02, 2026", lastUsed: "2 min ago", scopes: ["payments", "transfers", "ledger"] },
  { name: "Production — webhooks", prefix: "ody_live_Kp91", created: "Aug 02, 2026", lastUsed: "12 sec ago", scopes: ["events"] },
  { name: "Sandbox", prefix: "ody_test_3xZa", created: "Jul 18, 2026", lastUsed: "1 h ago", scopes: ["*"] },
];

export const webhooks = [
  { url: "https://api.nuvemcommerce.com/hooks/odyssey", events: ["payment.settled", "payment.failed"], success: 99.8, status: "active" },
  { url: "https://ops.lumen.health/odyssey/events", events: ["transfer.*"], success: 97.2, status: "active" },
  { url: "https://staging.kairo.gg/webhooks", events: ["*"], success: 81.4, status: "failing" },
];

export const apiLogs = Array.from({ length: 18 }, (_, i) => ({
  id: `req_${hex(12)}`,
  method: pick(["POST", "GET", "GET", "POST", "PATCH"]),
  path: pick(["/v1/payments", "/v1/payments/{id}", "/v1/transfers", "/v1/ledger/balances", "/v1/pix/qrcodes", "/v1/settlements"]),
  status: pick([200, 200, 200, 201, 201, 200, 400, 422, 500]),
  ms: Math.round(40 + r() * 280),
  time: new Date(base - i * 47000),
}));

export const brl = (n: number, c = "BRL") =>
  c === "BRL"
    ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : `${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${c}`;
export const compact = (n: number) =>
  "R$ " + Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(n);
export const fmtDate = (d: Date) =>
  d.toLocaleString("en-US", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Sao_Paulo" });
