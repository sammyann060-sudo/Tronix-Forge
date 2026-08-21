import { createFileRoute, Link } from "@tanstack/react-router";
import { Rocket, Sparkles } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/deployments")({
  head: () => ({
    meta: [
      { title: "Deployments — Tronix Forge Trading Platform" },
      {
        name: "description",
        content: "View deployment activity and build history across all your Tronix Forge sites.",
      },
      { property: "og:title", content: "Deployments — Tronix Forge Trading Platform" },
      {
        property: "og:description",
        content: "View deployment activity and build history across all your sites.",
      },
    ],
  }),
  component: DeploymentsPage,
});

function DeploymentsPage() {
  return (
    <AppShell>
      <PageHeader
        icon={Rocket}
        title="Deployments"
        subtitle="View all deployment activity across your sites"
      />
      <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card/50 p-16 text-center">
        <div>
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-accent">
            <Rocket className="size-9 text-primary" />
          </div>
          <h2 className="mt-6 text-2xl font-bold">No deployments yet</h2>
          <p className="mt-2 text-muted-foreground">
            Create a site and deploy it to see deployment history here.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
          >
            Create your first site <Sparkles className="size-4" />
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
