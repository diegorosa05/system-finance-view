import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, StatusBadge } from "@/components/kit";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Odyssey Core" },
      { name: "description", content: "Organization profile, team security, two-factor authentication and notification preferences." },
      { property: "og:title", content: "Settings — Odyssey Core" },
      { property: "og:description", content: "Account, security and preferences." },
    ],
  }),
  component: Page,
});

const save = () => toast.success("Changes saved");

function Row({ t, d, on = true }: { t: string; d: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4">
      <div><div className="text-sm font-medium">{t}</div><div className="text-xs text-muted-foreground">{d}</div></div>
      <Switch defaultChecked={on} onCheckedChange={() => save()} />
    </div>
  );
}

function Page() {
  return (
    <>
      <PageHeader eyebrow="Workspace" title="Settings" desc="Account, team, security and preferences." />
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-muted"><TabsTrigger value="profile">Profile</TabsTrigger><TabsTrigger value="security">Security</TabsTrigger><TabsTrigger value="team">Team</TabsTrigger><TabsTrigger value="prefs">Preferences</TabsTrigger></TabsList>
        <TabsContent value="profile">
          <Panel title="Organization">
            <form className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); save(); }}>
              <div className="space-y-1.5"><Label>Legal name</Label><Input defaultValue="Odyssey Pagamentos LTDA" /></div>
              <div className="space-y-1.5"><Label>CNPJ</Label><Input defaultValue="48.112.903/0001-27" /></div>
              <div className="space-y-1.5"><Label>Support email</Label><Input defaultValue="ops@odyssey.com" /></div>
              <div className="space-y-1.5"><Label>Settlement account</Label><Input defaultValue="Odyssey Ledger · acc_main" /></div>
              <div className="sm:col-span-2"><Button type="submit">Save changes</Button></div>
            </form>
          </Panel>
        </TabsContent>
        <TabsContent value="security">
          <Panel title="Security"><div className="max-w-2xl divide-y divide-border">
            <Row t="Two-factor authentication" d="Require TOTP for every dashboard sign-in." />
            <Row t="IP allowlist for API" d="Only accept live-key requests from 4 registered ranges." />
            <Row t="Dual approval for transfers" d="Transfers above R$ 50.000 need a second approver." />
            <Row t="Session timeout" d="Sign out after 30 minutes of inactivity." on={false} />
          </div></Panel>
        </TabsContent>
        <TabsContent value="team">
          <Panel title="Members" bodyClass="p-0" action={<Button size="sm" variant="outline" onClick={() => toast.success("Invite sent")}>Invite</Button>}>
            <ul className="divide-y divide-border">
              {[["Diego Rosa", "diego@odyssey.com", "Admin"], ["Larissa Pires", "larissa@odyssey.com", "Operator"], ["Marcos Teixeira", "marcos@odyssey.com", "Developer"], ["Isabela Rocha", "isabela@odyssey.com", "Finance"]].map(([n, e, r]) => (
                <li key={e} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-orbit/15 text-xs font-semibold text-orbit">{n!.split(" ").map((w) => w[0]).join("")}</span>
                  <div className="min-w-0 flex-1"><div className="text-sm font-medium">{n}</div><div className="truncate text-xs text-muted-foreground">{e}</div></div>
                  <span className="text-xs text-muted-foreground">{r}</span>
                  <StatusBadge status="active" />
                </li>
              ))}
            </ul>
          </Panel>
        </TabsContent>
        <TabsContent value="prefs">
          <Panel title="Notifications"><div className="max-w-2xl divide-y divide-border">
            <Row t="Rail incidents" d="Email and Slack when a rail is degraded." />
            <Row t="Settlement exceptions" d="Alert finance when reconciliation finds mismatches." />
            <Row t="Weekly report" d="Monday summary of volume and revenue." on={false} />
          </div></Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}
