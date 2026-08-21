import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const verifyAdminSecondPassword = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { password: string }) => {
    if (typeof input?.password !== "string" || input.password.length > 200) {
      throw new Error("Invalid password");
    }
    return { password: input.password };
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) return { ok: false as const };

    const expected = process.env["ADMIN_SECOND_PASSWORD"];
    if (!expected) return { ok: false as const };

    const a = new TextEncoder().encode(data.password);
    const b = new TextEncoder().encode(expected);
    let diff = a.length ^ b.length;
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
    }
    return { ok: diff === 0 };
  });
