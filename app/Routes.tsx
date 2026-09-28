"use client";
import { useState } from "react";
import Link from "next/link";

type Step = { href: string; title: string; text: string; live: boolean };
const ROUTES: Record<string, { label: string; steps: Step[] }> = {
  se: { label: "Solutions engineering", steps: [
    { href: "/#demo", title: "Watch me demo Kova", text: "A recorded walkthrough, built around a discovery call with a fictional prospect.", live: false },
    { href: "/kova", title: "Use the product yourself", text: "Spin up a sandbox, change the account and watch the health score respond.", live: true },
    { href: "/kova/docs", title: "Call the API", text: "Send a real request with your own key and see it land in the dashboard.", live: true },
    { href: "/#work", title: "Discovery and demo plan", text: "The questions I'd ask, and how the answers shape the demo.", live: false },
  ]},
  cs: { label: "Customer success", steps: [
    { href: "/kova", title: "See the health model working", text: "Five scored areas, each with its reason, and a suggested next step for the CSM.", live: true },
    { href: "/kova", title: "Get an at-risk alert in your inbox", text: "Let the account slip and Kova emails you a summary of what changed.", live: true },
    { href: "/kova", title: "Draft a QBR from live data", text: "One click turns the account's history into a review outline.", live: true },
    { href: "/#work", title: "Implementation and success plan", text: "How I'd take a new Kova customer from signature to renewal.", live: false },
  ]},
  enablement: { label: "Sales enablement", steps: [
    { href: "/#kova", title: "Kova's positioning", text: "Who it's for, the problem it solves and why it wins, in one place.", live: true },
    { href: "/#work", title: "Enablement kit for Kova's sales team", text: "Battlecard, objection handling and a demo playbook a new rep could run with.", live: false },
    { href: "/#demo", title: "The demo, recorded", text: "What good looks like, for a rep to learn from.", live: false },
    { href: "/kova", title: "The product it's all based on", text: "A working sandbox, so the enablement has something real behind it.", live: true },
  ]},
  tech: { label: "Something technical", steps: [
    { href: "/kova/docs", title: "API reference", text: "Authentication, endpoints, errors and rate limits.", live: true },
    { href: "/kova", title: "Watch the integration log", text: "Every outbound call (AI, n8n, email) shown with its status and timing.", live: true },
    { href: "/#work", title: "Architecture and the n8n workflow", text: "How the pieces connect, in plain English with the detail underneath.", live: false },
  ]},
};

export default function Routes() {
  const [r, setR] = useState<keyof typeof ROUTES>("se");
  return (
    <div>
      <div className="routes" role="group" aria-label="Choose a route">
        {Object.entries(ROUTES).map(([k, v]) => (
          <button key={k} className="route" aria-pressed={r === k} onClick={() => setR(k as keyof typeof ROUTES)}>{v.label}</button>
        ))}
      </div>
      <ol className="path">
        {ROUTES[r].steps.map(s => (
          <li key={s.title}>
            <div><Link href={s.href}>{s.title}</Link><p>{s.text}</p></div>
            <span className={`status ${s.live ? "live" : "soon"}`}>{s.live ? "Live" : "Coming soon"}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
