import { createFileRoute } from "@tanstack/react-router";
import { Store, Bot, GraduationCap, Zap } from "lucide-react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_authenticated/bot-store")({
  head: () => ({
    meta: [
      { title: "Bot Store — Tronix Forge" },
      {
        name: "description",
        content: "Sell XML bots, EA bots, video courses and signal subscriptions from your own Tronix Forge storefront.",
      },
      { property: "og:title", content: "Bot Store — Tronix Forge" },
      { property: "og:description", content: "Your own storefront for bots, courses and signal subscriptions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BotStorePage,
});

const teasers = [
  { icon: Bot, title: "XML & EA bots", copy: "List your bots with pricing, previews and instant delivery." },
  { icon: GraduationCap, title: "Video courses", copy: "Bundle lessons and sell access to your trading students." },
  { icon: Zap, title: "Signal subscriptions", copy: "Recurring plans billed via M-Pesa or card, managed for you." },
];

function BotStorePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl py-10 text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-brand shadow-brand">
          <Store className="size-8 text-brand-foreground" />
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold">Bot Store</h1>
        <p className="mt-2 text-xl font-semibold text-gradient">Coming Soon</p>
        <p className="mt-4 text-muted-foreground">
          The Bot Store will let you create your own online shop to sell XML bots, EA bots, video courses, and signal
          subscriptions directly to your audience — all managed from this dashboard.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">Stay tuned for updates.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {teasers.map(({ icon: Icon, title, copy }) => (
          <div key={title} className="card-surface p-6">
            <div className="grid size-11 place-items-center rounded-xl bg-accent">
              <Icon className="size-5 text-primary" />
            </div>
            <h2 className="mt-4 font-bold">{title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
