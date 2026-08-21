import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Pin } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/announcements")({
  head: () => ({
    meta: [
      { title: "Announcements — Tronix Forge" },
      {
        name: "description",
        content: "Product news, maintenance windows and payout notices from the Tronix Forge team.",
      },
      { property: "og:title", content: "Announcements — Tronix Forge" },
      { property: "og:description", content: "Product news and notices from the Tronix Forge team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnnouncementsPage,
});

const items = [
  {
    date: "Aug 18, 2026",
    tag: "Payments",
    pinned: true,
    title: "M-Pesa checkout is live",
    body: "You can now buy sites, AI credits and signal orders with M-Pesa. Choose M-Pesa at checkout, confirm the STK push, and your purchase unlocks instantly.",
  },
  {
    date: "Aug 09, 2026",
    tag: "AI",
    title: "AI Signals now delivers to Telegram groups",
    body: "Signal orders can target a channel or a group, with standby messages at every interval so you know the bot is alive.",
  },
  {
    date: "Jul 28, 2026",
    tag: "Platform",
    title: "Faster deployments",
    body: "Average build time is down to 38 seconds thanks to a new edge build pipeline.",
  },
];

function AnnouncementsPage() {
  return (
    <AppShell>
      <PageHeader
        icon={Megaphone}
        title="Announcements"
        subtitle="News, notices and product updates from the team"
      />
      <div className="space-y-4">
        {items.map((a) => (
          <article key={a.title} className="card-surface p-6">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-accent px-2.5 py-1 font-semibold text-primary">{a.tag}</span>
              <span className="text-muted-foreground">{a.date}</span>
              {a.pinned && (
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Pin className="size-3" /> Pinned
                </span>
              )}
            </div>
            <h2 className="mt-3 text-xl font-bold">{a.title}</h2>
            <p className="mt-2 text-muted-foreground">{a.body}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
