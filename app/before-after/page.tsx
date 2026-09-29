import Link from "next/link";

export const metadata = { title: "From symptom to impact: Haulio before and after Kova" };

const LANE_H = 76, TOP = 16, LABEL_W = 118;

function Lanes({ labels, width }: { labels: string[]; width: number }) {
  return (
    <g>
      {labels.map((l, i) => (
        <g key={l}>
          <rect x="0" y={TOP + i * LANE_H} width={width} height={LANE_H} fill={i % 2 ? "var(--surface)" : "var(--bg)"} stroke="var(--line)" />
          <text x="12" y={TOP + i * LANE_H + LANE_H / 2 + 5} fontSize="13" fontWeight="600" fill="var(--ink)" fontFamily="var(--body)">{l}</text>
        </g>
      ))}
      <line x1={LABEL_W - 8} x2={LABEL_W - 8} y1={TOP} y2={TOP + labels.length * LANE_H} stroke="var(--line)" />
    </g>
  );
}

function Step({ x, lane, w, t, s, tone = "plain" }: { x: number; lane: number; w: number; t: string; s?: string; tone?: "plain" | "kova" | "bad" }) {
  const y = TOP + lane * LANE_H + 12;
  const fill = tone === "kova" ? "var(--accent)" : "var(--surface)";
  const stroke = tone === "kova" ? "var(--accent)" : tone === "bad" ? "var(--red)" : "#B9BEC6";
  return (
    <g>
      <rect x={x} y={y} width={w} height={LANE_H - 24} rx="8" fill={fill} stroke={stroke} strokeWidth={tone === "bad" ? 1.6 : 1.2} />
      <text x={x + 10} y={y + 21} fontSize="12.5" fontWeight="600" fill={tone === "kova" ? "#fff" : "var(--ink)"} fontFamily="var(--body)">{t}</text>
      {s ? <text x={x + 10} y={y + 38} fontSize="11.5" fill={tone === "kova" ? "#E6E9FB" : "var(--muted)"} fontFamily="var(--body)">{s}</text> : null}
    </g>
  );
}

function Badge({ x, y, n, good = false }: { x: number; y: number; n: number; good?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="11" fill={good ? "var(--green)" : "var(--red)"} />
      <text x={x} y={y + 4} fontSize="12" fontWeight="700" fill="#fff" textAnchor="middle" fontFamily="var(--body)">{n}</text>
    </g>
  );
}

const Arrow = ({ d, dashed = false }: { d: string; dashed?: boolean }) => (
  <path d={d} fill="none" stroke="var(--muted)" strokeWidth="1.4" strokeDasharray={dashed ? "5 4" : undefined} markerEnd="url(#ah)" />
);
const Defs = () => (
  <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0L10,5L0,10z" fill="var(--muted)" /></marker></defs>
);
const svgStyle = { width: "100%", minWidth: 720, height: "auto", display: "block" } as const;

function Before() {
  const W = 940;
  return (
    <svg viewBox={`0 0 ${W} ${TOP * 2 + 4 * LANE_H}`} style={svgStyle} role="img"
      aria-label="Before Kova: each CSM pulls four tools by hand into a spreadsheet, the manager reviews it weekly, and outreach happens days later">
      <Defs />
      <Lanes labels={["Tools", "CSM", "Head of CS", "Customer"]} width={W} />
      <Step x={126} lane={0} w={82} t="HubSpot" s="renewals" />
      <Step x={214} lane={0} w={82} t="Zendesk" s="tickets" />
      <Step x={302} lane={0} w={82} t="Segment" s="usage" />
      <Step x={390} lane={0} w={82} t="Stripe" s="invoices" />
      <Step x={126} lane={1} w={346} t="Logs into each tool, account by account" s="55 accounts, about 2 hours every Monday" tone="bad" />
      <Step x={494} lane={1} w={206} t="Copies it into a spreadsheet" s="colours each account by feel" tone="bad" />
      <Step x={600} lane={2} w={196} t="Weekly review of 6 spreadsheets" s="Tuesday, 1 hour, whole team" tone="bad" />
      <Step x={712} lane={3} w={214} t="CSM contacts the customer" s="days after the signal first showed" tone="bad" />
      {[167, 255, 343, 431].map(x => <Arrow key={x} d={`M${x},${TOP + LANE_H - 12} L${x},${TOP + LANE_H + 10}`} />)}
      <Arrow d={`M472,${TOP + LANE_H * 1.5} L492,${TOP + LANE_H * 1.5}`} />
      <Arrow d={`M640,${TOP + LANE_H * 2 - 12} L640,${TOP + LANE_H * 2 + 10}`} />
      <Arrow d={`M760,${TOP + LANE_H * 3 - 12} L760,${TOP + LANE_H * 3 + 10}`} />
      <Badge x={462} y={TOP + LANE_H + 12} n={1} />
      <Badge x={690} y={TOP + LANE_H + 12} n={2} />
      <Badge x={786} y={TOP + LANE_H * 2 + 12} n={3} />
      <Badge x={916} y={TOP + LANE_H * 3 + 12} n={4} />
    </svg>
  );
}

function After() {
  const W = 940;
  return (
    <svg viewBox={`0 0 ${W} ${TOP * 2 + 4 * LANE_H}`} style={svgStyle} role="img"
      aria-label="After Kova: the tools send events to Kova automatically, Kova scores and alerts the CSM, who acts the same day; the Monday review works from Kova's list">
      <Defs />
      <Lanes labels={["Systems", "CSM", "Head of CS", "Customer"]} width={W} />
      <Step x={124} lane={0} w={72} t="HubSpot" />
      <Step x={200} lane={0} w={72} t="Zendesk" />
      <Step x={276} lane={0} w={72} t="Segment" />
      <Step x={352} lane={0} w={64} t="Stripe" />
      <Step x={452} lane={0} w={272} t="Kova scores every account" s="as events arrive, same rules, with reasons" tone="kova" />
      <Step x={452} lane={1} w={252} t="Alert with reason and next step" s="only when an account drops a band" />
      <Step x={724} lane={1} w={202} t="Acts the same day" s="call, escalate or fix" />
      <Step x={170} lane={2} w={270} t="Monday: reviews Kova's ranked list" s="about 45 minutes, exceptions only" />
      <Step x={724} lane={3} w={202} t="Hears from the CSM" s="while there's time to fix it" />
      <Arrow d={`M416,${TOP + LANE_H / 2} L450,${TOP + LANE_H / 2}`} dashed />
      <text x="418" y={TOP + 24} fontSize="11" fill="var(--muted)" fontFamily="var(--body)">events</text>
      <Arrow d={`M588,${TOP + LANE_H - 12} L588,${TOP + LANE_H + 10}`} dashed />
      <Arrow d={`M704,${TOP + LANE_H * 1.5} L722,${TOP + LANE_H * 1.5}`} />
      <Arrow d={`M825,${TOP + LANE_H * 2 - 12} L825,${TOP + LANE_H * 3 + 10}`} />
      <Arrow d={`M470,${TOP + LANE_H - 12} C470,${TOP + LANE_H + 40} 305,${TOP + LANE_H + 40} 305,${TOP + LANE_H * 2 + 10}`} dashed />
      <Badge x={724} y={TOP + 12} n={1} good />
      <Badge x={704} y={TOP + LANE_H + 12} n={2} good />
      <Badge x={440} y={TOP + LANE_H * 2 + 12} n={3} good />
      <Badge x={926} y={TOP + LANE_H * 3 + 12} n={4} good />
    </svg>
  );
}

export default function BeforeAfter() {
  return (
    <main className="wrap docs">
      <aside aria-label="On this page">
        <a href="#levels">L1, L2, L3</a>
        <a href="#whys">Getting from L1 to L2</a>
        <a href="#before">Before Kova</a>
        <a href="#after">After Kova</a>
        <a href="#compare">What changes, level by level</a>
        <a href="#method">How I use this</a>
      </aside>
      <div>
        <div className="kova-mark"><i />Kova</div>
        <h1>From symptom to impact</h1>
        <p>
          Customers rarely open with their real problem. They open with a symptom. In discovery I work through three
          levels, from what the customer says, to why it&apos;s happening, to what it costs the business. This page
          applies that to Haulio, the customer in the Kova <Link href="/success-plan">success plan</Link>, and maps
          their workflow before and after Kova.
        </p>

        <h2 id="levels">L1, L2, L3</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Level</th><th>What we found at Haulio</th><th>Who says it</th><th>Where it feeds MEDDPICC</th></tr></thead>
          <tbody>
            <tr><td><b>L1 · Symptom</b><br /><span className="sub">The individual pain</span></td><td>&ldquo;We keep losing renewals we didn&apos;t see coming.&rdquo;</td><td>CSMs, and Rachel in the first call</td><td>Identify pain</td></tr>
            <tr><td><b>L2 · Root cause</b><br /><span className="sub">The operational problem, at team level</span></td><td>Account health signals sit in four tools. Each CSM pulls them by hand once a week and judges risk their own way, so warning signs are days old and inconsistent by the time anyone acts.</td><td>Rachel and RevOps</td><td>Decision criteria</td></tr>
            <tr><td><b>L3 · Business impact</b><br /><span className="sub">Why it matters commercially</span></td><td>£180k of renewals lost last quarter. Gross revenue retention at 88% against a 93% target. A renewal forecast the CRO can&apos;t rely on.</td><td>Daniel, the CRO</td><td>Metrics and economic buyer</td></tr>
          </tbody>
        </table></div>
        <p className="sub">Each level usually has a different owner. A deal sold only at L1 stalls when it reaches someone who cares about L3.</p>

        <h2 id="whys">Getting from L1 to L2</h2>
        <p>Five Whys, as it went in the Haulio discovery call:</p>
        <ol>
          <li><b>Why did you lose those renewals?</b> The customers had been unhappy for months, and we didn&apos;t act.</li>
          <li><b>Why didn&apos;t you act?</b> We didn&apos;t know until the renewal conversation.</li>
          <li><b>Why didn&apos;t you know?</b> The signs were there: usage falling, tickets piling up, a champion leaving. But they were spread across Segment, Zendesk and HubSpot.</li>
          <li><b>Why weren&apos;t they brought together?</b> Each CSM does it by hand once a week across 55 accounts, and in busy weeks it gets skipped.</li>
          <li><b>Why by hand?</b> Nothing joins the data up, and there&apos;s no shared definition of a healthy account.</li>
        </ol>
        <p>That last answer is the L2 root cause. It&apos;s what Kova has to fix, and it&apos;s where the before-and-after below starts.</p>

        <h2 id="before">Before Kova</h2>
        <div className="table-scroll"><Before /></div>
        <p className="sub">Red outlines are manual steps. Numbers mark the bottlenecks.</p>
        <ol>
          <li><b>Four tools, by hand.</b> About 2 hours per CSM every Monday, across 55 accounts. 12 CSM-hours a week for the team.</li>
          <li><b>Risk judged by feel.</b> Six CSMs, six definitions of &ldquo;at risk&rdquo;. Rachel can&apos;t compare accounts across the team.</li>
          <li><b>A weekly batch.</b> By Tuesday&apos;s review, a signal can be 7 days old. Anything that happens on a Wednesday waits almost a week.</li>
          <li><b>Late outreach.</b> Three hand-offs before anyone contacts the customer: tools to spreadsheet, spreadsheet to meeting, meeting to CSM. The lost renewals were spotted in their final weeks.</li>
        </ol>

        <h2 id="after">After Kova</h2>
        <div className="table-scroll"><After /></div>
        <p className="sub">Green numbers show where each bottleneck is removed. Dashed lines happen automatically.</p>
        <ol>
          <li><b>No manual pulls.</b> HubSpot, Zendesk, Segment and Stripe send events to Kova as things happen.</li>
          <li><b>One definition of risk.</b> Every account is scored by the same rules, calibrated against Haulio&apos;s own lost renewals, with the reasons shown.</li>
          <li><b>No waiting for Tuesday.</b> The alert reaches the CSM when the account slips. The Monday review covers exceptions, not data gathering.</li>
          <li><b>One hand-off.</b> Alert to CSM, same day, with a suggested next step.</li>
        </ol>

        <h2 id="compare">What changes, level by level</h2>
        <div className="table-scroll"><table>
          <thead><tr><th>Level</th><th>Measure</th><th>Before</th><th>After (90-day target)</th></tr></thead>
          <tbody>
            <tr><td><b>L1</b></td><td>Renewals lost without a warning first</td><td>3 last quarter</td><td>0</td></tr>
            <tr><td><b>L2</b></td><td>Monday review time per CSM</td><td>About 3 hours</td><td>Under 45 minutes</td></tr>
            <tr><td><b>L2</b></td><td>Age of a signal when someone sees it</td><td>Up to 7 days</td><td>Minutes</td></tr>
            <tr><td><b>L2</b></td><td>Hand-offs before the customer hears from us</td><td>3</td><td>1</td></tr>
            <tr><td><b>L2</b></td><td>At-risk alerts acted on within 2 working days</td><td>Not measured</td><td>80%</td></tr>
            <tr><td><b>L3</b></td><td>Gross revenue retention</td><td>88%</td><td>Trending to 93% within the year</td></tr>
          </tbody>
        </table></div>
        <p className="sub">Haulio and its numbers are fictional. The same measures are the ones the <Link href="/success-plan#goals">success plan</Link> reports against at 90 days.</p>

        <h2 id="method">How I use this</h2>
        <ul>
          <li><b>Start where the customer starts.</b> Write down their L1 in their own words. It&apos;s the line they&apos;ll recognise when you play it back.</li>
          <li><b>Ask why until you reach something a process or a tool causes.</b> That&apos;s L2, and it&apos;s what the product has to fix. Map the current workflow with the people who do it, and mark where time is lost, where hand-offs happen and where things get missed.</li>
          <li><b>Confirm L3 with the person who owns the number.</b> The impact has to be in their words and their figures, or the business case won&apos;t survive procurement.</li>
          <li><b>Play all three back before the demo.</b> Then show only what moves each level. The <Link href="/enablement#discovery">enablement kit</Link> has the questions I use at each level.</li>
        </ul>
      </div>
    </main>
  );
}
