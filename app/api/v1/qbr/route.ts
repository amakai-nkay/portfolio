import { getStore } from "@/lib/store";
import { authenticate, json, error, rateLimited, ACCOUNT } from "@/lib/account";
import { replay, score, band, BAND_LABEL, nextAction, FEATURES } from "@/lib/health";
import { describe } from "@/lib/describe";
import { aiWrite } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const auth = await authenticate(req);
  if ("res" in auth) return auth.res;
  const { sandbox } = auth;
  if (rateLimited("qbr:" + sandbox.api_key, 4)) return error(429, "rate_limited", "QBR drafts are limited to 4 a minute.");

  const store = getStore();
  const events = await store.listEvents(sandbox.id);
  const { state, history } = replay(events);
  const s = score(state);
  const start = history.find(h => h.type === "usage.weekly")?.score ?? s.total;
  const unused = FEATURES.filter(f => !state.features.includes(f));
  const renewal = new Date(new Date(sandbox.created_at).getTime() + 90 * 864e5)
    .toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const template = `Quarterly business review: ${ACCOUNT.name}

Where things stand
- Health is ${s.total} (${BAND_LABEL[band(s.total)].toLowerCase()}), ${s.total >= start ? "up" : "down"} from ${start} in the first week of the contract.
- ${state.activeUsers} of ${state.seats} seats were active last week.

What's working
${s.components.filter(c => c.score / c.max >= 0.7).map(c => `- ${c.label}: ${c.reason}`).join("\n") || "- Not much yet. This quarter is about getting the basics in place."}

What needs attention
${s.components.filter(c => c.score / c.max < 0.7).map(c => `- ${c.label}: ${c.reason}`).join("\n") || "- Nothing significant."}

Plan for next quarter
- ${nextAction(state)}
${unused.length ? `- Introduce ${unused.slice(0, 2).join(" and ")}, tied to a goal the team has already named.` : "- Agree two measurable outcomes to report on at renewal."}
- Agree success measures ahead of renewal on ${renewal}.`;

  const prompt = `Draft a QBR outline for this B2B SaaS customer. Use exactly these four headings on their own lines: "Where things stand", "What's working", "What needs attention", "Plan for next quarter". Short bullet points under each, each starting with "- ". Under 220 words. Only use facts from the data.

Account: ${ACCOUNT.name} (${ACCOUNT.industry}), plan ${ACCOUNT.plan}, renews ${renewal}
Health score now ${s.total}, in the first week of the contract ${start}
Components: ${s.components.map(c => `${c.label} ${c.score}/${c.max}: ${c.reason}`).join("; ")}
Features not yet used: ${unused.join(", ") || "none"}
Changes this period: ${events.filter(e => e.source !== "seed").map(describe).join("; ") || "none since onboarding"}
Rules engine next action: ${nextAction(state)}`;

  const ai = await aiWrite(prompt, sandbox.meta.log, "Drafted the QBR");
  sandbox.meta.log = sandbox.meta.log.slice(0, 30);
  await store.updateMeta(sandbox.id, sandbox.meta);
  return json({ generated_by: ai ? "ai" : "template", draft: ai ? `Quarterly business review: ${ACCOUNT.name}\n\n${ai}` : template });
}
