import { createFileRoute } from "@tanstack/react-router";
import { Link2, Plus, CheckCircle2, Clock } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/domains")({
  head: () => ({
    meta: [
      { title: "Domains — Tronix Forge Trading Platform" },
      {
        name: "description",
        content: "Connect custom domains and subdomains to your Tronix Forge trading sites.",
      },
      { property: "og:title", content: "Domains — Tronix Forge Trading Platform" },
      {
        property: "og:description",
        content: "Connect custom domains and subdomains to your Tronix Forge trading sites.",
      },
    ],
  }),
  component: DomainsPage,
});

const domains = [
  { name: "signalmaster.site", status: "Live", ssl: true },
  { name: "alphabots.tronixforge.site", status: "Live", ssl: true },
  { name: "newventure.co.ke", status: "Pending DNS", ssl: false },
];

function DomainsPage() {
  return (
    <AppShell>
      <PageHeader
        icon={Link2}
        title="Domains"
        subtitle="Connect and verify domains for every site you run"
        action={
          <Button className="bg-gradient-brand text-brand-foreground shadow-brand">
            <Plus className="size-4" /> Add domain
          </Button>
        }
      />

      <div className="space-y-3">
        {domains.map((d) => (
          <div
            key={d.name}
            className="card-surface flex flex-wrap items-center justify-between gap-4 p-5"
          >
            <div className="flex items-center gap-4">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <Link2 className="size-4" />
              </span>
              <div>
                <p className="font-semibold">{d.name}</p>
                <p className="text-sm text-muted-foreground">
                  {d.ssl ? "SSL certificate active" : "Awaiting DNS propagation"}
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className={
                d.status === "Live"
                  ? "bg-success/15 text-success"
                  : "bg-warning/15 text-warning-foreground"
              }
            >
              {d.status === "Live" ? (
                <CheckCircle2 className="size-3" />
              ) : (
                <Clock className="size-3" />
              )}
              {d.status}
            </Badge>
          </div>
        ))}
      </div>

      <div className="card-surface mt-6 p-6">
        <h2 className="text-lg font-bold">DNS records</h2>
        <p className="text-sm text-muted-foreground">Point your registrar at these values.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                <th className="py-2 font-medium">Type</th>
                <th className="py-2 font-medium">Name</th>
                <th className="py-2 font-medium">Value</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              <tr className="border-b border-border">
                <td className="py-2">A</td>
                <td className="py-2">@</td>
                <td className="py-2">76.76.21.21</td>
              </tr>
              <tr>
                <td className="py-2">CNAME</td>
                <td className="py-2">www</td>
                <td className="py-2">cname.tronixforge.site</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
