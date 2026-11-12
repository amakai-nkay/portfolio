// Everything on the interactive CV comes from here. Edit freely: the page rearranges itself from this data.

export type RoleId = "se" | "cs" | "enable" | "ai";
export type IndustryId = "saas" | "ai" | "fintech" | "security" | "data" | "manufacturing" | "education";

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
  { id: "data", label: "Data & IoT" },
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
  workshops: { big: "Workshop to rollout", label: "Current-state mapping, future-state design, phased go-live", where: "Dotfile and Kentico" },
  lean:      { big: "22%", label: "More production output, with Lean Six Sigma", where: "Fusion Building Systems" },
  here:      { big: "This page", label: "Runs on an API, database and Make workflow I built. Try the terminal below", where: "Side project" },
};

export type Job = {
  id: string; org: string; role: string; when: string; start: number;
  line: string; points: string[];
  roles: Partial<Record<RoleId, number>>;   // 0–3: how relevant this job is to each kind of role
  industries: IndustryId[];
  skills: string[];
};

export const JOBS: Job[] = [
  { id: "dotfile", org: "Dotfile", role: "Senior Solutions Consultant", when: "2026", start: 2026,
    line: "Pre-sales and implementation for a KYB, KYC and AML compliance platform.",
    points: [
      "Wrote configurable risk-scoring engines in JavaScript, turning each client's risk matrix into automated onboarding decisions.",
      "Integrated Dotfile with Salesforce, HubSpot, Pipedrive, Google Workspace and verification providers including Onfido, Veriff and ComplyAdvantage.",
      "Ran implementation workshops from current-state mapping to phased rollout, then post-go-live enablement for compliance teams.",
    ],
    roles: { se: 3, cs: 3, ai: 2, enable: 1 }, industries: ["fintech", "saas"],
    skills: ["JavaScript", "REST APIs", "Salesforce", "HubSpot", "KYB, KYC, AML", "Implementation", "RFPs and security questionnaires", "Adoption"] },
  { id: "smartcat", org: "Smartcat", role: "Senior Solutions Engineer", when: "2025–2026", start: 2025,
    line: "An AI translation and localisation platform. I owned the EMEA technical sales cycle.",
    points: [
      "Closed over $200k in enterprise revenue, on deals averaging around $24k, through discovery, solution architecture and ROI validation.",
      "Built enterprise proofs of concept of agentic AI workflows, shortening evaluations from discovery to sign-off.",
      "Ran post-sale implementations and wrote repeatable deployment playbooks, and fixed live integration failures across WordPress, Drupal and Contentful.",
    ],
    roles: { se: 3, ai: 3, cs: 2, enable: 1 }, industries: ["saas", "ai"],
    skills: ["POC design", "LLMs", "Enterprise demos", "Discovery", "Solution architecture", "Implementation", "Playbooks"] },
  { id: "kentico", org: "Kentico", role: "EMEA Sales Engineer", when: "2024–2025", start: 2024,
    line: "Technical pre-sales for an enterprise CMS and digital experience platform.",
    points: [
      "Built an AI-powered RFP and RFI tool in Python with human review, cutting response time 20%.",
      "Lifted enterprise conversion 15% with demos tied to outcomes each customer defined.",
      "Ran solution design workshops on data architecture, DevOps integration and headless design.",
    ],
    roles: { se: 3, ai: 3, cs: 2, enable: 1 }, industries: ["saas", "ai"],
    skills: ["Python", "LLMs", "Enterprise demos", "Solution architecture", "Headless CMS", "RFPs and security questionnaires", "Discovery"] },
  { id: "kinsta", org: "Kinsta", role: "Head of Technical Sales Enablement", when: "2022–2023", start: 2022,
    line: "Managed cloud hosting for WordPress, Node.js and Python apps, sold to developers.",
    points: [
      "Built the global technical sales enablement function from scratch: 3 certification tracks, 6 reusable demo frameworks, 10 playbooks.",
      "Trained non-technical sales teams to explain performance analytics, monitoring and cloud infrastructure.",
      "Fed what we heard in the field back to Product and Engineering for observability and reporting.",
    ],
    roles: { enable: 3, se: 2, cs: 1 }, industries: ["saas"],
    skills: ["Sales enablement", "Playbooks", "Demo environments", "Battlecards", "Cloud hosting", "Kubernetes", "Training"] },
  { id: "wejo", org: "Wejo", role: "Pre-Sales Solutions Engineer", when: "2021–2022", start: 2021,
    line: "Connected vehicle data for fleet, mobility and smart city customers.",
    points: [
      "Built SQL and Python proofs of concept on real telematics data.",
      "Designed reusable data pipeline demos and monitored pipelines in Datadog and Grafana.",
      "Presented the platform at industry events and partner forums.",
    ],
    roles: { se: 3, ai: 1, enable: 1 }, industries: ["data"],
    skills: ["SQL", "Python", "POC design", "Data pipelines", "Datadog", "Grafana", "Enterprise demos"] },
  { id: "mako", org: "Mako Networks", role: "Pre-Sales Engineer", when: "2020–2021", start: 2020,
    line: "PCI DSS-compliant, cloud-managed network security for retail and financial services.",
    points: [
      "Demonstrated security analytics, compliance monitoring and network management to enterprise buyers.",
      "Wrote the battlecards and evaluation guides the sales team used.",
    ],
    roles: { se: 2, enable: 2 }, industries: ["security", "fintech"],
    skills: ["PCI DSS", "Network security", "Enterprise demos", "Battlecards"] },
  { id: "fusion", org: "Fusion Building Systems", role: "Manufacturing Engineer", when: "2019–2020", start: 2019,
    line: "Modular construction: steel and composite production lines.",
    points: ["Redesigned production workflows with Lean Six Sigma, lifting output 22% through root cause analysis and standard work."],
    roles: { cs: 1, ai: 1 }, industries: ["manufacturing"],
    skills: ["Lean Six Sigma", "Process improvement", "Root cause analysis"] },
  { id: "moe", org: "Ministry of Education, UAE", role: "Creative Design and Innovation Educator", when: "2017–2019", start: 2017,
    line: "Part of the first team delivering a new national design and innovation course.",
    points: ["Ran STEM projects with industry partners, including EXPO2020."],
    roles: { enable: 2, cs: 1 }, industries: ["education"],
    skills: ["Training", "Curriculum design", "Design thinking"] },
  { id: "sealed", org: "Sealed Air, Utrecht", role: "Undergraduate Design Engineer", when: "2015–2016", start: 2015,
    line: "A year in industry during my BEng in Design and Manufacturing Engineering.",
    points: [],
    roles: {}, industries: ["manufacturing"],
    skills: ["Design engineering"] },
];

export const SKILLS: { name: string; roles: RoleId[] }[] = [
  { name: "Discovery", roles: ["se", "cs"] },
  { name: "Enterprise demos", roles: ["se", "enable"] },
  { name: "POC design", roles: ["se", "ai"] },
  { name: "Solution architecture", roles: ["se", "cs"] },
  { name: "MEDDIC", roles: ["se"] },
  { name: "RFPs and security questionnaires", roles: ["se"] },
  { name: "REST APIs", roles: ["se", "cs", "ai"] },
  { name: "Implementation", roles: ["cs"] },
  { name: "Adoption", roles: ["cs"] },
  { name: "Training", roles: ["cs", "enable"] },
  { name: "Sales enablement", roles: ["enable"] },
  { name: "Playbooks", roles: ["enable", "cs"] },
  { name: "Battlecards", roles: ["enable", "se"] },
  { name: "Demo environments", roles: ["enable", "se"] },
  { name: "Python", roles: ["ai", "se"] },
  { name: "JavaScript", roles: ["ai", "se"] },
  { name: "SQL", roles: ["ai", "se"] },
  { name: "LLMs", roles: ["ai"] },
  { name: "Salesforce", roles: ["cs", "se"] },
  { name: "HubSpot", roles: ["cs", "se"] },
  { name: "KYB, KYC, AML", roles: ["se", "cs"] },
  { name: "PCI DSS", roles: ["se"] },
  { name: "Kubernetes", roles: ["ai"] },
  { name: "Data pipelines", roles: ["ai"] },
  { name: "Datadog", roles: ["ai"] },
  { name: "Lean Six Sigma", roles: ["cs"] },
];

export const CERTS = [
  "Microsoft Certified: Azure AI Fundamentals",
  "Microsoft Certified: Azure Fundamentals",
  "MEDDIC Sales Methodology Certification",
  "Sales Enablement Certification, HubSpot Academy",
  "Lean Six Sigma Yellow Belt, IASSC",
];

// Short recordings of you. Put the files in /public and set src, e.g. "/why.m4a". Empty = "recording soon".
export const VOICE_NOTES: { title: string; length: string; src: string }[] = [
  { title: "Why I do this work", length: "30 sec", src: "" },
  { title: "How I run discovery: symptom, cause, impact", length: "60 sec", src: "" },
  { title: "From the factory floor to software", length: "30 sec", src: "" },
  { title: "What I'm looking for next", length: "45 sec", src: "" },
];
