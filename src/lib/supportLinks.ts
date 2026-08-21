import { useEffect, useState } from "react";

export type SupportLinks = {
  telegram: string;
  telegramChannel: string;
  whatsapp: string;
  whatsappEnabled: boolean;
  email: string;
};

export const defaultSupportLinks: SupportLinks = {
  telegram: "https://t.me/tronixforge",
  telegramChannel: "https://t.me/tronixforge",
  whatsapp: "https://wa.me/254712345678",
  whatsappEnabled: false,
  email: "support@tronixforge.site",
};

const KEY = "tronix-forge-support-links";

export function readSupportLinks(): SupportLinks {
  if (typeof window === "undefined") return defaultSupportLinks;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...defaultSupportLinks, ...JSON.parse(raw) } : defaultSupportLinks;
  } catch {
    return defaultSupportLinks;
  }
}

export function saveSupportLinks(links: SupportLinks) {
  window.localStorage.setItem(KEY, JSON.stringify(links));
  window.dispatchEvent(new CustomEvent("tronix-support-links"));
}

export function useSupportLinks() {
  const [links, setLinks] = useState<SupportLinks>(defaultSupportLinks);
  useEffect(() => {
    const sync = () => setLinks(readSupportLinks());
    sync();
    window.addEventListener("tronix-support-links", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("tronix-support-links", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return links;
}
