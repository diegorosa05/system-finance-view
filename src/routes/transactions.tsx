import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Stat } from "@/components/kit";
import { TxTable } from "@/components/tx-table";
import { transactions } from "@/lib/mock";

export const Route = createFileRoute("/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Odyssey Core" },
      { name: "description", content: "Search, filter and inspect every transaction across Pix, stablecoins and bank rails." },
      { property: "og:title", content: "Transactions — Odyssey Core" },
      { property: "og:description", content: "See the full transaction lifecycle." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHeader eyebrow="Operate" title="Transactions" desc="See the transaction lifecycle — from initiation to confirmation and reconciliation." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Today" value="13,882" delta={6.1} />
        <Stat label="Volume today" value="R$ 3.12M" delta={8.4} />
        <Stat label="Failed" value="0.59%" delta={-0.2} hint="of attempts" />
        <Stat label="Avg. ticket" value="R$ 224.70" delta={2.3} />
      </div>
      <TxTable data={transactions} />
    </>
  );
}
