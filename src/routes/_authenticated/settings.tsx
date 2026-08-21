import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, User, ShieldCheck, BarChart3, TriangleAlert, Save } from "lucide-react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Tronix Forge Trading Platform" },
      {
        name: "description",
        content: "Manage your Tronix Forge account details, two-factor authentication and usage quota.",
      },
      { property: "og:title", content: "Settings — Tronix Forge Trading Platform" },
      {
        property: "og:description",
        content: "Manage your account details, two-factor authentication and usage quota.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        subtitle="Manage your account settings and preferences"
      />

      <div className="space-y-6">
        <section className="card-surface p-6">
          <h2 className="inline-flex items-center gap-2 text-xl font-bold">
            <User className="size-5 text-primary" /> Account information
          </h2>
          <p className="text-sm text-muted-foreground">View and update your account details</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" defaultValue="you@example.com" disabled className="h-11" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Display name
              </label>
              <Input id="name" defaultValue="Ann Sammy" className="h-11" />
            </div>
          </div>
          <Button className="mt-5 bg-gradient-brand text-brand-foreground shadow-brand">
            <Save className="size-4" /> Update name
          </Button>
        </section>

        <section className="card-surface p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="inline-flex items-center gap-2 text-xl font-bold">
                <ShieldCheck className="size-5 text-primary" /> Two-factor authentication
              </h2>
              <p className="text-sm text-muted-foreground">
                Require an authenticator code in addition to your password.
              </p>
            </div>
            <Badge variant="secondary">Optional</Badge>
          </div>
          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <li>Works with Google Authenticator and other TOTP apps.</li>
            <li>Recovery codes help you regain access if your phone is unavailable.</li>
          </ul>
          <Button className="mt-5 bg-gradient-brand text-brand-foreground shadow-brand">
            Set up two-factor authentication
          </Button>
        </section>

        <section className="card-surface p-6">
          <h2 className="inline-flex items-center gap-2 text-xl font-bold">
            <BarChart3 className="size-5 text-primary" /> Usage &amp; quota
          </h2>
          <p className="text-sm text-muted-foreground">Your current usage statistics</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-muted p-5">
              <p className="text-sm text-muted-foreground">Sites created</p>
              <p className="font-display text-3xl font-bold text-gradient">0</p>
            </div>
            <div className="rounded-2xl bg-muted p-5">
              <p className="text-sm text-muted-foreground">Deployments</p>
              <p className="font-display text-3xl font-bold text-gradient">0</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium">Site quota</span>
              <span className="text-muted-foreground">0 / 5</span>
            </div>
            <Progress value={0} />
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm font-medium">Role</span>
            <Badge variant="secondary">User</Badge>
          </div>
        </section>

        <section className="rounded-2xl border border-destructive/40 bg-destructive/5 p-6">
          <h2 className="inline-flex items-center gap-2 text-xl font-bold text-destructive">
            <TriangleAlert className="size-5" /> Danger zone
          </h2>
          <p className="text-sm text-muted-foreground">Irreversible actions</p>
          <p className="mt-4 text-sm">
            Once you delete your account there is no going back. All your sites and deployments will
            be permanently deleted.
          </p>
          <Button variant="destructive" className="mt-5">
            Delete account
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
