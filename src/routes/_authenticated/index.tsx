import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe, Plus, ShieldAlert, ArrowRight, Rocket, DollarSign, Bot, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SiteBuilder } from "@/components/SiteBuilder";
import { fetchMyDerivAccount, type DerivAccount } from "@/lib/cloudData";
import { buildDerivOAuthUrl, clearDerivOAuthParams, linkDerivToken, parseDerivOAuthToken } from "@/lib/derivAuth";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "Sites — Tronix Forge Trading Platform" },
      {
        name: "description",
        content:
          "Create, deploy and manage Deriv-powered trading sites from one Tronix Forge dashboard.",
      },
      { property: "og:title", content: "Sites — Tronix Forge Trading Platform" },
      {
        property: "og:description",
        content: "Create, deploy and manage Deriv-powered trading sites from one dashboard.",
      },
    ],
  }),
  component: SitesPage,
});

const stats = [
  { label: "Sites", value: "0 / 5", icon: Globe },
  { label: "Deployments", value: "0", icon: Rocket },
  { label: "Earned", value: "$0.00", icon: DollarSign },
  { label: "Bots", value: "0", icon: Bot },
];

function SitesPage() {
  const [token, setToken] = useState("");
  const [account, setAccount] = useState<DerivAccount | null>(null);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    fetchMyDerivAccount()
      .then(setAccount)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const oauth = parseDerivOAuthToken();
    if (!oauth?.token) return;
    setLinking(true);
    linkDerivToken(oauth.token)
      .then((linked) => {
        setAccount(linked);
        toast.success(`Deriv account ${linked.login_id} linked`);
        clearDerivOAuthParams();
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not link Deriv account"))
      .finally(() => setLinking(false));
  }, []);

  async function handleTokenLink() {
    if (!token.trim()) {
      toast.error("Paste your Deriv API token first");
      return;
    }
    setLinking(true);
    try {
      const linked = await linkDerivToken(token);
      setAccount(linked);
      setToken("");
      toast.success(`Deriv account ${linked.login_id} linked`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not link Deriv account");
    } finally {
      setLinking(false);
    }
  }

  function signInWithDeriv() {
    window.location.href = buildDerivOAuthUrl();
  }

  return (
    <AppShell>
      <PageHeader
        icon={Globe}
        title="Create New Site"
        subtitle="Choose how you'd like to launch your trading site"
        action={
          <Button size="lg" className="bg-gradient-brand text-brand-foreground shadow-brand">
            <Plus className="size-4" /> New Site
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card-surface p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 font-display text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-5">
        {account ? (
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
        ) : (
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-warning" />
        )}
        <div>
          <p className="font-semibold">{account ? "Deriv account linked" : "Deriv authentication required"}</p>
          <p className="text-sm text-muted-foreground">
            {account
              ? `${account.login_id} is connected for live trading and bot launches.`
              : "Link your Deriv account to launch bots and trade from your site."}
          </p>
        </div>
      </div>

      <section className="card-surface p-6 lg:p-8">
        <h2 className="text-2xl font-bold">Deriv API Authentication</h2>
        <p className="mt-1 text-muted-foreground">
          Creating sites is free. Deriv is only required when you want to launch and trade bots.
        </p>

        <div className="mt-6 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
          <p className="font-semibold">Important: permanent account binding</p>
          <p className="mt-1 text-muted-foreground">
            Once linked, your Deriv account cannot be changed or unlinked. Double-check you are
            using the correct account.
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <label htmlFor="token" className="text-sm font-medium">
            Deriv API Token
          </label>
          <Input
            id="token"
            placeholder={account ? `Linked to ${account.login_id}` : "Enter your Deriv API token"}
            className="h-12"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            disabled={linking}
          />
          <div className="text-sm text-muted-foreground">
            Required scopes:{" "}
            <Badge variant="secondary" className="mx-0.5">
              read
            </Badge>
            <Badge variant="secondary">trading_information</Badge>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            size="lg"
            className="h-12 w-full bg-gradient-brand text-brand-foreground shadow-brand"
            onClick={handleTokenLink}
            disabled={linking || !token.trim()}
          >
            {linking && <Loader2 className="size-4 animate-spin" />}
            Link with Token
          </Button>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
          </div>
          <Button size="lg" variant="outline" className="h-12 w-full" onClick={signInWithDeriv} disabled={linking}>
            Sign in with Deriv
          </Button>
        </div>
      </section>

      <div className="mt-6">
        <SiteBuilder />
      </div>

      <Link
        to="/tutorials"
        className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card/60 p-5 transition-colors hover:bg-accent"
      >
        <span className="text-sm font-medium">New here? Watch the 6-episode beginner bootcamp</span>
        <ArrowRight className="size-4" />
      </Link>
    </AppShell>
  );
}
