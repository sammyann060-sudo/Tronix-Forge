import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Upload, Globe, Clock, Trash2, Lightbulb, Sparkles, Lock, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createBot, deleteBot, fetchMyBots, type CloudBot } from "@/lib/cloudData";


export const Route = createFileRoute("/_authenticated/xml-bots")({
  head: () => ({
    meta: [
      { title: "XML Trading Bots — Tronix Forge" },
      {
        name: "description",
        content: "Upload, organize, download and publish DBot XML trading bots across your Tronix Forge sites.",
      },
      { property: "og:title", content: "XML Trading Bots — Tronix Forge" },
      {
        property: "og:description",
        content: "Upload, organize and download DBot XML trading bots for your sites.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: XmlBotsPage,
});

const tabs = ["My Bots", "Arrange", "Bot Store", "Bot Ideas", "Settings"] as const;

type Idea = {
  title: string;
  author: string;
  date: string;
  body: string;
  visibility: "public" | "private";
  status: "pending" | "completed";
};

const seedIdeas: Idea[] = [
  {
    title: "Under 5",
    author: "Denis Kirwa",
    date: "20/08/2026, 04:42",
    body: "A Deriv bot for the under-5 market: enter when digit 0, 2 or 4 shows a green bar, wait for digit 1 then 4 or 6, then trade under 5. Stop after three consecutive losses, martingale 1.2, adjustable stake.",
    visibility: "public",
    status: "pending",
  },
  {
    title: "Over 3 Bot",
    author: "Hannah",
    date: "18/08/2026, 14:26",
    body: "Green bar above digit 4, red bar above 4, digits 0–3 below 10%. Entry when the cursor touches an odd digit below 3 then another odd digit above 3.",
    visibility: "public",
    status: "pending",
  },
  {
    title: "Matches & Differs",
    author: "Amos T.",
    date: "16/08/2026, 09:12",
    body: "Frequency analysis over the last 1000 ticks, differ on the two least frequent digits with a flat stake and hard daily stop loss.",
    visibility: "public",
    status: "completed",
  },
];

function useBots() {
  const [bots, setBots] = useState<CloudBot[]>([]);
  const reload = () => {
    fetchMyBots()
      .then(setBots)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Could not load bots"));
  };
  useEffect(reload, []);
  return { bots, reload };
}

function XmlBotsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("My Bots");
  const [ideas, setIdeas] = useState<Idea[]>(seedIdeas);
  const [filter, setFilter] = useState("all");
  const { bots, reload } = useBots();
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const xml = await file.text();
    e.target.value = "";
    try {
      await createBot({
        name: file.name.replace(/\.xml$/i, ""),
        description: "Uploaded XML bot",
        source: "Upload",
        market: "—",
        xml,
      });
      toast.success(`${file.name} uploaded`);
      reload();
      setTab("My Bots");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  }


  const shownIdeas = ideas.filter((i) => filter === "all" || i.status === filter);

  return (
    <AppShell>
      <PageHeader
        icon={Bot}
        title="XML Trading Bots"
        subtitle="Upload, manage and organize your trading bots"
        action={
          <Button
            onClick={() => fileRef.current?.click()}
            className="bg-gradient-brand text-brand-foreground shadow-brand"
          >
            <Upload className="size-4" /> Upload bot
          </Button>
        }
      />
      <input ref={fileRef} type="file" accept=".xml" hidden onChange={handleUpload} />

      <div className="mb-6 flex flex-wrap gap-1 rounded-2xl border border-border bg-card p-1.5 shadow-soft">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              tab === t
                ? "bg-gradient-brand text-brand-foreground shadow-brand"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "My Bots" && (
        <>
          {bots.length === 0 ? (
            <EmptyState label="My Bots" />
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {bots.map((b) => (
                <article key={b.id} className="card-surface flex flex-col gap-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold">{b.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {b.source === "AI" ? "AI generated" : "Uploaded"} ·{" "}
                        {new Date(b.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="secondary">{b.market}</Badge>
                  </div>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{b.description}</p>
                  <div className="mt-auto flex gap-2 pt-2">
                    <Button asChild size="sm" className="bg-gradient-brand text-brand-foreground">
                      <Link to="/live-trading" search={{ botId: b.id } as never}>
                        <PlayCircle className="size-4" /> Run bot
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        try {
                          await deleteBot(b.id);
                          toast.success("Bot removed");
                          reload();
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Delete failed");
                        }
                      }}
                    >
                      <Trash2 className="size-4" /> Delete
                    </Button>
                  </div>

                </article>
              ))}
            </div>
          )}
        </>
      )}

      {tab === "Bot Ideas" && (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-sm">
            <p className="inline-flex items-center gap-2 text-muted-foreground">
              <Lightbulb className="size-4 text-primary" />
              Submit ideas for new bots. Public ideas are free, private ideas cost $2.
            </p>
            <div className="flex items-center gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <NewIdeaDialog onCreate={(idea) => setIdeas((prev) => [idea, ...prev])} />
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-dashed border-border bg-card/60 p-4 text-sm text-muted-foreground">
            Create a site first to add completed idea bots to your website.
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {shownIdeas.map((i) => (
              <article key={i.title} className="card-surface p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">{i.title}</h3>
                    <p className="text-sm text-muted-foreground">by {i.author}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Badge variant="secondary">
                      {i.visibility === "public" ? (
                        <Globe className="size-3" />
                      ) : (
                        <Lock className="size-3" />
                      )}
                      {i.visibility}
                    </Badge>
                    <Badge className="bg-gradient-brand text-brand-foreground">{i.status}</Badge>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{i.body}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="size-3" /> {i.date}
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      {tab !== "My Bots" && tab !== "Bot Ideas" && <EmptyState label={tab} />}
    </AppShell>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card/50 p-16 text-center">
      <div>
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-accent">
          <Bot className="size-7 text-primary" />
        </div>
        <h2 className="mt-5 text-xl font-bold">Nothing in {label} yet</h2>
        <p className="mt-1 text-muted-foreground">
          Upload an XML bot or generate one with AI to get started.
        </p>
      </div>
    </div>
  );
}

function NewIdeaDialog({ onCreate }: { onCreate: (idea: Idea) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");

  function submit() {
    if (!title.trim() || !body.trim()) return;
    onCreate({
      title: title.trim(),
      author: "You",
      date: new Date().toLocaleString(),
      body: body.trim(),
      visibility,
      status: "pending",
    });
    toast.success("Idea submitted for review");
    setTitle("");
    setBody("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-brand text-brand-foreground shadow-brand">
          <Sparkles className="size-4" /> New idea
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit a bot idea</DialogTitle>
          <DialogDescription>
            Public ideas are free. Private ideas cost $2 and stay visible only to you and the team.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idea-title">Title</Label>
            <Input
              id="idea-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Over 3 sniper"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="idea-body">Strategy description</Label>
            <Textarea
              id="idea-body"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Describe entry conditions, stake, martingale, take profit and stop loss..."
            />
          </div>
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select value={visibility} onValueChange={(v) => setVisibility(v as "public" | "private")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public — free</SelectItem>
                <SelectItem value="private">Private — $2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} className="bg-gradient-brand text-brand-foreground">
            Submit idea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
