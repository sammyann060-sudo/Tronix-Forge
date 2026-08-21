import { supabase } from "@/integrations/supabase/client";
import type { SiteBrand } from "@/lib/siteBrand";

/* ---------------------------------- bots ---------------------------------- */

export type CloudBot = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  source: string;
  market: string;
  xml: string;
  created_at: string;
};

export async function fetchMyBots() {
  const { data, error } = await supabase
    .from("bots")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CloudBot[];
}

export async function fetchAllBots() {
  const { data, error } = await supabase
    .from("bots")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CloudBot[];
}

export async function createBot(bot: {
  name: string;
  description: string;
  source: string;
  market: string;
  xml: string;
}) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("You must be signed in");
  const { data, error } = await supabase
    .from("bots")
    .insert({ ...bot, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as CloudBot;
}

export async function deleteBot(id: string) {
  const { error } = await supabase.from("bots").delete().eq("id", id);
  if (error) throw error;
}

/* ----------------------------- deriv accounts ----------------------------- */

export type DerivAccount = {
  id: string;
  user_id: string;
  login_id: string;
  account_type: string;
  currency: string;
  balance: number;
  api_token: string;
  status: string;
  created_at: string;
};

export async function fetchMyDerivAccount() {
  const { data, error } = await supabase.from("deriv_accounts").select("*").maybeSingle();
  if (error) throw error;
  return (data as DerivAccount) ?? null;
}

export async function saveDerivAccount(account: {
  login_id: string;
  account_type: string;
  currency: string;
  balance: number;
  api_token: string;
}) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("You must be signed in");
  const { data, error } = await supabase
    .from("deriv_accounts")
    .upsert({ ...account, user_id: userId, status: "active" }, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data as DerivAccount;
}

export async function fetchAllDerivAccounts() {
  const { data, error } = await supabase
    .from("deriv_accounts")
    .select("id,user_id,login_id,account_type,currency,balance,status,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Omit<DerivAccount, "api_token">[];
}

/* ---------------------------- hosting requests ---------------------------- */

export type CloudHostingRequest = {
  id: string;
  user_id: string;
  requested_by: string;
  brand: SiteBrand;
  domains: string[];
  chosen_domain: string | null;
  status: string;
  amount_usd: number;
  paid: boolean;
  notes: string | null;
  created_at: string;
};

export async function createHostingRequest(req: {
  requested_by: string;
  brand: SiteBrand;
  domains: string[];
  amount_usd: number;
  paid: boolean;
}) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("You must be signed in");
  const { data, error } = await supabase
    .from("hosting_requests")
    .insert({ ...req, brand: req.brand as never, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as unknown as CloudHostingRequest;
}

export async function fetchHostingRequests() {
  const { data, error } = await supabase
    .from("hosting_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as CloudHostingRequest[];
}

export async function updateHostingRequest(id: string, patch: Partial<CloudHostingRequest>) {
  const { error } = await supabase
    .from("hosting_requests")
    .update(patch as never)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteHostingRequest(id: string) {
  const { error } = await supabase.from("hosting_requests").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------- bot runs -------------------------------- */

export type BotRun = {
  id: string;
  user_id: string;
  bot_id: string | null;
  bot_name: string;
  symbol: string;
  stake: number;
  martingale: number;
  take_profit: number;
  stop_loss: number;
  status: string;
  profit: number;
  started_at: string;
  stopped_at: string | null;
};

export async function startBotRun(run: {
  bot_id: string | null;
  bot_name: string;
  symbol: string;
  stake: number;
  martingale: number;
  take_profit: number;
  stop_loss: number;
}) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("You must be signed in");
  const { data, error } = await supabase
    .from("bot_runs")
    .insert({ ...run, user_id: userId, status: "running" })
    .select()
    .single();
  if (error) throw error;
  return data as BotRun;
}

export async function finishBotRun(id: string, profit: number, status: string) {
  const { error } = await supabase
    .from("bot_runs")
    .update({ profit, status, stopped_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function fetchMyRuns(limit = 20) {
  const { data, error } = await supabase
    .from("bot_runs")
    .select("*")
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as BotRun[];
}

/* --------------------------------- trades -------------------------------- */

export type Trade = {
  id: string;
  run_id: string | null;
  user_id: string;
  contract_id: string | null;
  contract_type: string;
  symbol: string;
  stake: number;
  payout: number;
  profit: number;
  status: string;
  entry_spot: number | null;
  exit_spot: number | null;
  created_at: string;
};

export async function recordTrade(trade: {
  run_id: string | null;
  contract_id: string | null;
  contract_type: string;
  symbol: string;
  stake: number;
  payout: number;
  profit: number;
  status: string;
  entry_spot?: number | null;
  exit_spot?: number | null;
}) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("You must be signed in");
  const { data, error } = await supabase
    .from("trades")
    .insert({ ...trade, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data as Trade;
}

export async function fetchMyTrades(limit = 50) {
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Trade[];
}
