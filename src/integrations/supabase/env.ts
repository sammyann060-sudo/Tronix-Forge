const FALLBACK_SUPABASE_URL = "https://gjsldordcvkyzkzqmxzy.supabase.co";
const FALLBACK_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_cervEKhjyQYfdriOCZ_-tA_-IqD91FK";

export function getPublicSupabaseEnv(env: Record<string, string | undefined> = {}) {
  return {
    url: env["SUPABASE_URL"] || env["VITE_SUPABASE_URL"] || FALLBACK_SUPABASE_URL,
    publishableKey:
      env["SUPABASE_PUBLISHABLE_KEY"] ||
      env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      FALLBACK_SUPABASE_PUBLISHABLE_KEY,
  };
}
