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
    { href: "/#work", title: "Onboarding and success plan", text: "How I'd take Brightline Logistics from signature to renewal.", live: false },
  ]},
  pmm: { label: "Product marketing", steps: [
    { href: "/#work", title: "Positioning and ICP", text: "Who Kova is for, who it isn't for, and why.", live: false },
    { href: "/#work", title: "Messaging and competitive battlecard", text: "How Kova wins against the established customer success platforms.", live: false },
    { href: "/#work", title: "Pricing and launch plan", text: "The reasoning behind each decision, not just the outcome.", live: false },
    { href: "/kova", title: "The product it's all based on", text: "Try it, so the marketing has something real behind it.", live: true },
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
