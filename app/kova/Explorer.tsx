"use client";
import { useMemo, useState } from "react";

const TEMPLATES: { label: string; body: unknown }[] = [
  { label: "Weekly usage dropped", body: { type: "usage.weekly", data: { active_users: 12, logins: 28 } } },
  { label: "Weekly usage grew", body: { type: "usage.weekly", data: { active_users: 45, logins: 240 } } },
  { label: "Support ticket opened", body: { type: "ticket.opened", data: { severity: "high", subject: "Driver app not syncing routes" } } },
  { label: "Support ticket resolved", body: { type: "ticket.resolved", data: {} } },
  { label: "Champion left", body: { type: "contact.left", data: { role: "champion" } } },
  { label: "New champion added", body: { type: "contact.added", data: { role: "champion", name: "Dan Okafor, Ops Lead" } } },
  { label: "New feature adopted", body: { type: "feature.used", data: { feature: "playbooks" } } },
  { label: "NPS response", body: { type: "nps.submitted", data: { score: 9 } } },
  { label: "Invoice overdue", body: { type: "invoice.overdue", data: {} } },
  { label: "Invoice paid", body: { type: "invoice.paid", data: {} } },
];

const ERRORS: { label: string; raw: string; noKey?: boolean }[] = [
  { label: "Unknown event type", raw: JSON.stringify({ type: "customer.exploded", data: {} }, null, 2) },
  { label: "Broken JSON", raw: `{ "type": "usage.weekly", "data": { "active_users": 12, ` },
  { label: "No API key", raw: JSON.stringify({ type: "nps.submitted", data: { score: 8 } }, null, 2), noKey: true },
];

type Result = { status: number; ms: number; body: string; sentAt: string };

export default function Explorer({ apiKey, origin, onSent }: { apiKey: string; origin: string; onSent: () => void }) {
  const [raw, setRaw] = useState(JSON.stringify(TEMPLATES[0].body, null, 2));
  const [noKey, setNoKey] = useState(false);
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const jsonError = useMemo(() => { try { JSON.parse(raw); return ""; } catch (e) { return (e as Error).message; } }, [raw]);

  const pick = (i: string) => {
    const n = Number(i);
    if (n >= 0) { setRaw(JSON.stringify(TEMPLATES[n].body, null, 2)); setNoKey(false); }
    else { const e = ERRORS[-n - 1]; setRaw(e.raw); setNoKey(!!e.noKey); }
    setRes(null);
  };

  const send = async () => {
    setBusy(true);
    const t0 = performance.now();
    try {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (!noKey) headers.Authorization = `Bearer ${apiKey}`;
      const r = await fetch("/api/v1/events", { method: "POST", headers, body: raw });
      const text = await r.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { /* not JSON */ }
      setRes({ status: r.status, ms: Math.round(performance.now() - t0), body: pretty, sentAt: new Date().toLocaleTimeString("en-GB") });
      if (r.ok) onSent();
    } catch (e) {
      setRes({ status: 0, ms: Math.round(performance.now() - t0), body: (e as Error).message, sentAt: new Date().toLocaleTimeString("en-GB") });
    } finally { setBusy(false); }
  };

  const curl = `curl -X POST ${origin}/api/v1/events \\\n${noKey ? "" : `  -H "Authorization: Bearer ${apiKey}" \\\n`}  -H "Content-Type: application/json" \\\n  -d '${raw.replace(/\s*\n\s*/g, " ").replace(/'/g, "'\\''")}'`;
  const ok = res && res.status >= 200 && res.status < 300;

  return (
    <div className="explorer">
      <div className="ex-bar">
        <span className="method">POST</span><code className="ex-url">/api/v1/events</code>
      </div>
      <label className="ex-label" htmlFor="ex-pick">Choose an event</label>
      <select id="ex-pick" className="ex-select" onChange={e => pick(e.target.value)} defaultValue="0">
        <optgroup label="Events">{TEMPLATES.map((t, i) => <option key={t.label} value={i}>{t.label}</option>)}</optgroup>
        <optgroup label="See how errors are handled">{ERRORS.map((t, i) => <option key={t.label} value={-(i + 1)}>{t.label}</option>)}</optgroup>
      </select>

      <label className="ex-label" htmlFor="ex-body">Request body <span className="sub">edit it if you like</span></label>
      <textarea id="ex-body" className="ex-body" spellCheck={false} value={raw} onChange={e => setRaw(e.target.value)} rows={7} />
      <div className="ex-meta">
        <label className="ex-check"><input type="checkbox" checked={!noKey} onChange={e => setNoKey(!e.target.checked)} /> Send my API key</label>
        {jsonError ? <span className="ex-warn">Not valid JSON. Send it anyway to see how the API responds.</span> : null}
      </div>
      <div className="ex-actions">
        <button className="btn accent" onClick={send} disabled={busy}>{busy ? "Sending…" : "Send request"}</button>
        <button className="btn ghost small" onClick={() => navigator.clipboard?.writeText(curl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })}>{copied ? "Copied" : "Copy as cURL"}</button>
      </div>

      {res ? (
        <div className="ex-res" aria-live="polite">
          <div className="ex-res-head">
            <span className={`ex-status ${ok ? "ok" : "bad"}`}>{res.status || "Failed"} {statusText(res.status)}</span>
            <span className="sub">{res.ms} ms · {res.sentAt}</span>
          </div>
          <pre className="code ex-out">{res.body}</pre>
          {ok ? <p className="sub" style={{ margin: "8px 0 0" }}>Saved. The dashboard has already picked it up, marked API in the event feed.</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function statusText(s: number) {
  return ({ 201: "Created", 200: "OK", 400: "Bad Request", 401: "Unauthorized", 410: "Gone", 413: "Payload Too Large", 422: "Unprocessable", 429: "Too Many Requests", 500: "Server Error" } as Record<number, string>)[s] || "";
}
