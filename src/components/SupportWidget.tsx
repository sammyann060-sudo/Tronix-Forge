import { useState } from "react";
import { MessageCircle, X, Send, Home, Ticket, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "tickets", label: "Tickets", icon: Ticket },
] as const;

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("home");
  const [message, setMessage] = useState("");

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[520px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-brand">
          <div className="relative bg-gradient-brand p-5 text-brand-foreground">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close support chat"
              className="absolute right-4 top-4 opacity-80 hover:opacity-100"
            >
              <X className="size-4" />
            </button>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[Bot, User, User].map((Icon, i) => (
                  <span
                    key={i}
                    className="grid size-9 place-items-center rounded-full border-2 border-white/40 bg-white/20"
                  >
                    <Icon className="size-4" />
                  </span>
                ))}
              </div>
              <span className="font-display font-bold">Tronix Forge</span>
            </div>
            <p className="mt-4 text-xl font-bold">Hi there 👋</p>
            <p className="text-sm opacity-90">How can we help?</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {tab === "home" && (
              <button
                onClick={() => setTab("messages")}
                className="-mt-9 flex w-full items-center gap-3 rounded-2xl bg-gradient-brand px-4 py-4 text-left font-semibold text-brand-foreground shadow-brand"
              >
                <span className="grid size-9 place-items-center rounded-full bg-white/20">
                  <Send className="size-4" />
                </span>
                Send us a message
              </button>
            )}
            {tab === "messages" && (
              <div className="space-y-3 text-sm">
                <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-3">
                  Hi! Ask us anything about sites, bots, domains or payouts.
                </div>
              </div>
            )}
            {tab === "tickets" && (
              <p className="pt-10 text-center text-sm text-muted-foreground">
                You have no open tickets.
              </p>
            )}
          </div>

          {tab === "messages" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!message.trim()) return;
                toast.success("Message sent — we usually reply within a few hours.");
                setMessage("");
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 rounded-xl bg-muted px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="grid size-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground"
              >
                <Send className="size-4" />
              </button>
            </form>
          )}

          <div className="grid grid-cols-3 border-t border-border">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 text-xs",
                  tab === id ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open support chat"
        className="fixed bottom-6 right-5 z-50 grid size-14 place-items-center rounded-full bg-gradient-brand text-brand-foreground shadow-brand transition-transform hover:scale-105"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </>
  );
}
