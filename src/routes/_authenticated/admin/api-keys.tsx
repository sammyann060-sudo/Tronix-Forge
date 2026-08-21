import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAdminSettings, saveAdminSetting } from "@/lib/adminSettings.functions";

export const Route = createFileRoute("/_authenticated/admin/api-keys")({
  head: () => ({
    meta: [
      { title: "API Keys — Tronix Forge Admin" },
      { name: "description", content: "Store the Codex API key used as a fallback for the built-in AI." },
      { property: "og:title", content: "API Keys — Tronix Forge Admin" },
      { property: "og:description", content: "Codex fallback configuration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminApiKeysPage,
});

function AdminApiKeysPage() {
  const load = useServerFn(getAdminSettings);
  const save = useServerFn(saveAdminSetting);
  const [codexKey, setCodexKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load({})
      .then((rows) => {
        for (const r of rows) {
          if (r.key === "codex_api_key") setPreview(r.preview);
          if (r.key === "codex_base_url") setBaseUrl(r.preview);
          if (r.key === "codex_model") setModel(r.preview);
        }
      })
      .catch(() => toast.error("Could not load API settings"));
  }, [load]);

  async function persist() {
    setBusy(true);
    try {
      if (codexKey.trim()) {
        await save({ data: { key: "codex_api_key", value: codexKey.trim() } });
        setPreview(`${codexKey.trim().slice(0, 4)}••••${codexKey.trim().slice(-4)}`);
        setCodexKey("");
      }
      await save({ data: { key: "codex_base_url", value: baseUrl.trim() } });
      await save({ data: { key: "codex_model", value: model.trim() } });
      toast.success("Codex fallback settings saved");
    } catch {
      toast.error("Could not save API settings");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        icon={KeyRound}
        title="API Keys"
        subtitle="Codex fallback used automatically when the built-in AI is unavailable or out of quota."
      />
      <div className="card-surface max-w-2xl space-y-5 p-6">
        <div className="space-y-1.5">
          <Label htmlFor="codex-key">Codex API key</Label>
          <Input
            id="codex-key"
            type="password"
            autoComplete="off"
            placeholder={preview || "sk-..."}
            value={codexKey}
            onChange={(e) => setCodexKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            {preview ? `Currently stored: ${preview}` : "No key stored yet."} Keys are saved server-side and never
            exposed to the browser.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="codex-url">Base URL</Label>
          <Input id="codex-url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.openai.com/v1" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="codex-model">Model</Label>
          <Input id="codex-model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="gpt-5-codex" />
        </div>

        <Button disabled={busy} onClick={persist} className="bg-gradient-brand text-brand-foreground">
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save API settings
        </Button>
      </div>
    </>
  );
}
