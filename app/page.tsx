import Link from "next/link";
import Routes from "./Routes";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="wrap">
          <p className="who">{site.name}. {site.role}.</p>
          <h1>I work out what a customer needs, then show them how the product gets them there.</h1>
          <p className="lede">
            Seven years in enterprise pre-sales across SaaS, security, cloud, IoT and AI, mostly with customers
            across EMEA. I started out as a design and manufacturing engineer, so I still like to know how things
            actually work. Client work is confidential, so I built my own product to show you how I work.
          </p>
          <div className="ctas">
            <Link className="btn accent" href="/kova">Try Kova</Link>
            <Link className="btn ghost" href="#demo">Watch the demo</Link>
            {site.cvUrl ? <a className="btn ghost" href={site.cvUrl}>Download CV</a> : null}
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

      <section className="section" id="kova">
        <div className="wrap split">
          <div>
            <h2>Kova</h2>
            <p className="intro">
              Kova tells a customer success team which accounts need attention, and why, before renewal comes round.
              It&apos;s a made-up company, but the product works: it scores account health from real events,
              has its own API, and sends alerts through n8n and email when an account slips.
            </p>
            <p className="intro">Every visitor gets their own sandbox with a fictional customer, Brightline Logistics. Break it and see what happens.</p>
            <Link className="btn accent" href="/kova">Open a sandbox</Link>
          </div>
          <div className="kova-card">
            <div className="kova-mark"><i />Kova</div>
            <p style={{ margin: 0, color: "var(--muted)" }}>What happens when you use it</p>
            <ol className="flow" style={{ marginTop: 16 }}>
              <li><span>01</span>You send an event, from a button or with your own API call</li>
              <li><span>02</span>Kova replays the account&apos;s history and rescores it</li>
              <li><span>03</span>If the account drops a band, an AI model writes a summary for the CSM</li>
              <li><span>04</span>n8n emails that summary to you, and every call shows in the integration log</li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section" id="demo">
        <div className="wrap split">
          <div>
            <h2>Watch me demo it</h2>
            <p className="intro">
              A walkthrough built the way I&apos;d run a real one: discovery first, then a demo shaped around what
              the prospect said matters to them. The prospect is Brightline&apos;s Head of Operations, three weeks before renewal.
            </p>
          </div>
          <div className="video">
            {site.demoVideoUrl
              ? <video controls preload="metadata" poster={site.demoPosterUrl || undefined}><source src={site.demoVideoUrl} type="video/mp4" /></video>
              : <p>Recording in progress. In the meantime, the live product is one click away.</p>}
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="wrap">
          <h2>The rest of the work</h2>
          <p className="intro">Each piece is built around Kova, so you can check the thinking against the product.</p>
          <ul className="worklist">
            <li><Link href="/kova"><span className="status live">Live</span><h3>Kova sandbox</h3><p>Health scoring, alerts, integration log and QBR drafts.</p></Link></li>
            <li><Link href="/kova/docs"><span className="status live">Live</span><h3>API reference</h3><p>Endpoints, auth, errors and copy-paste requests.</p></Link></li>
            <li><span className="status soon">Coming soon</span><h3>Product marketing</h3><p>Positioning, ICP, messaging, battlecard, pricing and launch plan.</p></li>
            <li><span className="status soon">Coming soon</span><h3>Customer success playbook</h3><p>Onboarding plan, success plan and a sample QBR for Brightline.</p></li>
            <li><span className="status soon">Coming soon</span><h3>Discovery and demo plan</h3><p>The MEDDIC-based discovery behind the demo video.</p></li>
            <li><span className="status soon">Coming soon</span><h3>Architecture</h3><p>How Kova, the AI model, n8n and email fit together.</p></li>
          </ul>
        </div>
      </section>

      <section className="section" id="about">
        <div className="wrap split">
          <div>
            <h2>About me</h2>
            <p className="intro">
              My career started in education in Dubai, helping launch a new Creative Design and Innovation course,
              then moved to engineering, then into pre-sales for enterprise software. The thread through all of it is
              explaining how something works to people who need to decide whether to trust it.
            </p>
            <div className="ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {site.email ? <a className="btn" href={`mailto:${site.email}`}>Email me</a> : null}
              {site.linkedin ? <a className="btn ghost" href={site.linkedin}>LinkedIn</a> : null}
              {site.cvUrl ? <a className="btn ghost" href={site.cvUrl}>Download CV</a> : null}
            </div>
          </div>
          <dl className="facts">
            <div><dt>Experience</dt><dd>7+ years enterprise pre-sales, EMEA</dd></div>
            <div><dt>Background</dt><dd>BEng, design and manufacturing engineering</dd></div>
            <div><dt>Certifications</dt><dd>AWS Cloud Technology Consultant, Azure Fundamentals, Azure AI Fundamentals</dd></div>
            <div><dt>Methods</dt><dd>MEDDIC, Lean Six Sigma Yellow Belt</dd></div>
            <div><dt>Based in</dt><dd>{site.location}</dd></div>
            <div><dt>Looking for</dt><dd>Solutions engineering, customer success and technical product marketing roles</dd></div>
          </dl>
        </div>
      </section>
    </main>
  );
}
