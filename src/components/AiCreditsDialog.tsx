import { useState, type ReactNode } from "react";
import { Coins, AlertCircle, Smartphone, CreditCard, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const packs = [
  { id: "starter", name: "Starter", credits: 30, usd: 4.99, blurb: "Perfect for trying out the AI generator" },
  { id: "builder", name: "Builder", credits: 65, usd: 9.99, blurb: "Best for regular bot builders", popular: true },
  { id: "pro", name: "Pro", credits: 150, usd: 19.99, blurb: "Maximum value for power users" },
];

const costs = [
  { label: "Generate a bot", cost: 10 },
  { label: "Refine (per message)", cost: 3 },
  { label: "AI Verify + Auto-fix", cost: 3 },
];

const USD_TO_KES = 129;

export function AiCreditsDialog({
  children,
  balance = 0,
}: {
  children: ReactNode;
  balance?: number;
}) {
  const [selected, setSelected] = useState("builder");
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const [phone, setPhone] = useState("");
  const pack = packs.find((p) => p.id === selected)!;

  const pay = () => {
    if (method === "mpesa" && !/^(?:\+?254|0)7\d{8}$/.test(phone.replace(/\s/g, ""))) {
      toast.error("Enter a valid M-Pesa number, e.g. 0712345678");
      return;
    }
    toast.success(
      method === "mpesa"
        ? `STK push sent to ${phone} for KES ${Math.round(pack.usd * USD_TO_KES).toLocaleString()}`
        : `Redirecting to card checkout for $${pack.usd}`,
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Coins className="size-5 text-primary" /> AI Credits
          </DialogTitle>
          <DialogDescription>
            Credits power every AI action. Pick a pack and start building.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl bg-accent/60 py-6 text-center">
          <p className="font-display text-4xl font-bold text-gradient">{balance}</p>
          <p className="mt-1 text-sm text-muted-foreground">Credits Available</p>
        </div>

        <div className="space-y-2 rounded-2xl border border-border p-4 text-sm">
          {costs.map((c) => (
            <div key={c.label} className="flex justify-between">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-semibold">{c.cost}</span>
            </div>
          ))}
        </div>

        {balance === 0 && (
          <div className="flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-warning" />
            <span>You have no credits. Purchase a pack to start generating bots.</span>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm font-semibold">1. Choose a credit pack</p>
          {packs.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className={cn(
                "relative flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all",
                selected === p.id
                  ? "border-primary bg-accent/50 shadow-soft"
                  : "border-border hover:border-primary/40",
              )}
            >
              {p.popular && (
                <span className="absolute -top-2.5 left-4 rounded-full bg-gradient-brand px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-brand-foreground">
                  MOST POPULAR
                </span>
              )}
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-muted-foreground">{p.credits} credits</p>
                <p className="text-xs text-muted-foreground">{p.blurb}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${p.usd}</p>
                <p className="text-xs text-muted-foreground">
                  ≈ KES {Math.round(p.usd * USD_TO_KES).toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold">2. Payment method</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: "mpesa", label: "M-Pesa", icon: Smartphone },
              { id: "card", label: "Card", icon: CreditCard },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setMethod(id)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all",
                  method === id ? "border-primary bg-accent/50" : "border-border hover:border-primary/40",
                )}
              >
                <Icon className="size-4" /> {label}
                {method === id && <Check className="ml-auto size-4 text-primary" />}
              </button>
            ))}
          </div>
          {method === "mpesa" && (
            <div className="space-y-1.5">
              <Label htmlFor="mpesa-phone">M-Pesa phone number</Label>
              <Input
                id="mpesa-phone"
                inputMode="tel"
                placeholder="0712345678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You&apos;ll receive an STK push to confirm the payment.
              </p>
            </div>
          )}
        </div>

        <Button onClick={pay} className="w-full bg-gradient-brand text-brand-foreground">
          Pay ${pack.usd} for {pack.credits} credits
        </Button>
      </DialogContent>
    </Dialog>
  );
}
