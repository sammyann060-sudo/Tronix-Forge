import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyAdminSecondPassword } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function SecondPasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const verify = useServerFn(verifyAdminSecondPassword);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await verify({ data: { password } });
      if (res.ok) {
        sessionStorage.setItem("tronix-admin-unlocked", "1");
        onUnlock();
      } else {
        toast.error("Incorrect admin password");
      }
    } catch {
      toast.error("You are not authorised to access the admin console");
    } finally {
      setBusy(false);
      setPassword("");
    }
  }

  return (
    <main className="surface-grad flex min-h-screen items-center justify-center px-5">
      <div className="card-surface w-full max-w-md p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-brand shadow-brand">
          <Lock className="size-6 text-brand-foreground" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">Admin verification</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your second admin password to open the console.
        </p>
        <form onSubmit={submit} className="mt-6 space-y-3 text-left">
          <Label htmlFor="second-pass">Second password</Label>
          <Input
            id="second-pass"
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button disabled={busy} type="submit" className="w-full bg-gradient-brand text-brand-foreground">
            {busy && <Loader2 className="size-4 animate-spin" />} Unlock console
          </Button>
        </form>
      </div>
    </main>
  );
}

function AdminLayout() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem("tronix-admin-unlocked") === "1");
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!unlocked) return <SecondPasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
