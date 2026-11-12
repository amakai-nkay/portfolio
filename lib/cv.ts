// Everything on the interactive CV comes from here. Edit freely: the page rearranges itself from this data.

export type RoleId = "se" | "cs" | "enable" | "ai";
export type IndustryId = "saas" | "ai" | "fintech" | "security" | "iot" | "manufacturing" | "education";

export const NAME = { full: "Amaka Alexis Ikpeazu", short: "Amaka Ikpeazu" };

export const SUMMARY = [
  "I'm a Senior Solutions Engineer with 7+ years of experience across SaaS, AI, RegTech, connected data, IoT and manufacturing. My work sits at the intersection of technology, sales and customer success, spanning technical discovery, enterprise demonstrations, solution architecture, APIs, integrations and implementation.",
  "I've also built technical sales enablement functions, automated internal processes and developed reusable demos, integrations and playbooks. Much of my experience has been in high-growth startups and scale-ups, through rapid growth, restructures and acquisitions, where I've helped establish the tools and processes needed to support technical evaluations, bring products to market and drive customer adoption.",
];
export const NOW = "Right now I consult for startups on sales engineering and AI transformation.";

export const LOOKING_FOR = [
  "I'm drawn to ambitious, technically driven companies solving meaningful problems: businesses where technology, customer outcomes and commercial impact are closely connected.",
  "I do my best work in environments that value ownership, rigorous thinking and moving with purpose. I enjoy working through complex problems, challenging assumptions constructively, and turning ambiguity into practical solutions rather than waiting for a playbook to exist.",
  "Just as important to me is a positive, supportive team culture. I value working with people who are generous with their knowledge, celebrate each other's successes, give honest and constructive feedback, and create an environment where people feel comfortable asking questions, sharing ideas and learning from mistakes. I believe high standards and kindness should go hand in hand.",
  "I'm particularly interested in teams that collaborate closely across Sales, Engineering, Product and Customer Success, where customer feedback informs the product and technical expertise plays a meaningful role in business growth.",
  "Having spent much of my career building processes, enablement and customer-facing solutions in high-growth SaaS companies, I'm excited by opportunities to help scale a business while remaining close to the technology and the people using it.",
  "Ultimately, I'm looking for a team that combines ambition with trust, autonomy with collaboration, and a commitment to doing excellent work with a genuine desire to see the people around them succeed.",
];

export const ROLES: { id: RoleId; label: string; line: string; highlights: string[] }[] = [
  { id: "se", label: "Solutions Engineering",
    line: "Discovery, demos and proofs of concept that turn technical evaluations into signed deals.",
    highlights: ["closed", "conv", "multi"] },
  { id: "cs", label: "Customer Success & Implementation",
    line: "From the first workshop to go-live, then staying until people actually use what they bought.",
    highlights: ["workshops", "systems", "lean"] },
  { id: "enable", label: "Sales Enablement",
    line: "Giving sales teams what they need to run technical conversations without me in the room.",
    highlights: ["zero", "conv", "rfp"] },
  { id: "ai", label: "AI & Automation",
    line: "Working AI tools in Python and JavaScript, with people reviewing what the model produces.",
    highlights: ["rfp", "agentic", "here"] },
];

export const INDUSTRIES: { id: IndustryId; label: string }[] = [
  { id: "saas", label: "SaaS" },
  { id: "ai", label: "AI" },
  { id: "fintech", label: "Fintech & RegTech" },
  { id: "security", label: "Security" },
  { id: "iot", label: "IoT & connected data" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "education", label: "Education" },
];

export const HIGHLIGHTS: Record<string, { big: string; label: string; where: string }> = {
  multi:     { big: "Multi-million", label: "Commercial and enterprise revenue influenced", where: "Across EMEA and the Americas" },
  closed:    { big: "$200k+", label: "Enterprise revenue closed, on deals averaging around $24k", where: "Smartcat" },
  conv:      { big: "15%", label: "Higher enterprise conversion", where: "Kentico" },
  systems:   { big: "8 systems", label: "Integrated for one compliance platform", where: "Salesforce, HubSpot, Onfido and more, at Dotfile" },
  agentic:   { big: "Agentic AI", label: "Enterprise proofs of concept of agentic workflows, shortening evaluations to sign-off", where: "Smartcat" },
  rfp:       { big: "20%", label: "Faster RFP and RFI responses, from an AI tool I built", where: "Kentico" },
  zero:      { big: "From zero", label: "Global technical sales enablement: 3 certification tracks, 6 demo frameworks, 10 playbooks", where: "Kinsta" },
  workshops: { big: "Workshop to rollout", label: "Current-state mapping, future-state design, phased go-live and an onboarding guide", where: "Dotfile and Kentico" },
  lean:      { big: "22%", label: "More production output, with Lean Six Sigma", where: "Fusion Building Systems" },
  iot:       { big: "Telematics", label: "SQL and Python proofs of concept on live connected vehicle data", where: "Wejo" },
  here:      { big: "This page", label: "Runs on an API, database and Make workflow I built. Try the terminal below", where: "Side project" },
};

// Each bullet says which roles and industries it matters most for, so the page can put the right ones first.
export type Point = { text: string; roles: RoleId[]; industries?: IndustryId[] };

export type Job = {
  id: string; org: string; role: string; when: string; start: number;
  note?: string;              // shown quietly under the dates
  line: string; points: Point[];
  roles: Partial<Record<RoleId, number>>;   // 0–3: how relevant the job is to each kind of role
  industries: IndustryId[];
  skills: string[];           // names must match the skills list below
};

export const JOBS: Job[] = [
  { id: "consulting", org: "Startup consulting", role: "AI Transformation and Sales Engineering Lead", when: "2026–now", start: 2026.9,
    line: "Consulting for early-stage startups, currently an AI observability platform.",
    points: [
      { text: "Leading AI transformation and sales engineering for an early-stage AI observability platform.", roles: ["ai", "se"], industries: ["ai", "saas"] },
      { text: "Working across several hats, from technical demos to helping the team adopt AI in its own processes.", roles: ["se", "enable", "ai"], industries: ["ai"] },
    ],
    roles: { ai: 3, se: 3, enable: 1, cs: 1 }, industries: ["ai", "saas"],
    skills: ["LLMs", "AI adoption enablement", "Agentic AI workflows", "Enterprise demos", "Technical discovery", "Claude Code"] },

  { id: "dotfile", org: "Dotfile", role: "Senior Solutions Consultant", when: "May–Aug 2026", start: 2026.4, note: "Role ended in redundancy",
    line: "Pre-sales and implementation for a KYB, KYC and AML compliance platform.",
    points: [
      { text: "Wrote configurable KYB risk-scoring engines in JavaScript, turning each client's risk matrix into automated knockout, escalation and weighted-score logic.", roles: ["se", "ai"], industries: ["fintech"] },
      { text: "Integrated Dotfile with Salesforce, HubSpot, Pipedrive and Google Workspace, and with verification providers Onfido, Veriff, Checkout.com and ComplyAdvantage.", roles: ["se", "cs", "ai"], industries: ["fintech", "saas"] },
      { text: "Ran implementation workshops that mapped how compliance teams really ran onboarding, then turned it into future-state configuration and phased rollouts.", roles: ["cs", "se"], industries: ["fintech"] },
      { text: "Built Dotfile's customer onboarding and success guide.", roles: ["cs", "enable"], industries: ["fintech", "saas"] },
      { text: "Led RFP, RFI and security questionnaire responses for regulated payments and financial services prospects.", roles: ["se"], industries: ["fintech", "security"] },
      { text: "Ran post-go-live enablement on risk scoring, EDD, AML alert tuning and ongoing monitoring, driving adoption by non-technical compliance teams.", roles: ["cs", "enable"], industries: ["fintech"] },
    ],
    roles: { se: 3, cs: 3, ai: 2, enable: 2 }, industries: ["fintech", "saas", "security"],
    skills: ["JavaScript", "REST APIs", "Salesforce", "HubSpot", "Pipedrive", "Google Workspace", "Onfido", "Veriff", "Checkout.com", "ComplyAdvantage",
      "KYB", "KYC", "AML", "Risk scoring", "Discovery and strategy workshops", "Current-state to future-state mapping", "Phased rollouts", "Onboarding",
      "RFPs, RFIs and security questionnaires", "Customer training", "Adoption tracking", "Implementation playbooks"] },

  { id: "smartcat", org: "Smartcat", role: "Senior Solutions Engineer", when: "2025–2026", start: 2025.5,
    line: "An AI translation and localisation platform. I owned the EMEA technical sales cycle.",
    points: [
      { text: "Closed over $200k in enterprise revenue, on deals averaging around $24k, through discovery, solution architecture and ROI validation.", roles: ["se"], industries: ["ai", "saas"] },
      { text: "Built enterprise proofs of concept of agentic AI workflows, shortening evaluations from discovery to sign-off.", roles: ["se", "ai"], industries: ["ai"] },
      { text: "Ran post-sale implementations and wrote repeatable deployment playbooks that sped up time to value.", roles: ["cs"], industries: ["saas", "ai"] },
      { text: "Fixed live integration failures across WordPress, Drupal and Contentful, restoring enterprise content pipelines.", roles: ["cs", "se"], industries: ["saas"] },
      { text: "Fed field friction back to Product and Engineering, shaping priorities for API extensibility and integration depth.", roles: ["enable", "se"], industries: ["ai", "saas"] },
    ],
    roles: { se: 3, ai: 3, cs: 2, enable: 1 }, industries: ["ai", "saas"],
    skills: ["Agentic AI workflows", "POC and POV design", "Technical discovery", "Solution architecture", "Business-value and ROI validation",
      "Implementation playbooks", "WordPress", "Drupal", "Contentful", "Field feedback to Product", "LLMs"] },

  { id: "kentico", org: "Kentico", role: "EMEA Sales Engineer", when: "2024–2025", start: 2024, note: "Role ended in redundancy",
    line: "Technical pre-sales for an enterprise CMS and digital experience platform.",
    points: [
      { text: "Built an AI-powered RFP and RFI tool in Python, using LLM workflows with human review, that cut response time 20%.", roles: ["ai", "se", "enable"], industries: ["ai", "saas"] },
      { text: "Lifted enterprise conversion 15% with technical narratives tied to outcomes each customer defined.", roles: ["se", "enable"], industries: ["saas"] },
      { text: "Ran solution design and implementation workshops, turning requirements into architectures and phased deployment roadmaps.", roles: ["se", "cs"], industries: ["saas"] },
      { text: "Advised global accounts on data architecture, DevOps integration and headless, API-first design across multi-brand estates.", roles: ["se", "ai"], industries: ["saas"] },
      { text: "Turned enterprise field feedback into structured feature requests for Product.", roles: ["enable", "cs"], industries: ["saas"] },
    ],
    roles: { se: 3, ai: 3, cs: 2, enable: 2 }, industries: ["saas", "ai"],
    skills: ["Python", "LLMs", "Human-in-the-loop workflows", "RFPs, RFIs and security questionnaires", "Enterprise demos", "Solution architecture",
      "Discovery and strategy workshops", "Headless CMS", "Kentico Xperience", "DevOps automation", "Field feedback to Product"] },

  { id: "kinsta", org: "Kinsta", role: "Head of Technical Sales Enablement", when: "2022–2023", start: 2022, note: "Role ended in redundancy",
    line: "Managed cloud hosting on Google Cloud and Kubernetes, sold to developers.",
    points: [
      { text: "Built the global technical sales enablement function from scratch: 3 certification tracks, 6 reusable demo frameworks, 10 technical sales playbooks.", roles: ["enable"], industries: ["saas"] },
      { text: "Created demo blueprints and documentation libraries so sales engineers could run enterprise evaluations on their own.", roles: ["enable", "se"], industries: ["saas"] },
      { text: "Trained non-technical sales teams to explain performance analytics, monitoring and cloud infrastructure to enterprise buyers.", roles: ["enable", "cs"], industries: ["saas"] },
      { text: "Turned field intelligence into roadmap input for observability tooling and reporting.", roles: ["enable", "ai"], industries: ["saas"] },
    ],
    roles: { enable: 3, se: 2, cs: 2 }, industries: ["saas"],
    skills: ["Sales enablement", "Playbooks", "Certification paths", "Demo environments", "Demo frameworks", "Battlecards", "Technical documentation",
      "Customer training", "Kubernetes", "Google Cloud Platform", "Field feedback to Product"] },

  { id: "wejo", org: "Wejo", role: "Pre-Sales Solutions Engineer", when: "2021–2022", start: 2021,
    line: "Connected vehicle and IoT data for fleet, mobility and smart city customers, during rapid post-IPO scaling.",
    points: [
      { text: "Built SQL and Python proofs of concept that let enterprise clients query live vehicle telematics and find fleet insights.", roles: ["se", "ai"], industries: ["iot"] },
      { text: "Designed reusable pipeline patterns that turned raw streaming telematics into customer-facing analytics.", roles: ["ai", "se"], industries: ["iot"] },
      { text: "Monitored pipeline health in Datadog and Grafana: ingestion throughput, latency and errors.", roles: ["ai"], industries: ["iot"] },
      { text: "Presented the platform at industry events and partner forums across the connected vehicle ecosystem.", roles: ["se", "enable"], industries: ["iot"] },
      { text: "Built demo environments and evaluation guides so the sales team could self-serve.", roles: ["enable", "se"], industries: ["iot"] },
    ],
    roles: { se: 3, ai: 2, enable: 2 }, industries: ["iot"],
    skills: ["SQL", "Python", "POC and POV design", "Data pipelines", "Datadog", "Grafana", "Connected vehicle telematics", "IoT platforms",
      "Streaming data", "Enterprise demos", "Demo environments"] },

  { id: "mako", org: "Mako Networks", role: "Pre-Sales Engineer", when: "2020–2021", start: 2020,
    line: "PCI DSS-compliant, cloud-managed network security for retail, payments and financial services.",
    points: [
      { text: "Demonstrated security analytics, compliance monitoring and cloud-managed networking to buyers evaluating against PCI DSS.", roles: ["se"], industries: ["security", "fintech"] },
      { text: "Wrote the battlecards and evaluation guides the sales team used in security and compliance conversations.", roles: ["enable", "se"], industries: ["security"] },
    ],
    roles: { se: 2, enable: 2 }, industries: ["security", "fintech"],
    skills: ["PCI DSS", "Network security", "Security analytics", "Enterprise demos", "Battlecards", "Competitive positioning"] },

  { id: "fusion", org: "Fusion Building Systems", role: "Manufacturing Engineer", when: "2019–2020", start: 2019, note: "Role ended due to COVID-19",
    line: "Modular construction: steel and composite production lines.",
    points: [
      { text: "Redesigned production workflows with Lean Six Sigma, lifting output 22% through root cause analysis and process standardisation.", roles: ["cs", "ai"], industries: ["manufacturing"] },
    ],
    roles: { cs: 1, ai: 1 }, industries: ["manufacturing"],
    skills: ["Lean Six Sigma", "Root cause analysis", "Process standardisation", "Manufacturing engineering"] },

  { id: "moe", org: "Ministry of Education, UAE", role: "Creative Design and Innovation Educator", when: "2017–2019", start: 2017,
    line: "Part of the first team delivering a new national design and innovation course.",
    points: [
      { text: "Designed and ran a STEM curriculum built on design thinking and real projects, with industry partners including EXPO2020.", roles: ["enable", "cs"], industries: ["education"] },
    ],
    roles: { enable: 2, cs: 1 }, industries: ["education"],
    skills: ["Curriculum design", "Design thinking", "Customer training"] },

  { id: "sealed", org: "Sealed Air, Utrecht", role: "Undergraduate Design Engineer", when: "2015–2016", start: 2015,
    line: "A year in industry during my BEng in Design and Manufacturing Engineering.",
    points: [],
    roles: {}, industries: ["manufacturing"],
    skills: ["Design engineering"] },
];

export type SkillGroup = { title: string; roles: RoleId[]; industries?: IndustryId[]; items: string[] };

export const SKILL_GROUPS: SkillGroup[] = [
  { title: "Pre-sales and solutions engineering", roles: ["se"],
    items: ["Technical discovery", "Discovery and strategy workshops", "Stakeholder interviews", "Enterprise demos", "POC and POV design",
      "Solution architecture", "Technical evaluations", "Technical objection handling", "Business-value and ROI validation", "MEDDIC",
      "RFPs, RFIs and security questionnaires", "Competitive positioning", "Sandbox builds", "Technical win strategy"] },
  { title: "Implementation and customer success", roles: ["cs"],
    items: ["Enterprise account ownership", "Current-state to future-state mapping", "Implementation planning", "Phased rollouts", "Onboarding",
      "Customer training", "Technical handover", "Success plans and KPIs", "Adoption tracking", "Feature adoption", "Quarterly business reviews",
      "Renewals", "Expansion", "Escalation management", "Stakeholder management", "Implementation playbooks", "Technical documentation",
      "Integration guides", "Troubleshooting guides"] },
  { title: "Sales enablement and go-to-market", roles: ["enable"],
    items: ["Sales enablement", "Playbooks", "Certification paths", "Demo environments", "Demo frameworks", "Battlecards", "Curriculum design",
      "Product positioning", "ICP and persona development", "Value propositions", "Messaging", "Competitive analysis", "Pricing rationale",
      "Launch planning", "Field feedback to Product", "Cross-functional alignment"] },
  { title: "GTM engineering and revenue systems", roles: ["se", "enable", "ai"],
    items: ["CRM architecture", "Sales workflow automation", "Lead routing", "Data enrichment", "Pipeline data flows", "Sales tooling",
      "Demo automation", "Salesforce external-ID upsert"] },
  { title: "AI engineering", roles: ["ai"], industries: ["ai"],
    items: ["LLMs", "SLMs", "RAG", "Prompt engineering", "Structured output (JSON)", "Tool calling", "Agentic AI workflows", "AI agents",
      "Human-in-the-loop workflows", "LLM output evaluation and QA", "Document processing", "Data extraction", "Classification",
      "AI workflow design", "AI adoption enablement"] },
  { title: "AI and automation tools", roles: ["ai"], industries: ["ai"],
    items: ["Claude Code", "Claude", "Cursor", "GitHub Copilot", "ChatGPT", "Perplexity", "Notion AI", "Replit", "Lovable", "Midjourney",
      "Mobbin", "n8n", "Make", "Zapier"] },
  { title: "APIs and integrations", roles: ["se", "cs", "ai"],
    items: ["REST APIs", "GraphQL", "Webhooks", "OAuth", "SDKs", "JSON", "Postman", "MCP connectors", "Database connectors", "iPaaS workflows",
      "Sandbox and integration testing", "Third-party integrations", "Data mapping", "Authentication"] },
  { title: "Engineering, cloud and DevOps", roles: ["ai", "se"],
    items: ["Python", "JavaScript", "Node.js", "SQL", "Bash scripting", "Linux command line", "HTML", "CSS", "Git", "GitHub", "GitLab",
      "Bitbucket", "CI/CD pipelines", "DevOps automation", "npm", "PyPI", "AWS", "Microsoft Azure", "Google Cloud Platform", "Kubernetes", "PostgreSQL"] },
  { title: "Data, analytics and observability", roles: ["ai", "se"], industries: ["iot"],
    items: ["Data pipelines", "Data modelling", "Snowflake", "Databricks", "Tableau", "Power BI", "Looker", "Datadog", "Grafana"] },
  { title: "IoT and connected data", roles: [], industries: ["iot"],
    items: ["Connected vehicle telematics", "IoT platforms", "Streaming data", "Fleet and smart city use cases", "Systems integration", "Operational technology"] },
  { title: "Fintech, compliance and security", roles: ["se", "cs"], industries: ["fintech", "security"],
    items: ["KYB", "KYC", "AML", "CDD and EDD", "UBO analysis", "Sanctions and PEP screening", "Adverse media screening", "Risk scoring",
      "Ongoing monitoring", "Compliance automation", "Payment flows", "PCI DSS", "Network security", "Security analytics", "SSO", "SAML", "MFA",
      "Okta", "Microsoft Entra ID", "Sensitive-data handling", "ComplyAdvantage", "Onfido", "Veriff", "IDnow", "Checkout.com"] },
  { title: "Business systems", roles: ["cs", "enable"],
    items: ["Salesforce", "HubSpot", "Microsoft Dynamics 365", "Pipedrive", "Gainsight", "Zendesk", "Intercom", "Freshdesk", "Pylon", "Jira",
      "Jira Service Management", "Confluence", "Linear", "Notion", "Slack", "Google Workspace", "Figma", "Miro", "Monday.com"] },
  { title: "Web platforms and CMS", roles: ["se"], industries: ["saas"],
    items: ["Kentico Xperience", "Headless CMS", "Contentful", "WordPress", "Drupal", "Shopify", "Magento", "WooCommerce", "BigCommerce"] },
  { title: "Manufacturing and process", roles: ["cs"], industries: ["manufacturing"],
    items: ["Lean Six Sigma", "Root cause analysis", "Process standardisation", "Manufacturing engineering", "Design engineering", "Design thinking"] },
  { title: "Languages", roles: [],
    items: ["English", "Igbo", "Conversational French"] },
];

export const CERTS = [
  "Microsoft Certified: Azure AI Fundamentals",
  "Microsoft Certified: Azure Fundamentals",
  "MEDDIC Sales Methodology Certification",
  "Sales Enablement Certification, HubSpot Academy",
  "Lean Six Sigma Yellow Belt, IASSC",
];

export const EDUCATION = "BEng Design and Manufacturing Engineering, Southampton Solent University, 2012–2017";

// Short recordings of you. Put the files in /public and set src, e.g. "/why.m4a". Empty = "recording soon".
export const VOICE_NOTES: { title: string; length: string; src: string }[] = [
  { title: "Why I do this work", length: "30 sec", src: "" },
  { title: "How I run discovery: symptom, cause, impact", length: "60 sec", src: "" },
  { title: "From the factory floor to software", length: "30 sec", src: "" },
  { title: "What I'm looking for next", length: "45 sec", src: "" },
];
