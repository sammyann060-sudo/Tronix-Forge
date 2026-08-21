import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { AdminPageHeader, StatusBadge } from "@/components/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminUsers } from "@/lib/adminDashboard.functions";

type AdminUserRow = Awaited<ReturnType<typeof getAdminUsers>>[number];

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({
    meta: [
      { title: "Users - Tronix Forge Admin" },
      { name: "description", content: "All Tronix Forge members, their plans, sites and AI credits." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => getAdminUsers(),
  });

  return (
    <>
      <AdminPageHeader icon={Users} title="Users" subtitle="Everyone who has joined Tronix Forge." />
      <div className="card-surface overflow-x-auto p-2">
        {error ? <p className="p-4 text-sm text-destructive">{String(error.message ?? error)}</p> : null}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Sites</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Loading users...</TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No users yet.</TableCell>
              </TableRow>
            ) : (
              users.map((u: AdminUserRow) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.joined}</TableCell>
                  <TableCell>{u.sites}</TableCell>
                  <TableCell>{u.credits}</TableCell>
                  <TableCell><Badge variant="secondary">{u.plan}</Badge></TableCell>
                  <TableCell><StatusBadge status={u.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
