import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { AdminPageHeader } from "@/components/AdminShell";
import { Badge } from "@/components/ui/badge";
import { getAdminPackages, kes } from "@/lib/adminDashboard.functions";

type AdminPackageRow = Awaited<ReturnType<typeof getAdminPackages>>[number];

export const Route = createFileRoute("/_authenticated/admin/packages")({
  head: () => ({
    meta: [
      { title: "Packages - Tronix Forge Admin" },
      { name: "description", content: "Credit packs, website plans and signal bot orders with sales and revenue." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPackagesPage,
});

function AdminPackagesPage() {
  const { data: packages = [], isLoading, error } = useQuery({
    queryKey: ["admin-packages"],
    queryFn: () => getAdminPackages(),
  });

  return (
    <>
      <AdminPageHeader icon={Package} title="Packages" subtitle="Credit packs, website plans and signal orders on sale." />
      {error ? <p className="card-surface p-4 text-sm text-destructive">{String(error.message ?? error)}</p> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <div className="card-surface p-5 text-sm text-muted-foreground">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="card-surface p-5 text-sm text-muted-foreground">No packages configured yet.</div>
        ) : (
          packages.map((p: AdminPackageRow) => (
            <div key={p.id} className="card-surface p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold">{p.name}</h2>
                  <p className="text-sm text-muted-foreground">{p.units}</p>
                </div>
                <Badge variant="secondary">{p.kind}</Badge>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="font-display text-2xl font-bold">${p.usd.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{kes(p.usd)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{p.sold} sold</p>
                  <p className="text-xs text-muted-foreground">
                    ${p.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} revenue
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
