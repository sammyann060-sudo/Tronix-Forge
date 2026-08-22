export type SiteBrand = {
  name: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  /** data URL of the uploaded logo (png/svg), optional */
  logoDataUrl?: string;
  logoFileName?: string;
};

export const FONT_OPTIONS = [
  { label: "DM Sans", value: "DM Sans", google: "DM+Sans:wght@400;500;700" },
  { label: "Space Grotesk", value: "Space Grotesk", google: "Space+Grotesk:wght@400;500;700" },
  { label: "Inter", value: "Inter", google: "Inter:wght@400;500;700" },
  { label: "Manrope", value: "Manrope", google: "Manrope:wght@400;500;800" },
  { label: "Outfit", value: "Outfit", google: "Outfit:wght@400;500;700" },
  { label: "Sora", value: "Sora", google: "Sora:wght@400;500;700" },
] as const;

export const COLOR_PRESETS = [
  { label: "Neon Lime", primary: "#90f73b", secondary: "#0f172a" },
  { label: "Violet Forge", primary: "#7c3aed", secondary: "#c026d3" },
  { label: "Deriv Red", primary: "#ff444f", secondary: "#0e0e0e" },
  { label: "Ocean", primary: "#0ea5e9", secondary: "#1e293b" },
  { label: "Gold", primary: "#f59e0b", secondary: "#111827" },
] as const;

export const defaultBrand: SiteBrand = {
  name: "My Trading Hub",
  tagline: "Automated Deriv trading bots, ready to run.",
  primaryColor: "#90f73b",
  secondaryColor: "#0f172a",
  font: "DM Sans",
};

export function googleFontHref(font: string) {
  const match = FONT_OPTIONS.find((f) => f.value === font);
  const family = match?.google ?? "DM+Sans:wght@400;500;700";
  return `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
}

export const USD_TO_KES = 129;

/** Site creation and hosting requests are free; bot products carry the paid pricing. */
export const SITE_PRICING = {
  download: 0,
  hosting: 0,
} as const;

export type HostingRequest = {
  id: string;
  createdAt: string;
  requestedBy: string;
  brand: SiteBrand;
  /** preferred domain names in priority order, checked for availability */
  domains: string[];
  chosenDomain?: string;
  status: "pending" | "checking" | "approved" | "live";
  notes?: string;
};

const KEY = "tronix-forge-hosting-requests";
const EVENT = "tronix-hosting-changed";

function read(): HostingRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HostingRequest[]) : [];
  } catch {
    return [];
  }
}

function write(list: HostingRequest[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVENT));
}

export const HOSTING_EVENT = EVENT;

export function listHostingRequests(): HostingRequest[] {
  return read();
}

export function addHostingRequest(req: HostingRequest) {
  write([req, ...read()]);
}

export function updateHostingRequest(id: string, patch: Partial<HostingRequest>) {
  write(read().map((r) => (r.id === id ? { ...r, ...patch } : r)));
}

export function removeHostingRequest(id: string) {
  write(read().filter((r) => r.id !== id));
}

/** Lightweight availability heuristic used before an order is placed. */
export function domainLooksValid(domain: string) {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/i.test(domain.trim());
}
