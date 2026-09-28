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
            <h1>I get complex software bought, rolled out and actually used.</h1>
            <p className="lede">
              Senior solutions engineer with 7+ years across SaaS, AI, RegTech and deep-tech startups in EMEA.
              I&apos;ve mostly joined companies at founding or pre-scale stage, where there was no playbook yet,
              and built the functions, tooling and processes myself.
            </p>
            <p className="lede">
              I work end to end: discovery and demos, API and CRM integrations, Python and JavaScript automation,
              and LLM-powered tools with human review built in. Then I stay through rollout, training and adoption.
            </p>
            <div className="ctas">
              <Link className="btn accent" href="/kova">Try Kova</Link>
              {site.linkedin ? <a className="btn ghost" href={site.linkedin}>LinkedIn</a> : null}
              {site.email ? <a className="btn ghost" href={`mailto:${site.email}`}>Email me</a> : null}
            </div>
          </div>
          {site.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="portrait" src={site.photoUrl} alt={`Photo of ${site.name}`} width={440} height={550} />
          ) : null}
        </div>
      </section>

      <section className="section" id="what-i-do">
        <div className="wrap">
          <h2>What I do</h2>
          <p className="intro">Five things I&apos;m hired for, and what they&apos;ve looked like in practice.</p>
          <div className="pillars">
            <div>
              <h3>Technical pre-sales</h3>
              <p>Discovery that finds the real problem, demos built around it, POCs that prove it, and the ROI case that gets it signed.</p>
              <ul>
                <li>Lifted enterprise conversion 15% by tying every demo to the customer&apos;s own outcomes</li>
                <li>Closed $200k+ in enterprise revenue through consultative discovery and ROI validation</li>
                <li>Run RFP, RFI and security questionnaire responses for regulated buyers</li>
              </ul>
            </div>
            <div>
              <h3>Integrations and implementation</h3>
              <p>I map how a process really runs with the people doing it, then design and deliver the future state.</p>
              <ul>
                <li>API integrations across Salesforce, HubSpot, Pipedrive and Google Workspace</li>
                <li>Identity and compliance providers including Onfido, Veriff, Checkout.com and ComplyAdvantage</li>
                <li>Implementation workshops and phased rollouts for enterprise clients</li>
              </ul>
            </div>
            <div>
              <h3>AI and automation</h3>
              <p>Working tools, not slideware. I build day to day with Claude Code and AI coding agents.</p>
              <ul>
                <li>An LLM-powered RFP tool with human review that cut response time 20%</li>
                <li>Configurable risk-scoring engines in JavaScript for regulated onboarding</li>
                <li>RAG, structured output, tool calling and output evaluation</li>
              </ul>
            </div>
            <div>
              <h3>Sales enablement</h3>
              <p>Giving sales teams what they need to run technical conversations without me in the room.</p>
              <ul>
                <li>Built a global technical sales enablement function from scratch</li>
                <li>Playbooks, certification paths, demo environments and competitive battlecards</li>
                <li>Technical narratives and positioning grounded in what customers actually said</li>
              </ul>
            </div>
            <div>
              <h3>Customer success and adoption</h3>
              <p>A signed deal isn&apos;t the finish line. Usage is.</p>
              <ul>
                <li>Post-go-live enablement that got non-technical teams using what they&apos;d bought</li>
                <li>Repeatable deployment playbooks that shortened time to value</li>
                <li>Field feedback turned into structured requests for Product and Engineering</li>
              </ul>
            </div>
          </div>
          <p className="industries">Industries: SaaS, AI, fintech and payments, RegTech, enterprise CMS, cloud hosting, connected vehicle data and network security.</p>
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
          <div className="skills">
            <div><h3>Solutions engineering</h3><p>Technical discovery, strategy workshops, POC and POV design, enterprise demos, solution architecture, ROI validation, MEDDIC</p></div>
            <div><h3>Integrations and APIs</h3><p>REST APIs, SDKs, webhooks, OAuth, JSON, GraphQL, MCP connectors, Postman, sandbox testing, Salesforce integration</p></div>
            <div><h3>AI engineering</h3><p>LLMs, RAG, prompt engineering, structured output, tool calling, agentic workflows, output evaluation and QA</p></div>
            <div><h3>AI and automation tools</h3><p>Claude Code, Cursor, GitHub Copilot, Claude, ChatGPT, n8n, Make, Zapier, Replit, Lovable</p></div>
            <div><h3>Engineering, cloud and data</h3><p>Python, JavaScript, SQL, git, CI/CD, AWS, Kubernetes, Snowflake, Databricks, Datadog, Grafana, Tableau, Power BI, Looker</p></div>
            <div><h3>Fintech and compliance</h3><p>KYB, KYC, AML, CDD and EDD, UBO analysis, sanctions and PEP screening, risk scoring, PCI DSS, payment flows</p></div>
            <div><h3>Security and identity</h3><p>SSO, MFA, SAML, Okta, Entra ID, sensitive data handling</p></div>
            <div><h3>Enablement and delivery</h3><p>Playbooks, certification paths, demo environments, battlecards, implementation playbooks, user training, rollout and adoption tracking</p></div>
            <div><h3>Business systems</h3><p>Salesforce, HubSpot, MS Dynamics, Pipedrive, Jira, Confluence, Notion, Linear, Zendesk, Intercom, Gainsight, Figma</p></div>
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
              in their own terms. I&apos;ve also worked in the UAE, and I know the MENA market as well as Europe.
            </p>
            <div className="ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {site.email ? <a className="btn" href={`mailto:${site.email}`}>Email me</a> : null}
              {site.linkedin ? <a className="btn ghost" href={site.linkedin}>LinkedIn</a> : null}
            </div>
          </div>
          <dl className="facts">
            <div><dt>Experience</dt><dd>7+ years in solutions engineering, pre-sales and implementation</dd></div>
            <div><dt>Focus</dt><dd>Solutions engineering, implementation, customer success and sales enablement</dd></div>
            <div><dt>Regions</dt><dd>UK, Europe and MENA</dd></div>
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
