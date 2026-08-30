import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  CloudUpload,
  Loader2,
  Send,
  Settings,
  Sparkles,
  TrendingUp,
  WandSparkles,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SitePaymentDialog } from "@/components/SitePaymentDialog";
import { createHostingRequest } from "@/lib/cloudData";
import {
  defaultBrand,
  domainLooksValid,
  type SiteBrand,
} from "@/lib/siteBrand";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

type BuilderMode = "choice" | "ai" | "manual";

type Draft = {
  type: string;
  domain: string;
  siteName: string;
  logoFileName?: string;
  design: string;
  markup: number;
};

const SERVICE_FEE_USD = 1.49;
const PLATFORM_COMMISSION_PERCENT = 20;

const siteTypes = [
  {
    id: "Bot Trading Platform",
    title: "Bot Platform",
    description: "Your own bot-trading website with free bots, a bot builder and analysis tools.",
    icon: Bot,
  },
  {
    id: "Smart Trader",
    title: "Smart Trader",
    description: "A rise/fall options trading site, like Deriv SmartTrader with your branding.",
    icon: TrendingUp,
  },
  {
    id: "Air Run",
    title: "Air Run",
    description: "A crash-style accumulator game site where traders ride a multiplier.",
    icon: Zap,
  },
  {
    id: "Pulse Trader",
    title: "Pulse Trader",
    description: "A fast pulse-trading site focused on quick entries and signals.",
    icon: Sparkles,
  },
  {
    id: "Digit Trader",
    title: "Digit Trader",
    description: "A digits-strategy trading site built for last-digit predictions.",
    icon: Settings,
  },
];

const designs = [
  {
    id: "Money8GG",
    title: "Money8GG",
    description: "Bright AI trading landing page with purple controls and starter bots.",
    colors: ["#a855f7", "#2563eb", "#f8fafc"],
    brand: { primaryColor: "#a855f7", secondaryColor: "#0f172a", font: "Space Grotesk" },
  },
  {
    id: "DollarPrinter",
    title: "DollarPrinter",
    description: "Bold navy-and-blue trading workspace with premium dollar-themed sections.",
    colors: ["#1d4ed8", "#0f172a", "#ffffff"],
    brand: { primaryColor: "#2563eb", secondaryColor: "#0b1220", font: "Inter" },
  },
  {
    id: "DigitTools",
    title: "DigitTools",
    description: "Community-style bot loader with deep navy panels and signal widgets.",
    colors: ["#0ea5e9", "#1e293b", "#60a5fa"],
    brand: { primaryColor: "#0ea5e9", secondaryColor: "#0f172a", font: "DM Sans" },
  },
  {
    id: "BinaryTool",
    title: "BinaryTool",
    description: "Dashboard-first trading platform with footer-centered run controls.",
    colors: ["#1d4ed8", "#0f172a", "#e5e7eb"],
    brand: { primaryColor: "#3b82f6", secondaryColor: "#111827", font: "Manrope" },
  },
];

const stepLabels = ["Welcome", "Type", "Domain", "Name", "Logo", "Design", "Markup", "Confirm"];
const markupOptions = [0, 0.5, 1, 1.5, 2, 2.5, 3];

function initialDraft(): Draft {
  return {
    type: "",
    domain: "",
    siteName: "",
    design: "Money8GG",
    markup: 2.5,
  };
}

function titleCase(value: string) {
  return value
    .replace(/\.[a-z]{2,}$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function draftToBrand(draft: Draft): SiteBrand {
  const design = designs.find((item) => item.id === draft.design) ?? designs[0]!;
  const name = draft.siteName.trim() || titleCase(draft.domain) || "My Trading Hub";
  const brand: SiteBrand = {
    ...defaultBrand,
    ...design.brand,
    name,
    tagline: `${draft.type || "Bot Trading Platform"} with automated Deriv bots, signals and fast live trading.`,
  };
  if (draft.logoFileName) brand.logoFileName = draft.logoFileName;
  return brand;
}

function AssistantIcon() {
  return (
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-brand text-brand-foreground shadow-brand">
      <Sparkles className="size-4" />
    </span>
  );
}

function Bubble({
  from = "assistant",
  children,
}: {
  from?: "assistant" | "user";
  children: React.ReactNode;
}) {
  const user = from === "user";
  return (
    <div className={cn("flex gap-3", user && "justify-end")}>
      {!user && <AssistantIcon />}
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed",
          user ? "bg-blue-500 text-white" : "bg-slate-800 text-white",
        )}
      >
        {children}
      </div>
      {user && (
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-500 text-white">
          <CheckCircle2 className="size-4" />
        </span>
      )}
    </div>
  );
}

function ProgressHeader({ step, mode }: { step: number; mode: "AI Assistant" | "Manual Setup" }) {
  const progress = ((step + 1) / stepLabels.length) * 100;
  return (
    <div className="border-b border-border bg-card/70 p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-full bg-gradient-brand text-brand-foreground shadow-brand">
          {mode === "AI Assistant" ? <Sparkles className="size-5" /> : <Settings className="size-5" />}
        </span>
        <div>
          <h3 className="font-display text-base font-bold">{mode}</h3>
          <p className="text-xs text-muted-foreground">Step {step + 1} of {stepLabels.length}</p>
        </div>
      </div>
      <div className="mt-5 h-1.5 rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-2 grid grid-cols-8 gap-1 text-[11px] font-semibold text-muted-foreground">
        {stepLabels.map((label, index) => (
          <span key={label} className={cn(index <= step && "text-primary")}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function DesignThumb({ colors }: { colors: string[] }) {
  return (
    <div className="relative h-24 overflow-hidden rounded-lg border border-border bg-slate-950">
      <div className="flex h-5 items-center gap-2 border-b border-white/10 px-3">
        <span className="h-1.5 w-16 rounded-full" style={{ background: colors[0] }} />
        <span className="ml-auto h-1.5 w-8 rounded-full bg-white/40" />
      </div>
      <div className="grid grid-cols-[1.2fr_.8fr] gap-2 p-3">
        <div>
          <span className="block h-3 w-24 rounded-full bg-white/80" />
          <span className="mt-2 block h-2 w-32 rounded-full bg-white/30" />
          <span className="mt-2 block h-5 w-16 rounded-md" style={{ background: colors[0] }} />
        </div>
        <div className="grid gap-1 rounded-md bg-white/10 p-2">
          <span className="h-2 rounded-full" style={{ background: colors[1] }} />
          <span className="h-2 rounded-full bg-white/30" />
          <span className="h-2 rounded-full" style={{ background: colors[2] }} />
        </div>
      </div>
    </div>
  );
}

function Summary({ draft, brand }: { draft: Draft; brand: SiteBrand }) {
  return (
    <div className="rounded-lg bg-slate-800 p-4 text-sm">
      {[
        ["Platform", draft.type || "Bot Trading Platform"],
        ["Domain", draft.domain || "Not selected"],
        ["Commission markup", `${draft.markup.toFixed(1)}%`],
        ["Site Name", brand.name],
        ["App ID", "Auto-created by platform"],
        ["Design", draft.design],
      ].map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-4 py-1.5">
          <span className="text-sky-200/80">{label}:</span>
          <span className="text-right font-bold text-white">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function SiteBuilder() {
  const { user } = useAuth();
  const [mode, setMode] = useState<BuilderMode>("choice");
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => initialDraft());
  const [input, setInput] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const brand = useMemo(() => draftToBrand(draft), [draft]);

  function reset(nextMode: BuilderMode = "choice") {
    setMode(nextMode);
    setStep(nextMode === "choice" ? 0 : 1);
    setDraft(initialDraft());
    setInput("");
    setAgreed(false);
  }

  function setDraftValue<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function next() {
    if (step === 2 && !domainLooksValid(draft.domain)) {
      toast.error("Enter a valid domain like kenyap.com");
      return;
    }
    if (step === 3 && !draft.siteName.trim()) {
      toast.error("Add your site name");
      return;
    }
    setStep((current) => Math.min(current + 1, stepLabels.length - 1));
  }

  function sendText() {
    const value = input.trim();
    if (!value) return;
    if (step === 2) {
      const domain = value.toLowerCase();
      if (!domainLooksValid(domain)) {
        toast.error("Enter a valid domain like kenyap.com");
        return;
      }
      setDraftValue("domain", domain);
    }
    if (step === 3) setDraftValue("siteName", value);
    setInput("");
    setStep((current) => Math.min(current + 1, stepLabels.length - 1));
  }

  function onLogo(file?: File) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo must be under 5 MB");
      return;
    }
    setDraftValue("logoFileName", file.name);
    toast.success("Logo attached");
  }

  async function submit(paid: boolean) {
    if (!agreed) {
      toast.error("Accept the commission agreement first");
      return;
    }
    if (!domainLooksValid(draft.domain)) {
      toast.error("Enter a valid domain before deploying");
      return;
    }
    setBusy(true);
    try {
      await createHostingRequest({
        requested_by: user?.email ?? "guest",
        brand,
        domains: [draft.domain],
        amount_usd: mode === "ai" ? SERVICE_FEE_USD : 0,
        paid,
      });
      toast.success("Site request created. Deployment is queued.");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create site request");
    } finally {
      setBusy(false);
    }
  }

  function startAi() {
    setMode("ai");
    setStep(1);
  }

  function startManual() {
    setMode("manual");
    setStep(1);
  }

  if (mode === "choice") {
    return (
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-muted-foreground">Step 1</p>
          <h2 className="mt-3 font-display text-4xl font-bold">How do you want to create your site?</h2>
          <p className="mt-3 text-lg text-muted-foreground">
            Both options end with the same live site. Pick whichever fits you.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
          <button
            type="button"
            onClick={startAi}
            className="relative rounded-2xl border-2 border-primary bg-card p-8 text-left shadow-brand transition hover:-translate-y-0.5 hover:bg-accent/30"
          >
            <Badge className="absolute -top-4 left-8 bg-gradient-brand text-brand-foreground">Recommended</Badge>
            <div className="flex items-center gap-5">
              <span className="grid size-16 place-items-center rounded-2xl bg-primary/20 text-primary">
                <WandSparkles className="size-8" />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-2xl font-bold">AI Assistant</h3>
                  <Badge variant="secondary">$1.49</Badge>
                </div>
                <p className="text-muted-foreground">Live in minutes</p>
              </div>
            </div>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Answer a few questions and chat with our AI. Your site is live in minutes, no forms required.
            </p>
            <ul className="mt-7 space-y-3 text-base">
              <li className="flex gap-3"><span className="mt-2 size-2 rounded-full bg-primary" />Personalized site type picker with previews</li>
              <li className="flex gap-3"><span className="mt-2 size-2 rounded-full bg-primary" />AI-generated logo and branding</li>
              <li className="flex gap-3"><span className="mt-2 size-2 rounded-full bg-primary" />Automatic deployment</li>
            </ul>
            <span className="mt-9 flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-brand font-bold text-brand-foreground">
              Start with AI <ArrowRight className="size-5" />
            </span>
          </button>

          <button
            type="button"
            onClick={startManual}
            className="rounded-2xl border border-border bg-card p-8 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-primary/60"
          >
            <div className="flex items-center gap-5">
              <span className="grid size-16 place-items-center rounded-2xl bg-blue-500/20 text-blue-400">
                <Settings className="size-8" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-bold">Manual Setup</h3>
                <p className="text-muted-foreground">For advanced users</p>
              </div>
            </div>
            <p className="mt-7 text-lg leading-relaxed text-muted-foreground">
              Configure every detail yourself with the same guided step-by-step flow.
            </p>
            <ul className="mt-7 space-y-3 text-base">
              <li className="flex gap-3"><span className="mt-2 size-2 rounded-full bg-blue-400" />Custom colors and branding</li>
              <li className="flex gap-3"><span className="mt-2 size-2 rounded-full bg-blue-400" />Choose your own domain</li>
              <li className="flex gap-3"><span className="mt-2 size-2 rounded-full bg-blue-400" />Complete settings control</li>
            </ul>
            <span className="mt-9 flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white">
              Start Manual Setup <ArrowRight className="size-5" />
            </span>
          </button>
        </div>
      </section>
    );
  }

  const isAi = mode === "ai";

  return (
    <section className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <button type="button" onClick={() => reset()} className="inline-flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft className="size-4" /> Create New Site
        </button>
        {isAi && <Badge variant="secondary">${SERVICE_FEE_USD} service fee</Badge>}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <ProgressHeader step={step} mode={isAi ? "AI Assistant" : "Manual Setup"} />

        <div className="max-h-[430px] space-y-4 overflow-y-auto p-5">
          <Bubble>
            {isAi
              ? "Hey, I am Daniel, your web design buddy. Let's build your trading site in a few fast steps."
              : "Manual setup uses the same guided path, with direct control over each choice."}
          </Bubble>
          {draft.type && <Bubble from="user">I want a {draft.type}</Bubble>}
          {draft.domain && <Bubble from="user">{draft.domain}</Bubble>}
          {draft.domain && <Bubble>Perfect. I have noted your domain.</Bubble>}
          {draft.siteName && <Bubble from="user">{draft.siteName}</Bubble>}
          {draft.siteName && <Bubble>"{draft.siteName}" is a great name.</Bubble>}
          {draft.logoFileName && <Bubble from="user">I will use {draft.logoFileName}</Bubble>}
          {draft.logoFileName && <Bubble>That logo is attached. Great choice.</Bubble>}
          {step >= 6 && <Bubble>Pick your commission. It is your cut per trade. Choose 0% to 3%.</Bubble>}
          {step >= 7 && <Bubble>Your site looks ready. Confirm the agreement and deploy it.</Bubble>}
        </div>

        <div className="border-t border-border p-5">
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">First, what kind of site do you want?</p>
              {siteTypes.map(({ id, title, description, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setDraftValue("type", id);
                    setStep(2);
                  }}
                  className="flex w-full items-center gap-4 rounded-xl border border-border p-4 text-left transition hover:border-primary/60 hover:bg-accent/30"
                >
                  <span className="grid size-10 place-items-center rounded-lg bg-accent text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{title}</span>
                    <span className="block text-sm text-muted-foreground">{description}</span>
                  </span>
                  <span className="rounded-lg border border-border px-3 py-2 text-xs font-bold">Preview</span>
                </button>
              ))}
            </div>
          )}

          {(step === 2 || step === 3) && (
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendText()}
                placeholder={step === 2 ? "kenyap.com" : "Kenya P"}
                className="h-12"
              />
              <Button type="button" size="icon" className="size-12 bg-gradient-brand" onClick={sendText}>
                <Send className="size-5" />
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="rounded-xl border border-dashed border-border p-8 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/20 text-primary">
                <CloudUpload className="size-8" />
              </div>
              <p className="mt-4 font-bold">Click to upload or drag and drop</p>
              <p className="text-sm text-muted-foreground">PNG, JPG or SVG, max 5 MB</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <label className="inline-flex h-10 cursor-pointer items-center rounded-xl border border-border px-4 text-sm font-semibold hover:border-primary/60">
                  Select File
                  <input type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(e) => onLogo(e.target.files?.[0])} />
                </label>
                <Button
                  type="button"
                  className="bg-gradient-brand"
                  onClick={() => {
                    setDraftValue("logoFileName", `${brand.name}-ai-logo.png`);
                    setStep(5);
                  }}
                >
                  <Sparkles className="size-4" /> Generate with AI
                </Button>
              </div>
              <Button type="button" variant="ghost" className="mt-5" onClick={next}>Skip this step</Button>
              {draft.logoFileName && <Button type="button" className="mt-5 w-full" onClick={next}>Continue</Button>}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Pick a design. Each one comes with matching starter bots.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {designs.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setDraftValue("design", item.id);
                      setStep(6);
                    }}
                    className={cn(
                      "rounded-xl border p-3 text-left transition hover:border-primary/60",
                      draft.design === item.id ? "border-primary bg-primary/10" : "border-border",
                    )}
                  >
                    <DesignThumb colors={item.colors} />
                    <span className="mt-3 block font-bold">{item.title}</span>
                    <span className="line-clamp-2 text-sm text-muted-foreground">{item.description}</span>
                    <span className="mt-3 flex gap-1">
                      {item.colors.map((color) => (
                        <span key={color} className="size-3 rounded-full" style={{ background: color }} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {markupOptions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setDraftValue("markup", value)}
                    className={cn(
                      "h-10 min-w-16 rounded-lg border px-4 text-sm font-bold",
                      draft.markup === value ? "border-primary bg-primary/20 text-primary" : "border-border",
                    )}
                  >
                    {value.toFixed(1)}%
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Pick your markup. This percentage is added to each trade and becomes your earnings.
              </p>
              <Button type="button" className="w-full bg-gradient-brand" onClick={next}>Continue</Button>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <Summary draft={draft} brand={brand} />
              <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-3 text-sm text-orange-100">
                <strong>Commission Agreement:</strong> By creating this site, you agree to share {PLATFORM_COMMISSION_PERCENT}% of your monthly commission earnings with our platform.
              </div>
              {isAi && (
                <div className="rounded-lg border border-blue-500/50 bg-blue-500/10 p-3 text-sm text-blue-100">
                  <strong>Service Fee:</strong> A one-time fee of ${SERVICE_FEE_USD} will be charged for AI-assisted setup.
                </div>
              )}
              <label className="flex items-start gap-3 text-sm font-semibold">
                <Checkbox checked={agreed} onCheckedChange={(value) => setAgreed(Boolean(value))} />
                <span>I agree that {PLATFORM_COMMISSION_PERCENT}% of trading commissions go to the platform</span>
              </label>
              <Button
                type="button"
                disabled={busy || !agreed}
                className="h-12 w-full bg-gradient-brand font-bold text-brand-foreground shadow-brand"
                onClick={() => (isAi ? setPaymentOpen(true) : submit(false))}
              >
                {busy && <Loader2 className="size-4 animate-spin" />}
                <CheckCircle2 className="size-4" /> Create My Site and Deploy
              </Button>
            </div>
          )}

        </div>
      </div>

      <SitePaymentDialog
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        title="Select Payment Method"
        description="Choose how you would like to pay for your site."
        amountUsd={SERVICE_FEE_USD}
        onPaid={() => submit(true)}
      />
    </section>
  );
}
