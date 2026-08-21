import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    let result: Awaited<ReturnType<typeof supabase.auth.getUser>>;
    try {
      result = await supabase.auth.getUser();
    } catch (error) {
      console.error("[AuthGuard]", error);
      throw redirect({ to: "/auth" });
    }

    if (result.error || !result.data.user) throw redirect({ to: "/auth" });
    return { user: result.data.user };
  },
  component: () => <Outlet />,
});
