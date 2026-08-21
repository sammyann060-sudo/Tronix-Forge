import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Zap, Send, Clock, Plus, ChevronLeft, ChevronRight, Sparkles, Smartphone } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/ai-signals")({
  head: () => ({
    meta: [
      { title: "AI Signals — Tronix Forge" },
      {
        name: "description",
        content: "Order custom AI trading signal strategies delivered straight to your Telegram channel or group.",
      },
      { property: "og:title", content: "AI Signals — Tronix Forge" },
      { property: "og:description", content: "Custom trading signals delivered to your Telegram." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AiSignalsPage,
});

const steps = ["Strategy Details", "Telegram Setup", "Message Template", "Build & Pay"];
const PRICE_USD = 14.99;
const USD_TO_KES = 129;

function AiSignalsPage() {
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "",
    description: "",
    interval: "5m",
    target: "channel",
    handle: "",
    template:
      "🔔 {{signal_type}} — {{asset}}\nEntry: {{entry}}\nStop loss: {{stop_loss}}\nTake profit: {{take_profit}}",
    phone: "",
  });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (!creating) {
    return (
      <AppShell>
        <PageHeader
          icon={Zap}
          title="Signal Strategies"
          subtitle="Custom trading signals delivered to your Telegram"
          action={
            <Button className="bg-gradient-brand text-brand-foreground" onClick={() => setCreating(true)}>
              <Plus className="size-4" /> New Order
            </Button>
          }
        />
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 font-semibold text-primary">
            <Send className="size-3" /> Telegram Delivery
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 font-semibold text-primary">
            <Clock className="size-3" /> 5 Min Fulfillment
          </span>
        </div>
        <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card/50 p-16 text-center">
          <div>
            <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-accent">
              <Zap className="size-9 text-primary" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">No Signal Orders Yet</h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Create your first signal order and Tronix Forge AI will build and deploy your custom trading signal bot
              to your Telegram channel or group — typically in 90–240 seconds.
            </p>
            <Button
              className="mt-6 bg-gradient-brand text-brand-foreground"
              onClick={() => setCreating(true)}
            >
              <Plus className="size-4" /> Create Signal Order
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const canNext =
    step === 0
      ? form.name.trim().length > 0 && form.description.trim().length >= 20
      : step === 1
        ? form.handle.trim().length > 0
        : true;

  return (
    <AppShell>
      <div className="mb-8 flex items-start gap-4">
        <button
          onClick={() => setCreating(false)}
          aria-label="Back to signal orders"
          className="mt-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand shadow-brand">
          <Zap className="size-6 text-brand-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gradient">Create Signal Order</h1>
          <p className="mt-1 text-muted-foreground">Submit your requirements and we&apos;ll build your signal</p>
        </div>
      </div>

      <div className="card-surface p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create Signal Order</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold">
            <Sparkles className="size-3 text-primary" /> AI-Powered
          </span>
        </div>

        <ol className="mb-8 grid gap-3 sm:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s} className="space-y-2">
              <span
                className={cn(
                  "block h-1 rounded-full",
                  i <= step ? "bg-gradient-brand" : "bg-muted",
                )}
              />
              <span
                className={cn(
                  "flex items-center gap-2 text-sm font-medium",
                  i === step ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-5 place-items-center rounded-full border text-[11px]",
                    i <= step ? "border-primary text-primary" : "border-border",
                  )}
                >
                  {i + 1}
                </span>
                {s}
              </span>
            </li>
          ))}
        </ol>

        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="strategy-name">Strategy Name *</Label>
              <Input
                id="strategy-name"
                placeholder="e.g., RSI Crossover Signals"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Give your signal strategy a memorable name</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="strategy-desc">Strategy Description * (min 20 characters)</Label>
              <Textarea
                id="strategy-desc"
                rows={8}
                placeholder={`Describe your signal strategy in detail. Include:
• What market/asset you want to trade (e.g., Volatility 100, EUR/USD)
• What indicators or conditions should trigger signals
• What type of signals you want (BUY, SELL, or both)
• Any specific entry/exit rules
• Risk management preferences (stop loss, take profit levels)`}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {form.description.length}/20 characters minimum
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Signal Interval *</Label>
              <Select value={form.interval} onValueChange={(v) => set("interval", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">Every 1 minute</SelectItem>
                  <SelectItem value="5m">Every 5 minutes</SelectItem>
                  <SelectItem value="15m">Every 15 minutes</SelectItem>
                  <SelectItem value="1h">Every hour</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                How often signals are checked and sent. A standby message is sent at every interval even when no
                condition fires.
              </p>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label>Delivery target *</Label>
              <Select value={form.target} onValueChange={(v) => set("target", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="channel">Telegram channel</SelectItem>
                  <SelectItem value="group">Telegram group</SelectItem>
                  <SelectItem value="dm">Direct message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="handle">Channel / group handle *</Label>
              <Input
                id="handle"
                placeholder="@mysignals"
                value={form.handle}
                onChange={(e) => set("handle", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Add <span className="font-semibold">@TronixForgeSignalBot</span> as an admin so it can post.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-1.5">
            <Label htmlFor="template">Message template</Label>
            <Textarea
              id="template"
              rows={8}
              value={form.template}
              onChange={(e) => set("template", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Available variables: {"{{signal_type}}"}, {"{{asset}}"}, {"{{entry}}"}, {"{{stop_loss}}"},{" "}
              {"{{take_profit}}"}, {"{{time}}"}
            </p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border p-5 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Strategy</span>
                <span className="font-semibold">{form.name || "—"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Interval</span>
                <span className="font-semibold">{form.interval}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-semibold">
                  {form.handle || "—"} ({form.target})
                </span>
              </div>
              <div className="mt-3 flex justify-between border-t border-border pt-3 text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold">
                  ${PRICE_USD}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    ≈ KES {Math.round(PRICE_USD * USD_TO_KES).toLocaleString()}
                  </span>
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="signal-phone" className="flex items-center gap-2">
                <Smartphone className="size-4 text-primary" /> M-Pesa phone number
              </Label>
              <Input
                id="signal-phone"
                inputMode="tel"
                placeholder="0712345678"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Confirm the STK push and your bot deploys in 90–240 seconds.
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => (step === 0 ? setCreating(false) : setStep((s) => s - 1))}
          >
            <ChevronLeft className="size-4" /> {step === 0 ? "Cancel" : "Back"}
          </Button>
          {step < steps.length - 1 ? (
            <Button
              disabled={!canNext}
              className="bg-gradient-brand text-brand-foreground"
              onClick={() => setStep((s) => s + 1)}
            >
              Next <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              className="bg-gradient-brand text-brand-foreground"
              onClick={() => {
                if (!/^(?:\+?254|0)7\d{8}$/.test(form.phone.replace(/\s/g, ""))) {
                  toast.error("Enter a valid M-Pesa number, e.g. 0712345678");
                  return;
                }
                toast.success(`STK push sent to ${form.phone}. Your signal bot deploys once payment clears.`);
                setCreating(false);
                setStep(0);
              }}
            >
              Pay with M-Pesa
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
