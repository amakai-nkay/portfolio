import Link from "next/link";

export const metadata = { title: "Kova implementation and success plan" };

export default function SuccessPlan() {
  return (
    <main className="wrap docs">
      <aside aria-label="On this page">
        <a href="#customer">The customer</a>
        <a href="#handover">Sales handover (MEDDPICC)</a>
        <a href="#goals">Success measures</a>
        <a href="#plan">The first 90 days</a>
        <a href="#raci">Who does what</a>
        <a href="#risks">Risks</a>
        <a href="#adoption">Tracking adoption</a>
        <a href="#qbr">The 90-day review</a>
      </aside>
      <div>
        <div className="kova-mark"><i />Kova</div>
        <h1>Implementation and success plan</h1>
        <p>
          How I&apos;d take a new Kova customer from signed contract to a renewal they don&apos;t need convincing about.
          The customer is Haulio, a fictional fleet-management SaaS company. Brightline Logistics, the account in the{" "}
          <Link href="/kova">sandbox</Link>, is one of Haulio&apos;s own customers.
        </p>

        <h2 id="customer">The customer</h2>
        <div className="table-scroll"><table>
          <tbody>
            <tr><td><b>Company</b></td><td>Haulio, route-planning and fleet software for logistics firms. 180 staff, 320 customers on annual contracts.</td></tr>
            <tr><td><b>Team</b></td><td>6 CSMs, each owning around 55 accounts, led by Rachel Adeyemi, Head of Customer Success.</td></tr>
            <tr><td><b>Stack</b></td><td>HubSpot, Zendesk, Segment for product analytics, Stripe for billing.</td></tr>
            <tr><td><b>Contract</b></td><td>Kova Growth plan, annual, 320 accounts monitored.</td></tr>
          </tbody>
        </table></div>

        <h2 id="handover">Sales handover (MEDDPICC)</h2>
        <p>
          The deal is qualified with MEDDPICC during the sale, and the same notes become the starting point for
          implementation. If customer success doesn&apos;t know why the customer bought, it can&apos;t prove they got it.
        </p>
        <div className="table-scroll"><table>
          <thead><tr><th>Letter</th><th>What sales learned</th><th>What it means after signature</th></tr></thead>
          <tbody>
            <tr><td><b>Metrics</b></td><td>Gross revenue retention is 88%; the target is 93% within a year. Three renewals worth £180k were lost last quarter without warning.</td><td>These are the numbers the 90-day review reports against.</td></tr>
            <tr><td><b>Economic buyer</b></td><td>Daniel Price, CRO. He owns the retention target.</td><td>Invite him to kickoff for 15 minutes, and put the 90-day review in his diary now.</td></tr>
            <tr><td><b>Decision criteria</b></td><td>Explainable scores, live within a month, HubSpot and Zendesk connected, less than half the cost of a full CS suite.</td><td>Go-live by day 30 is a commitment, not a hope.</td></tr>
            <tr><td><b>Decision process</b></td><td>Rachel evaluated, RevOps validated the API in a sandbox, Daniel signed off the business case.</td><td>RevOps already knows the API, so involve them from day one.</td></tr>
            <tr><td><b>Paper process</b></td><td>DPA signed, security questionnaire completed, Zendesk data limited to ticket metadata only.</td><td>No ticket contents are pulled in. That&apos;s a promise to keep.</td></tr>
            <tr><td><b>Identify pain</b></td><td>CSMs spend Monday mornings across four tools building a spreadsheet, and still miss accounts.</td><td>Success is Monday morning starting in Kova. Measure it.</td></tr>
            <tr><td><b>Champion</b></td><td>Rachel. She took the business case to Daniel herself.</td><td>Make her look good at the 90-day review. Give her the numbers first.</td></tr>
            <tr><td><b>Competition</b></td><td>A full CS suite was dropped for its six-month rollout. The fallback was staying on HubSpot health fields.</td><td>If rollout drags, the alternative is doing nothing. Speed matters more than scope.</td></tr>
          </tbody>
        </table></div>

        <h2 id="goals">Success measures</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Measure</th><th>Starting point</th><th>Day 90 target</th><th>Why it matters</th></tr></thead>
          <tbody>
            <tr><td>Accounts scored</td><td>0</td><td>All 320</td><td>Nobody trusts a score that only covers some accounts</td></tr>
            <tr><td>CSMs using Kova weekly</td><td>0 of 6</td><td>6 of 6</td><td>Usage is the leading indicator of everything else</td></tr>
            <tr><td>At-risk alerts acted on within 2 working days</td><td>n/a</td><td>80%</td><td>Proves alerts are trusted, not ignored</td></tr>
            <tr><td>Monday account review time</td><td>About 3 hours per CSM</td><td>Under 45 minutes</td><td>The pain Rachel bought Kova for</td></tr>
            <tr><td>Renewals lost without an alert first</td><td>3 last quarter</td><td>0</td><td>The early read on the retention target</td></tr>
            <tr><td>Gross revenue retention</td><td>88%</td><td>Trending towards 93%</td><td>The CRO&apos;s number. Too early to prove at 90 days; track the trend.</td></tr>
          </tbody>
        </table></div>

        <h2 id="plan">The first 90 days</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>When</th><th>What happens</th><th>Done when</th></tr></thead>
          <tbody>
            <tr><td><b>Week 0</b><br />Kickoff</td><td>Walk through the MEDDPICC handover with Rachel and RevOps. Map the current Monday review workflow with two CSMs and mark the bottlenecks (<Link href="/before-after">before and after</Link>). Agree the success measures above. Daniel joins for the first 15 minutes.</td><td>Current-state map and measures signed off by Rachel</td></tr>
            <tr><td><b>Weeks 1–2</b><br />Connect</td><td>HubSpot (accounts, contacts, renewal dates) and Zendesk (ticket metadata) through native integrations. Segment usage and Stripe invoices through the events API, set up with RevOps.</td><td>All four sources flowing, checked against 10 accounts Rachel knows well</td></tr>
            <tr><td><b>Week 3</b><br />Calibrate</td><td>Replay the last 12 months and check the score against the three renewals lost last quarter. Adjust the weights with Rachel until those accounts would have gone red early.</td><td>All three lost renewals would have triggered an alert at least 45 days before renewal</td></tr>
            <tr><td><b>Week 4</b><br />Go live</td><td>A 60-minute CSM training built around their own accounts, not a product tour. Alerts switched on, sent to Slack and email. Rachel&apos;s Monday meeting runs from Kova.</td><td>6 of 6 CSMs logged in and acted on at least one account</td></tr>
            <tr><td><b>Weeks 5–8</b><br />Embed</td><td>Weekly 20-minute check-in with Rachel. Review which alerts were useful and which were noise, and tune. Turn on QBR drafting for the top 30 accounts.</td><td>Alert action rate above 70% and rising</td></tr>
            <tr><td><b>Day 60</b><br />Adoption review</td><td>Usage by CSM, alerts acted on, and one example of an account turned around. Agree anything to fix before the 90-day review.</td><td>No CSM below weekly usage</td></tr>
            <tr><td><b>Day 90</b><br />Review with the CRO</td><td>Results against the measures, presented by Rachel, with me in support.</td><td>Daniel agrees Kova is on track to the retention target</td></tr>
          </tbody>
        </table></div>

        <h2 id="raci">Who does what</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Task</th><th>Kova CSM</th><th>Kova SE</th><th>Rachel (Head of CS)</th><th>RevOps</th><th>Daniel (CRO)</th></tr></thead>
          <tbody>
            <tr><td>Success measures</td><td>Responsible</td><td>Consulted</td><td>Accountable</td><td>Informed</td><td>Consulted</td></tr>
            <tr><td>Integrations</td><td>Informed</td><td>Responsible</td><td>Informed</td><td>Accountable</td><td>n/a</td></tr>
            <tr><td>Score calibration</td><td>Responsible</td><td>Consulted</td><td>Accountable</td><td>Consulted</td><td>n/a</td></tr>
            <tr><td>CSM training</td><td>Responsible</td><td>Informed</td><td>Accountable</td><td>n/a</td><td>n/a</td></tr>
            <tr><td>90-day review</td><td>Responsible</td><td>Informed</td><td>Accountable</td><td>Informed</td><td>Consulted</td></tr>
          </tbody>
        </table></div>

        <h2 id="risks">Risks</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Risk</th><th>Early sign</th><th>What we do</th></tr></thead>
          <tbody>
            <tr><td>Segment data is messy and delays go-live</td><td>Usage numbers don&apos;t match what CSMs expect in week 2</td><td>Go live on HubSpot and Zendesk first; add usage when it&apos;s clean. The score shows which sources are missing.</td></tr>
            <tr><td>CSMs don&apos;t trust the score</td><td>Alerts ignored in weeks 5–6</td><td>Walk through the ignored alerts with Rachel, adjust the weights, and share one save story with the team.</td></tr>
            <tr><td>Rachel leaves or changes role</td><td>Missed check-ins, slower replies</td><td>Build a second relationship early, usually a senior CSM, and keep Daniel updated monthly by email.</td></tr>
            <tr><td>Alert fatigue</td><td>More than 3 alerts per CSM per day</td><td>Raise the thresholds and route lower-priority changes to a weekly digest.</td></tr>
          </tbody>
        </table></div>

        <h2 id="adoption">Tracking adoption</h2>
        <p>
          Kova&apos;s own health for Haulio is scored the same way Haulio scores its customers: weekly usage by CSMs, features
          in use (alerts, QBR drafts), open support issues, whether Rachel is still engaged, and whether the invoice is paid.
          If it would be good enough for their customers, it&apos;s good enough for ours.
        </p>

        <h2 id="qbr">The 90-day review</h2>
        <p>Rachel presents, Kova supports. The outline:</p>
        <ol>
          <li><b>What we set out to do:</b> the MEDDPICC metrics from the handover, in Daniel&apos;s own words.</li>
          <li><b>What happened:</b> accounts scored, usage by CSM, alerts acted on, Monday review time before and after.</li>
          <li><b>One account story:</b> an account Kova flagged, what the CSM did, and how it stands now.</li>
          <li><b>What we learned:</b> which signals mattered most at Haulio, and what we changed in the score.</li>
          <li><b>Next 90 days:</b> expand QBR drafting to all accounts, write health back into HubSpot, and set the renewal forecast target.</li>
        </ol>
        <p className="sub">You can see a QBR drafted from live data in the <Link href="/kova">Kova sandbox</Link>.</p>
      </div>
    </main>
  );
}
