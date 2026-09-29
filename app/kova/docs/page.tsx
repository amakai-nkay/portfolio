import Link from "next/link";

export const metadata = { title: "Kova API reference" };

const Code = ({ children }: { children: string }) => <div className="code" style={{ margin: "10px 0 16px" }}>{children}</div>;

export default function Docs() {
  return (
    <main className="wrap docs">
      <aside aria-label="On this page">
        <a href="#start">Getting started</a>
        <a href="#auth">Authentication</a>
        <a href="#account">Get the account</a>
        <a href="#events">Send an event</a>
        <a href="#types">Event types</a>
        <a href="#list">List events</a>
        <a href="#qbr">Draft a QBR</a>
        <a href="#reset">Reset the sandbox</a>
        <a href="#errors">Errors and limits</a>
        <a href="#scoring">How scoring works</a>
      </aside>
      <div>
        <div className="kova-mark"><i />Kova API</div>
        <h1>API reference</h1>
        <p>
          Kova&apos;s API lets you push customer activity in from your own systems and read back each account&apos;s
          health. It&apos;s a small REST API that takes and returns JSON. Everything here works against your sandbox,
          so you can try each request as you read.
        </p>

        <h2 id="start">Getting started</h2>
        <p>
          <Link href="/kova">Create a sandbox</Link> to get a key. Each sandbox holds one customer, Brightline
          Logistics, with 30 days of history, and lasts 7 days. Keep the Kova page open while you send requests
          and you&apos;ll see each one arrive.
        </p>

        <h2 id="auth">Authentication</h2>
        <p>Send your sandbox key as a bearer token on every request.</p>
        <Code>{`Authorization: Bearer kova_test_...`}</Code>
        <p>Sandbox keys start with <code>kova_test_</code>. A production API would add live keys, key rotation and scoped permissions; the sandbox keeps it to one key per account.</p>

        <h2 id="account"><span className="method">GET</span>/api/v1/account</h2>
        <p>Returns the account, its current health score broken down by component, the suggested next step, recent events, alerts and the integration log.</p>
        <Code>{`curl https://<this-site>/api/v1/account \\
  -H "Authorization: Bearer kova_test_..."`}</Code>
        <Code>{`{
  "account": { "name": "Brightline Logistics", "renewal_date": "2026-12-27", ... },
  "health": {
    "score": 86,
    "band": "healthy",
    "components": [
      { "key": "usage", "label": "Usage", "score": 32.1, "max": 35,
        "reason": "38 of 50 seats active this week, 4.3 logins each" },
      ...
    ]
  },
  "next_action": "Account is in good shape. Use the momentum: ask for a case study or a referral.",
  "history": [ { "at": "...", "score": 64, "type": "usage.weekly" }, ... ],
  "events": [ ... ], "alerts": [ ... ], "integration_log": [ ... ]
}`}</Code>

        <h2 id="events"><span className="method">POST</span>/api/v1/events</h2>
        <p>Records something that happened at the customer. Kova replays the account&apos;s full history, rescores it, and returns the new score. If the account drops into a worse band, Kova writes an alert and sends it.</p>
        <Code>{`curl -X POST https://<this-site>/api/v1/events \\
  -H "Authorization: Bearer kova_test_..." \\
  -H "Content-Type: application/json" \\
  -d '{"type":"usage.weekly","data":{"active_users":14,"logins":30}}'`}</Code>
        <Code>{`{
  "event": { "id": "...", "type": "usage.weekly", "description": "Weekly usage: 14 active users, 30 logins", ... },
  "health": { "previous": 76, "score": 58, "band": "at_risk" },
  "alert_triggered": true
}`}</Code>

        <h3 id="types">Event types</h3>
        <div className="table-scroll"><table>
          <thead><tr><th>type</th><th>data</th><th>What it changes</th></tr></thead>
          <tbody>
            <tr><td><code>usage.weekly</code></td><td><code>active_users</code>, <code>logins</code></td><td>Usage score</td></tr>
            <tr><td><code>feature.used</code></td><td><code>feature</code>: dashboards, alerts, reports, integrations, playbooks, api, segments or surveys</td><td>Feature adoption</td></tr>
            <tr><td><code>ticket.opened</code></td><td><code>severity</code>: low, medium or high; <code>subject</code></td><td>Support</td></tr>
            <tr><td><code>ticket.resolved</code></td><td><code>ticket_id</code> (optional, oldest if left out)</td><td>Support</td></tr>
            <tr><td><code>contact.added</code></td><td><code>role</code>: champion or sponsor; <code>name</code></td><td>Relationship</td></tr>
            <tr><td><code>contact.left</code></td><td><code>role</code>: champion or sponsor</td><td>Relationship</td></tr>
            <tr><td><code>nps.submitted</code></td><td><code>score</code>: 0 to 10</td><td>Relationship</td></tr>
            <tr><td><code>seats.changed</code></td><td><code>seats</code></td><td>Commercial and usage</td></tr>
            <tr><td><code>invoice.overdue</code></td><td>none</td><td>Commercial</td></tr>
            <tr><td><code>invoice.paid</code></td><td>none</td><td>Commercial</td></tr>
          </tbody>
        </table></div>

        <h2 id="list"><span className="method">GET</span>/api/v1/events</h2>
        <p>Returns the last 100 events, newest first, each with a plain-English description.</p>

        <h2 id="qbr"><span className="method">POST</span>/api/v1/qbr</h2>
        <p>Drafts a quarterly business review outline from the account&apos;s data. If an AI model is connected it writes the draft; otherwise Kova uses its own template. The response says which.</p>
        <Code>{`{ "generated_by": "ai", "draft": "Quarterly business review: Brightline Logistics\\n\\nWhere things stand\\n- ..." }`}</Code>

        <h2 id="reset"><span className="method">POST</span>/api/v1/reset</h2>
        <p>Puts the sandbox back to its starting point: the original 30 days of history, no alerts and an empty integration log. The key and alert email stay the same.</p>

        <h2 id="errors">Errors and limits</h2>
        <p>Errors come back with an HTTP status and a JSON body you can show to a user or act on in code.</p>
        <Code>{`{ "error": { "code": "unknown_event_type", "message": "type must be one of: usage.weekly, ..." } }`}</Code>
        <div className="table-scroll"><table>
          <thead><tr><th>Status</th><th>code</th><th>When</th></tr></thead>
          <tbody>
            <tr><td>400</td><td><code>invalid_json</code></td><td>The body isn&apos;t valid JSON</td></tr>
            <tr><td>401</td><td><code>missing_api_key</code>, <code>invalid_api_key</code></td><td>No key, or a key Kova doesn&apos;t recognise</td></tr>
            <tr><td>410</td><td><code>sandbox_expired</code></td><td>The sandbox is more than 7 days old</td></tr>
            <tr><td>413</td><td><code>payload_too_large</code></td><td><code>data</code> is over 2KB</td></tr>
            <tr><td>422</td><td><code>unknown_event_type</code></td><td>The event type isn&apos;t on the list above</td></tr>
            <tr><td>429</td><td><code>rate_limited</code></td><td>More than 30 events, 120 reads, 4 QBR drafts or 6 resets a minute</td></tr>
          </tbody>
        </table></div>

        <h2 id="scoring">How scoring works</h2>
        <p>
          Kova doesn&apos;t store a score. It stores events, and rebuilds the account&apos;s state by replaying them
          in order every time something changes. That means every score can be traced back to what caused it, and
          changing the model rescores history too.
        </p>
        <div className="table-scroll"><table>
          <thead><tr><th>Component</th><th>Weight</th><th>Based on</th></tr></thead>
          <tbody>
            <tr><td>Usage</td><td>35</td><td>Share of seats active this week, and logins per active user</td></tr>
            <tr><td>Feature adoption</td><td>20</td><td>How many of the eight features are in use (six or more scores full marks)</td></tr>
            <tr><td>Support</td><td>15</td><td>Open tickets, weighted by severity</td></tr>
            <tr><td>Relationship</td><td>20</td><td>Champion in place, exec sponsor engaged, latest NPS</td></tr>
            <tr><td>Commercial</td><td>10</td><td>Seats kept against the contract, invoices paid on time</td></tr>
          </tbody>
        </table></div>
        <p>70 and above is healthy, 50 to 69 is at risk, below 50 is critical. An alert fires only when an account moves into a worse band, at most once a minute per sandbox. Each sandbox emails at most 3 alerts in its lifetime, and a reset doesn&apos;t clear that count.</p>
      </div>
    </main>
  );
}
