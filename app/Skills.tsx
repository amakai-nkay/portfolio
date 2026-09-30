"use client";
import { useState } from "react";

type Card = { id: string; title: string; text: string; tags: string[]; all: string[] };

const CARDS: Card[] = [
  {
    id: "se", title: "Solutions Engineering & Technical Pre-Sales",
    text: "Running technical evaluations from the first discovery call through to the technical win.",
    tags: ["Technical discovery", "Enterprise demos", "POC/POV design", "MEDDIC"],
    all: ["Technical discovery", "Stakeholder interviews", "Enterprise demos", "Solution architecture", "POC/POV design", "Technical evaluations", "Technical objection handling", "Business-value and ROI validation", "Competitive positioning", "Sandbox builds", "MEDDIC", "RFP/RFI responses", "Security questionnaires", "Technical win strategy"],
  },
  {
    id: "api", title: "APIs, Integrations & Systems Architecture",
    text: "Connecting products to the systems customers already run, and fixing it when the data doesn't line up.",
    tags: ["REST APIs", "Webhooks", "OAuth", "CRM integrations"],
    all: ["REST APIs", "GraphQL", "Webhooks", "OAuth", "SDKs", "JSON", "Postman", "CRM integrations", "iPaaS workflows", "Authentication", "Data mapping", "API testing", "Integration guides", "Troubleshooting"],
  },
  {
    id: "gtm", title: "GTM Engineering & Revenue Systems",
    text: "Building the systems, workflows and tooling that sales teams rely on day to day.",
    tags: ["CRM architecture", "Sales workflow automation", "Lead routing", "Sales enablement"],
    all: ["GTM engineering", "CRM architecture", "Sales workflow automation", "Revenue systems", "Lead routing", "Data enrichment", "Pipeline data flows", "Sales tooling", "Demo automation", "Sales enablement"],
  },
  {
    id: "ai", title: "AI Engineering & Intelligent Automation",
    text: "Putting LLMs to work inside real business processes, with people reviewing the output.",
    tags: ["LLM integration", "RAG", "Agentic AI", "Human-in-the-loop"],
    all: ["LLM integration", "LLMs and SLMs", "Generative AI", "RAG", "Prompt engineering", "Structured outputs", "Tool calling", "Agentic AI", "AI agents", "AI workflow design", "LLM-powered automation", "Human-in-the-loop workflows", "Output evaluation and QA", "AI adoption enablement", "n8n", "Make", "Zapier"],
  },
  {
    id: "eng", title: "Software Engineering, Cloud & Data",
    text: "Hands-on enough to build prototypes, automations and integrations myself, not just specify them.",
    tags: ["Python", "JavaScript", "Linux command line", "Git"],
    all: ["Python", "JavaScript", "Node.js", "SQL", "Bash scripting", "Linux command line", "npm", "PyPI", "Git", "GitHub", "GitLab", "Bitbucket", "CI/CD", "PostgreSQL", "Microsoft Azure", "AWS", "GCP", "Snowflake", "Databricks", "Kubernetes", "Tableau", "Power BI", "Looker", "Datadog", "Grafana"],
  },
  {
    id: "iot", title: "Manufacturing, IoT & Industrial Technology",
    text: "Experience with physical systems, connected vehicles and industrial data, not only software.",
    tags: ["Manufacturing engineering", "Vehicle telemetry", "IoT platforms", "Systems integration"],
    all: ["Manufacturing engineering", "Connected-vehicle technology", "Vehicle telemetry", "IoT platforms", "Systems integration", "Operational technology", "Engineering problem-solving", "Technical requirements"],
  },
];

const TOOLKIT: { title: string; items: string[] }[] = [
  { title: "Pre-Sales & Technical GTM", items: ["Technical discovery", "POC and POV design", "Enterprise demos", "Technical objection handling", "Business-value and ROI validation", "MEDDIC", "RFPs, RFIs and security questionnaires", "Competitive positioning", "Sandbox builds"] },
  { title: "Post-Sales, Adoption & Growth", items: ["Enterprise account ownership", "Implementation planning", "Onboarding", "Customer training", "Technical handover", "Success plans and KPIs", "Adoption tracking", "Feature adoption", "Quarterly business reviews", "Renewals", "Expansion", "Escalation management", "Stakeholder management", "Rollout planning", "Implementation playbooks", "Technical documentation", "Integration guides"] },
  { title: "Programming, Scripting & Package Ecosystems", items: ["JavaScript", "Python", "SQL", "Node.js", "Bash scripting", "Linux command line", "npm", "PyPI", "Package managers", "Scripting and automation", "HTML", "CSS", "Open source tooling"] },
  { title: "Source Control, CI/CD & Cloud", items: ["Git", "GitHub", "GitLab", "Bitbucket", "CI/CD pipelines", "DevOps automation", "Deployment workflows", "Microsoft Azure", "AWS", "Google Cloud Platform", "Kubernetes", "PostgreSQL", "Cloud architecture fundamentals"] },
  { title: "Security & Compliance", items: ["Cloud-managed network security", "Security analytics", "Compliance monitoring", "Compliance automation", "PCI DSS", "SSO", "SAML", "MFA", "Okta", "Microsoft Entra ID", "Sensitive-data handling"] },
  { title: "FinTech & RegTech", items: ["KYB", "KYC", "AML", "CDD", "EDD", "UBO analysis", "Sanctions and PEP screening", "Risk scoring", "Compliance workflows", "Payment flows"] },
  { title: "Product Strategy, GTM & Enablement", items: ["Product positioning", "ICP and persona development", "Value propositions", "Messaging", "Competitive analysis", "Battlecards", "Pricing rationale", "Launch planning", "Sales playbooks", "Demo frameworks", "Certification paths", "Cross-functional alignment"] },
  { title: "Data, Analytics & Visualisation", items: ["SQL", "Data modelling", "Snowflake", "Databricks", "Tableau", "Power BI", "Looker", "Datadog", "Grafana"] },
  { title: "AI Development Tools & Workflow Platforms", items: ["Claude Code", "Claude", "Cursor", "GitHub Copilot", "ChatGPT", "Perplexity", "Replit", "Lovable", "n8n", "Make", "Zapier"] },
  { title: "Business Applications, CRM & Collaboration", items: ["Salesforce", "HubSpot", "Microsoft Dynamics 365", "Pipedrive", "Gainsight", "Zendesk", "Intercom", "Pylon", "Linear", "Jira", "Confluence", "Notion", "Figma", "Miro", "Monday.com"] },
  { title: "Digital Platforms & CMS", items: ["Kentico Xperience", "Contentful", "WordPress", "Drupal", "Headless CMS", "Shopify", "Magento", "WooCommerce", "BigCommerce"] },
  { title: "Certifications", items: ["Microsoft Certified: Azure AI Fundamentals", "Microsoft Certified: Azure Fundamentals", "MEDDIC Sales Methodology Certification", "Sales Enablement Certification, HubSpot Academy", "Lean Six Sigma Yellow Belt, IASSC"] },
];

const Chevron = ({ open }: { open: boolean }) => (
  <svg className={`chev${open ? " open" : ""}`} width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Skills() {
  const [cardOpen, setCardOpen] = useState<Record<string, boolean>>({});
  const [rows, setRows] = useState<boolean[]>(TOOLKIT.map(() => false));
  const allOpen = rows.every(Boolean);

  return (
    <>
      <div className="caps">
        {CARDS.map(c => {
          const open = !!cardOpen[c.id];
          return (
            <article className="cap" key={c.id}>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <ul className="tags" aria-label="Representative skills">
                {(open ? c.all : c.tags).map(t => <li key={t}>{t}</li>)}
              </ul>
              <button className="more" aria-expanded={open} onClick={() => setCardOpen(s => ({ ...s, [c.id]: !open }))}>
                {open ? "Show less" : `Show all ${c.all.length}`} <Chevron open={open} />
              </button>
            </article>
          );
        })}
      </div>

      <div className="toolkit">
        <div className="toolkit-head">
          <h3>Full Technical Toolkit</h3>
          <button className="linkbtn" onClick={() => setRows(TOOLKIT.map(() => !allOpen))}>{allOpen ? "Collapse all" : "Expand all"}</button>
        </div>
        <p className="toolkit-note">Tools and platforms I&apos;ve used in real work, at different depths.</p>
        <ul className="acc">
          {TOOLKIT.map((row, i) => (
            <li key={row.title}>
              <button className="acc-row" aria-expanded={rows[i]} aria-controls={`tk-${i}`}
                onClick={() => setRows(r => r.map((v, j) => (j === i ? !v : v)))}>
                <span>{row.title}</span>
                <span className="acc-count">{row.items.length}<Chevron open={rows[i]} /></span>
              </button>
              <div id={`tk-${i}`} className="acc-body" hidden={!rows[i]}>
                <ul className="tags">{row.items.map(t => <li key={t}>{t}</li>)}</ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
