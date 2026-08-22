import { DERIV_APP_ID, DerivClient } from "@/lib/derivClient";
import { saveDerivAccount } from "@/lib/cloudData";

type DerivOAuthToken = {
  token: string;
  loginId?: string;
  currency?: string;
};

function combinedUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : window.location.hash;
  const hashParams = new URLSearchParams(hash);
  hashParams.forEach((value, key) => {
    if (!params.has(key)) params.set(key, value);
  });
  return params;
}

export function buildDerivOAuthUrl() {
  const url = new URL("https://oauth.binary.com/oauth2/authorize");
  url.searchParams.set("app_id", String(DERIV_APP_ID));
  return url.toString();
}

export function parseDerivOAuthToken(): DerivOAuthToken | null {
  if (typeof window === "undefined") return null;
  const params = combinedUrlParams();
  const token = params.get("token1") ?? params.get("token");
  if (!token) return null;
  const loginId = params.get("acct1") ?? params.get("loginid");
  const currency = params.get("cur1");
  return {
    token,
    ...(loginId ? { loginId } : {}),
    ...(currency ? { currency } : {}),
  };
}

export function clearDerivOAuthParams() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const keys = ["acct1", "cur1", "token1", "token", "loginid"];
  keys.forEach((key) => url.searchParams.delete(key));
  window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash.startsWith("#") ? "" : url.hash}`);
}

export async function linkDerivToken(token: string) {
  const client = new DerivClient();
  try {
    const auth = await client.authorize(token.trim());
    return await saveDerivAccount({
      login_id: auth.loginid,
      account_type: auth.is_virtual ? "Demo" : "Real",
      currency: auth.currency || "USD",
      balance: Number(auth.balance ?? 0),
      api_token: token.trim(),
    });
  } finally {
    client.close();
  }
}
