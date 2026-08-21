import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import { AdminPageHeader, StatusBadge } from "@/components/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminDerivAccounts } from "@/lib/adminDashboard.functions";

type AdminDerivAccountRow = Awaited<ReturnType<typeof getAdminDerivAccounts>>[number];

export const Route = createFileRoute("/_authenticated/admin/deriv")({
  head: () => ({
    meta: [
      { title: "Deriv Accounts - Tronix Forge Admin" },
      { name: "description", content: "Deriv accounts linked by Tronix Forge users and their connection status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDerivPage,
});

function AdminDerivPage() {
  const { data: accounts = [], isLoading, error } = useQuery({
    queryKey: ["admin-deriv-accounts"],
    queryFn: () => getAdminDerivAccounts(),
  });

  return (
    <>
      <AdminPageHeader icon={Link2} title="Deriv Accounts" subtitle="Accounts linked to Deriv through Tronix Forge." />
      <div className="card-surface overflow-x-auto p-2">
        {error ? <p className="p-4 text-sm text-destructive">{String(error.message ?? error)}</p> : null}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Deriv login ID</TableHead>
              <TableHead>Account type</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Linked on</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Loading Deriv accounts...</TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No Deriv accounts linked yet.</TableCell>
              </TableRow>
            ) : (
              accounts.map((a: AdminDerivAccountRow) => (
                <TableRow key={a.id}>
                  <TableCell className="text-muted-foreground">{a.user}</TableCell>
                  <TableCell className="font-mono text-sm">{a.loginId}</TableCell>
                  <TableCell><Badge variant={a.type === "Real" ? "default" : "secondary"}>{a.type}</Badge></TableCell>
                  <TableCell>{a.currency}</TableCell>
                  <TableCell className="text-muted-foreground">{a.linked}</TableCell>
                  <TableCell><StatusBadge status={a.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
