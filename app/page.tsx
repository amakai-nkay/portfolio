import Link from "next/link";
import Routes from "./Routes";
import Skills from "./Skills";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="who">{site.name}. {site.role}, {site.location}.</p>
            <h1>I help businesses understand, evaluate and successfully adopt complex software.</h1>
            <p className="lede">
              I&apos;m a Senior Solutions Engineer with 7+ years of experience across SaaS, AI, RegTech, connected data
              and manufacturing. My work sits at the intersection of technology, sales and customer success, spanning
              technical discovery, enterprise demonstrations, solution architecture, APIs, integrations and implementation.
            </p>
            <p className="lede">
              I&apos;ve also built technical sales enablement functions, automated internal processes and developed
              reusable demos, integrations and playbooks. Much of my experience has been in early-stage and scaling
              environments, where I&apos;ve helped establish the tools and processes needed to support technical
              evaluations, bring products to market and drive customer adoption.
            </p>
            <div className="ctas">
              <Link className="btn accent" href="/kova">Try Kova</Link>
              <Link className="btn ghost" href="/#demo">Watch the demo</Link>
              {site.linkedin ? <a className="btn ghost" href={site.linkedin}>LinkedIn</a> : null}
              {site.email ? <a className="btn ghost" href={`mailto:${site.email}`}>Email me</a> : null}
            </div>
          </div>
          {site.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="portrait" src={site.photoUrl} alt={`Photo of ${site.name}`} width={440} height={550} />
          ) : null}
        </div>
        <div className="wrap">
          <ul className="wins" aria-label="Selected results">
            <li><b>$200k+</b><span>Enterprise revenue closed</span><small>Through consultative technical discovery, solution architecture and ROI validation</small></li>
            <li><b>20%</b><span>Faster RFP and RFI responses</span><small>From an AI-powered automation tool I built in Python, with human review</small></li>
            <li><b>22%</b><span>Increase in production output</span><small>Through Lean Six Sigma process improvement on steel and composite production lines</small></li>
            <li><b>3 · 6 · 10</b><span>Certification tracks, demo frameworks and playbooks</span><small>Built Kinsta&apos;s global technical sales enablement function from the ground up, standardising technical sales across global teams</small></li>
          </ul>
        </div>
      </section>

      <section className="section" id="kova">
        <div className="wrap split">
          <div>
            <h2>Meet Kova</h2>
            <p className="intro">
              Client work stays confidential, so I built a company to show you how I work. Kova is fictional.
              The product, its API and its integrations are real, and you can use them.
            </p>
            <p className="intro">
              Kova is a customer health platform for B2B SaaS companies. It connects to the places where churn
              shows up first (product usage, support tickets, the CRM and billing), scores every account, explains
              the score, and tells the customer success manager what to do before renewal comes round.
            </p>
            <Link className="btn accent" href="/kova">Try it with a sandbox account</Link>
          </div>
          <div className="kova-card">
            <div className="kova-mark"><i />Kova</div>
            <dl className="kova-facts">
              <div><dt>What it sells</dt><dd>Customer health scoring, at-risk alerts and QBR drafting</dd></div>
              <div><dt>Who buys it</dt><dd>Heads of Customer Success at SaaS companies with 50 to 500 customers, where each CSM has too many accounts to watch by hand</dd></div>
              <div><dt>The problem</dt><dd>Churn signals are spread across four systems, so CSMs find out an account is at risk when it&apos;s already too late</dd></div>
              <div><dt>Up against</dt><dd>Gainsight, ChurnZero and Vitally</dd></div>
              <div><dt>Why Kova wins</dt><dd>Every score comes with its reasons, it&apos;s API-first, and it&apos;s live in days rather than a quarter-long rollout</dd></div>
              <div><dt>The company</dt><dd>London-based, founded 2023, around 45 people, Series A. All made up.</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section" id="route">
        <div className="wrap">
          <h2>What are you hiring for?</h2>
          <p className="intro">Pick one and I&apos;ll point you to the work that matters for that role. Everything marked live works right now.</p>
          <Routes />
        </div>
      </section>

      <section className="section" id="demo">
        <div className="wrap split">
          <div>
            <h2>Watch me demo it</h2>
            <p className="intro">
              A walkthrough built the way I&apos;d run a real one: discovery first, then a demo shaped around what
              the prospect said matters. The prospect is a Head of Customer Success three weeks before a big renewal.
            </p>
          </div>
          <div className="video">
            {site.demoVideoUrl
              ? <video controls preload="metadata" poster={site.demoPosterUrl || undefined}><source src={site.demoVideoUrl} type="video/mp4" /></video>
              : <p>Recording in progress. In the meantime, the live product is one click away.</p>}
          </div>
        </div>
      </section>

      <section className="section" id="skills">
        <div className="wrap">
          <h2>Skills</h2>
          <p className="intro">
            Six core capabilities first, then the full toolkit behind them. Industries I&apos;ve worked in: SaaS, AI,
            RegTech, fintech and payments, IoT and connected-vehicle data, enterprise software and manufacturing.
          </p>
          <Skills />
        </div>
      </section>

      <section className="section" id="work">
        <div className="wrap">
          <h2>The rest of the work</h2>
          <p className="intro">Each piece is built around Kova, so you can check the thinking against the product.</p>
          <ul className="worklist">
            <li><Link href="/kova"><span className="status live">Live</span><h3>Kova sandbox</h3><p>Health scoring, alerts, integration log and QBR drafts.</p></Link></li>
            <li><Link href="/kova/docs"><span className="status live">Live</span><h3>API reference</h3><p>Endpoints, auth, errors and copy-paste requests.</p></Link></li>
            <li><span className="status soon">Coming soon</span><h3>Discovery and demo plan</h3><p>The MEDDIC-based discovery behind the demo video.</p></li>
            <li><span className="status soon">Coming soon</span><h3>Implementation and success plan</h3><p>How I&apos;d take a new Kova customer from signature to renewal.</p></li>
            <li><span className="status soon">Coming soon</span><h3>Sales enablement kit</h3><p>Positioning, competitive battlecard, objection handling and a demo playbook for Kova&apos;s sales team.</p></li>
            <li><span className="status soon">Coming soon</span><h3>Architecture</h3><p>How Kova, the AI model, n8n and email fit together.</p></li>
          </ul>
        </div>
      </section>

      <section className="section" id="about">
        <div className="wrap split">
          <div>
            <h2>About me</h2>
            <p className="intro">
              I&apos;m a hands-on solutions engineer. I work out how a process really runs with the people doing it,
              design the solution, build what&apos;s needed to prove it, and stay through rollout and training until
              people actually use it. Most recently that&apos;s been for fintech and payments compliance teams handling
              sensitive KYB, KYC and AML data.
            </p>
            <p className="intro">
              I&apos;ve worked across enterprise CMS, cloud hosting, connected vehicle data, network security, AI and
              RegTech, so I pick up new domains quickly and can talk to engineers, operations teams and executives
              in their own terms. I&apos;ve worked with customers across EMEA and the Americas, and spent two years living and working in the UAE.
            </p>
            <div className="ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {site.email ? <a className="btn" href={`mailto:${site.email}`}>Email me</a> : null}
              {site.linkedin ? <a className="btn ghost" href={site.linkedin}>LinkedIn</a> : null}
            </div>
          </div>
          <dl className="facts">
            <div><dt>Experience</dt><dd>7+ years in solutions engineering, pre-sales and implementation</dd></div>
            <div><dt>Focus</dt><dd>Solutions engineering, implementation, customer success and sales enablement</dd></div>
            <div><dt>Regions</dt><dd>EMEA and the Americas, including MENA</dd></div>
            <div><dt>Certifications</dt><dd>Azure AI Fundamentals, Azure Fundamentals, MEDDIC, HubSpot Sales Enablement, Lean Six Sigma Yellow Belt</dd></div>
            <div><dt>Education</dt><dd>BEng, Southampton Solent University</dd></div>
            <div><dt>Languages</dt><dd>English, Igbo, conversational French</dd></div>
            <div><dt>Based in</dt><dd>{site.location}</dd></div>
          </dl>
        </div>
      </section>
    </main>
  );
}
