import type { KovaEvent } from "./health";

export function describe(e: Pick<KovaEvent, "type" | "data">): string {
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
