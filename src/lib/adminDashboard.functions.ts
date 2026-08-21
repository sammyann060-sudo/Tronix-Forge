import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const USD_TO_KES = 129;
export const kes = (usd: number) => `KES ${Math.round(usd * USD_TO_KES).toLocaleString()}`;

async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error) throw error;
  if (!isAdmin) throw new Error("Forbidden");
}

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const db = context.supabase as any;

    const [profiles, hosting, deriv, packages, purchases] = await Promise.all([
      db.from("profiles").select("id,status"),
      db.from("hosting_requests").select("id,status,paid,amount_usd"),
      db.from("deriv_accounts").select("id,status"),
      db.from("packages").select("id,name,kind,units,usd,active,sort_order"),
      db.from("package_purchases").select("id,amount_usd,status"),
    ]);

    for (const result of [profiles, hosting, deriv, packages, purchases]) {
      if (result.error) throw result.error;
    }

    const hostingRevenue = (hosting.data ?? [])
      .filter((row: any) => row.paid || row.status === "paid")
      .reduce((sum: number, row: any) => sum + Number(row.amount_usd ?? 0), 0);
    const packageRevenue = (purchases.data ?? [])
      .filter((row: any) => row.status === "paid")
      .reduce((sum: number, row: any) => sum + Number(row.amount_usd ?? 0), 0);

    return {
      users: {
        total: profiles.data?.length ?? 0,
        active: (profiles.data ?? []).filter((row: any) => row.status === "active").length,
      },
      domains: {
        total: hosting.data?.length ?? 0,
        pending: (hosting.data ?? []).filter((row: any) => row.status === "pending").length,
      },
      deriv: {
        total: deriv.data?.length ?? 0,
        active: (deriv.data ?? []).filter((row: any) => row.status === "active").length,
      },
      revenue: hostingRevenue + packageRevenue,
    };
  });

export const getAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await (context.supabase as any)
      .from("profiles")
      .select("id,email,full_name,created_at,status,plan,ai_credits,hosting_requests(id),bots(id)")
      .order("created_at", { ascending: false });
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.full_name || "Unnamed user",
      email: row.email || "No email",
      joined: String(row.created_at).slice(0, 10),
      sites: row.hosting_requests?.length ?? 0,
      credits: row.ai_credits ?? 0,
      plan: row.plan ?? "Free",
      status: row.status ?? "active",
    }));
  });

export const getAdminBots = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await (context.supabase as any)
      .from("bots")
      .select("id,name,source,credits_used,status,created_at,profiles(email)")
      .order("created_at", { ascending: false });
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      owner: row.profiles?.email ?? "Unknown",
      type: row.source,
      credits: row.credits_used ?? 0,
      created: String(row.created_at).slice(0, 10),
      status: row.status ?? "draft",
    }));
  });

export const getAdminDerivAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await (context.supabase as any)
      .from("deriv_accounts")
      .select("id,login_id,account_type,currency,created_at,status,profiles(email)")
      .order("created_at", { ascending: false });
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      user: row.profiles?.email ?? "Unknown",
      loginId: row.login_id,
      type: row.account_type,
      currency: row.currency,
      linked: String(row.created_at).slice(0, 10),
      status: row.status,
    }));
  });

export const getAdminDomains = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await (context.supabase as any)
      .from("hosting_requests")
      .select("id,requested_by,domains,chosen_domain,status,amount_usd,paid,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;

    return (data ?? []).map((row: any) => ({
      id: row.id,
      domain: row.chosen_domain ?? row.domains?.[0] ?? "No domain selected",
      user: row.requested_by,
      years: 1,
      usd: Number(row.amount_usd ?? 0),
      method: "External",
      status: row.paid ? "paid" : row.status,
      date: String(row.created_at).slice(0, 10),
    }));
  });

export const getAdminPackages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { data, error } = await (context.supabase as any)
      .from("packages")
      .select("id,name,kind,units,usd,package_purchases(id,amount_usd,status)")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;

    return (data ?? []).map((row: any) => {
      const paidPurchases = (row.package_purchases ?? []).filter((p: any) => p.status === "paid");
      return {
        id: row.id,
        name: row.name,
        kind: row.kind,
        units: row.units,
        usd: Number(row.usd ?? 0),
        sold: paidPurchases.length,
        revenue: paidPurchases.reduce((sum: number, p: any) => sum + Number(p.amount_usd ?? 0), 0),
      };
    });
  });
