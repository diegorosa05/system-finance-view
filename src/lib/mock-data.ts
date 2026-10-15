export const user = {
  name: "Jose Nilton do...",
  fullName: "Jose Nilton",
  email: "conta1@veilslabs.io",
  account: "PAGAMENTOSS G...",
};

export const salesVolume = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  value: 0,
}));

export const apiKeys = [
  {
    id: "1",
    name: "Chave Pública",
    type: "publishable",
    value: "pk_live_51HxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYZ",
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    name: "Chave Secreta",
    type: "secret",
    value: "sk_live_51HxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxAB",
    createdAt: "2026-01-15",
  },
];

export const webhooks = [
  {
    id: "wh_1",
    url: "https://api.veilslabs.io/webhooks/cashyin",
    events: ["payment.succeeded", "payment.failed"],
    active: true,
  },
];

export const extrato: Array<{
  id: string;
  date: string;
  description: string;
  type: "in" | "out";
  amount: number;
  balance: number;
}> = [];
