import type { LogEntry } from "./store";
import type { AccountState, Component } from "./health";

const now = () => new Date().toISOString();

async function timed<T>(target: string, log: LogEntry[], fn: () => Promise<T>, note: string): Promise<T | null> {
  const t0 = Date.now();
  try {
    const out = await fn();
    log.unshift({ at: now(), target, status: "ok", ms: Date.now() - t0, note });
    return out;
  } catch (err) {
    log.unshift({ at: now(), target, status: "error", ms: Date.now() - t0, note: (err as Error).message.slice(0, 160) });
    return null;
  }
}

// ---------- AI ----------
export async function aiWrite(prompt: string, log: LogEntry[], note: string): Promise<string | null> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    log.unshift({ at: now(), target: "Anthropic API", status: "skipped", ms: 0, note: "No API key set, used the built-in template" });
    return null;
  }
  return timed("Anthropic API", log, async () => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001",
        max_tokens: 700,
        system: "You write for customer success managers at a B2B SaaS company. Plain, direct British English. No hype, no emojis, no headings unless asked. Never invent facts that aren't in the data you're given.",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const text = (json.content || []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n").trim();
    if (!text) throw new Error("Empty response");
    return text;
  }, note);
}

// ---------- Alert emails ----------
export type AlertContext = {
  account: string;
  from: number; to: number; bandFrom: string; bandTo: string;
  state: AccountState; components: Component[];
  recent: string[]; nextAction: string;
};

export function alertTemplate(c: AlertContext) {
  const weakest = [...c.components].sort((a, b) => a.score / a.max - b.score / b.max).slice(0, 2);
  return `${c.account} has moved from ${c.bandFrom.toLowerCase()} to ${c.bandTo.toLowerCase()}. The health score dropped from ${c.from} to ${c.to}.

What changed: ${c.recent.join("; ")}.

The weakest areas now are ${weakest.map(w => `${w.label.toLowerCase()} (${w.reason})`).join(" and ")}.

Suggested next step: ${c.nextAction}`;
}

export function alertPrompt(c: AlertContext) {
  return `Write the body of a short internal alert email (under 120 words) to the CSM who owns this account. Say what changed, why it matters for the renewal, and one concrete next step. No greeting or sign-off.

Account: ${c.account}
Health score: ${c.from} -> ${c.to} (${c.bandFrom} -> ${c.bandTo})
Recent events: ${c.recent.join("; ")}
Score components: ${c.components.map(x => `${x.label} ${x.score}/${x.max} (${x.reason})`).join("; ")}
Suggested action from the rules engine: ${c.nextAction}`;
}

const sentToday = (() => {
  const g = globalThis as unknown as { __kovaSent?: { day: string; n: number } };
  return () => {
    const day = new Date().toISOString().slice(0, 10);
    if (!g.__kovaSent || g.__kovaSent.day !== day) g.__kovaSent = { day, n: 0 };
    return g.__kovaSent;
  };
})();

export async function deliverAlert(
  to: string | null, subject: string, body: string, payload: Record<string, unknown>, log: LogEntry[],
): Promise<{ delivered: "email" | "preview"; via?: string }> {
  if (!to) {
    log.unshift({ at: now(), target: "Email", status: "skipped", ms: 0, note: "No alert email on this sandbox, saved as a preview" });
    return { delivered: "preview" };
  }
  const counter = sentToday();
  const cap = Number(process.env.MAX_ALERT_EMAILS_PER_DAY || 50);
  if (counter.n >= cap) {
    log.unshift({ at: now(), target: "Email", status: "skipped", ms: 0, note: "Daily email limit reached, saved as a preview" });
    return { delivered: "preview" };
  }

  const n8n = process.env.N8N_WEBHOOK_URL;
  if (n8n) {
    const ok = await timed("n8n webhook", log, async () => {
      const res = await fetch(n8n, { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ to, subject, body, ...payload }) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return true;
    }, `Alert handed to n8n for ${maskEmail(to)}`);
    if (ok) { counter.n++; return { delivered: "email", via: "n8n" }; }
  }

  const resend = process.env.RESEND_API_KEY;
  if (resend) {
    const ok = await timed("Resend API", log, async () => {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resend}`, "content-type": "application/json" },
        body: JSON.stringify({
          from: process.env.ALERT_FROM_EMAIL || "Kova <onboarding@resend.dev>",
          to: [to], subject, text: body + "\n\n— Kova, a demo product in Amaka Ikpeazu's portfolio",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 100)}`);
      return true;
    }, `Email sent to ${maskEmail(to)}`);
    if (ok) { counter.n++; return { delivered: "email", via: "Resend" }; }
  }

  if (!n8n && !resend) log.unshift({ at: now(), target: "Email", status: "skipped", ms: 0, note: "No email service configured, saved as a preview" });
  return { delivered: "preview" };
}

export const maskEmail = (e: string) => e.replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => a + "•".repeat(Math.min(6, b.length)) + c);
