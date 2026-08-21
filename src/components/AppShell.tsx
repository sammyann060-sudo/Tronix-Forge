import { Link, useRouterState } from "@tanstack/react-router";
import {
  Globe,
  GraduationCap,
  Link2,
  Megaphone,
  Rocket,
  DollarSign,
  Bot,
  Wand2,
  Settings as SettingsIcon,
  ChevronLeft,
  LogOut,
  Moon,
  Sun,
  Menu,
  Coins,
  PenLine,
  Zap,
  Store,
  PlayCircle,
  Headphones,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/tronix-logo.png";
import { cn } from "@/lib/utils";
import { SupportWidget } from "@/components/SupportWidget";
import { AiCreditsDialog } from "@/components/AiCreditsDialog";

const nav = [
  { to: "/", label: "Sites", icon: Globe },
  { to: "/tutorials", label: "Tutorials", icon: GraduationCap },
  { to: "/domains", label: "Domains", icon: Link2 },
  { to: "/updates", label: "Platform Updates", icon: Megaphone },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/deployments", label: "Deployments", icon: Rocket },
  { to: "/commissions", label: "Commissions", icon: DollarSign },
  { to: "/earnings", label: "Earnings", icon: DollarSign },
  { to: "/website-editor", label: "Website Editor", icon: PenLine },
  { to: "/xml-bots", label: "XML Bots", icon: Bot },
  { to: "/ai-generator", label: "AI Bot Generator", icon: Wand2 },
  { to: "/live-trading", label: "Live Trading", icon: PlayCircle },
  { to: "/ai-signals", label: "AI Signals", icon: Zap },
  { to: "/bot-store", label: "Bot Store", icon: Store },
  { to: "/support", label: "Support", icon: Headphones },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
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

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen surface-grad">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur transition-[width,transform] duration-300",
          collapsed ? "w-[84px]" : "w-[268px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center gap-3 px-5 py-6">
          <img
            src={logo}
            alt="Tronix Forge logo"
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-xl shadow-brand"
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-xl font-bold text-gradient leading-none">Tronix Forge</p>
              <p className="mt-1 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground">
                TRADING PLATFORM
              </p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                title={label}
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
                {!collapsed && <span className="truncate">{label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-sidebar-border px-5 py-5 text-sm">
          <button
            onClick={toggle}
            className="flex w-full items-center justify-between rounded-xl px-1 py-1.5 text-muted-foreground transition-colors hover:text-sidebar-foreground"
          >
            {!collapsed && <span>Theme</span>}
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
          <AiCreditsDialog>
            <button className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-muted-foreground transition-colors hover:text-primary">
              <Coins className="size-4" />
              {!collapsed && <span>AI Credits</span>}
            </button>
          </AiCreditsDialog>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-1 py-1.5 text-muted-foreground transition-colors hover:text-destructive"
          >
            <LogOut className="size-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
          {!collapsed && <p className="pt-1 text-xs text-muted-foreground">© 2026 Tronix Forge</p>}
        </div>
      </aside>

      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label="Collapse sidebar"
        className={cn(
          "fixed top-24 z-50 hidden size-8 place-items-center rounded-full border border-border bg-card text-muted-foreground shadow-soft transition-all hover:text-foreground lg:grid",
          collapsed ? "left-[68px]" : "left-[252px]",
        )}
      >
        <ChevronLeft className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
      </button>

      <button
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Open menu"
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

      <main
        className={cn(
          "min-h-screen transition-[padding] duration-300",
          collapsed ? "lg:pl-[84px]" : "lg:pl-[268px]",
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-10 pt-20 lg:px-10 lg:pt-12">{children}</div>
      </main>

      <SupportWidget />
    </div>
  );
}

export function PageHeader({
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
