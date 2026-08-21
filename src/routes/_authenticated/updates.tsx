import { createFileRoute } from "@tanstack/react-router";
import { Megaphone } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/updates")({
  head: () => ({
    meta: [
      { title: "Platform Updates — Tronix Forge" },
      {
        name: "description",
        content: "Release notes and changelog for the Tronix Forge trading platform.",
      },
      { property: "og:title", content: "Platform Updates — Tronix Forge" },
      { property: "og:description", content: "Release notes and changelog for Tronix Forge." },
    ],
  }),
  component: UpdatesPage,
});

const updates = [
  {
    date: "18 Aug 2026",
    tag: "New",
    title: "AI Bot Generator v2",
    body: "Strategy verification now runs before download, catching invalid DBot blocks automatically.",
  },
  {
    date: "02 Aug 2026",
    tag: "Improved",
    title: "Faster deployments",
    body: "Site builds are now roughly 3x faster with incremental asset caching.",
  },
  {
    date: "21 Jul 2026",
    tag: "New",
    title: "Earnings Hub",
    body: "All four income streams — payment agent, marketplace, AI credits and referrals — in one view.",
  },
];

function UpdatesPage() {
  return (
    <AppShell>
      <PageHeader
        icon={Megaphone}
        title="Platform Updates"
        subtitle="Everything shipping on Tronix Forge, newest first"
      />
      <ol className="relative space-y-6 border-l border-border pl-6">
        {updates.map((u) => (
          <li key={u.title} className="relative">
            <span className="absolute -left-[31px] top-2 size-3 rounded-full bg-gradient-brand" />
            <div className="card-surface p-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-gradient-brand text-brand-foreground">{u.tag}</Badge>
                <span className="text-sm text-muted-foreground">{u.date}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold">{u.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{u.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
