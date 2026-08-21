import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PenLine, Palette, Type, Image as ImageIcon, Save } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/website-editor")({
  head: () => ({
    meta: [
      { title: "Website Editor — Tronix Forge" },
      {
        name: "description",
        content: "Customise the branding, hero copy and colours of your Tronix Forge trading site.",
      },
      { property: "og:title", content: "Website Editor — Tronix Forge" },
      { property: "og:description", content: "Customise branding, copy and colours for your trading site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WebsiteEditorPage,
});

const palettes = [
  { id: "violet", label: "Violet Forge", from: "#7c3aed", to: "#d946ef" },
  { id: "ocean", label: "Ocean", from: "#0ea5e9", to: "#6366f1" },
  { id: "emerald", label: "Emerald", from: "#10b981", to: "#14b8a6" },
  { id: "sunset", label: "Sunset", from: "#f97316", to: "#ef4444" },
];

function WebsiteEditorPage() {
  const [palette, setPalette] = useState("violet");
  const [name, setName] = useState("My Trading Hub");
  const [headline, setHeadline] = useState("Trade smarter with automated bots");
  const [tagline, setTagline] = useState(
    "Deploy proven XML bots, follow live signals and grow your account with confidence.",
  );
  const active = palettes.find((p) => p.id === palette)!;

  return (
    <AppShell>
      <PageHeader
        icon={PenLine}
        title="Website Editor"
        subtitle="Customise how your trading site looks to visitors"
        action={
          <Button
            className="bg-gradient-brand text-brand-foreground"
            onClick={() => toast.success("Changes saved — redeploy to publish them.")}
          >
            <Save className="size-4" /> Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-5">
          <div className="card-surface space-y-4 p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Type className="size-4 text-primary" /> Content
            </h2>
            <div className="space-y-1.5">
              <Label htmlFor="site-name">Site name</Label>
              <Input id="site-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="headline">Hero headline</Label>
              <Input id="headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tagline">Hero tagline</Label>
              <Textarea id="tagline" rows={3} value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
          </div>

          <div className="card-surface space-y-4 p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <Palette className="size-4 text-primary" /> Colour palette
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {palettes.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPalette(p.id)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-sm font-medium transition-all",
                    palette === p.id ? "border-primary bg-accent/50" : "border-border hover:border-primary/40",
                  )}
                >
                  <span
                    className="size-6 rounded-full"
                    style={{ backgroundImage: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="flex items-center gap-2 font-bold">
              <ImageIcon className="size-4 text-primary" /> Logo
            </h2>
            <div className="mt-4 grid place-items-center rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Drop a PNG or SVG here, or click to upload
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-10 lg:self-start">
          <p className="mb-2 text-sm font-semibold text-muted-foreground">Live preview</p>
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            <div className="flex items-center gap-1.5 bg-muted px-4 py-3">
              <span className="size-2.5 rounded-full bg-destructive/60" />
              <span className="size-2.5 rounded-full bg-warning/60" />
              <span className="size-2.5 rounded-full bg-success/60" />
            </div>
            <div
              className="p-10 text-center text-white"
              style={{ backgroundImage: `linear-gradient(135deg, ${active.from}, ${active.to})` }}
            >
              <p className="text-sm font-semibold opacity-90">{name}</p>
              <h3 className="mt-3 font-display text-3xl font-bold">{headline}</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm opacity-90">{tagline}</p>
              <span className="mt-6 inline-block rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold">
                Start trading
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 bg-card p-5 text-center text-xs text-muted-foreground">
              <div className="rounded-xl bg-muted py-4">Bots</div>
              <div className="rounded-xl bg-muted py-4">Signals</div>
              <div className="rounded-xl bg-muted py-4">Support</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
