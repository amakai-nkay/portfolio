import { authenticate, accountView, json, error, rateLimited } from "@/lib/account";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await authenticate(req);
  if ("res" in auth) return auth.res;
  if (rateLimited("read:" + auth.sandbox.api_key, 120)) return error(429, "rate_limited", "Slow down: 120 reads a minute per key.");
  return json(await accountView(auth.sandbox));
}
