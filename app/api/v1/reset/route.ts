import { getStore } from "@/lib/store";
import { authenticate, json, error, rateLimited, seedEvents, accountView } from "@/lib/account";

export const dynamic = "force-dynamic";

// Puts the sandbox back to its starting point: the original 30 days of history,
// no alerts, an empty integration log. The key and alert email stay the same.
export async function POST(req: Request) {
  const auth = await authenticate(req);
  if ("res" in auth) return auth.res;
  const { sandbox } = auth;
  if (rateLimited("reset:" + sandbox.api_key, 6)) return error(429, "rate_limited", "Resets are limited to 6 a minute.");
  const store = getStore();
  const events = seedEvents(sandbox.id);
  await store.deleteEvents(sandbox.id);
  await store.addEvents(events);
  // Keep the email count, so a reset can't be used to send more alert emails.
  sandbox.meta = { log: [], alerts: [], emailsSent: sandbox.meta.emailsSent || 0 };
  await store.updateMeta(sandbox.id, sandbox.meta);
  return json({ reset: true, account: await accountView(sandbox, events) });
}
