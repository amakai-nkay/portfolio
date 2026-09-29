import Link from "next/link";

export const metadata = { title: "Kova sales enablement kit" };

export default function Enablement() {
  return (
    <main className="wrap docs">
      <aside aria-label="On this page">
        <a href="#positioning">Positioning</a>
        <a href="#icp">Who we sell to</a>
        <a href="#personas">Buyers</a>
        <a href="#messaging">Messaging</a>
        <a href="#discovery">Discovery: L1 to L3</a>
        <a href="#meddpicc">Qualifying with MEDDPICC</a>
        <a href="#battlecard">Battlecard</a>
        <a href="#objections">Objection handling</a>
        <a href="#pricing">Pricing and why</a>
        <a href="#demo">Demo playbook</a>
      </aside>
      <div>
        <div className="kova-mark"><i />Kova</div>
        <h1>Sales enablement kit</h1>
        <p>
          What a new Kova account executive or solutions engineer needs to run a good deal in their first month: who
          we&apos;re for, what we say, how we qualify, how we handle the competition, and how to run the demo. Kova is
          fictional; the thinking is how I&apos;d build this for a real product.
        </p>

        <h2 id="positioning">Positioning</h2>
        <p className="lede-quote">
          For customer success teams at B2B SaaS companies who find out an account is at risk when it&apos;s already too
          late, Kova is a customer health platform that shows which accounts need attention and why, from the data they
          already have. Unlike the large CS suites, Kova is live in days, every score comes with its reasons, and it&apos;s
          built API-first so it fits the stack a team already runs.
        </p>
        <p>
          <b>The one-line version:</b> see which customers need you before renewal does.
        </p>

        <h2 id="icp">Who we sell to</h2>
        <div className="table-scroll"><table>
          <tbody>
            <tr><td><b>Company</b></td><td>B2B SaaS, 50 to 500 employees, 50 to 500 customers on annual contracts</td></tr>
            <tr><td><b>Team</b></td><td>A customer success team of 3 to 20 CSMs, each owning 30 to 80 accounts</td></tr>
            <tr><td><b>Stack</b></td><td>A CRM (HubSpot or Salesforce), a support tool (Zendesk or Intercom), product analytics, and Stripe or similar for billing</td></tr>
            <tr><td><b>Trigger events</b></td><td>A surprise churn or lost renewal, a new VP of CS, a board asking about net revenue retention, or a CS team that&apos;s grown past spreadsheets</td></tr>
            <tr><td><b>Not a fit</b></td><td>Enterprise CS teams of 50+ who want a full suite with journeys and surveys (point them elsewhere), and monthly self-serve products with thousands of tiny accounts</td></tr>
          </tbody>
        </table></div>

        <h2 id="personas">Buyers</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Who</th><th>What they care about</th><th>What they need to hear</th></tr></thead>
          <tbody>
            <tr><td><b>Head of Customer Success</b><br /><span className="sub">Usually the champion</span></td><td>No surprise churn. A team that works the right accounts. Something to show the CRO.</td><td>Your CSMs stop building spreadsheets on Monday morning and start the week with a ranked list and the reason for each account.</td></tr>
            <tr><td><b>CRO or COO</b><br /><span className="sub">Usually the economic buyer</span></td><td>Gross and net revenue retention. Forecast accuracy on renewals.</td><td>Earlier warning on the renewals that matter, in time to do something about them, and a clear line from Kova to retained revenue.</td></tr>
            <tr><td><b>RevOps or a technical lead</b><br /><span className="sub">Technical evaluator</span></td><td>Clean data, no new silo, not another tool to maintain.</td><td>A documented API and webhooks, native CRM and support integrations, and a sandbox they can test against today.</td></tr>
            <tr><td><b>CSM</b><br /><span className="sub">The daily user</span></td><td>Less admin, fewer surprises.</td><td>One place to see what changed and what to do next, and QBR prep in minutes instead of an afternoon.</td></tr>
          </tbody>
        </table></div>

        <h2 id="messaging">Messaging</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Pillar</th><th>What we say</th><th>Proof to show</th></tr></thead>
          <tbody>
            <tr><td><b>Know early</b></td><td>Churn signals are spread across four systems. Kova brings them together and flags the account the day it slips, not the week of renewal.</td><td>Play the &ldquo;Customer at risk&rdquo; scenario and let the alert email land.</td></tr>
            <tr><td><b>Know why</b></td><td>A score without a reason is just a colour. Every Kova score shows what drove it and what to do next.</td><td>The score breakdown and the suggested next step.</td></tr>
            <tr><td><b>Live in days</b></td><td>Connect the tools you already have and Kova scores your book of business the same week.</td><td>The API docs and the API Explorer.</td></tr>
            <tr><td><b>Grow what&apos;s working</b></td><td>Health isn&apos;t only about risk. Kova spots accounts ready to expand, and turns their data into a QBR.</td><td>The &ldquo;Customer thriving&rdquo; scenario and the QBR draft.</td></tr>
          </tbody>
        </table></div>

        <h2 id="discovery">Discovery: L1 to L3</h2>
        <p>
          Customers open with a symptom. Work through three levels before qualifying or demoing, and use Five Whys to
          get from the first to the second. <Link href="/before-after">See it applied to Haulio</Link>, with the
          workflow before and after Kova.
        </p>
        <div className="table-scroll"><table>
          <thead><tr><th>Level</th><th>What you&apos;re after</th><th>Questions that get there</th><th>Usually from</th></tr></thead>
          <tbody>
            <tr><td><b>L1 · Symptom</b></td><td>The pain in the customer&apos;s own words, and what triggered the call now</td><td>What made you look at this now? What happened last time it went wrong? Talk me through a recent example.</td><td>A CSM or the Head of CS</td></tr>
            <tr><td><b>L2 · Root cause</b></td><td>The process, tools or hand-offs causing it. This is what Kova has to fix</td><td>Walk me through how you review accounts today, step by step. Where does the data come from? Who does it, how often, and how long does it take? What gets skipped when the team is busy?</td><td>The Head of CS, CSMs, RevOps</td></tr>
            <tr><td><b>L3 · Business impact</b></td><td>What it costs, in numbers the business already tracks</td><td>What did those lost renewals cost? What&apos;s the retention target, and who owns it? What happens if nothing changes this year?</td><td>The CRO or COO</td></tr>
          </tbody>
        </table></div>
        <p>
          L1 gives you the story, L2 gives you the decision criteria, and L3 gives you the metrics and the economic
          buyer. A deal with only L1 is interest, not an opportunity.
        </p>

        <h2 id="meddpicc">Qualifying with MEDDPICC</h2>
        <p>What to find out, questions that get there, and what a qualified Kova deal looks like at each point.</p>
        <div className="table-scroll"><table>
          <thead><tr><th>Letter</th><th>Questions to ask</th><th>Good sign</th><th>Red flag</th></tr></thead>
          <tbody>
            <tr><td><b>Metrics</b></td><td>What&apos;s your gross revenue retention today, and what&apos;s the target? How many renewals did you lose last year without warning? How long does account review take each week?</td><td>A retention number and a target the CRO has signed up to</td><td>&ldquo;We don&apos;t really track churn&rdquo;</td></tr>
            <tr><td><b>Economic buyer</b></td><td>Who owns the retention number? Who signed off your last CS tool? Would they join a 20-minute call on the business case?</td><td>The CRO has been named and has agreed to a call</td><td>Only the Head of CS is involved and can&apos;t get time with anyone above</td></tr>
            <tr><td><b>Decision criteria</b></td><td>What does a good outcome look like in 90 days? Which tools must it connect to? What went wrong with the last tool you tried?</td><td>Criteria that match our strengths: explainability, speed to live, API</td><td>A checklist copied from a large suite, with journeys and surveys as must-haves</td></tr>
            <tr><td><b>Decision process</b></td><td>Once you&apos;re happy, what happens next? Who else needs to see it? Is there a technical review?</td><td>Clear steps and dates: evaluation, technical validation, business case, signature</td><td>&ldquo;We&apos;ll decide when we&apos;ve seen everyone&rdquo;</td></tr>
            <tr><td><b>Paper process</b></td><td>Does legal need a DPA? Is there a security questionnaire? Who signs, and does procurement need three quotes?</td><td>Security, legal and procurement steps mapped, with owners</td><td>Paperwork discovered in the last week of the quarter</td></tr>
            <tr><td><b>Identify pain</b></td><td>Tell me about the last renewal you lost. When did you first know? What did it cost?</td><td>A specific account, a specific amount and a clear &ldquo;we found out too late&rdquo;</td><td>General interest in &ldquo;being more data-driven&rdquo;</td></tr>
            <tr><td><b>Champion</b></td><td>Would you take this to your CRO? What would you need from me to do that?</td><td>They&apos;ll sell it internally and give us access to the economic buyer</td><td>Friendly, but won&apos;t share information or set up meetings</td></tr>
            <tr><td><b>Competition</b></td><td>What else are you looking at? What happens if you do nothing this year?</td><td>We know the alternatives, including staying on spreadsheets</td><td>A late-stage evaluation where we were brought in to make up the numbers</td></tr>
          </tbody>
        </table></div>

        <h2 id="battlecard">Battlecard</h2>
        <p className="sub">These are positioning notes for a fictional product, not a review of the real products named.</p>
        <div className="table-scroll"><table>
          <thead><tr><th>Up against</th><th>Where they&apos;re strong</th><th>Where Kova wins</th><th>Landmine question</th></tr></thead>
          <tbody>
            <tr><td><b>Gainsight</b></td><td>The broadest platform in the category, and the safe choice for large CS organisations with admins to run it</td><td>Time to value and simplicity for a team without a CS operations function</td><td>&ldquo;Who on your team will own configuring and maintaining it?&rdquo;</td></tr>
            <tr><td><b>ChurnZero</b></td><td>Well established with mid-market CS teams, and strong on in-app engagement</td><td>Scores that explain themselves, and an API-first approach for teams that already have their own engagement tools</td><td>&ldquo;When a score changes, can your CSMs see exactly why?&rdquo;</td></tr>
            <tr><td><b>Vitally</b></td><td>Modern, well liked by CSMs, with good workspace and collaboration features</td><td>Focus: early warning and next steps, without asking the team to move their daily work into a new workspace</td><td>&ldquo;Do you want a new place for CSMs to work, or better signals in the places they already work?&rdquo;</td></tr>
            <tr><td><b>CRM health fields and spreadsheets</b></td><td>Free, familiar and already there</td><td>Signals from support, usage and billing in one score, updated as things happen rather than once a week</td><td>&ldquo;How did the last surprise churn look in the spreadsheet the week before?&rdquo;</td></tr>
          </tbody>
        </table></div>

        <h2 id="objections">Objection handling</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>What they say</th><th>What&apos;s usually behind it</th><th>How to respond</th></tr></thead>
          <tbody>
            <tr><td>&ldquo;We already have a health score in HubSpot.&rdquo;</td><td>They&apos;ve tried a simple score and don&apos;t trust it</td><td>Ask how it did before the last churn. Then show how Kova explains each score, and that it can write back to HubSpot so reps keep working there.</td></tr>
            <tr><td>&ldquo;We&apos;re too small for this.&rdquo;</td><td>Cost, and fear of another tool to maintain</td><td>Kova is priced for teams from 3 CSMs and is live in days. Put a number on one saved renewal against the annual cost.</td></tr>
            <tr><td>&ldquo;Our data is a mess.&rdquo;</td><td>Worry the project will stall</td><td>Start with two sources, usually CRM and support. The score shows what&apos;s missing instead of hiding it, and gets better as sources are added.</td></tr>
            <tr><td>&ldquo;Scores don&apos;t work, CSMs ignore them.&rdquo;</td><td>A past tool cried wolf</td><td>That&apos;s why Kova only alerts when an account drops a band and always says why. Show the alert rules.</td></tr>
            <tr><td>&ldquo;Let&apos;s revisit next quarter.&rdquo;</td><td>No urgency, or no economic buyer</td><td>Go back to the pain: which renewals are due next quarter? Offer a two-week pilot on those accounts only.</td></tr>
          </tbody>
        </table></div>

        <h2 id="pricing">Pricing and why</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Plan</th><th>Who it&apos;s for</th><th>Includes</th></tr></thead>
          <tbody>
            <tr><td><b>Starter</b></td><td>Up to 5 CSMs, up to 150 accounts</td><td>Health scoring, alerts, 2 native integrations, API access</td></tr>
            <tr><td><b>Growth</b></td><td>Up to 20 CSMs, up to 600 accounts</td><td>Everything in Starter, all integrations, QBR drafting, custom score weights</td></tr>
            <tr><td><b>Scale</b></td><td>Larger teams</td><td>Everything in Growth, SSO, data residency options, dedicated onboarding</td></tr>
          </tbody>
        </table></div>
        <ul>
          <li><b>Priced by accounts monitored, with CSM seats included.</b> Charging per seat would push teams to share logins and keep managers out, which is the opposite of what we want.</li>
          <li><b>Annual contracts.</b> Health scoring needs a few months of history to show its worth, and it matches how our customers buy.</li>
          <li><b>API on every plan.</b> Our technical buyer is often the deciding voice, and gating the API would lose us the technical validation.</li>
        </ul>

        <h2 id="demo">Demo playbook</h2>
        <p>Run discovery first, then shape the demo around what you heard. The standard flow, about 20 minutes live:</p>
        <ol>
          <li><b>Play back L1, L2 and L3</b> (2 min): their symptom, the cause underneath it, and what it costs them. Get a nod before you share your screen.</li>
          <li><b>Start from their pain, not the menu</b> (5 min): open an account, play &ldquo;Customer at risk&rdquo;, show the score move, the reasons and the next step.</li>
          <li><b>Make it real</b> (3 min): let the alert email land in their own inbox. Ask for an email address at the start of the call.</li>
          <li><b>Answer the technical question before it&apos;s asked</b> (5 min): send an event through the API Explorer and show the integration log. For RevOps, show the docs and the error handling.</li>
          <li><b>Show the upside</b> (3 min): &ldquo;Customer thriving&rdquo;, the expansion prompt, and a QBR drafted from the data.</li>
          <li><b>Close on next steps</b> (2 min): tie back to their decision criteria and agree a date for technical validation with a sandbox key of their own.</li>
        </ol>
        <p>
          Before any demo: create a fresh sandbox with the prospect&apos;s email ready, reset the demo, and close every other tab.
          The live product is on the <Link href="/kova">Kova page</Link>.
        </p>
      </div>
    </main>
  );
}
