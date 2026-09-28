import Link from "next/link";
import Routes from "./Routes";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="who">{site.name}. {site.role}, {site.location}.</p>
            <h1>I make complex software make sense to the people buying it, then help them get it working.</h1>
            <p className="lede">
              Seven years in pre-sales and implementation across SaaS, AI, cloud and RegTech, working with customers
              across EMEA. Most of that time has been at early-stage companies with no playbook yet, so I&apos;ve built
              demo environments, enablement programmes and integrations from scratch. I&apos;m now moving towards
              technical product marketing.
            </p>
            <p className="lede">
              Client work is confidential, so I built a product to show you how I work: something you can use,
              an API you can call, and the thinking behind both.
            </p>
            <div className="ctas">
              <Link className="btn accent" href="/kova">Try Kova</Link>
              {site.cvUrl ? <a className="btn ghost" href={site.cvUrl}>Download CV</a> : null}
              {site.linkedin ? <a className="btn ghost" href={site.linkedin}>LinkedIn</a> : null}
            </div>
          </div>
          {site.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="portrait" src={site.photoUrl} alt={`Photo of ${site.name}`} width={440} height={550} />
          ) : null}
        </div>
      </section>

      <section className="section" id="results">
        <div className="wrap">
          <h2>A few things I&apos;ve built</h2>
          <ul className="results">
            <li><b>Sales enablement, from nothing</b><p>Built Kinsta&apos;s global technical sales enablement function: playbooks, certification paths, demo environments and competitive material.</p></li>
            <li><b>20% faster RFP responses</b><p>Built an AI-powered RFP and RFI system at Kentico in Python, with LLM drafting and human review built in.</p></li>
            <li><b>Risk-scoring engines</b><p>Wrote configurable KYB risk-scoring logic in JavaScript at Dotfile, turning client risk matrices into automated onboarding decisions.</p></li>
            <li><b>15% better enterprise conversion</b><p>At Kentico, by tying every demo to the customer&apos;s own digital experience goals.</p></li>
            <li><b>Data POCs on real telematics</b><p>SQL and Python proofs of concept at Wejo that let fleet and smart city customers query connected vehicle data.</p></li>
            <li><b>22% more output</b><p>Redesigned steel and composite production lines at Fusion Building Systems using Lean Six Sigma.</p></li>
          </ul>
        </div>
      </section>

      <section className="section" id="route">
        <div className="wrap">
          <h2>What are you hiring for?</h2>
          <p className="intro">Pick one and I&apos;ll point you to the work that matters for that role. Everything marked live works right now.</p>
          <Routes />
        </div>
      </section>

      <section className="section" id="skills">
        <div className="wrap">
          <h2>Skills</h2>
          <p className="intro">The short version. The full list is on my CV.</p>
          <div className="skills">
            <div><h3>Pre-sales and discovery</h3><p>Technical discovery, MEDDIC, demo strategy, POC and POV design, ROI validation, RFPs and security questionnaires</p></div>
            <div><h3>Integrations and APIs</h3><p>REST, webhooks, OAuth, JSON, GraphQL, Postman, Salesforce and HubSpot integrations, n8n, Make, Zapier</p></div>
            <div><h3>AI</h3><p>LLM workflow design, RAG, prompt engineering, AI output QA, Claude, ChatGPT, Claude Code</p></div>
            <div><h3>Cloud and data</h3><p>AWS, Azure, Kubernetes, Snowflake, Databricks, SQL, Python, Tableau, Power BI, Looker</p></div>
            <div><h3>Implementation and customer success</h3><p>Implementation workshops, onboarding and phased rollouts, enablement programmes, Gainsight, Zendesk, Intercom</p></div>
            <div><h3>Product marketing</h3><p>Positioning, competitive battlecards, sales enablement content, turning field feedback into roadmap and messaging</p></div>
            <div><h3>Security and compliance</h3><p>SSO, SAML, Okta, Entra ID, KYC, KYB, AML, sanctions and PEP screening, PCI DSS</p></div>
            <div><h3>Web and CMS</h3><p>Next.js, HTML, CSS, JavaScript, headless CMS, Kentico, WordPress, Drupal, GitHub</p></div>
          </div>
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
              I started in education in Dubai, as part of the first team teaching a new Creative Design and Innovation
              course, then worked as a design and manufacturing engineer before moving into pre-sales. The thread
              through all of it is explaining how something works to people who need to decide whether to trust it.
            </p>
            <p className="intro">
              I&apos;m looking for solutions engineering, customer success and technical product marketing roles at
              SaaS and AI companies, in the UK or remote.
            </p>
            <div className="ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {site.email ? <a className="btn" href={`mailto:${site.email}`}>Email me</a> : null}
              {site.linkedin ? <a className="btn ghost" href={site.linkedin}>LinkedIn</a> : null}
              {site.cvUrl ? <a className="btn ghost" href={site.cvUrl}>Download CV</a> : null}
            </div>
          </div>
          <dl className="facts">
            <div><dt>Experience</dt><dd>7+ years in pre-sales and implementation, EMEA</dd></div>
            <div><dt>Education</dt><dd>BEng Design and Manufacturing Engineering, Southampton Solent</dd></div>
            <div><dt>Certifications</dt><dd>Azure AI Fundamentals, Azure Fundamentals, MEDDIC, HubSpot Sales Enablement</dd></div>
            <div><dt>Methods</dt><dd>MEDDIC, Lean Six Sigma Yellow Belt</dd></div>
            <div><dt>Languages</dt><dd>English, Igbo, conversational French</dd></div>
            <div><dt>Based in</dt><dd>{site.location}</dd></div>
          </dl>
        </div>
      </section>
    </main>
  );
}
