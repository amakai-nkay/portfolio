"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

type Component = { key: string; label: string; score: number; max: number; reason: string };
type Ev = { id: string; type: string; data: Record<string, unknown>; source: "seed" | "ui" | "api"; created_at: string };
type View = {
  account: { name: string; plan: string; industry: string; renewal_date: string };
  health: { score: number; band: "healthy" | "at_risk" | "critical"; band_label: string; components: Component[] };
  next_action: string;
  state: { features: string[]; openTickets: { id: string }[]; champion: boolean; sponsor: boolean; seats: number; invoiceOverdue: boolean };
  history: { at: string; score: number; type: string }[];
  events: Ev[];
  alerts: { at: string; subject: string; body: string; delivered: "email" | "preview"; to?: string; via?: string }[];
  integration_log: { at: string; target: string; status: "ok" | "error" | "skipped"; ms: number; note: string }[];
  alert_email_set: boolean;
  storage: "supabase" | "memory";
  sandbox_expires: string;
};

const KEY_STORE = "kova_sandbox_key";
const FEATURES = ["dashboards", "alerts", "reports", "integrations", "playbooks", "api", "segments", "surveys"];

function describe(e: Pick<Ev, "type" | "data">) {
  const d = e.data || {};
  switch (e.type) {
    case "contract.started": return `Contract started with ${d.seats} seats`;
    case "usage.weekly": return `Weekly usage: ${d.active_users} active users, ${d.logins} logins`;
    case "feature.used": return `Started using ${d.feature}`;
    case "ticket.opened": return `${String(d.severity || "medium").replace(/^./, c => c.toUpperCase())} ticket opened${d.subject ? `: ${d.subject}` : ""}`;
    case "ticket.resolved": return "Support ticket resolved";
    case "contact.added": return `${d.role === "sponsor" ? "Exec sponsor" : "Champion"} added${d.name ? `: ${d.name}` : ""}`;
    case "contact.left": return `${d.role === "sponsor" ? "Exec sponsor" : "Champion"} left the company`;
    case "nps.submitted": return `NPS response: ${d.score}`;
    case "seats.changed": return `Seats changed to ${d.seats}`;
    case "invoice.overdue": return "Invoice overdue";
    case "invoice.paid": return "Overdue invoice paid";
    default: return e.type;
  }
}
const when = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 45) return "just now";
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return `${Math.round(s / 86400)} days ago`;
};

export default function KovaPage() {
  const [key, setKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setKey(localStorage.getItem(KEY_STORE)); setReady(true); }, []);
  if (!ready) return <main className="wrap app" />;
  return key
    ? <Dashboard apiKey={key} onReset={() => { localStorage.removeItem(KEY_STORE); setKey(null); }} />
    : <Start onCreated={k => { localStorage.setItem(KEY_STORE, k); setKey(k); }} />;
}

function Start({ onCreated }: { onCreated: (k: string) => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const create = async () => {
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/sandbox", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error?.message || "Something went wrong");
      onCreated(j.api_key);
    } catch (e) { setErr((e as Error).message); setBusy(false); }
  };
  return (
    <main className="wrap start">
      <div>
        <div className="kova-mark"><i />Kova</div>
        <h1>See which customers need you before renewal does.</h1>
        <p className="lede">
          Kova is a customer health platform for B2B SaaS teams. It scores every account from what customers
          actually do, explains the score, and alerts the customer success manager the moment an account slips.
        </p>
        <p className="lede">
          In this sandbox you&apos;re the CSM. Your customer is Brightline Logistics, a freight company with 50 seats
          and 30 days of history. It&apos;s yours to break.
        </p>
        <ol className="steps">
          <li><b>1</b><span>Change what&apos;s happening at Brightline: their champion leaves, usage drops, a ticket goes urgent.</span></li>
          <li><b>2</b><span>Watch the health score and the reasons behind it update.</span></li>
          <li><b>3</b><span>When the account drops a band, get the alert Kova sends the CSM, in your own inbox.</span></li>
          <li><b>4</b><span>Do the same with a real API call using your sandbox key.</span></li>
        </ol>
      </div>
      <div className="form">
        <label htmlFor="email">Where should alerts go?</label>
        <input id="email" type="email" inputMode="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !busy) create(); }} />
        <p className="help">Optional. Used only to send this sandbox&apos;s alerts, and deleted when the sandbox expires after 7 days. Leave it blank to see alerts on screen instead.</p>
        <button className="btn accent" onClick={create} disabled={busy}>{busy ? "Setting up your sandbox…" : "Create my sandbox"}</button>
        {err ? <p className="err" role="alert">{err}</p> : null}
      </div>
    </main>
  );
}

const HURT: { label: string; type: string; data: Record<string, unknown> }[] = [
  { label: "Champion leaves", type: "contact.left", data: { role: "champion" } },
  { label: "Quiet week", type: "usage.weekly", data: { active_users: 14, logins: 30 } },
  { label: "Urgent ticket", type: "ticket.opened", data: { severity: "high", subject: "Shipment sync failing for all depots" } },
  { label: "Invoice overdue", type: "invoice.overdue", data: {} },
  { label: "Low NPS (3)", type: "nps.submitted", data: { score: 3 } },
  { label: "Seats cut to 30", type: "seats.changed", data: { seats: 30 } },
];

function Dashboard({ apiKey, onReset }: { apiKey: string; onReset: () => void }) {
  const [v, setV] = useState<View | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [qbr, setQbr] = useState<{ draft: string; by: string } | null>(null);
  const [qbrBusy, setQbrBusy] = useState(false);
  const [tab, setTab] = useState<"curl" | "js" | "python">("curl");
  const [copied, setCopied] = useState("");
  const seen = useRef<Set<string>>(new Set());
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const hasView = useRef(false);
  const take = useCallback((nv: View) => {
    hasView.current = true;
    const incoming = nv.events.map(e => e.id).filter(id => seen.current.size && !seen.current.has(id));
    nv.events.forEach(e => seen.current.add(e.id));
    if (incoming.length) setFresh(new Set(incoming));
    setV(nv);
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/account", { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" });
      const j = await res.json();
      if (res.status === 401 || res.status === 410) { setErr(j.error?.message || "Sandbox not found"); return; }
      if (!res.ok) throw new Error(j.error?.message || `Server error ${res.status}`);
      setErr(""); take(j);
    } catch (e) {
      // Keep showing the last good view if we have one; otherwise say what went wrong.
      if (!hasView.current) setErr(`Kova couldn't load this sandbox. ${(e as Error).message || ""}`.trim());
    }
  }, [apiKey, take]);

  useEffect(() => {
    load();
    const t = setInterval(() => { if (document.visibilityState === "visible") load(); }, 3000);
    return () => clearInterval(t);
  }, [load]);

  const send = async (type: string, data: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch("/api/v1/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json", "x-kova-source": "dashboard" },
        body: JSON.stringify({ type, data }),
      });
      const j = await res.json();
      if (j.account) take(j.account); else load();
    } finally { setBusy(false); }
  };

  const draftQbr = async () => {
    setQbrBusy(true);
    try {
      const res = await fetch("/api/v1/qbr", { method: "POST", headers: { Authorization: `Bearer ${apiKey}` } });
      const j = await res.json();
      setQbr(res.ok ? { draft: j.draft, by: j.generated_by } : { draft: j.error?.message || "Couldn't draft the QBR.", by: "error" });
      load();
    } finally { setQbrBusy(false); }
  };

  const copy = (text: string, what: string) => {
    navigator.clipboard?.writeText(text).then(() => { setCopied(what); setTimeout(() => setCopied(""), 1800); }, () => setCopied("fail"));
  };

  if (err) return (
    <main className="wrap app">
      <div className="panel"><div className="in" style={{ paddingTop: 20 }}>
        <p>{err}</p><button className="btn" onClick={onReset}>Start a new sandbox</button>
      </div></div>
    </main>
  );
  if (!v) return <main className="wrap app"><p className="empty">Loading your sandbox…</p></main>;

  const s = v.state;
  const nextFeature = FEATURES.find(f => !s.features.includes(f));
  const HELP = [
    { label: "Busy week", type: "usage.weekly", data: { active_users: 44, logins: 230 } },
    nextFeature ? { label: `Starts using ${nextFeature}`, type: "feature.used", data: { feature: nextFeature } } : null,
    s.openTickets.length ? { label: "Resolve a ticket", type: "ticket.resolved", data: {} } : null,
    !s.champion ? { label: "New champion", type: "contact.added", data: { role: "champion", name: "Dan Okafor, Ops Lead" } } : null,
    s.invoiceOverdue ? { label: "Invoice paid", type: "invoice.paid", data: {} } : null,
    { label: "Great NPS (9)", type: "nps.submitted", data: { score: 9 } },
  ].filter(Boolean) as typeof HURT;

  const body = `{"type":"contact.left","data":{"role":"champion"}}`;
  const snippets = {
    curl: `curl -X POST ${origin}/api/v1/events \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${body}'`,
    js: `await fetch("${origin}/api/v1/events", {
  method: "POST",
  headers: {
    Authorization: "Bearer ${apiKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ type: "contact.left", data: { role: "champion" } }),
});`,
    python: `import requests

requests.post(
    "${origin}/api/v1/events",
    headers={"Authorization": "Bearer ${apiKey}"},
    json={"type": "contact.left", "data": {"role": "champion"}},
)`,
  };

  // sparkline
  const pts = v.history.map(h => h.score);
  const W = 520, H = 72, pad = 4;
  const x = (i: number) => pad + (i * (W - pad * 2)) / Math.max(1, pts.length - 1);
  const y = (n: number) => H - pad - ((n / 100) * (H - pad * 2));
  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p).toFixed(1)}`).join(" ");

  return (
    <main className="wrap app">
      {v.storage === "memory" ? <div className="banner">Running in local demo mode: data is kept in memory and resets when the server restarts.</div> : null}
      <div className="app-head">
        <div>
          <div className="kova-mark"><i />Kova</div>
          <h1>{v.account.name}</h1>
          <p className="meta">{v.account.industry}. {v.account.plan}. Renews {new Date(v.account.renewal_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Link className="btn ghost small" href="/kova/docs">API docs</Link>
          <button className="btn ghost small" onClick={onReset}>Start over</button>
        </div>
      </div>

      <div className="grid">
        <div className="stack">
          <section className="panel" aria-labelledby="h-health">
            <header><h2 id="h-health">Account health</h2><span className="sub">Rebuilt from {v.history.length} events</span></header>
            <div className="in">
              <div className="score-row">
                <div>
                  <div className={`big c-${v.health.band}`} aria-live="polite">{v.health.score}</div>
                  <span className={`band ${v.health.band}`}>{v.health.band_label}</span>
                </div>
                <svg className="spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Health score over time">
                  <line x1="0" x2={W} y1={y(70)} y2={y(70)} stroke="var(--line)" strokeDasharray="4 4" />
                  <line x1="0" x2={W} y1={y(50)} y2={y(50)} stroke="var(--line)" strokeDasharray="4 4" />
                  <path d={line} fill="none" stroke="var(--ink)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="comp">
                {v.health.components.map(c => (
                  <div className="comp-row" key={c.key}>
                    <span>{c.label}</span>
                    <span className="bar"><i style={{ width: `${(c.score / c.max) * 100}%` }} /></span>
                    <span className="n">{Math.round(c.score)}/{c.max}</span>
                    <small>{c.reason}</small>
                  </div>
                ))}
              </div>
              <div className="next"><b>Suggested next step</b>{v.next_action}</div>
            </div>
          </section>

          <section className="panel sim" aria-labelledby="h-sim">
            <header><h2 id="h-sim">Change what&apos;s happening at Brightline</h2><span className="sub">Each button sends a real event</span></header>
            <div className="in">
              <h3>Things that hurt</h3>
              <div className="btns hurt">{HURT.map(b => <button key={b.label} disabled={busy} onClick={() => send(b.type, b.data)}>{b.label}</button>)}</div>
              <h3>Things that help</h3>
              <div className="btns help">{HELP.map(b => <button key={b.label} disabled={busy} onClick={() => send(b.type, b.data)}>{b.label}</button>)}</div>
            </div>
          </section>

          <section className="panel" aria-labelledby="h-api">
            <header><h2 id="h-api">Or do it with the API</h2><span className="sub">Watch this page update within 3 seconds</span></header>
            <div className="in">
              <div className="tabs" role="group" aria-label="Language">
                {(["curl", "js", "python"] as const).map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)}>{t === "js" ? "JavaScript" : t === "python" ? "Python" : "cURL"}</button>)}
              </div>
              <div className="code">
                <button className="copy" onClick={() => copy(snippets[tab], "code")}>{copied === "code" ? "Copied" : "Copy"}</button>
                {snippets[tab]}
              </div>
              <div className="keyline">Your sandbox key: <code>{apiKey.slice(0, 16)}…</code>
                <button className="btn ghost small" onClick={() => copy(apiKey, "key")}>{copied === "key" ? "Copied" : "Copy key"}</button>
                <span>Expires {new Date(v.sandbox_expires).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}.</span>
              </div>
            </div>
          </section>

          <section className="panel" aria-labelledby="h-qbr">
            <header><h2 id="h-qbr">Quarterly business review</h2><span className="sub">Drafted from this account&apos;s data</span></header>
            <div className="in">
              <button className="btn" onClick={draftQbr} disabled={qbrBusy}>{qbrBusy ? "Drafting…" : qbr ? "Redraft QBR" : "Draft a QBR"}</button>
              {qbr ? <div className="qbr">{qbr.draft}</div> : null}
              {qbr && qbr.by !== "error" ? <p className="sub" style={{ marginTop: 8 }}>{qbr.by === "ai" ? "Written by an AI model from the account data." : "Built from Kova's template. Add an AI key to have a model write it."}</p> : null}
            </div>
          </section>
        </div>

        <div className="stack">
          <section className="panel" aria-labelledby="h-alerts">
            <header><h2 id="h-alerts">Alerts</h2><span className="sub">{v.alert_email_set ? "Sent to your inbox" : "Shown here"}</span></header>
            <div className="in">
              {v.alerts.length ? v.alerts.map(a => (
                <div className="alert" key={a.at}>
                  <div className="subj">{a.subject}</div>
                  <div className="meta">{when(a.at)} · {a.delivered === "email" ? `emailed to ${a.to}${a.via ? ` via ${a.via}` : ""}` : "preview only"}</div>
                  <pre>{a.body}</pre>
                </div>
              )) : <p className="empty">No alerts yet. Kova sends one when the account drops from healthy to at risk, or from at risk to critical. Try &ldquo;Champion leaves&rdquo; then &ldquo;Quiet week&rdquo;.</p>}
            </div>
          </section>

          <section className="panel" aria-labelledby="h-log">
            <header><h2 id="h-log">Integration log</h2><span className="sub">Outbound calls</span></header>
            <div className="in">
              {v.integration_log.length ? <ul className="log">{v.integration_log.map((l, i) => (
                <li key={l.at + i}><span className={`dot ${l.status}`} aria-label={l.status} /><b>{l.target}</b><span className="ms">{l.status === "skipped" ? "skipped" : `${l.ms} ms`}</span><p>{l.note}</p></li>
              ))}</ul> : <p className="empty">Calls to the AI model, n8n and the email service will show here with their status and timing.</p>}
            </div>
          </section>

          <section className="panel" aria-labelledby="h-feed">
            <header><h2 id="h-feed">Event feed</h2><span className="sub">Newest first</span></header>
            <div className="in">
              <ul className="feed">{v.events.map(e => (
                <li key={e.id} className={fresh.has(e.id) ? "fresh" : ""}>
                  <span>{describe(e)}<span className={`src ${e.source}`}>{e.source === "api" ? "API" : e.source === "ui" ? "dashboard" : "history"}</span></span>
                  <time dateTime={e.created_at}>{when(e.created_at)}</time>
                </li>
              ))}</ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
