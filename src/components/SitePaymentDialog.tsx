import { useState, type ReactNode } from "react";
import { Smartphone, CreditCard, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { USD_TO_KES } from "@/lib/siteBrand";

export function SitePaymentDialog({
  open,
  onOpenChange,
  title,
  description,
  amountUsd,
  summary,
  onPaid,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: string;
  amountUsd: number;
  summary?: ReactNode;
  onPaid: (payment: { method: "mpesa" | "card"; phone?: string; amountUsd: number }) => void;
}) {
  const [method, setMethod] = useState<"mpesa" | "card">("mpesa");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const kes = Math.round(amountUsd * USD_TO_KES).toLocaleString();

  async function pay() {
    if (method === "mpesa" && !/^(?:\+?254|0)7\d{8}$/.test(phone.replace(/\s/g, ""))) {
      toast.error("Enter a valid M-Pesa number, e.g. 0712345678");
      return;
    }
    setPaying(true);
    toast.info(
      method === "mpesa" ? `STK push sent to ${phone} — approve on your phone` : "Opening card checkout…",
    );
    await new Promise((r) => setTimeout(r, 1400));
    setPaying(false);
    onOpenChange(false);
    onPaid({ method, amountUsd, ...(method === "mpesa" ? { phone } : {}) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl bg-accent/60 p-4 text-center">
          <p className="font-display text-3xl font-bold text-gradient">${amountUsd}</p>
          <p className="mt-1 text-sm text-muted-foreground">≈ KES {kes}</p>
        </div>

        {summary && <div className="rounded-2xl border border-border p-4 text-sm">{summary}</div>}

        <div className="grid grid-cols-2 gap-3">
          {([
            { id: "mpesa", label: "M-Pesa", icon: Smartphone },
            { id: "card", label: "Card", icon: CreditCard },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
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
            <Label htmlFor="site-mpesa">M-Pesa phone number</Label>
            <Input
              id="site-mpesa"
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

        <Button
          onClick={pay}
          disabled={paying}
          className="w-full bg-gradient-brand text-brand-foreground shadow-brand"
        >
          {paying && <Loader2 className="size-4 animate-spin" />}
          {paying ? "Waiting for confirmation…" : `Pay $${amountUsd}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
