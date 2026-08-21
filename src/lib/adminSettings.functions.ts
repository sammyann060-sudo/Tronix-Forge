import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ALLOWED_KEYS = ["codex_api_key", "codex_base_url", "codex_model"] as const;
type AllowedKey = (typeof ALLOWED_KEYS)[number];

export const getAdminSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data, error } = await context.supabase
      .from("admin_settings")
      .select("key, value, updated_at")
      .in("key", ALLOWED_KEYS as unknown as string[]);
    if (error) throw error;

    const mask = (value: string) =>
      !value ? "" : value.length <= 8 ? "••••" : `${value.slice(0, 4)}••••${value.slice(-4)}`;

    return (data ?? []).map((row) => ({
      key: row.key,
      preview: row.key === "codex_api_key" ? mask(row.value) : row.value,
      hasValue: Boolean(row.value),
      updatedAt: row.updated_at,
    }));
  });

export const saveAdminSetting = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { key: AllowedKey; value: string }) => {
    if (!ALLOWED_KEYS.includes(input?.key)) throw new Error("Unknown setting");
    if (typeof input.value !== "string" || input.value.length > 500) {
      throw new Error("Invalid value");
    }
    return { key: input.key, value: input.value };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { error } = await context.supabase
      .from("admin_settings")
      .upsert({ key: data.key, value: data.value, updated_at: new Date().toISOString() });
    if (error) throw error;
    return { ok: true as const };
  });
