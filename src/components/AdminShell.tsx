import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Users,
  Globe,
  Link2,
  Bot,
  Package,
  Server,
  Headphones,
  KeyRound,
  LogOut,
  Moon,
  Sun,
  Menu,
  ArrowLeft,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/tronix-logo.png";
import { cn } from "@/lib/utils";

export const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/domains", label: "Domain Requests", icon: Globe },
  { to: "/admin/hosting", label: "Hosting Requests", icon: Server },
  { to: "/admin/deriv", label: "Deriv Accounts", icon: Link2 },
  { to: "/admin/bots", label: "Bots", icon: Bot },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/support", label: "Support Settings", icon: Headphones },
  { to: "/admin/api-keys", label: "API Keys", icon: KeyRound },
] as const;

function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("tronix-forge-theme");
    const isDark = stored ? stored === "dark" : false;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);
  const toggle = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("tronix-forge-theme", next ? "dark" : "light");
      return next;
    });
  };
  return { dark, toggle };
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; icon: typeof CheckCircle2 }> = {
    active: { cls: "bg-success/10 text-success", icon: CheckCircle2 },
    paid: { cls: "bg-success/10 text-success", icon: CheckCircle2 },
    published: { cls: "bg-success/10 text-success", icon: CheckCircle2 },
    pending: { cls: "bg-warning/10 text-warning", icon: Clock },
    review: { cls: "bg-warning/10 text-warning", icon: Clock },
    draft: { cls: "bg-muted text-muted-foreground", icon: Clock },
    failed: { cls: "bg-destructive/10 text-destructive", icon: XCircle },
    suspended: { cls: "bg-destructive/10 text-destructive", icon: XCircle },
    revoked: { cls: "bg-destructive/10 text-destructive", icon: XCircle },
  };
  const { cls, icon: Icon } = map[status] ?? map["draft"]!;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${cls}`}>
      <Icon className="size-3" /> {status}
    </span>
  );
}

export function AdminStat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="grid size-9 place-items-center rounded-xl bg-accent">
          <Icon className="size-4 text-primary" />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function AdminPageHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-brand shadow-brand">
          <Icon className="size-6 text-brand-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold lg:text-4xl">{title}</h1>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {action}
    </header>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    sessionStorage.removeItem("tronix-admin-unlocked");
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <img src={logo} alt="Tronix Forge logo" width={40} height={40} className="size-10 rounded-xl shadow-brand" />
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-gradient leading-none">Tronix Forge</p>
            <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">ADMIN CONSOLE</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {adminNav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg transition-colors",
                    active
                      ? "bg-gradient-brand text-brand-foreground shadow-brand"
                      : "bg-muted text-muted-foreground group-hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="size-4" />
                </span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-sidebar-border px-5 py-5 text-sm">
          <button
            onClick={toggle}
            className="flex w-full items-center justify-between rounded-xl px-1 py-1.5 text-muted-foreground transition-colors hover:text-sidebar-foreground"
          >
            <span>Theme</span>
            <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
              <span
                className={cn(
                  "grid size-5 place-items-center rounded-full bg-gradient-brand text-brand-foreground transition-transform",
                  dark ? "translate-x-[22px]" : "translate-x-[2px]",
                )}
              >
                {dark ? <Moon className="size-3" /> : <Sun className="size-3" />}
              </span>
            </span>
          </button>
          <Link
            to="/"
            className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-4" /> <span>User dashboard</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="size-4" /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <button
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Open admin menu"
        className="fixed left-4 top-4 z-50 grid size-10 place-items-center rounded-xl border border-border bg-card shadow-soft lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className="min-h-screen lg:pl-[260px]">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 pt-20 lg:px-10 lg:pt-12">{children}</div>
      </main>
    </div>
  );
}
