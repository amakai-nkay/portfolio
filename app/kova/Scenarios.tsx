"use client";
import { useState } from "react";

type Comp = { key: string; label: string; score: number; max: number; reason: string };
type Health = { score: number; band: string; band_label: string; components: Comp[] };
type State = { features: string[]; openTickets: { id: string }[]; champion: boolean; invoiceOverdue: boolean };
export type ViewLike = { health: Health; next_action: string; state: State; account: { renewal_date: string } };
type Step = { label: string; type: string; data: Record<string, unknown> };
type Sent = { label: string; before: number; after: number };

const FEATURES = ["dashboards", "alerts", "reports", "integrations", "playbooks", "api", "segments", "surveys"];

const SCENARIOS: { id: string; title: string; story: string; steps: (v: ViewLike) => Step[] }[] = [
  {
    id: "risk", title: "Customer at risk",
    story: "Brightline's drivers stop using the app after a sync problem, and support tickets start piling up.",
    steps: () => [
      { label: "Weekly usage falls to 17 active users", type: "usage.weekly", data: { active_users: 17, logins: 40 } },
      { label: "Urgent ticket: route sync failing at every depot", type: "ticket.opened", data: { severity: "high", subject: "Route sync failing at every depot" } },
      { label: "Ticket: weekly reports timing out", type: "ticket.opened", data: { severity: "medium", subject: "Weekly reports timing out" } },
    ],
  },
  {
    id: "renewal", title: "Renewal warning",
    story: "Renewal is getting closer. The exec sponsor has moved on, finance hasn't paid, and the team is logging in less.",
    steps: () => [
      { label: "Invoice goes overdue", type: "invoice.overdue", data: {} },
      { label: "Exec sponsor leaves the company", type: "contact.left", data: { role: "sponsor" } },
      { label: "NPS response of 4", type: "nps.submitted", data: { score: 4 } },
      { label: "Weekly usage dips to 26 active users", type: "usage.weekly", data: { active_users: 26, logins: 80 } },
    ],
  },
  {
    id: "thrive", title: "Customer thriving",
    story: "The rollout lands. More of the team is using Kova every week, they adopt new features and support is quiet.",
    steps: v => {
      const unused = FEATURES.filter(f => !v.state.features.includes(f)).slice(0, 2);
      return [
        { label: "Weekly usage grows to 46 active users", type: "usage.weekly", data: { active_users: 46, logins: 260 } },
        ...unused.map(f => ({ label: `Starts using ${f}`, type: "feature.used", data: { feature: f } })),
        ...v.state.openTickets.map(() => ({ label: "Support ticket resolved", type: "ticket.resolved", data: {} })),
        ...(!v.state.champion ? [{ label: "New champion added", type: "contact.added", data: { role: "champion", name: "Dan Okafor, Ops Lead" } }] : []),
        ...(v.state.invoiceOverdue ? [{ label: "Overdue invoice paid", type: "invoice.paid", data: {} }] : []),
        { label: "NPS response of 9", type: "nps.submitted", data: { score: 9 } },
      ];
    },
  },
];

type Run = { id: string; title: string; before: ViewLike; after: ViewLike; sent: Sent[] };

export default function Scenarios({ view, send, disabled }: {
  view: ViewLike;
  send: (type: string, data: Record<string, unknown>) => Promise<{ previous: number; score: number; view: ViewLike } | null>;
  disabled: boolean;
}) {
  const [running, setRunning] = useState<string | null>(null);
  const [run, setRun] = useState<Run | null>(null);

  const play = async (id: string) => {
    const sc = SCENARIOS.find(s => s.id === id)!;
    setRunning(id); setRun(null);
    const before = view;
    let after = view;
    const sent: Sent[] = [];
    for (const step of sc.steps(view)) {
      const r = await send(step.type, step.data);
      if (!r) break;
      sent.push({ label: step.label, before: r.previous, after: r.score });
      after = r.view;
    }
    setRun({ id, title: sc.title, before, after, sent });
    setRunning(null);
  };

  const days = Math.max(0, Math.round((new Date(view.account.renewal_date).getTime() - Date.now()) / 864e5));

  return (
    <div>
      <div className="scen-grid">
        {SCENARIOS.map(s => (
          <div className="scen" key={s.id}>
            <h3>{s.title}</h3>
            <p>{s.id === "renewal" ? `${s.story} Renewal is in ${days} days.` : s.story}</p>
            <button className="btn small" disabled={disabled || !!running} onClick={() => play(s.id)}>
              {running === s.id ? "Running…" : "Play scenario"}
            </button>
          </div>
        ))}
      </div>

      {run ? <Result run={run} /> : null}
    </div>
  );
}

function Result({ run }: { run: Run }) {
  const b = run.before.health, a = run.after.health;
  const diff = a.score - b.score;
  const changed = a.components
    .map(c => ({ c, prev: b.components.find(x => x.key === c.key)! }))
    .filter(({ c, prev }) => Math.abs(c.score - prev.score) >= 0.5);
  return (
    <div className="scen-result" aria-live="polite">
      <div className="sr-head">
        <b>{run.title}</b>
        <span className="sr-scores">
          <span className={`band ${b.band}`}>{b.score} {b.band_label}</span>
          <span aria-hidden="true">→</span>
          <span className={`band ${a.band}`}>{a.score} {a.band_label}</span>
          <span className="sub">{diff > 0 ? `+${diff}` : diff} points</span>
        </span>
      </div>
      <div className="sr-cols">
        <div>
          <h4>What happened</h4>
          <ol className="sr-list">{run.sent.map((s, i) => (
            <li key={i}><span>{s.label}</span><span className="sub">{s.before} → {s.after}</span></li>
          ))}</ol>
        </div>
        <div>
          <h4>Why the score moved</h4>
          <ul className="sr-list">{changed.length ? changed.map(({ c, prev }) => (
            <li key={c.key}><span><b>{c.label}</b> {Math.round(prev.score)} → {Math.round(c.score)} of {c.max}<br /><small>{c.reason}</small></span></li>
          )) : <li>No change to the score components.</li>}</ul>
        </div>
      </div>
      <div className="next"><b>Recommended next step</b>{run.after.next_action}</div>
    </div>
  );
}
