import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DollarSign, Globe, Link2, Shield, Users } from "lucide-react";
import { AdminPageHeader, AdminStat, adminNav } from "@/components/AdminShell";
import { getAdminOverview, kes } from "@/lib/adminDashboard.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Console - Tronix Forge" },
      { name: "description", content: "Tronix Forge admin overview: users, domain requests, Deriv links and revenue." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => getAdminOverview(),
  });

  const overview = data ?? {
    users: { total: 0, active: 0 },
    domains: { total: 0, pending: 0 },
    deriv: { total: 0, active: 0 },
    revenue: 0,
  };

  return (
    <>
      <AdminPageHeader
        icon={Shield}
        title="Admin Console"
        subtitle="Everything happening on Tronix Forge: users, purchases, Deriv links, bots and support."
      />

      {error ? <p className="card-surface mb-4 p-4 text-sm text-destructive">{String(error.message ?? error)}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStat icon={Users} label="Total users" value={isLoading ? "..." : String(overview.users.total)} sub={`${overview.users.active} active`} />
        <AdminStat icon={Globe} label="Domain requests" value={isLoading ? "..." : String(overview.domains.total)} sub={`${overview.domains.pending} awaiting payment`} />
        <AdminStat icon={Link2} label="Deriv accounts linked" value={isLoading ? "..." : String(overview.deriv.active)} sub={`${overview.deriv.total} total connections`} />
        <AdminStat icon={DollarSign} label="Gross revenue" value={isLoading ? "..." : `$${overview.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub={kes(overview.revenue)} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {adminNav.slice(1).map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="card-surface flex items-center gap-4 p-5 transition-colors hover:border-primary/40">
            <span className="grid size-11 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-brand">
              <Icon className="size-5" />
            </span>
            <span className="font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
