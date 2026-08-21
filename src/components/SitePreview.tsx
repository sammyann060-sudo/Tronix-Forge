import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { googleFontHref, type SiteBrand } from "@/lib/siteBrand";
import { cn } from "@/lib/utils";

/**
 * Live preview of the generated site. Every site is the same Tronix trading app —
 * only name, logo, colours and font change, which is exactly what this renders.
 */
export function SitePreview({ brand }: { brand: SiteBrand }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const name = brand.name.trim() || "My Trading Hub";
  const tagline = brand.tagline.trim() || "Automated Deriv trading bots, ready to run.";

  const srcDoc = `<!doctype html><html><head><meta charset="utf-8" />
<link rel="stylesheet" href="${googleFontHref(brand.font)}" />
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--p:${brand.primaryColor};--s:${brand.secondaryColor}}
  body{font-family:"${brand.font}",system-ui,sans-serif;background:var(--s);color:#fff}
  header{display:flex;align-items:center;justify-content:space-between;padding:16px 22px;border-bottom:1px solid rgba(255,255,255,.1)}
  .brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:17px}
  .logo{width:30px;height:30px;border-radius:9px;background:var(--p);display:grid;place-items:center;color:var(--s);font-weight:800;font-size:14px;overflow:hidden}
  .logo img{width:100%;height:100%;object-fit:contain}
  nav{display:flex;gap:18px;font-size:13px;opacity:.75}
  .cta{background:var(--p);color:var(--s);padding:8px 14px;border-radius:999px;font-size:13px;font-weight:700}
  main{padding:44px 22px}
  h1{font-size:34px;line-height:1.1;letter-spacing:-.02em;max-width:16ch}
  h1 span{color:var(--p)}
  p.sub{margin-top:14px;opacity:.7;font-size:14px;max-width:44ch}
  .row{display:flex;gap:12px;margin-top:22px;flex-wrap:wrap}
  .ghost{border:1px solid rgba(255,255,255,.25);padding:8px 14px;border-radius:999px;font-size:13px}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-top:38px}
  .card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:16px}
  .card b{display:block;font-size:14px}
  .card small{opacity:.6;font-size:12px}
  .kpi{color:var(--p);font-weight:800;font-size:20px;margin-top:8px;display:block}
  footer{padding:18px 22px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;opacity:.55}
</style></head><body>
<header>
  <div class="brand"><div class="logo">${
    brand.logoDataUrl ? `<img src="${brand.logoDataUrl}" alt="" />` : name.slice(0, 1).toUpperCase()
  }</div>${name}</div>
  <nav><span>Bots</span><span>Markets</span><span>Pricing</span></nav>
  <div class="cta">Launch app</div>
</header>
<main>
  <h1>Trade Deriv on <span>autopilot</span>.</h1>
  <p class="sub">${tagline}</p>
  <div class="row"><div class="cta">Get started free</div><div class="ghost">View bots</div></div>
  <div class="cards">
    <div class="card"><b>Active bots</b><small>Running now</small><span class="kpi">12</span></div>
    <div class="card"><b>Win rate</b><small>Last 30 days</small><span class="kpi">68%</span></div>
    <div class="card"><b>Profit</b><small>This month</small><span class="kpi">$1,420</span></div>
  </div>
</main>
<footer>© ${new Date().getFullYear()} ${name}. All rights reserved.</footer>
</body></html>`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Live preview</h3>
        <div className="flex gap-1 rounded-full border border-border p-1">
          {([
            { id: "desktop", icon: Monitor },
            { id: "mobile", icon: Smartphone },
          ] as const).map(({ id, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-label={id}
              onClick={() => setDevice(id)}
              className={cn(
                "rounded-full p-1.5 transition-colors",
                device === id ? "bg-primary/15 text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-muted/40">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-warning/60" />
          <span className="size-2.5 rounded-full bg-success/60" />
          <span className="ml-2 truncate rounded-md bg-background px-2 py-0.5 text-xs text-muted-foreground">
            {(brand.name.trim() || "my-trading-hub").toLowerCase().replace(/\s+/g, "-")}
            .tronixforge.site
          </span>
        </div>
        <div className="flex justify-center bg-background/40 p-3">
          <iframe
            title="Site preview"
            srcDoc={srcDoc}
            className={cn(
              "h-[460px] rounded-lg border border-border bg-black transition-all",
              device === "desktop" ? "w-full" : "w-[380px]",
            )}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Preview of your branding. The delivered site is the full Tronix trading app with these
        colours, font, name and logo applied.
      </p>
    </div>
  );
}
