import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Play, Search, Sparkles, Youtube, ListVideo } from "lucide-react";
import { useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/tutorials")({
  head: () => ({
    meta: [
      { title: "Tutorials — Learn the Tronix Forge Ecosystem" },
      {
        name: "description",
        content:
          "Video series and guides covering Tronix Forge, Deriv trading, bot strategies and commissions.",
      },
      { property: "og:title", content: "Tutorials — Learn the Tronix Forge Ecosystem" },
      {
        property: "og:description",
        content: "Video series and guides covering Tronix Forge, Deriv trading and bot strategies.",
      },
    ],
  }),
  component: TutorialsPage,
});

const categories = [
  "All",
  "Tronix Forge Platform",
  "Deriv Trading",
  "Bot Strategies",
  "Commissions",
  "Sites & Domains",
  "AI Tools",
];

const series = [
  {
    title: "Tronix Forge Beginner Bootcamp",
    tag: "Tronix Forge Platform",
    episodes: 6,
    desc: "The complete beginner's guide to Tronix Forge — account setup, Deriv linking, first site and first deploy.",
  },
  {
    title: "Adding XML Bots to Your Platform",
    tag: "Bot Strategies",
    episodes: 3,
    desc: "Every way to get bots onto your platform — ready-made packs, uploads and the AI generator.",
  },
  {
    title: "Earning with Payment Agent",
    tag: "Commissions",
    episodes: 4,
    desc: "Set up M-Pesa deposits, understand the 22% share and track payouts end to end.",
  },
];

function TutorialsPage() {
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");
  const list = series.filter(
    (s) =>
      (active === "All" || s.tag === active) && s.title.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader
        icon={GraduationCap}
        title="Learn the Ecosystem"
        subtitle="Video series and standalone guides covering the full Tronix Forge ecosystem."
      />

      <div className="mb-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <ListVideo className="size-4" /> 3 series
        </span>
        <span className="inline-flex items-center gap-2">
          <Play className="size-4" /> 13 videos
        </span>
        <span className="inline-flex items-center gap-2">
          <Youtube className="size-4 text-destructive" /> On YouTube
        </span>
        <span className="inline-flex items-center gap-2">
          <Sparkles className="size-4 text-primary" /> Growing library
        </span>
      </div>

      <div className="card-surface mb-6 p-5">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tutorials..."
            className="h-11 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                active === c
                  ? "bg-gradient-brand text-brand-foreground shadow-brand"
                  : "bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => (
          <article key={s.title} className="card-surface group overflow-hidden">
            <div className="relative aspect-video bg-gradient-brand p-5">
              <span className="rounded-full bg-background/20 px-3 py-1 text-xs font-semibold text-brand-foreground backdrop-blur">
                {s.episodes} Episodes
              </span>
              <span className="absolute right-4 top-5 rounded-full bg-background/20 px-3 py-1 text-xs font-semibold text-brand-foreground backdrop-blur">
                {s.tag}
              </span>
              <div className="absolute inset-x-5 bottom-5">
                <h3 className="font-display text-xl font-bold text-brand-foreground">{s.title}</h3>
              </div>
              <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                <span className="grid size-14 place-items-center rounded-full bg-background/30 backdrop-blur">
                  <Play className="size-6 text-brand-foreground" />
                </span>
              </div>
            </div>
            <p className="p-5 text-sm text-muted-foreground">{s.desc}</p>
          </article>
        ))}
        <div className="grid place-items-center rounded-2xl border border-dashed border-border p-10 text-center">
          <div>
            <Sparkles className="mx-auto size-6 text-primary" />
            <p className="mt-3 font-semibold">More series on the way</p>
            <p className="text-sm text-muted-foreground">New content added as episodes publish.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
