import { getStore } from "@/lib/store";
import { authenticate, accountView, json, error, rateLimited, makeEvent, ACCOUNT } from "@/lib/account";
import { EVENT_TYPES, replay, score, band, bandRank, BAND_LABEL, nextAction, type EventType } from "@/lib/health";
import { describe } from "@/lib/describe";
import { aiWrite, alertPrompt, alertTemplate, deliverAlert, maskEmail, type AlertContext } from "@/lib/integrations";
import type { Alert } from "@/lib/store";

export const dynamic = "force-dynamic";
const WRITABLE: EventType[] = EVENT_TYPES.filter(t => t !== "contract.started");
const ALERT_COOLDOWN_MS = 60_000;

export async function GET(req: Request) {
  const auth = await authenticate(req);
  if ("res" in auth) return auth.res;
  const events = await getStore().listEvents(auth.sandbox.id);
  return json({ data: events.slice(-100).reverse().map(e => ({ ...e, description: describe(e) })) });
}

export async function POST(req: Request) {
  const auth = await authenticate(req);
  if ("res" in auth) return auth.res;
  const { sandbox } = auth;
  if (rateLimited("write:" + sandbox.api_key, 30)) return error(429, "rate_limited", "Slow down: 30 events a minute per key.");

  let body: { type?: string; data?: Record<string, unknown> };
  try { body = await req.json(); } catch { return error(400, "invalid_json", "The request body must be JSON."); }
  const type = body?.type as EventType;
  if (!type || !WRITABLE.includes(type)) return error(422, "unknown_event_type", `type must be one of: ${WRITABLE.join(", ")}`);
  const data = body.data && typeof body.data === "object" && !Array.isArray(body.data) ? body.data : {};
  if (JSON.stringify(data).length > 2000) return error(413, "payload_too_large", "Keep data under 2KB.");

  const source = req.headers.get("x-kova-source") === "dashboard" ? "ui" : "api";
  const store = getStore();
  const before = await store.listEvents(sandbox.id);
  const prev = score(replay(before).state).total;

  const event = makeEvent(sandbox.id, type, data, source);
  await store.addEvents([event]);
  const all = [...before, event];
  const { state } = replay(all);
  const s = score(state);
  const next = s.total;

  // Alert when the account drops into a worse band.
  let alert: Alert | null = null;
  const worse = bandRank(band(next)) > bandRank(band(prev));
  const cooled = !sandbox.meta.lastAlertAt || Date.now() - new Date(sandbox.meta.lastAlertAt).getTime() > ALERT_COOLDOWN_MS;
  if (worse && cooled) {
    const recent = all.filter(e => e.source !== "seed").slice(-3).map(describe);
    const ctx: AlertContext = {
      account: ACCOUNT.name, from: prev, to: next,
      bandFrom: BAND_LABEL[band(prev)], bandTo: BAND_LABEL[band(next)],
      state, components: s.components, recent, nextAction: nextAction(state),
    };
    const subject = `${ACCOUNT.name} is now ${ctx.bandTo.toLowerCase()} (health ${prev} → ${next})`;
    const text = (await aiWrite(alertPrompt(ctx), sandbox.meta.log, "Wrote the alert summary")) || alertTemplate(ctx);
    const result = await deliverAlert(sandbox.alert_email, subject, text,
      { account: ACCOUNT.name, score_from: prev, score_to: next, band: band(next) }, sandbox.meta.log);
    alert = { at: new Date().toISOString(), subject, body: text, delivered: result.delivered, via: result.via,
      to: sandbox.alert_email ? maskEmail(sandbox.alert_email) : undefined };
    sandbox.meta.alerts.unshift(alert);
    sandbox.meta.lastAlertAt = alert.at;
    sandbox.meta.log = sandbox.meta.log.slice(0, 30);
    sandbox.meta.alerts = sandbox.meta.alerts.slice(0, 10);
    await store.updateMeta(sandbox.id, sandbox.meta);
  }

  return json({
    event: { ...event, description: describe(event) },
    health: { previous: prev, score: next, band: band(next) },
    alert_triggered: !!alert,
    account: source === "ui" ? await accountView(sandbox, all) : undefined,
  }, 201);
}
