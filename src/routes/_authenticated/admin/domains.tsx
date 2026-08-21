import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, StatusBadge } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminDomains, kes } from "@/lib/adminDashboard.functions";

type AdminDomainRow = Awaited<ReturnType<typeof getAdminDomains>>[number];

export const Route = createFileRoute("/_authenticated/admin/domains")({
  head: () => ({
    meta: [
      { title: "Domain Requests - Tronix Forge Admin" },
      { name: "description", content: "Custom domain purchase requests, prices and payment status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDomainsPage,
});

function AdminDomainsPage() {
  const { data: domains = [], isLoading, error } = useQuery({
    queryKey: ["admin-domains"],
    queryFn: () => getAdminDomains(),
  });

  return (
    <>
      <AdminPageHeader icon={Globe} title="Domain Requests" subtitle="Custom domains users asked for, with prices and payment status." />
      <div className="card-surface overflow-x-auto p-2">
        {error ? <p className="p-4 text-sm text-destructive">{String(error.message ?? error)}</p> : null}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain</TableHead>
              <TableHead>Requested by</TableHead>
              <TableHead>Years</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Loading domain requests...</TableCell>
              </TableRow>
            ) : domains.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">No domain requests yet.</TableCell>
              </TableRow>
            ) : (
              domains.map((d: AdminDomainRow) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.domain}</TableCell>
                  <TableCell className="text-muted-foreground">{d.user}</TableCell>
                  <TableCell>{d.years}</TableCell>
                  <TableCell>
                    <p className="font-semibold">${d.usd.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{kes(d.usd)}</p>
                  </TableCell>
                  <TableCell>{d.method}</TableCell>
                  <TableCell className="text-muted-foreground">{d.date}</TableCell>
                  <TableCell><StatusBadge status={d.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant={d.status === "paid" ? "outline" : "default"}
                      onClick={() =>
                        toast.success(
                          d.status === "paid" ? `${d.domain} marked as provisioned` : `Payment reminder sent to ${d.user}`,
                        )
                      }
                    >
                      {d.status === "paid" ? "Provision" : "Remind"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
