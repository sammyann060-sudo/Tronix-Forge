/**
 * Minimal Deriv WebSocket API client (browser only).
 * Docs: https://api.deriv.com/api-explorer
 */
export const DERIV_APP_ID = 1089;
export const DERIV_WS_URL = `wss://ws.derivws.com/websockets/v3?app_id=${DERIV_APP_ID}`;

type AnyMsg = any;

export class DerivClient {
  private ws: WebSocket | null = null;
  private reqId = 1;
  private pending = new Map<number, { resolve: (v: AnyMsg) => void; reject: (e: Error) => void }>();
  private subs = new Map<number, (msg: AnyMsg) => void>();

  async connect(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;
    await new Promise<void>((resolve, reject) => {
      const ws = new WebSocket(DERIV_WS_URL);
      this.ws = ws;
      ws.onopen = () => resolve();
      ws.onerror = () => reject(new Error("Could not reach Deriv"));
      ws.onclose = () => {
        this.pending.forEach((p) => p.reject(new Error("Deriv connection closed")));
        this.pending.clear();
        this.subs.clear();
      };
      ws.onmessage = (ev) => {
        let msg: AnyMsg;
        try {
          msg = JSON.parse(ev.data as string);
        } catch {
          return;
        }
        const id = Number(msg.req_id);
        const sub = this.subs.get(id);
        if (sub) sub(msg);
        const p = this.pending.get(id);
        if (p) {
          this.pending.delete(id);
          if (msg.error) p.reject(new Error(msg.error.message ?? "Deriv error"));
          else p.resolve(msg);
        }
      };
    });
  }

  get connected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  async send(payload: AnyMsg): Promise<AnyMsg> {
    await this.connect();
    const req_id = this.reqId++;
    return new Promise((resolve, reject) => {
      this.pending.set(req_id, { resolve, reject });
      this.ws!.send(JSON.stringify({ ...payload, req_id }));
      setTimeout(() => {
        if (this.pending.has(req_id)) {
          this.pending.delete(req_id);
          reject(new Error("Deriv request timed out"));
        }
      }, 30_000);
    });
  }

  /** Subscribe to a stream; returns an unsubscribe function. */
  async subscribe(payload: AnyMsg, onMsg: (msg: AnyMsg) => void): Promise<() => void> {
    await this.connect();
    const req_id = this.reqId++;
    this.subs.set(req_id, onMsg);
    this.ws!.send(JSON.stringify({ ...payload, subscribe: 1, req_id }));
    return () => {
      this.subs.delete(req_id);
      try {
        this.ws?.send(JSON.stringify({ forget_all: ["proposal_open_contract", "ticks"] }));
      } catch {
        /* socket already gone */
      }
    };
  }

  async authorize(token: string) {
    const res = await this.send({ authorize: token });
    return res.authorize as {
      loginid: string;
      currency: string;
      balance: number;
      is_virtual: 0 | 1;
      email?: string;
      fullname?: string;
    };
  }

  close() {
    this.ws?.close();
    this.ws = null;
  }
}

export const SYMBOLS = [
  { value: "R_10", label: "Volatility 10 Index" },
  { value: "R_25", label: "Volatility 25 Index" },
  { value: "R_50", label: "Volatility 50 Index" },
  { value: "R_75", label: "Volatility 75 Index" },
  { value: "R_100", label: "Volatility 100 Index" },
  { value: "1HZ100V", label: "Volatility 100 (1s) Index" },
] as const;

export const CONTRACT_TYPES = [
  { value: "DIGITOVER", label: "Digit Over", needsBarrier: true },
  { value: "DIGITUNDER", label: "Digit Under", needsBarrier: true },
  { value: "DIGITEVEN", label: "Digit Even", needsBarrier: false },
  { value: "DIGITODD", label: "Digit Odd", needsBarrier: false },
  { value: "CALL", label: "Rise", needsBarrier: false },
  { value: "PUT", label: "Fall", needsBarrier: false },
] as const;

export type ContractType = (typeof CONTRACT_TYPES)[number]["value"];

export type BuyParams = {
  symbol: string;
  contractType: ContractType;
  amount: number;
  currency: string;
  barrier?: string;
  duration?: number;
};

/** Buys one contract and resolves with the contract id. */
export async function buyContract(client: DerivClient, p: BuyParams) {
  const parameters: AnyMsg = {
    amount: Number(p.amount.toFixed(2)),
    basis: "stake",
    contract_type: p.contractType,
    currency: p.currency,
    duration: p.duration ?? 1,
    duration_unit: "t",
    symbol: p.symbol,
  };
  if (p.barrier !== undefined && CONTRACT_TYPES.find((c) => c.value === p.contractType)?.needsBarrier) {
    parameters.barrier = p.barrier;
  }
  const res = await client.send({ buy: 1, price: Number(p.amount.toFixed(2)), parameters });
  return res.buy as { contract_id: number; buy_price: number; payout: number; longcode: string };
}

/** Waits for a bought contract to settle, streaming updates along the way. */
export function watchContract(
  client: DerivClient,
  contractId: number,
  onUpdate?: (c: AnyMsg) => void,
): Promise<AnyMsg> {
  return new Promise((resolve, reject) => {
    client
      .subscribe({ proposal_open_contract: 1, contract_id: contractId }, (msg) => {
        if (msg.error) {
          reject(new Error(msg.error.message));
          return;
        }
        const c = msg.proposal_open_contract;
        if (!c) return;
        onUpdate?.(c);
        if (c.is_sold) resolve(c);
      })
      .catch(reject);
  });
}
