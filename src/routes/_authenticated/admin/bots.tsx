import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Bot } from "lucide-react";
import { AdminPageHeader, StatusBadge } from "@/components/AdminShell";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminBots } from "@/lib/adminDashboard.functions";

type AdminBotRow = Awaited<ReturnType<typeof getAdminBots>>[number];

export const Route = createFileRoute("/_authenticated/admin/bots")({
  head: () => ({
    meta: [
      { title: "Bots - Tronix Forge Admin" },
      { name: "description", content: "Every bot created on Tronix Forge, AI generated or uploaded XML." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminBotsPage,
});

function AdminBotsPage() {
  const { data: bots = [], isLoading, error } = useQuery({
    queryKey: ["admin-bots"],
    queryFn: () => getAdminBots(),
  });

  return (
    <>
      <AdminPageHeader icon={Bot} title="Bots" subtitle="Bots made by users: AI generated, uploaded XML and signal bots." />
      <div className="card-surface overflow-x-auto p-2">
        {error ? <p className="p-4 text-sm text-destructive">{String(error.message ?? error)}</p> : null}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bot</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Credits used</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Loading bots...</TableCell>
              </TableRow>
            ) : bots.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No bots yet.</TableCell>
              </TableRow>
            ) : (
              bots.map((b: AdminBotRow) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.name}</TableCell>
                  <TableCell className="text-muted-foreground">{b.owner}</TableCell>
                  <TableCell><Badge variant="secondary">{b.type}</Badge></TableCell>
                  <TableCell>{b.credits}</TableCell>
                  <TableCell className="text-muted-foreground">{b.created}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
