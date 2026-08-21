import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Server, Download } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader, StatusBadge } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HOSTING_EVENT,
  listHostingRequests,
  updateHostingRequest,
  removeHostingRequest,
  type HostingRequest,
} from "@/lib/siteBrand";
import { downloadSiteCode } from "@/lib/siteExport";

export const Route = createFileRoute("/_authenticated/admin/hosting")({
  head: () => ({
    meta: [
      { title: "Hosting Requests — Tronix Forge Admin" },
      {
        name: "description",
        content:
          "Managed hosting requests with preferred domains and downloadable branded site builds.",
      },
      { property: "og:title", content: "Hosting Requests — Tronix Forge Admin" },
      {
        property: "og:description",
        content: "Review hosting requests, pick a domain and download the branded build.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminHostingPage,
});

function AdminHostingPage() {
  const [requests, setRequests] = useState<HostingRequest[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => setRequests(listHostingRequests());
    sync();
    window.addEventListener(HOSTING_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(HOSTING_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  async function handleDownload(req: HostingRequest) {
    setBusy(req.id);
    try {
      await downloadSiteCode(req.brand, req.chosenDomain ?? req.domains[0]);
      toast.success("Branded build downloaded");
    } catch {
      toast.error("Could not build that site");
    } finally {
      setBusy(null);
    }
  }

  function choose(req: HostingRequest, domain: string) {
    updateHostingRequest(req.id, { chosenDomain: domain, status: "approved" });
    toast.success(`${domain} selected for ${req.brand.name}`);
  }

  return (
    <>
      <AdminPageHeader
        icon={Server}
        title="Hosting Requests"
        subtitle="Users who asked us to host their site — pick an available domain and download their build."
      />

      {requests.length === 0 ? (
        <div className="card-surface grid place-items-center p-16 text-center">
          <Server className="size-10 text-muted-foreground" />
          <p className="mt-4 font-semibold">No hosting requests yet</p>
          <p className="text-sm text-muted-foreground">
            Requests appear here as soon as a user chooses “Let us host it for you”.
          </p>
        </div>
      ) : (
        <div className="card-surface overflow-x-auto p-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Requested by</TableHead>
                <TableHead>Preferred domains</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.brand.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.requestedBy}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {r.domains.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => choose(r, d)}
                          className={
                            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors " +
                            (r.chosenDomain === d
                              ? "border-transparent bg-gradient-brand text-brand-foreground"
                              : "border-border hover:bg-accent")
                          }
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className="size-4 rounded-full border border-border"
                        style={{ background: r.brand.primaryColor }}
                      />
                      <span
                        className="size-4 rounded-full border border-border"
                        style={{ background: r.brand.secondaryColor }}
                      />
                      <span className="text-xs text-muted-foreground">{r.brand.font}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status === "live" ? "published" : r.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy === r.id}
                        onClick={() => handleDownload(r)}
                      >
                        <Download className="size-4" />
                        {busy === r.id ? "Building…" : "Build"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          updateHostingRequest(r.id, { status: "live" });
                          toast.success("Marked as live");
                        }}
                      >
                        Mark live
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          removeHostingRequest(r.id);
                          toast.success("Request removed");
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}
