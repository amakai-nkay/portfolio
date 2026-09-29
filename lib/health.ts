// Kova's customer health model.
// The account's state is rebuilt by replaying its events in order (event sourcing),
// so every score can be traced back to the events that produced it.

export type KovaEvent = {
  id: string;
  sandbox_id: string;
  type: EventType;
  data: Record<string, unknown>;
  source: "seed" | "ui" | "api";
  created_at: string;
};

export const EVENT_TYPES = [
  "contract.started",
  "usage.weekly",
  "feature.used",
  "ticket.opened",
  "ticket.resolved",
  "contact.added",
  "contact.left",
  "nps.submitted",
  "seats.changed",
  "invoice.overdue",
  "invoice.paid",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const FEATURES = ["dashboards", "alerts", "reports", "integrations", "playbooks", "api", "segments", "surveys"];

export type AccountState = {
  licensedSeats: number;
  seats: number;
  activeUsers: number;
  logins7d: number;
  features: string[];
  openTickets: { id: string; severity: "low" | "medium" | "high"; subject: string }[];
  champion: boolean;
  sponsor: boolean;
  nps: number | null;
  invoiceOverdue: boolean;
};

export const initialState = (): AccountState => ({
  licensedSeats: 50,
  seats: 50,
  activeUsers: 0,
  logins7d: 0,
  features: [],
  openTickets: [],
  champion: false,
  sponsor: false,
  nps: null,
  invoiceOverdue: false,
});

const num = (v: unknown, fallback: number) => (typeof v === "number" && isFinite(v) ? v : fallback);

export function apply(state: AccountState, e: KovaEvent): AccountState {
  const s: AccountState = { ...state, features: [...state.features], openTickets: [...state.openTickets] };
  const d = e.data || {};
  switch (e.type) {
    case "contract.started":
      s.licensedSeats = s.seats = Math.max(1, Math.round(num(d.seats, 50)));
      break;
    case "usage.weekly":
      s.activeUsers = Math.max(0, Math.min(s.seats, Math.round(num(d.active_users, s.activeUsers))));
      s.logins7d = Math.max(0, Math.round(num(d.logins, s.logins7d)));
      break;
    case "feature.used": {
      const f = String(d.feature || "").toLowerCase();
      if (FEATURES.includes(f) && !s.features.includes(f)) s.features.push(f);
      break;
    }
    case "ticket.opened": {
      const sev = (["low", "medium", "high"].includes(String(d.severity)) ? d.severity : "medium") as "low" | "medium" | "high";
      s.openTickets.push({ id: e.id, severity: sev, subject: String(d.subject || "Support request").slice(0, 120) });
      break;
    }
    case "ticket.resolved":
      if (s.openTickets.length) {
        const i = d.ticket_id ? s.openTickets.findIndex(t => t.id === d.ticket_id) : 0;
        s.openTickets.splice(i >= 0 ? i : 0, 1);
      }
      break;
    case "contact.added":
      if (d.role === "champion") s.champion = true;
      if (d.role === "sponsor") s.sponsor = true;
      break;
    case "contact.left":
      if (d.role === "champion") s.champion = false;
      if (d.role === "sponsor") s.sponsor = false;
      break;
    case "nps.submitted":
      s.nps = Math.max(0, Math.min(10, Math.round(num(d.score, 7))));
      break;
    case "seats.changed":
      s.seats = Math.max(1, Math.round(num(d.seats, s.seats)));
      s.activeUsers = Math.min(s.activeUsers, s.seats);
      break;
    case "invoice.overdue":
      s.invoiceOverdue = true;
      break;
    case "invoice.paid":
      s.invoiceOverdue = false;
      break;
  }
  return s;
}

export type Component = { key: string; label: string; score: number; max: number; reason: string };

export function score(s: AccountState): { total: number; components: Component[] } {
  const adoption = s.seats ? s.activeUsers / s.seats : 0;
  const loginsPerUser = s.activeUsers ? s.logins7d / s.activeUsers : 0;
  const usage = 35 * (0.6 * Math.min(1, adoption / 0.8) + 0.4 * Math.min(1, loginsPerUser / 5));

  const breadth = 20 * Math.min(1, s.features.length / 6);

  const ticketCost = s.openTickets.reduce((t, k) => t + (k.severity === "high" ? 8 : k.severity === "medium" ? 4 : 2), 0);
  const support = Math.max(0, 15 - ticketCost);

  const npsPts = s.nps == null ? 2.5 : s.nps >= 9 ? 5 : s.nps >= 7 ? 3 : 0;
  const relationship = (s.champion ? 10 : 0) + (s.sponsor ? 5 : 0) + npsPts;

  const commercial = (s.invoiceOverdue ? 0 : 5) + 5 * Math.min(1, s.seats / s.licensedSeats);

  const high = s.openTickets.filter(t => t.severity === "high").length;
  const components: Component[] = [
    { key: "usage", label: "Usage", score: usage, max: 35,
      reason: `${s.activeUsers} of ${s.seats} seats active this week, ${loginsPerUser.toFixed(1)} logins each` },
    { key: "breadth", label: "Feature adoption", score: breadth, max: 20,
      reason: `${s.features.length} of ${FEATURES.length} features in use` },
    { key: "support", label: "Support", score: support, max: 15,
      reason: s.openTickets.length ? `${s.openTickets.length} open ticket${s.openTickets.length > 1 ? "s" : ""}${high ? `, ${high} urgent` : ""}` : "No open tickets" },
    { key: "relationship", label: "Relationship", score: relationship, max: 20,
      reason: [s.champion ? "Champion in place" : "No champion", s.sponsor ? "exec sponsor engaged" : "no exec sponsor", s.nps == null ? "no NPS yet" : `last NPS ${s.nps}`].join(", ") },
    { key: "commercial", label: "Commercial", score: commercial, max: 10,
      reason: `${s.seats} of ${s.licensedSeats} contracted seats${s.invoiceOverdue ? ", invoice overdue" : ", invoices paid"}` },
  ];
  const total = Math.round(components.reduce((t, c) => t + c.score, 0));
  return { total: Math.max(0, Math.min(100, total)), components: components.map(c => ({ ...c, score: Math.round(c.score * 10) / 10 })) };
}

export type Band = "healthy" | "at_risk" | "critical";
export const band = (n: number): Band => (n >= 70 ? "healthy" : n >= 50 ? "at_risk" : "critical");
export const BAND_LABEL: Record<Band, string> = { healthy: "Healthy", at_risk: "At risk", critical: "Critical" };
export const bandRank = (b: Band) => (b === "healthy" ? 0 : b === "at_risk" ? 1 : 2);

export function replay(events: KovaEvent[]) {
  let s = initialState();
  const history: { at: string; score: number; type: string }[] = [];
  for (const e of events) {
    s = apply(s, e);
    history.push({ at: e.created_at, score: score(s).total, type: e.type });
  }
  return { state: s, history };
}

// The single most useful thing a CSM could do next, based on the weakest part of the score.
export function nextAction(s: AccountState): string {
  if (!s.champion) return "Find a new champion. Ask your exec sponsor who now owns the rollout, and book a working session with them this week.";
  if (s.openTickets.some(t => t.severity === "high")) return "Get the urgent ticket resolved. Join the next support call yourself and give the customer a clear time to resolution.";
  if (s.seats && s.activeUsers / s.seats < 0.5) return "Usage has dropped. Pull the list of inactive users and run a short re-onboarding session with their team leads.";
  if (s.invoiceOverdue) return "Check with finance why the invoice is late before it turns into a renewal conversation.";
  if (s.features.length < 4) return "Adoption is narrow. Show them one feature that fits a goal they've already told you about.";
  if (!s.sponsor) return "Re-engage an exec sponsor before renewal. Share a one-page value summary they can forward.";
  if (s.nps != null && s.nps < 7) return "Follow up on the low NPS score. Ask what would make it a 9 and log the answer.";
  if (s.seats && s.activeUsers / s.seats >= 0.85) return `Expansion opportunity: ${s.activeUsers} of ${s.seats} seats are in use. Open a conversation about more seats before renewal, and ask for a case study while things are going well.`;
  return "Account is in good shape. Use the momentum: ask for a case study or a referral.";
}
