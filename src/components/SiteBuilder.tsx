import { useState } from "react";
import { Server, Loader2, Upload, Plus, Trash2, Palette } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  COLOR_PRESETS,
  FONT_OPTIONS,
  defaultBrand,
  domainLooksValid,
  type SiteBrand,
} from "@/lib/siteBrand";
import { createHostingRequest } from "@/lib/cloudData";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { SitePreview } from "@/components/SitePreview";


function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

export function SiteBuilder() {
  const { user } = useAuth();
  const [brand, setBrand] = useState<SiteBrand>(defaultBrand);
  const [domains, setDomains] = useState<string[]>(["", "", ""]);
  const [busy, setBusy] = useState<"zip" | "host" | null>(null);

  const set = <K extends keyof SiteBrand>(key: K, value: SiteBrand[K]) =>
    setBrand((b) => ({ ...b, [key]: value }));

  function onLogo(file?: File) {
    if (!file) return;
    if (file.size > 512 * 1024) {
      toast.error("Logo must be under 512 KB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      set("logoDataUrl", String(reader.result));
      set("logoFileName", file.name);
      toast.success("Logo attached");
    };
    reader.readAsDataURL(file);
  }

  async function handleHost() {
    const wanted = domains.map((d) => d.trim().toLowerCase()).filter(Boolean);
    if (wanted.length < 1) {
      toast.error("Add at least one preferred domain name");
      return;
    }
    const bad = wanted.find((d) => !domainLooksValid(d));
    if (bad) {
      toast.error(`"${bad}" is not a valid domain name`);
      return;
    }
    setBusy("host");
    try {
      await createHostingRequest({
        requested_by: user?.email ?? "guest",
        brand,
        domains: wanted,
        amount_usd: 0,
        paid: false,
      });
      toast.success("Hosting request sent — we'll confirm which domain is available");
      setDomains(["", "", ""]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send request");
    } finally {
      setBusy(null);
    }
  }


  return (
    <section className="card-surface p-6 lg:p-8">
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-brand shadow-brand">
          <Palette className="size-5 text-brand-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Build your site</h2>
          <p className="mt-1 text-muted-foreground">
            Every site is the full Tronix trading app. You customise the name, logo, colours and
            font — everything else stays exactly the same.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Site name">
          <Input value={brand.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Tagline">
          <Input value={brand.tagline} onChange={(e) => set("tagline", e.target.value)} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Primary colour">
          <div className="flex items-center gap-2">
            <input
              type="color"
              aria-label="Primary colour"
              value={brand.primaryColor}
              onChange={(e) => set("primaryColor", e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-transparent"
            />
            <Input value={brand.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} />
          </div>
        </Field>
        <Field label="Secondary colour">
          <div className="flex items-center gap-2">
            <input
              type="color"
              aria-label="Secondary colour"
              value={brand.secondaryColor}
              onChange={(e) => set("secondaryColor", e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-lg border border-border bg-transparent"
            />
            <Input
              value={brand.secondaryColor}
              onChange={(e) => set("secondaryColor", e.target.value)}
            />
          </div>
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {COLOR_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              set("primaryColor", p.primary);
              set("secondaryColor", p.secondary);
            }}
            className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/50"
          >
            <span className="size-3 rounded-full" style={{ background: p.primary }} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Font">
          <div className="flex flex-wrap gap-2">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => set("font", f.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  brand.font === f.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Logo (PNG or SVG, max 512 KB)">
          <label className="flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border px-3 text-sm text-muted-foreground hover:border-primary/50">
            <Upload className="size-4" />
            {brand.logoFileName ?? "Upload logo"}
            <input
              type="file"
              accept="image/png,image/svg+xml"
              className="hidden"
              onChange={(e) => onLogo(e.target.files?.[0])}
            />
          </label>
        </Field>
      </div>

      <div className="mt-8">
        <SitePreview brand={brand} />
      </div>

      <div className="mt-8 grid gap-4">
        <div className="rounded-2xl border border-primary/40 bg-primary/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Let us host it for you</h3>
            <Badge variant="secondary">M-Pesa</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Give us up to three preferred domain names — we secure the first one that's available.
          </p>
          <div className="mt-4 space-y-2">
            {domains.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={d}
                  placeholder={i === 0 ? "firstchoice.co.ke" : `alternative ${i + 1}`}
                  onChange={(e) =>
                    setDomains((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                  }
                />
                {domains.length > 1 && (
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Remove domain"
                    onClick={() => setDomains((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            {domains.length < 5 && (
              <Button variant="ghost" size="sm" onClick={() => setDomains((p) => [...p, ""])}>
                <Plus className="size-4" /> Add another option
              </Button>
            )}
          </div>
          <Button onClick={handleHost} disabled={busy !== null} className="mt-4 w-full">
            <Server className="size-4" /> Request hosting
          </Button>
        </div>
      </div>
    </section>
  );
}
