import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock, Mail, Phone, ShieldCheck, User as UserIcon } from "lucide-react";
import { verifyAdminSecondPassword } from "@/lib/admin.functions";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import logo from "@/assets/tronix-logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or create an account — Tronix Forge" },
      {
        name: "description",
        content:
          "Sign in to Tronix Forge or create an account with your full name, phone number and email to build Deriv-powered trading sites.",
      },
      { property: "og:title", content: "Sign in or create an account — Tronix Forge" },
      {
        property: "og:description",
        content: "Access your Tronix Forge dashboard, bots, domains and earnings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [adminStep, setAdminStep] = useState(false);
  const [secondPassword, setSecondPassword] = useState("");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");


  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const emailValue = signInEmail.trim();
    const { error } = await supabase.auth.signInWithPassword({
      email: emailValue,
      password: signInPassword,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (emailValue.toLowerCase().includes(".admin")) {
      sessionStorage.removeItem("tronix-admin-unlocked");
      setAdminStep(true);
      return;
    }
    toast.success("Welcome back to Tronix Forge");
    navigate({ to: "/" });
  }

  async function handleAdminSecondPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await verifyAdminSecondPassword({ data: { password: secondPassword } });
      if (res.ok) {
        sessionStorage.setItem("tronix-admin-unlocked", "1");
        toast.success("Admin console unlocked");
        navigate({ to: "/admin" });
      } else {
        toast.error("Incorrect second password");
      }
    } catch {
      toast.error("This account is not an admin account");
    } finally {
      setBusy(false);
      setSecondPassword("");
    }
  }


  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!/^\+?[0-9\s-]{7,20}$/.test(phone.trim())) {
      toast.error("Enter a valid phone number");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName.trim(), phone: phone.trim() },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.success("Account created");
      navigate({ to: "/" });
    } else {
      toast.success("Account created — you can sign in now");
    }
  }

  if (adminStep) {
    return (
      <main className="surface-grad flex min-h-screen items-center justify-center px-5 py-12">
        <div className="card-surface w-full max-w-md p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-gradient-brand shadow-brand">
            <ShieldCheck className="size-6 text-brand-foreground" />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold">Admin verification</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            This is an admin account. Enter your second password to open the admin console.
          </p>
          <form onSubmit={handleAdminSecondPassword} className="mt-6 space-y-3 text-left">
            <Label htmlFor="second-password">Second password</Label>
            <Input
              id="second-password"
              type="password"
              autoFocus
              required
              value={secondPassword}
              onChange={(e) => setSecondPassword(e.target.value)}
            />
            <Button disabled={busy} type="submit" className="w-full bg-gradient-brand text-brand-foreground">
              {busy && <Loader2 className="size-4 animate-spin" />} Continue to admin console
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (

    <main className="surface-grad flex min-h-screen items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src={logo} alt="Tronix Forge logo" width={64} height={64} className="size-16" />
          <h1 className="mt-4 font-display text-3xl font-bold text-gradient">Tronix Forge</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Build, deploy and monetise Deriv-powered trading sites.
          </p>
        </div>

        <div className="card-surface p-6">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="si-email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="si-email"
                      type="email"
                      required
                      className="pl-9"
                      placeholder="you@example.com"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="si-pass">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="si-pass"
                      type="password"
                      required
                      className="pl-9"
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button disabled={busy} type="submit" className="w-full bg-gradient-brand text-brand-foreground">
                  {busy && <Loader2 className="size-4 animate-spin" />} Sign in
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Admin emails containing <span className="font-mono">.admin</span> will be asked for a second
                  password.
                </p>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="su-name">Full name</Label>
                  <div className="relative">
                    <UserIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="su-name"
                      required
                      maxLength={100}
                      className="pl-9"
                      placeholder="Jane Wanjiru"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-phone">Phone number</Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="su-phone"
                      required
                      maxLength={20}
                      className="pl-9"
                      placeholder="+2547XXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="su-email">Email</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="su-email"
                      type="email"
                      required
                      maxLength={255}
                      className="pl-9"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="su-pass">Password</Label>
                    <Input
                      id="su-pass"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="su-confirm">Confirm password</Label>
                    <Input
                      id="su-confirm"
                      type="password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                    />
                  </div>
                </div>
                <Button disabled={busy} type="submit" className="w-full bg-gradient-brand text-brand-foreground">
                  {busy && <Loader2 className="size-4 animate-spin" />} Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Back to Tronix Forge
          </Link>
        </p>
      </div>
    </main>
  );
}
