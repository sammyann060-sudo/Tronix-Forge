import { createFileRoute, Link } from "@tanstack/react-router";
import { Wand2, Sparkles, History, Zap, BarChart3, Repeat, Crosshair, PlayCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AiCreditsDialog } from "@/components/AiCreditsDialog";
import { buildBotXml } from "@/lib/botStore";
import { createBot, type CloudBot } from "@/lib/cloudData";

export const Route = createFileRoute("/_authenticated/ai-generator")({
  head: () => ({
    meta: [
      { title: "AI Bot Generator — Tronix Forge" },
      {
        name: "description",
        content: "Describe a trading strategy in plain English and get a complete DBot XML file.",
      },
      { property: "og:title", content: "AI Bot Generator — Tronix Forge" },
      {
        property: "og:description",
        content: "Describe a trading strategy in plain English and get a complete DBot XML file.",
      },
    ],
  }),
  component: AiGeneratorPage,
});

const templates = [
  {
    icon: BarChart3,
    title: "Over/Under Martingale",
    desc: "Digit Over/Under with martingale recovery.",
  },
  { icon: Repeat, title: "Even/Odd Switcher", desc: "Frequency analysis to pick the likely side." },
  { icon: Crosshair, title: "Frequency Sniper", desc: "Digit frequency analysis to predict entry." },
];

function AiGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [verify, setVerify] = useState(true);
  const [busy, setBusy] = useState(false);
  const [lastBot, setLastBot] = useState<CloudBot | null>(null);

  async function handleGenerate() {
    const text = prompt.trim();
    if (!text) return;
    const name = (text.split(/[.\n]/)[0] ?? "").slice(0, 48) || "Tronix Bot";
    setBusy(true);
    try {
      const bot = await createBot({
        name,
        description: text,
        source: "AI",
        market: /100/.test(text) ? "R_100" : "R_50",
        xml: buildBotXml({ name, description: text }),
      });
      setLastBot(bot);
      toast.success("Bot generated — saved to My Bots");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save bot");
    } finally {
      setBusy(false);
    }
  }


  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 font-medium text-accent-foreground">
          <Sparkles className="size-4" /> Tronix AI
        </span>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <History className="size-4" /> History
        </span>
        <AiCreditsDialog>
          <button className="inline-flex items-center gap-2 font-medium text-warning hover:underline">
            <Zap className="size-4" /> 0 Credits
          </button>
        </AiCreditsDialog>

      </div>

      <div className="text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-brand shadow-brand">
          <Wand2 className="size-7 text-brand-foreground" />
        </div>
        <h1 className="mt-6 text-4xl font-bold text-gradient lg:text-5xl">AI Bot Generator</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Describe your trading strategy in plain English and let AI build a complete DBot XML file
          for you.
        </p>
      </div>

      <div className="card-surface mt-8 p-5">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          placeholder="e.g. Create a Digit Over 2 bot on Volatility 100 (1s) Index with martingale. Start with $0.35 stake, multiply by 2 on loss, reset on win. Take profit at $25, stop loss at $500..."
          className="resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Switch checked={verify} onCheckedChange={setVerify} /> Verify strategy
          </label>
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!prompt.trim() || busy}
            className="bg-gradient-brand text-brand-foreground shadow-brand"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />} Generate (13)
          </Button>

        </div>
      </div>

      {lastBot && (
        <div className="card-surface mt-5 flex flex-wrap items-center justify-between gap-3 p-5">
          <div className="min-w-0">
            <p className="font-semibold">{lastBot.name}</p>
            <p className="text-sm text-muted-foreground">
              Saved to My Bots — run it from Live Trading.
            </p>
          </div>
          <Button asChild className="bg-gradient-brand text-brand-foreground shadow-brand">
            <Link to="/live-trading">
              <PlayCircle className="size-4" /> Run bot
            </Link>
          </Button>
        </div>
      )}



      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 text-sm">
        <p>
          This run costs <strong>13 credits</strong> (generate + verify) — you have <strong>0</strong>.
        </p>
        <AiCreditsDialog>
          <Button size="sm" className="bg-gradient-brand text-brand-foreground">
            Buy credits
          </Button>
        </AiCreditsDialog>
      </div>

      <h2 className="mb-4 mt-10 inline-flex items-center gap-2 text-lg font-bold">
        <Zap className="size-4 text-primary" /> Quick templates
        <span className="text-sm font-normal text-muted-foreground">— click to use</span>
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {templates.map((t) => (
          <button
            key={t.title}
            onClick={() => setPrompt(`${t.title}: ${t.desc}`)}
            className="card-surface p-5 text-left transition-transform hover:-translate-y-0.5"
          >
            <t.icon className="size-5 text-primary" />
            <p className="mt-3 font-semibold">{t.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
