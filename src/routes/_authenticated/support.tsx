import { createFileRoute } from "@tanstack/react-router";
import { Headphones, Send, MessageCircle, Clock, CheckCircle2, Mail, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useSupportLinks } from "@/lib/supportLinks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/_authenticated/support")({
  head: () => ({
    meta: [
      { title: "Support Center — Tronix Forge" },
      {
        name: "description",
        content: "Get help with Tronix Forge — chat on Telegram, WhatsApp, or browse frequently asked questions.",
      },
      { property: "og:title", content: "Support Center — Tronix Forge" },
      { property: "og:description", content: "Chat with the Tronix Forge team or browse the FAQ." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SupportPage,
});

const faqs = [
  {
    q: "How do I create a new trading site?",
    a: "Navigate to the Sites tab, click 'Create New Site', fill in your site details, and configure your branding options.",
  },
  {
    q: "How do I connect my custom domain?",
    a: "Go to Domains, add your domain, and follow the DNS configuration instructions to point your domain to our servers.",
  },
  {
    q: "How do commissions work?",
    a: "You earn commissions based on the trading activity of users on your sites. Track your earnings in the Commissions tab.",
  },
  {
    q: "How do I upload custom trading bots?",
    a: "Visit the XML Bots section, click 'Upload Bot', and select your XML bot file to make it available on your sites.",
  },
  {
    q: "How do I pay with M-Pesa?",
    a: "Choose M-Pesa at checkout, enter your Safaricom number and confirm the STK push on your phone. Credits and site purchases are unlocked instantly.",
  },
];

function SupportPage() {
  const links = useSupportLinks();
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-gradient-brand shadow-brand">
          <Headphones className="size-8 text-brand-foreground" />
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold text-gradient">Support Center</h1>
        <p className="mt-3 text-muted-foreground">
          Need help? We&apos;re here for you. Choose your preferred way to get in touch with our support team.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="card-surface p-6">
          <div className="flex items-start justify-between">
            <div className="grid size-11 place-items-center rounded-xl bg-accent">
              <Send className="size-5 text-primary" />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
              <CheckCircle2 className="size-3" /> Available
            </span>
          </div>
          <h2 className="mt-4 text-xl font-bold">Telegram</h2>
          <p className="mt-1 text-sm text-muted-foreground">Chat with us on Telegram for quick support</p>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" /> Usually responds within hours
          </p>
          <a
            href={links.telegram}
            target="_blank"
            rel="noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3 font-semibold text-brand-foreground shadow-brand"
          >
            Open Telegram <ExternalLink className="size-4" />
          </a>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-start justify-between">
            <div className="grid size-11 place-items-center rounded-xl bg-accent">
              <MessageCircle className="size-5 text-primary" />
            </div>
            {links.whatsappEnabled ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                <CheckCircle2 className="size-3" /> Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
                <Clock className="size-3" /> Coming Soon
              </span>
            )}
          </div>
          <h2 className="mt-4 text-xl font-bold">WhatsApp</h2>
          <p className="mt-1 text-sm text-muted-foreground">Message us on WhatsApp for assistance</p>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-3.5" />{" "}
            {links.whatsappEnabled ? "Usually responds within minutes" : "Currently unavailable"}
          </p>
          {links.whatsappEnabled ? (
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3 font-semibold text-brand-foreground shadow-brand"
            >
              Open WhatsApp <ExternalLink className="size-4" />
            </a>
          ) : (
            <button
              disabled
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-muted py-3 font-semibold text-muted-foreground"
            >
              <Clock className="size-4" /> Open WhatsApp
            </button>
          )}
        </div>
      </div>

      <div className="card-surface mt-6 flex flex-wrap items-center gap-5 p-6">
        <div className="grid size-12 place-items-center rounded-xl bg-accent">
          <Send className="size-5 text-primary" />
        </div>
        <div className="min-w-[240px] flex-1">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            Tronix Forge Channel
            <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-primary">New</span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Join our Telegram channel for the latest updates, tutorials, tips, and announcements on how to use new
            features and get the most out of the platform.
          </p>
        </div>
        <a
          href={links.telegramChannel}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 font-semibold text-brand-foreground shadow-brand"
        >
          Join Channel <ExternalLink className="size-4" />
        </a>
      </div>

      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f) => (
            <AccordionItem
              key={f.q}
              value={f.q}
              className="card-surface border-none px-5"
            >
              <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <div className="card-surface mt-10 p-10 text-center">
        <Mail className="mx-auto size-7 text-primary" />
        <h3 className="mt-3 text-xl font-bold">Need More Help?</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          For complex issues or business inquiries, reach out to us on Telegram and we&apos;ll get back to you as soon
          as possible.
        </p>
        <a
          href="https://t.me/tronixforge"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 font-semibold shadow-soft"
        >
          <Send className="size-4" /> Contact on Telegram
        </a>
      </div>
    </AppShell>
  );
}
