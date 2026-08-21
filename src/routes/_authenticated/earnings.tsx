import { createFileRoute } from "@tanstack/react-router";
import { DollarSign, CreditCard, ShoppingCart, Bot, Link2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings Hub — Tronix Forge Trading Platform" },
      {
        name: "description",
        content:
          "Track payment agent, marketplace, AI credit and referral income from your Tronix Forge sites.",
      },
      { property: "og:title", content: "Earnings Hub — Tronix Forge Trading Platform" },
      {
        property: "og:description",
        content: "Track every income stream from your Tronix Forge platform sites in one place.",
      },
    ],
  }),
  component: EarningsPage,
});

const streams = [
  {
    title: "Payment Agent",
    desc: "Your 22% share from M-Pesa deposits and withdrawals on your sites.",
    icon: CreditCard,
    meta: "0 transactions this period",
    footer: [
      ["$0.00", "Pending"],
      ["$0.00", "Paid Out"],
      ["0 / 0", "Dep / With"],
    ],
    accent: "from-brand to-brand-2",
  },
  {
    title: "Marketplace Sales",
    desc: "Earn from selling XML bots, PDFs and courses on your platform sites.",
    icon: ShoppingCart,
    meta: "Coming soon",
    footer: [],
    accent: "from-muted to-muted",
    soon: true,
  },
  {
    title: "AI Credits Referral",
    desc: "Your 20% share when users on your sites purchase AI Bot Generator credits.",
    icon: Bot,
    meta: "0 purchases this period",
    footer: [
      ["$0.00", "Pending"],
      ["$0.00", "Paid Out"],
      ["0", "Purchases"],
    ],
    accent: "from-chart-5 to-brand",
  },
  {
    title: "Site Referrals",
    desc: "Your 5% share of the markup your referrals generate.",
    icon: Link2,
    meta: "0 trades this period",
    footer: [
      ["$0.00", "Pending"],
      ["$0.00", "Paid Out"],
      ["0", "Referred Users"],
    ],
    accent: "from-success to-chart-2",
  },
];

const ranges = ["This Week", "This Month", "All Time"];

function EarningsPage() {
  const [range, setRange] = useState("This Month");

  return (
    <AppShell>
      <PageHeader
        icon={DollarSign}
        title="Earnings Hub"
        subtitle="Track all your income streams from your platform sites in one place"
      />

      <section className="relative overflow-hidden rounded-3xl bg-gradient-brand p-8 shadow-brand">
        <div className="flex flex-wrap items-end gap-10 text-brand-foreground">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] opacity-80">TOTAL EARNED</p>
            <p className="font-display text-5xl font-bold">$0.00</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] opacity-80">PENDING</p>
            <p className="font-display text-2xl font-bold">$0.00</p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] opacity-80">PAID OUT</p>
            <p className="font-display text-2xl font-bold">$0.00</p>
          </div>
        </div>
        <div className="mt-6 inline-flex rounded-full bg-background/15 p-1 backdrop-blur">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium text-brand-foreground transition-colors",
                range === r && "bg-background/85 text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </section>

      <p className="mt-6 inline-block rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
        Link your Deriv account to see amounts in your local currency
      </p>

      <h2 className="mb-4 mt-8 text-xs font-semibold tracking-[0.18em] text-muted-foreground">
        YOUR EARNING STREAMS
      </h2>

      <div className="grid gap-5 lg:grid-cols-2">
        {streams.map((s) => (
          <article
            key={s.title}
            className={cn("card-surface overflow-hidden", s.soon && "opacity-70")}
          >
            <div className={cn("h-1 w-full bg-gradient-to-r", s.accent)} />
            <div className="p-6">
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
                {!s.soon && <ArrowRight className="size-4 shrink-0 text-muted-foreground" />}
              </div>

              {s.soon ? (
                <p className="mt-6 text-sm font-medium text-muted-foreground">Coming soon</p>
              ) : (
                <>
                  <p className="mt-5 font-display text-4xl font-bold text-gradient">$0.00</p>
                  <p className="text-sm text-muted-foreground">{s.meta}</p>
                  <div className="mt-5 flex gap-8 border-t border-border pt-4">
                    {s.footer.map(([v, l]) => (
                      <div key={l}>
                        <p className="font-semibold">{v}</p>
                        <p className="text-xs text-muted-foreground">{l}</p>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-5 bg-gradient-brand text-brand-foreground shadow-brand">
                    View details <ArrowRight className="size-4" />
                  </Button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
