import { getStore } from "@/lib/store";
import { json, error, newSandbox, seedEvents, rateLimited, SANDBOX_DAYS } from "@/lib/account";

export const dynamic = "force-dynamic";

// Creates a private sandbox with its own API key and 30 days of seeded history.
export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (rateLimited("create:" + ip, 5)) return error(429, "rate_limited", "Too many sandboxes from this address. Try again in a minute.");

  let email: string | null = null;
  try {
    const body = await req.json();
    if (body && typeof body.email === "string" && body.email.trim()) {
      email = body.email.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email!) || email!.length > 200) return error(400, "invalid_email", "That email address doesn't look right.");
    }
  } catch { /* empty body is fine */ }

  const store = getStore();
  const sandbox = newSandbox(email);
  try {
    await store.createSandbox(sandbox);
    await store.addEvents(seedEvents(sandbox.id));
  } catch (e) {
    return error(500, "storage_error", (e as Error).message);
  }
  return json({ api_key: sandbox.api_key, expires_in_days: SANDBOX_DAYS, alert_email_set: !!email }, 201);
}
