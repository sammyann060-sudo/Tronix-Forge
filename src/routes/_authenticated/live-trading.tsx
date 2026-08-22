import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Activity, Play, Square, Wallet, TrendingUp, TrendingDown, Link2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CONTRACT_TYPES,
  DerivClient,
  SYMBOLS,
  buyContract,
  watchContract,
  type ContractType,
} from "@/lib/derivClient";
import {
  fetchMyBots,
  fetchMyDerivAccount,
  finishBotRun,
  recordTrade,
  startBotRun,
  type CloudBot,
  type DerivAccount,
} from "@/lib/cloudData";

export const Route = createFileRoute("/_authenticated/live-trading")({
  head: () => ({
    meta: [
      { title: "Live Trading — Tronix Forge" },
      {
        name: "description",
        content:
          "Run your Tronix Forge bots live on your linked Deriv account and watch every contract as it settles.",
      },
      { property: "og:title", content: "Live Trading — Tronix Forge" },
      {
        property: "og:description",
        content: "Start your bots on Deriv and follow each contract in real time.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LiveTradingPage,
});

type LiveTrade = {
  contractId: number | string;
  type: string;
  stake: number;
  payout: number;
  profit: number;
  status: "open" | "won" | "lost";
  time: string;
};

function LiveTradingPage() {
  const [account, setAccount] = useState<DerivAccount | null>(null);
  const [bots, setBots] = useState<CloudBot[]>([]);
  const [botId, setBotId] = useState<string>("");
  const [symbol, setSymbol] = useState("R_100");
  const [contractType, setContractType] = useState<ContractType>("DIGITOVER");
  const [barrier, setBarrier] = useState("2");
  const [stake, setStake] = useState(0.35);
  const [martingale, setMartingale] = useState(2);
  const [takeProfit, setTakeProfit] = useState(5);
  const [stopLoss, setStopLoss] = useState(10);
  const [running, setRunning] = useState(false);
  const [profit, setProfit] = useState(0);
  const [balance, setBalance] = useState<number | null>(null);
  const [trades, setTrades] = useState<LiveTrade[]>([]);

  const clientRef = useRef<DerivClient | null>(null);
  const stopRef = useRef(false);

  useEffect(() => {
    const selectedBotId = new URLSearchParams(window.location.search).get("botId");
    fetchMyDerivAccount()
      .then((a) => {
        setAccount(a);
        if (a) setBalance(Number(a.balance));
      })
      .catch(() => undefined);
    fetchMyBots()
      .then((loaded) => {
        setBots(loaded);
        if (selectedBotId && loaded.some((bot) => bot.id === selectedBotId)) {
          setBotId(selectedBotId);
        }
      })
      .catch(() => undefined);
    return () => clientRef.current?.close();
  }, []);

  const stop = useCallback(() => {
    stopRef.current = true;
    setRunning(false);
  }, []);

  async function start() {
    if (!account) {
      toast.error("Link your Deriv account first on the Sites page");
      return;
    }
    if (!Number.isFinite(stake) || stake <= 0) {
      toast.error("Enter a valid stake above 0");
      return;
    }
    if (!Number.isFinite(martingale) || martingale < 1) {
      toast.error("Martingale must be 1 or higher");
      return;
    }
    if (!Number.isFinite(takeProfit) || takeProfit <= 0 || !Number.isFinite(stopLoss) || stopLoss <= 0) {
      toast.error("Take profit and stop loss must be above 0");
      return;
    }
    const bot = bots.find((b) => b.id === botId) ?? null;
    stopRef.current = false;
    setRunning(true);
    setProfit(0);
    setTrades([]);

    const client = new DerivClient();
    clientRef.current = client;
    let runId: string | null = null;
    let total = 0;

    try {
      const auth = await client.authorize(account.api_token);
      setBalance(auth.balance);
      const run = await startBotRun({
        bot_id: bot?.id ?? null,
        bot_name: bot?.name ?? `${contractType} manual run`,
        symbol,
        stake,
        martingale,
        take_profit: takeProfit,
        stop_loss: stopLoss,
      });
      runId = run.id;
      toast.success(`Running on ${auth.loginid} (${auth.is_virtual ? "Demo" : "Real"})`);

      let currentStake = stake;

      while (!stopRef.current) {
        const bought = await buyContract(client, {
          symbol,
          contractType,
          amount: currentStake,
          currency: auth.currency || "USD",
          barrier,
        });

        setTrades((t) => [
          {
            contractId: bought.contract_id,
            type: contractType,
            stake: bought.buy_price,
            payout: bought.payout,
            profit: 0,
            status: "open",
            time: new Date().toLocaleTimeString(),
          },
          ...t,
        ]);

        const settled = await watchContract(client, bought.contract_id);
        const tradeProfit = Number(settled.profit ?? 0);
        total += tradeProfit;
        setProfit(total);
        if (settled.balance_after != null) setBalance(Number(settled.balance_after));

        setTrades((t) =>
          t.map((x) =>
            x.contractId === bought.contract_id
              ? { ...x, profit: tradeProfit, status: tradeProfit >= 0 ? "won" : "lost" }
              : x,
          ),
        );

        await recordTrade({
          run_id: runId,
          contract_id: String(bought.contract_id),
          contract_type: contractType,
          symbol,
          stake: bought.buy_price,
          payout: Number(settled.payout ?? bought.payout),
          profit: tradeProfit,
          status: tradeProfit >= 0 ? "won" : "lost",
          entry_spot: settled.entry_spot ?? null,
          exit_spot: settled.exit_spot ?? null,
        }).catch(() => undefined);

        currentStake = tradeProfit >= 0 ? stake : Number((currentStake * martingale).toFixed(2));

        if (total >= takeProfit) {
          toast.success(`Take profit hit: $${total.toFixed(2)}`);
          break;
        }
        if (total <= -Math.abs(stopLoss)) {
          toast.warning(`Stop loss hit: $${total.toFixed(2)}`);
          break;
        }
      }

      if (runId) await finishBotRun(runId, total, stopRef.current ? "stopped" : "completed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Live run failed");
      if (runId) await finishBotRun(runId, total, "error").catch(() => undefined);
    } finally {
      stopRef.current = true;
      setRunning(false);
      clientRef.current?.close();
      clientRef.current = null;
    }
  }

  const needsBarrier = CONTRACT_TYPES.find((c) => c.value === contractType)?.needsBarrier;

  return (
    <AppShell>
      <PageHeader
        icon={Activity}
        title="Live Trading"
        subtitle="Run your bots on your linked Deriv account and watch every contract live"
        action={
          running ? (
            <Button variant="destructive" onClick={stop}>
              <Square className="size-4" /> Stop bot
            </Button>
          ) : (
            <Button onClick={start} className="bg-gradient-brand text-brand-foreground shadow-brand">
              <Play className="size-4" /> Launch bot
            </Button>
          )
        }
      />

      {!account && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-5 text-sm">
          <Link2 className="size-5 shrink-0 text-warning" />
          <p>
            No Deriv account linked yet. Add your Deriv API token on the Sites page to trade live.
          </p>
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card-surface p-5">
          <p className="flex items-center justify-between text-sm text-muted-foreground">
            Deriv account <Wallet className="size-4" />
          </p>
          <p className="mt-2 font-display text-xl font-bold">{account?.login_id ?? "—"}</p>
          <p className="text-sm text-muted-foreground">
            {balance != null ? `${account?.currency ?? "USD"} ${balance.toFixed(2)}` : "Not linked"}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="flex items-center justify-between text-sm text-muted-foreground">
            Session P/L {profit >= 0 ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
          </p>
          <p
            className={`mt-2 font-display text-2xl font-bold ${profit >= 0 ? "text-success" : "text-destructive"}`}
          >
            {profit >= 0 ? "+" : "-"}${Math.abs(profit).toFixed(2)}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-sm text-muted-foreground">Status</p>
          <p className="mt-2">
            <Badge className={running ? "bg-success/15 text-success" : ""} variant={running ? "secondary" : "outline"}>
              {running ? "Running" : "Idle"}
            </Badge>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{trades.length} contracts this session</p>
        </div>
      </div>

      <section className="card-surface p-6">
        <h2 className="text-lg font-bold">Run settings</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Bot</Label>
            <Select value={botId} onValueChange={setBotId}>
              <SelectTrigger>
                <SelectValue placeholder={bots.length ? "Choose a bot" : "No saved bots"} />
              </SelectTrigger>
              <SelectContent>
                {bots.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Market</Label>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SYMBOLS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Contract</Label>
            <Select value={contractType} onValueChange={(v) => setContractType(v as ContractType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TYPES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {needsBarrier && (
            <div className="space-y-2">
              <Label htmlFor="barrier">Digit</Label>
              <Input
                id="barrier"
                value={barrier}
                onChange={(e) => setBarrier(e.target.value.replace(/\D/g, "").slice(0, 1))}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="stake">Stake ($)</Label>
            <Input
              id="stake"
              type="number"
              step="0.01"
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mart">Martingale</Label>
            <Input
              id="mart"
              type="number"
              step="0.1"
              value={martingale}
              onChange={(e) => setMartingale(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tp">Take profit ($)</Label>
            <Input
              id="tp"
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sl">Stop loss ($)</Label>
            <Input
              id="sl"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
            />
          </div>
        </div>
      </section>

      <section className="card-surface mt-6 overflow-x-auto p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Stake</TableHead>
              <TableHead>Payout</TableHead>
              <TableHead>Result</TableHead>
              <TableHead className="text-right">P/L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  Contracts appear here the moment your bot buys them.
                </TableCell>
              </TableRow>
            ) : (
              trades.map((t) => (
                <TableRow key={String(t.contractId)}>
                  <TableCell className="text-muted-foreground">{t.time}</TableCell>
                  <TableCell>{t.type}</TableCell>
                  <TableCell className="font-mono text-xs">{t.contractId}</TableCell>
                  <TableCell>${t.stake.toFixed(2)}</TableCell>
                  <TableCell>${t.payout.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === "open" ? "outline" : "secondary"}>{t.status}</Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${t.profit > 0 ? "text-success" : t.profit < 0 ? "text-destructive" : ""}`}
                  >
                    {t.status === "open" ? "—" : `${t.profit >= 0 ? "+" : "-"}$${Math.abs(t.profit).toFixed(2)}`}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </AppShell>
  );
}
