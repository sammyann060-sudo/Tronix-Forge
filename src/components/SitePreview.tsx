import { useMemo, useState } from "react";
import { ExternalLink, Maximize2, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { googleFontHref, type SiteBrand } from "@/lib/siteBrand";
import { cn } from "@/lib/utils";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildPreviewDoc(brand: SiteBrand) {
  const name = escapeHtml(brand.name.trim() || "My Trading Hub");
  const tagline = escapeHtml(brand.tagline.trim() || "Automated Deriv trading bots, ready to run.");
  const logo = brand.logoDataUrl
    ? `<img src="${brand.logoDataUrl}" alt="${name} logo" />`
    : name.slice(0, 1).toUpperCase();

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="${googleFontHref(brand.font)}" />
<style>
  *{box-sizing:border-box}
  :root{--p:${brand.primaryColor};--s:${brand.secondaryColor};--ink:#f8fafc;--muted:rgba(248,250,252,.72);--panel:rgba(255,255,255,.08);--line:rgba(255,255,255,.14)}
  body{margin:0;font-family:"${brand.font}",system-ui,sans-serif;background:var(--s);color:var(--ink)}
  button,input,select{font:inherit}
  button{cursor:pointer}
  .shell{min-height:100vh;display:grid;grid-template-rows:auto 1fr}
  header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 20px;border-bottom:1px solid var(--line);position:sticky;top:0;background:color-mix(in srgb,var(--s) 90%,#000);z-index:5}
  .brand{display:flex;align-items:center;gap:10px;font-weight:800;min-width:0}
  .brand-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .logo{width:34px;height:34px;border-radius:8px;background:var(--p);display:grid;place-items:center;color:var(--s);font-weight:900;overflow:hidden;flex:0 0 auto}
  .logo img{width:100%;height:100%;object-fit:contain}
  nav{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
  .nav-btn,.primary,.ghost{border:0;border-radius:8px;padding:9px 12px;font-weight:700;font-size:13px}
  .nav-btn{background:transparent;color:var(--muted)}
  .nav-btn.active{background:var(--panel);color:#fff}
  .primary{background:var(--p);color:var(--s)}
  .ghost{background:transparent;color:#fff;border:1px solid var(--line)}
  main{padding:24px;display:grid;gap:18px}
  .hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(300px,.95fr);gap:20px;align-items:stretch}
  .hero-copy{padding:24px 0}
  h1{font-size:clamp(34px,6vw,64px);line-height:1;letter-spacing:0;margin:0;max-width:12ch}
  h1 span,.accent{color:var(--p)}
  .sub{color:var(--muted);font-size:16px;line-height:1.6;max-width:58ch;margin:16px 0 0}
  .actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
  .panel,.card{background:var(--panel);border:1px solid var(--line);border-radius:8px}
  .panel{padding:18px}
  .bot-panel{display:grid;gap:12px}
  .field{display:grid;gap:6px}
  label{color:var(--muted);font-size:12px;font-weight:700}
  input,select{width:100%;border:1px solid var(--line);border-radius:8px;background:rgba(0,0,0,.22);color:#fff;padding:10px}
  .metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
  .card{padding:15px}
  .card small{color:var(--muted)}
  .kpi{display:block;margin-top:8px;color:var(--p);font-size:22px;font-weight:900}
  .view{display:none}
  .view.active{display:grid;gap:16px}
  .market-grid,.bot-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
  .modal{position:fixed;inset:0;display:none;place-items:center;background:rgba(0,0,0,.62);padding:18px;z-index:10}
  .modal.open{display:grid}
  .dialog{max-width:440px;width:100%;background:#111827;border:1px solid var(--line);border-radius:8px;padding:18px}
  .dialog h2{margin:0 0 8px}
  .dialog p{color:var(--muted);line-height:1.5}
  footer{padding:18px 24px;border-top:1px solid var(--line);color:var(--muted);font-size:12px}
  @media (max-width:760px){
    header{align-items:flex-start;flex-direction:column}
    nav{justify-content:flex-start}
    main{padding:16px}
    .hero{grid-template-columns:1fr}
    .metrics{grid-template-columns:1fr}
  }
</style>
</head>
<body>
<div class="shell">
  <header>
    <div class="brand"><div class="logo">${logo}</div><span class="brand-name">${name}</span></div>
    <nav>
      <button class="nav-btn active" data-view="home">Home</button>
      <button class="nav-btn" data-view="bots">Bots</button>
      <button class="nav-btn" data-view="markets">Markets</button>
      <button class="nav-btn" data-connect>Deriv</button>
    </nav>
  </header>
  <main>
    <section class="view active" id="home">
      <div class="hero">
        <div class="hero-copy">
          <h1>Trade Deriv on <span>autopilot</span>.</h1>
          <p class="sub">${tagline}</p>
          <div class="actions">
            <button class="primary" data-launch>Launch bot</button>
            <button class="ghost" data-connect>Sign in with Deriv</button>
          </div>
        </div>
        <div class="panel bot-panel">
          <div class="field"><label>Bot</label><select><option>Digit Over strategy</option><option>Rise/Fall scalper</option><option>Uploaded XML bot</option></select></div>
          <div class="field"><label>Market</label><select><option>Volatility 100 Index</option><option>Volatility 75 Index</option><option>Volatility 10 Index</option></select></div>
          <div class="field"><label>Stake</label><input value="0.35" /></div>
          <button class="primary" data-launch>Launch bot</button>
        </div>
      </div>
      <div class="metrics">
        <div class="card"><small>Active bots</small><span class="kpi">12</span></div>
        <div class="card"><small>Win rate</small><span class="kpi">68%</span></div>
        <div class="card"><small>Session P/L</small><span class="kpi">+$24.80</span></div>
      </div>
    </section>
    <section class="view" id="bots">
      <div class="bot-grid">
        <div class="card"><strong>Digit Over strategy</strong><p class="sub">Fast synthetic index bot.</p><button class="primary" data-launch>Launch bot</button></div>
        <div class="card"><strong>Rise/Fall scalper</strong><p class="sub">Simple tick-based bot.</p><button class="primary" data-launch>Launch bot</button></div>
        <div class="card"><strong>Uploaded XML bot</strong><p class="sub">Your custom DBot XML.</p><button class="primary" data-launch>Launch bot</button></div>
      </div>
    </section>
    <section class="view" id="markets">
      <div class="market-grid">
        <div class="card"><small>Volatility 10</small><span class="kpi">R_10</span></div>
        <div class="card"><small>Volatility 75</small><span class="kpi">R_75</span></div>
        <div class="card"><small>Volatility 100</small><span class="kpi">R_100</span></div>
      </div>
    </section>
  </main>
  <footer>${new Date().getFullYear()} ${name}. Branded trading app preview.</footer>
</div>
<div class="modal" id="launch-modal"><div class="dialog"><h2>Bot launch ready</h2><p>This button opens the live trading runner on the delivered site. Link Deriv first, then start or stop the bot from the run panel.</p><button class="primary" data-close>Got it</button></div></div>
<div class="modal" id="deriv-modal"><div class="dialog"><h2>Connect Deriv</h2><p>The real site redirects to Deriv sign-in or accepts a scoped API token, then stores the linked login for live bot trading.</p><button class="primary" data-close>Got it</button></div></div>
<script>
  document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-view]').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.view').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.view).classList.add('active');
  }));
  document.querySelectorAll('[data-launch]').forEach(btn => btn.addEventListener('click', () => document.getElementById('launch-modal').classList.add('open')));
  document.querySelectorAll('[data-connect]').forEach(btn => btn.addEventListener('click', () => document.getElementById('deriv-modal').classList.add('open')));
  document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => btn.closest('.modal').classList.remove('open')));
</script>
</body>
</html>`;
}

function PreviewFrame({ brand, device, full = false }: { brand: SiteBrand; device: "desktop" | "mobile"; full?: boolean }) {
  const srcDoc = useMemo(() => buildPreviewDoc(brand), [brand]);
  return (
    <iframe
      title={full ? "Full site preview" : "Site preview"}
      srcDoc={srcDoc}
      className={cn(
        "rounded-lg border border-border bg-black transition-all",
        full ? "h-[72vh]" : "h-[520px]",
        device === "desktop" ? "w-full" : "w-[390px] max-w-full",
      )}
    />
  );
}

export function SitePreview({ brand }: { brand: SiteBrand }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">Live preview</h3>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => setOpen(true)}>
            <Maximize2 className="size-4" /> Open preview
          </Button>
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
        <div className="flex justify-center overflow-auto bg-background/40 p-3">
          <PreviewFrame brand={brand} device={device} />
        </div>
      </div>
      <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <ExternalLink className="size-3" />
        Use Open preview to click through the full responsive site before requesting hosting.
      </p>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-[96vw] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Interactive Site Preview</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end">
            <div className="flex gap-1 rounded-full border border-border p-1">
              <button
                type="button"
                aria-label="desktop"
                onClick={() => setDevice("desktop")}
                className={cn("rounded-full p-1.5", device === "desktop" ? "bg-primary/15 text-primary" : "text-muted-foreground")}
              >
                <Monitor className="size-4" />
              </button>
              <button
                type="button"
                aria-label="mobile"
                onClick={() => setDevice("mobile")}
                className={cn("rounded-full p-1.5", device === "mobile" ? "bg-primary/15 text-primary" : "text-muted-foreground")}
              >
                <Smartphone className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex justify-center overflow-auto rounded-xl bg-background/70 p-3">
            <PreviewFrame brand={brand} device={device} full />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
