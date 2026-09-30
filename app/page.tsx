import Link from "next/link";
import Routes from "./Routes";
import Terminal from "./Terminal";
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
            <li><b>Multi-million</b><span>Commercial and enterprise revenue impact</span><small>Influencing multi-million-dollar opportunities across EMEA and the Americas through technical discovery, solution architecture, proof-of-concept delivery and ROI validation</small></li>
            <li><b>15%</b><span>Higher enterprise conversion</span><small>From technical narratives tied to outcomes each customer defined</small></li>
            <li><b>20%</b><span>Faster RFP and RFI responses</span><small>From an AI-powered automation tool I built in Python, with human review</small></li>
            <li><b>Built from zero</b><span>Global technical sales enablement at Kinsta</span><small>3 certification tracks, 6 reusable demo frameworks and 10 technical sales playbooks, used across global teams</small></li>
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

      <section className="section" id="terminal">
        <div className="wrap term-grid">
          <div>
            <h2>Prefer the command line?</h2>
            <p className="intro">
              Everything in Kova also works from a terminal. This one runs in your browser against Kova&apos;s live API.
              Create a sandbox, check the score, send events and watch it change.
            </p>
            <p className="intro">
              Type <code>install</code> to get <code>kova.sh</code>, the Bash client I wrote, and run the same commands
              on your own Linux or macOS machine. The <Link href="/architecture#linux">architecture page</Link> shows how
              to run Kova itself on a Linux server.
            </p>
          </div>
          <Terminal />
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
            <li><span className="status soon">Coming soon</span><h3>Demo video</h3><p>A recorded walkthrough of Kova for a Head of Customer Success.</p></li>
            <li><Link href="/before-after"><span className="status live">Live</span><h3>From symptom to impact</h3><p>My L1, L2, L3 discovery method, and Haulio&apos;s workflow before and after Kova with the bottlenecks marked.</p></Link></li>
            <li><Link href="/success-plan"><span className="status live">Live</span><h3>Implementation and success plan</h3><p>Taking a new Kova customer from signature to renewal, starting from the MEDDPICC handover.</p></Link></li>
            <li><Link href="/enablement"><span className="status live">Live</span><h3>Sales enablement kit</h3><p>Positioning, MEDDPICC qualification, battlecard, objection handling, pricing and a demo playbook.</p></Link></li>
            <li><Link href="/architecture"><span className="status live">Live</span><h3>Architecture</h3><p>How Kova, the database, the API, Make and Gmail fit together, and the decisions behind it.</p></Link></li>
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
              in their own terms, whether that&apos;s developers, security teams or operations. I&apos;ve worked with customers across EMEA and the Americas, and spent two years living and working in the UAE.
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
            <div><dt>Community</dt><dd>Women in Dev, volunteer since 2019. Solar Sister, community member</dd></div>
            <div><dt>Based in</dt><dd>{site.location}</dd></div>
          </dl>
        </div>
      </section>
      <section className="section" id="looking-for">
        <div className="wrap split">
          <div>
            <h2>What I&apos;m looking for</h2>
          </div>
          <div className="looking">
            <p className="lead">
              I&apos;m drawn to ambitious, technically driven companies solving meaningful problems: businesses where
              technology, customer outcomes and commercial impact are closely connected.
            </p>
            <p>
              I do my best work in environments that value ownership, rigorous thinking and moving with purpose. I enjoy
              working through complex problems, challenging assumptions constructively, and turning ambiguity into
              practical solutions rather than waiting for a playbook to exist.
            </p>
            <p>
              Just as important to me is a positive, supportive team culture. I value working with people who are
              generous with their knowledge, celebrate each other&apos;s successes, give honest and constructive feedback,
              and create an environment where people feel comfortable asking questions, sharing ideas and learning from
              mistakes. I believe high standards and kindness should go hand in hand.
            </p>
            <p>
              I&apos;m particularly interested in teams that collaborate closely across Sales, Engineering, Product and
              Customer Success, where customer feedback informs the product and technical expertise plays a meaningful
              role in business growth.
            </p>
            <p>
              Having spent much of my career building processes, enablement and customer-facing solutions in high-growth
              SaaS companies, I&apos;m excited by opportunities to help scale a business while remaining close to the
              technology and the people using it.
            </p>
            <p>
              Ultimately, I&apos;m looking for a team that combines ambition with trust, autonomy with collaboration, and a
              commitment to doing excellent work with a genuine desire to see the people around them succeed.
            </p>
            <div className="ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
              {site.email ? <a className="btn accent" href={`mailto:${site.email}`}>Get in touch</a> : null}
              {site.linkedin ? <a className="btn ghost" href={site.linkedin}>LinkedIn</a> : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
