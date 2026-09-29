import { randomBytes, randomUUID } from "crypto";
import { getStore, type Sandbox } from "./store";
import { replay, score, band, BAND_LABEL, nextAction, type KovaEvent, type EventType } from "./health";

export const ACCOUNT = { name: "Brightline Logistics", plan: "Growth, 50 seats", industry: "Freight and logistics, 400 staff" };
export const SANDBOX_DAYS = 7;
export const MAX_EMAILS_PER_SANDBOX = 3;

export function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}
export function error(status: number, code: string, message: string) {
  return json({ error: { code, message } }, status);
}

export async function authenticate(req: Request): Promise<{ sandbox: Sandbox } | { res: Response }> {
  const header = req.headers.get("authorization") || "";
  const key = header.replace(/^Bearer\s+/i, "").trim();
  if (!key) return { res: error(401, "missing_api_key", "Send your sandbox key as: Authorization: Bearer kova_test_...") };
  if (!/^kova_test_[a-f0-9]{32}$/.test(key)) return { res: error(401, "invalid_api_key", "That doesn't look like a Kova sandbox key.") };
  const sandbox = await getStore().getByKey(key);
  if (!sandbox) return { res: error(401, "invalid_api_key", "No sandbox found for this key. Create a new one on the Kova page.") };
  const age = (Date.now() - new Date(sandbox.created_at).getTime()) / 864e5;
  if (age > SANDBOX_DAYS) return { res: error(410, "sandbox_expired", `Sandboxes last ${SANDBOX_DAYS} days. Create a new one on the Kova page.`) };
  return { sandbox };
}

// Simple per-key rate limit. Good enough for a demo; a production API would use a shared store.
const g = globalThis as unknown as { __kovaRate?: Map<string, number[]> };
const hits: Map<string, number[]> = g.__kovaRate || (g.__kovaRate = new Map<string, number[]>());
export function rateLimited(key: string, perMinute = 30) {
  const t = Date.now();
  const list = (hits.get(key) || []).filter(x => t - x < 60_000);
  list.push(t);
  hits.set(key, list);
  return list.length > perMinute;
}

export function newKey() { return "kova_test_" + randomBytes(16).toString("hex"); }

export function makeEvent(sandboxId: string, type: EventType, data: Record<string, unknown>, source: KovaEvent["source"], at?: Date): KovaEvent {
  return { id: randomUUID(), sandbox_id: sandboxId, type, data, source, created_at: (at || new Date()).toISOString() };
}

// 30 days of healthy history so the dashboard has something to show from the first second.
export function seedEvents(sandboxId: string): KovaEvent[] {
  const day = 864e5, t = Date.now();
  const at = (daysAgo: number, mins = 0) => new Date(t - daysAgo * day + mins * 60_000);
  const e = (type: EventType, data: Record<string, unknown>, d: number, m = 0) => makeEvent(sandboxId, type, data, "seed", at(d, m));
  return [
    e("contract.started", { seats: 50 }, 30),
    e("contact.added", { role: "champion", name: "Priya Shah, Head of Operations" }, 30, 1),
    e("contact.added", { role: "sponsor", name: "Tom Ellis, COO" }, 30, 2),
    e("usage.weekly", { active_users: 22, logins: 70 }, 23),
    e("feature.used", { feature: "dashboards" }, 22),
    e("feature.used", { feature: "alerts" }, 19),
    e("usage.weekly", { active_users: 31, logins: 120 }, 16),
    e("feature.used", { feature: "reports" }, 14),
    e("ticket.opened", { severity: "low", subject: "SSO login loop for two users" }, 12),
    e("usage.weekly", { active_users: 36, logins: 150 }, 9),
    e("feature.used", { feature: "integrations" }, 6),
    e("nps.submitted", { score: 7 }, 4),
    e("usage.weekly", { active_users: 38, logins: 165 }, 2),
  ];
}

export async function accountView(sandbox: Sandbox, events?: KovaEvent[]) {
  const all = events || (await getStore().listEvents(sandbox.id));
  const { state, history } = replay(all);
  const s = score(state);
  const renewal = new Date(new Date(sandbox.created_at).getTime() + 90 * 864e5).toISOString().slice(0, 10);
  return {
    account: { ...ACCOUNT, renewal_date: renewal },
    health: { score: s.total, band: band(s.total), band_label: BAND_LABEL[band(s.total)], components: s.components },
    next_action: nextAction(state),
    state,
    history,
    events: all.slice(-25).reverse(),
    alerts: sandbox.meta.alerts.slice(0, 5),
    integration_log: sandbox.meta.log.slice(0, 12),
    alert_email_set: !!sandbox.alert_email,
    emails_sent: sandbox.meta.emailsSent || 0,
    emails_limit: MAX_EMAILS_PER_SANDBOX,
    storage: getStore().mode,
    sandbox_expires: new Date(new Date(sandbox.created_at).getTime() + SANDBOX_DAYS * 864e5).toISOString(),
  };
}

export function newSandbox(email: string | null): Sandbox {
  return { id: randomUUID(), api_key: newKey(), alert_email: email, created_at: new Date().toISOString(), meta: { log: [], alerts: [] } };
}
