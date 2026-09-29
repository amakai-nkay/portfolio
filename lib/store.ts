import type { KovaEvent } from "./health";

export type LogEntry = { at: string; target: string; status: "ok" | "error" | "skipped"; ms: number; note: string };
export type Alert = { at: string; subject: string; body: string; delivered: "email" | "preview"; to?: string; via?: string };

export type Sandbox = {
  id: string;
  api_key: string;
  alert_email: string | null;
  created_at: string;
  meta: { log: LogEntry[]; alerts: Alert[]; lastAlertAt?: string };
};

export interface Store {
  mode: "supabase" | "memory";
  createSandbox(s: Sandbox): Promise<void>;
  getByKey(key: string): Promise<Sandbox | null>;
  updateMeta(id: string, meta: Sandbox["meta"]): Promise<void>;
  addEvents(events: KovaEvent[]): Promise<void>;
  listEvents(sandboxId: string): Promise<KovaEvent[]>;
  deleteEvents(sandboxId: string): Promise<void>;
}

// ---------- Supabase (Postgres via its REST API) ----------
function supabaseStore(url: string, key: string): Store {
  const base = url.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/, "") + "/rest/v1";
  const k = key.trim();
  const headers = { apikey: k, Authorization: `Bearer ${k}`, "Content-Type": "application/json" };
  const call = async (path: string, init: RequestInit = {}) => {
    const res = await fetch(base + path, { ...init, headers: { ...headers, ...(init.headers || {}) }, cache: "no-store" });
    if (!res.ok) throw new Error(`Database error ${res.status}: ${await res.text()}`);
    return res;
  };
  return {
    mode: "supabase",
    async createSandbox(s) {
      await call("/sandboxes", { method: "POST", body: JSON.stringify(s), headers: { Prefer: "return=minimal" } });
    },
    async getByKey(apiKey) {
      const res = await call(`/sandboxes?api_key=eq.${encodeURIComponent(apiKey)}&select=*&limit=1`);
      const rows = (await res.json()) as Sandbox[];
      return rows[0] || null;
    },
    async updateMeta(id, meta) {
      await call(`/sandboxes?id=eq.${id}`, { method: "PATCH", body: JSON.stringify({ meta }), headers: { Prefer: "return=minimal" } });
    },
    async addEvents(events) {
      await call("/events", { method: "POST", body: JSON.stringify(events), headers: { Prefer: "return=minimal" } });
    },
    async listEvents(sandboxId) {
      const res = await call(`/events?sandbox_id=eq.${sandboxId}&select=*&order=created_at.asc,id.asc&limit=2000`);
      return (await res.json()) as KovaEvent[];
    },
    async deleteEvents(sandboxId) {
      await call(`/events?sandbox_id=eq.${sandboxId}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
    },
  };
}

// ---------- In-memory (local development only) ----------
type Mem = { sandboxes: Map<string, Sandbox>; events: KovaEvent[] };
const g = globalThis as unknown as { __kovaMem?: Mem };
const mem: Mem = g.__kovaMem || (g.__kovaMem = { sandboxes: new Map(), events: [] });

const memoryStore: Store = {
  mode: "memory",
  async createSandbox(s) { mem.sandboxes.set(s.api_key, structuredClone(s)); },
  async getByKey(k) { const s = mem.sandboxes.get(k); return s ? structuredClone(s) : null; },
  async updateMeta(id, meta) {
    for (const s of mem.sandboxes.values()) if (s.id === id) s.meta = structuredClone(meta);
  },
  async addEvents(events) { mem.events.push(...structuredClone(events)); },
  async listEvents(id) {
    return mem.events.filter(e => e.sandbox_id === id).sort((a, b) => a.created_at.localeCompare(b.created_at));
  },
  async deleteEvents(id) { mem.events = mem.events.filter(e => e.sandbox_id !== id); },
};

export function getStore(): Store {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? supabaseStore(url, key) : memoryStore;
}
