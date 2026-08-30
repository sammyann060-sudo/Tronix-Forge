import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Globe, Loader2, ShieldAlert } from "lucide-react";
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
        subtitle="Choose how you'd like to create your site"
      />

      <div className="mb-8 rounded-2xl border border-success/30 bg-success/5 p-5">
        {account ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <CheckCircle2 className="size-5 shrink-0 text-success" />
              <div className="min-w-0">
                <p className="font-semibold">{account.login_id}</p>
                <p className="text-sm text-muted-foreground">
                  {account.account_type} account connected for site creation and bot launches.
                </p>
              </div>
            </div>
            <Badge variant="secondary">{account.currency}</Badge>
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <ShieldAlert className="size-5 text-warning" />
                <div>
                  <p className="font-semibold">Deriv authentication required</p>
                  <p className="text-sm text-muted-foreground">
                    Link your Deriv account before launching live bots from the site.
                  </p>
                </div>
              </div>
              <Input
                id="token"
                placeholder="Enter your Deriv API token"
                className="h-11"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={linking}
              />
              <div className="text-xs text-muted-foreground">
                Required scopes: <Badge variant="secondary">read</Badge>{" "}
                <Badge variant="secondary">trading_information</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleTokenLink} disabled={linking || !token.trim()}>
                {linking && <Loader2 className="size-4 animate-spin" />}
                Link Token
              </Button>
              <Button variant="outline" onClick={signInWithDeriv} disabled={linking}>
                Sign in with Deriv
              </Button>
            </div>
          </div>
        )}
      </div>

      <SiteBuilder />
    </AppShell>
  );
}
