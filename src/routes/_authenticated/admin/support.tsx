import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Headphones, Save } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { readSupportLinks, saveSupportLinks, type SupportLinks } from "@/lib/supportLinks";

export const Route = createFileRoute("/_authenticated/admin/support")({
  head: () => ({
    meta: [
      { title: "Support Settings — Tronix Forge Admin" },
      { name: "description", content: "Set the WhatsApp, Telegram and email links users see for support." },
      { property: "og:title", content: "Support Settings — Tronix Forge Admin" },
      { property: "og:description", content: "Configure support channels." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSupportPage,
});

function AdminSupportPage() {
  const [links, setLinks] = useState<SupportLinks>(() => readSupportLinks());
  const update = (patch: Partial<SupportLinks>) => setLinks((l) => ({ ...l, ...patch }));

  return (
    <>
      <AdminPageHeader
        icon={Headphones}
        title="Support Settings"
        subtitle="These links power the Support page and the floating chat widget."
      />
      <div className="card-surface max-w-2xl space-y-5 p-6">
        <div className="space-y-1.5">
          <Label htmlFor="wa">WhatsApp link or number</Label>
          <Input
            id="wa"
            value={links.whatsapp}
            onChange={(e) => update({ whatsapp: e.target.value })}
            placeholder="https://wa.me/2547XXXXXXXX"
          />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div>
            <p className="text-sm font-semibold">WhatsApp available</p>
            <p className="text-xs text-muted-foreground">Turn off to show “Coming soon” instead.</p>
          </div>
          <Switch checked={links.whatsappEnabled} onCheckedChange={(v) => update({ whatsappEnabled: v })} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tg">Telegram support link</Label>
          <Input id="tg" value={links.telegram} onChange={(e) => update({ telegram: e.target.value })} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tgc">Telegram channel link</Label>
          <Input id="tgc" value={links.telegramChannel} onChange={(e) => update({ telegramChannel: e.target.value })} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="mail">Support email</Label>
          <Input id="mail" type="email" value={links.email} onChange={(e) => update({ email: e.target.value })} />
        </div>

        <Button
          className="bg-gradient-brand text-brand-foreground"
          onClick={() => {
            saveSupportLinks(links);
            toast.success("Support settings saved");
          }}
        >
          <Save className="size-4" /> Save support settings
        </Button>
      </div>
    </>
  );
}
