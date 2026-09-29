import Link from "next/link";

export const metadata = { title: "How Kova works — architecture" };

function Diagram() {
  const box = (x: number, y: number, w: number, t: string, s: string, accent = false) => (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height="58" rx="10" fill={accent ? "var(--accent)" : "var(--surface)"} stroke={accent ? "var(--accent)" : "var(--line)"} />
      <text x="14" y="25" fontSize="14" fontWeight="600" fill={accent ? "#fff" : "var(--ink)"} fontFamily="var(--body)">{t}</text>
      <text x="14" y="44" fontSize="12" fill={accent ? "#E6E9FB" : "var(--muted)"} fontFamily="var(--body)">{s}</text>
    </g>
  );
  const arrow = (d: string, label?: string, lx = 0, ly = 0) => (
    <g>
      <path d={d} fill="none" stroke="var(--muted)" strokeWidth="1.4" markerEnd="url(#a)" />
      {label ? <text x={lx} y={ly} fontSize="11.5" fill="var(--muted)" fontFamily="var(--body)">{label}</text> : null}
    </g>
  );
  return (
    <div className="table-scroll" style={{ margin: "18px 0 8px" }}>
      <svg viewBox="0 0 880 380" style={{ width: "100%", minWidth: 680, height: "auto", display: "block" }} role="img" aria-label="Kova architecture: sources send events to the Kova API, which stores them in Postgres, scores the account, and sends alerts through Make to Gmail">
        <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--muted)" /></marker></defs>
        {box(10, 20, 200, "Dashboard buttons", "Visitor clicks a scenario")}
        {box(10, 100, 200, "API Explorer / cURL", "Visitor sends a real request")}
        {box(10, 180, 200, "Customer systems", "HubSpot, Zendesk, Stripe…")}
        <text x="16" y="258" fontSize="11.5" fill="var(--muted)" fontFamily="var(--body)">dashed: how a real customer connects</text>

        {box(290, 100, 250, "Kova API", "Next.js on Vercel · auth, checks, limits", true)}
        {box(290, 230, 250, "Scoring engine", "Replays events, scores, explains")}
        {box(290, 310, 250, "Postgres (Supabase)", "Sandboxes and event history")}

        {box(650, 20, 220, "Dashboard", "Polls the API every 3 seconds")}
        {box(650, 150, 220, "AI model (optional)", "Anthropic API: alerts, QBRs")}
        {box(650, 240, 220, "Make scenario", "Webhook → Gmail")}
        {box(650, 316, 220, "Visitor's inbox", "The at-risk alert")}

        {arrow("M210,49 C250,49 250,118 288,118", "POST events", 222, 66)}
        {arrow("M210,129 L288,129")}
        <path d="M210,209 C250,209 250,142 288,142" fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeDasharray="5 4" markerEnd="url(#a)" />
        {arrow("M415,158 L415,228")}
        {arrow("M415,288 L415,308")}
        {arrow("M540,112 C595,112 595,49 648,49", "GET account", 560, 72)}
        {arrow("M540,136 C595,136 595,179 648,179", "band drops", 560, 150)}
        {arrow("M540,150 C600,165 600,269 648,269", "alert", 606, 236)}
        {arrow("M760,298 L760,314")}
      </svg>
    </div>
  );
}

export default function Architecture() {
  return (
    <main className="wrap docs">
      <aside aria-label="On this page">
        <a href="#overview">Overview</a>
        <a href="#flow">One event, end to end</a>
        <a href="#decisions">Design decisions</a>
        <a href="#stack">Stack</a>
        <a href="#production">What changes in production</a>
      </aside>
      <div>
        <div className="kova-mark"><i />Kova</div>
        <h1>How Kova works</h1>
        <p>
          The short version: things that happen at a customer come in as events, Kova stores every event, rebuilds the
          account from them, scores it, and tells the CSM when it slips. Everything below is running on this site
          right now. You can <Link href="/kova">try it</Link> or <Link href="/kova/docs">call the API</Link>.
        </p>

        <h2 id="overview">Overview</h2>
        <Diagram />
        <p className="sub">Solid arrows are live on this site. The dashed one is how a real Kova customer would feed it; here, the buttons and the API Explorer stand in for those systems.</p>

        <h2 id="flow">One event, end to end</h2>
        <p>What happens when you click &ldquo;Customer at risk&rdquo; and the first event, &ldquo;weekly usage falls to 17&rdquo;, is sent:</p>
        <ol>
          <li><b>Request.</b> The browser sends <code>POST /api/v1/events</code> with the sandbox key as a bearer token.</li>
          <li><b>Checks.</b> Kova checks the key, confirms the sandbox hasn&apos;t expired, applies the rate limit, and validates the event type and payload. Anything wrong gets a clear error: 400, 401, 410, 413, 422 or 429.</li>
          <li><b>Store.</b> The event is written to Postgres. Events are never edited or deleted, except by a full reset.</li>
          <li><b>Rebuild.</b> Kova replays every event for the account, in order, to rebuild its current state: seats, active users, features, tickets, contacts, NPS, invoices.</li>
          <li><b>Score.</b> Five components (usage, feature adoption, support, relationship, commercial) are scored with written reasons, and the rules engine picks a next step.</li>
          <li><b>Compare.</b> If the account has dropped into a worse band (healthy to at risk, or at risk to critical), an alert is written, by the AI model if one is connected or by a template if not.</li>
          <li><b>Deliver.</b> If the visitor gave an email and hasn&apos;t used their 3 emails, Kova posts the alert to a Make webhook. Make sends it through Gmail.</li>
          <li><b>Log.</b> Every outbound call is recorded with its status and timing, and shown in the dashboard&apos;s integration log.</li>
          <li><b>Show.</b> The response carries the new score. The dashboard updates straight away; anything sent from outside (cURL, Postman) appears within 3 seconds because the dashboard polls.</li>
        </ol>

        <h2 id="decisions">Design decisions</h2>
        <h3>Store events, not scores</h3>
        <p>
          Kova keeps the history of what happened and works out the score from it each time. Every score can be traced
          back to the events that caused it, which is what a CSM needs when a customer asks &ldquo;why are we red?&rdquo;.
          It also means a change to the scoring model rescores the whole history, with no migration.
          <br /><span className="sub">Trade-off: replaying gets slower as history grows. Fine at this scale; in production I&apos;d add a snapshot every few hundred events.</span>
        </p>
        <h3>Rules first, not machine learning</h3>
        <p>
          The score is a transparent weighted model. A new customer can check it against their own instinct in the first
          week, and it works from day one without months of churn data.
          <br /><span className="sub">Trade-off: it won&apos;t spot patterns nobody thought to write a rule for. Once a customer has a year of renewals and losses, a predictive model can be tested against the rules, not instead of them.</span>
        </p>
        <h3>Alerts on band changes only</h3>
        <p>Alerting on every score movement trains people to ignore alerts. Kova only alerts when an account crosses into a worse band, with a cooldown and a hard cap on emails per sandbox.</p>
        <h3>A private sandbox for every visitor</h3>
        <p>Each visitor gets their own account and key, so one person&apos;s experiments never spoil another&apos;s demo. Sandboxes and any email addresses expire after 7 days.</p>
        <h3>Hand off to a workflow tool for delivery</h3>
        <p>
          Kova doesn&apos;t send email itself. It posts to a webhook and Make does the delivery. Swapping Gmail for Slack,
          Teams or a CRM task becomes a change in Make, not in Kova&apos;s code, which is how most customers want to work.
        </p>
        <h3>Secrets stay on the server</h3>
        <p>The database key, AI key and webhook address live in the hosting environment, never in the code or the browser. The only key a visitor sees is their own sandbox key, which can only touch their own sandbox.</p>

        <h2 id="stack">Stack</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Part</th><th>Tool</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td>Web app and API</td><td>Next.js, TypeScript</td><td>One codebase for pages and API routes</td></tr>
            <tr><td>Hosting</td><td>Vercel</td><td>Deploys on every GitHub commit, secrets kept in environment settings</td></tr>
            <tr><td>Database</td><td>Postgres on Supabase</td><td>Reached through its REST API, row-level security on</td></tr>
            <tr><td>Alert workflow</td><td>Make, Gmail</td><td>Webhook trigger, email step, run history for debugging</td></tr>
            <tr><td>AI writing</td><td>Anthropic API</td><td>Optional, with a template fallback so nothing breaks without it</td></tr>
          </tbody>
        </table></div>

        <h2 id="production">What changes in production</h2>
        <p>This is a demo, and some things are deliberately simpler than they would be for a paying customer. What I&apos;d add:</p>
        <ul>
          <li><b>Signed webhooks</b> in both directions (HMAC signatures), so each side can prove a request is genuine.</li>
          <li><b>Idempotency keys</b> on events, so a customer system that retries doesn&apos;t count the same ticket twice.</li>
          <li><b>A proper queue with retries</b> for alerts, instead of sending during the request.</li>
          <li><b>Rate limits in a shared store</b> such as Redis. The demo keeps them in memory per server.</li>
          <li><b>Scoped API keys</b> (read-only, write-only), key rotation, and OAuth for the native integrations.</li>
          <li><b>Customer-editable scoring weights</b>, because every customer weighs usage and support differently.</li>
          <li><b>Monitoring and alerting</b> on error rates and webhook failures, plus an audit log customers can export.</li>
          <li><b>Data handling:</b> EU data residency options, a DPA, and retention settings per customer.</li>
        </ul>
      </div>
    </main>
  );
}
