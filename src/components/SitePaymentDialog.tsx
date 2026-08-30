import { useState, type ReactNode } from "react";
import { Check, CreditCard, Loader2, Smartphone } from "lucide-react";
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
import { USD_TO_KES } from "@/lib/siteBrand";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [method, setMethod] = useState<"mpesa" | "card">("card");
  const [phone, setPhone] = useState("");
  const [paying, setPaying] = useState(false);
  const kes = Math.ceil(amountUsd * USD_TO_KES).toLocaleString();

  async function pay() {
    const cleanedPhone = phone.replace(/\s/g, "");
    if (method === "mpesa" && cleanedPhone && !/^(?:\+?254|0)7\d{8}$/.test(cleanedPhone)) {
      toast.error("Enter a valid M-Pesa number, e.g. 0712345678");
      return;
    }
    setPaying(true);
    toast.info(
      method === "mpesa"
        ? cleanedPhone
          ? `STK push sent to ${phone}. Approve on your phone.`
          : "Opening M-Pesa checkout."
        : "Opening card checkout.",
    );
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setPaying(false);
    onOpenChange(false);
    onPaid({ method, amountUsd, ...(method === "mpesa" && cleanedPhone ? { phone } : {}) });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] gap-5 overflow-y-auto border-white/10 bg-[#08080d] p-5 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-slate-400">{description}</DialogDescription>
        </DialogHeader>

        {summary && <div className="rounded-lg border border-white/10 p-4 text-sm">{summary}</div>}

        <div className="space-y-3">
          {([
            {
              id: "card",
              label: "Credit Card / Mobile Money",
              helper: "Supported Globally - Auto-converted to KES",
              icon: CreditCard,
            },
            {
              id: "mpesa",
              label: "M-Pesa",
              helper: "Safaricom (Kenya)",
              icon: Smartphone,
            },
          ] as const).map(({ id, label, helper, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className={cn(
                "relative grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-2xl border p-4 text-left transition-all",
                method === id ? "border-primary/70 bg-white/[0.03]" : "border-white/10 hover:border-primary/50",
              )}
            >
              <span
                className={cn(
                  "grid size-10 place-items-center rounded-full",
                  id === "mpesa" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-white">{label}</span>
                <span className="block text-xs text-slate-400">{helper}</span>
              </span>
              <span className="text-right">
                <span className="block whitespace-nowrap font-bold">KSh {kes}</span>
                <span
                  className={cn(
                    "mt-1 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold",
                    id === "mpesa" ? "bg-emerald-500/20 text-emerald-300" : "bg-violet-500 text-white",
                  )}
                >
                  {id === "mpesa" ? "Dynamic" : "KES"}
                </span>
              </span>
              {method === id && <Check className="absolute right-3 top-3 size-4 text-primary" />}
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
              className="border-white/10 bg-white/[0.04]"
            />
            <p className="text-xs text-slate-400">Leave blank to continue to M-Pesa checkout.</p>
          </div>
        )}

        <Button
          onClick={pay}
          disabled={paying}
          className="h-11 w-full bg-gradient-brand font-bold text-brand-foreground shadow-brand"
        >
          {paying && <Loader2 className="size-4 animate-spin" />}
          {paying ? "Waiting for confirmation..." : `Pay KSh ${kes}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
