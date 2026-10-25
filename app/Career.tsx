"use client";
import { useRef, useState } from "react";

type Chapter = "engineering" | "teaching" | "solutions";
type Stop = { when: string; role: string; org: string; chapter: Chapter; points: string[] };

const STOPS: Stop[] = [
  { when: "2012–2017", role: "BEng Design and Manufacturing Engineering", org: "Southampton Solent University", chapter: "engineering",
    points: ["Included a year as an undergraduate design engineer at Sealed Air in Utrecht."] },
  { when: "2017–2019", role: "Creative Design and Innovation Educator", org: "Ministry of Education, UAE", chapter: "teaching",
    points: ["Part of the first team delivering a new national Creative Design and Innovation course.", "Ran STEM projects with industry partners, including EXPO2020."] },
  { when: "2019–2020", role: "Manufacturing Engineer", org: "Fusion Building Systems", chapter: "engineering",
    points: ["Redesigned steel and composite production workflows using Lean Six Sigma.", "Lifted output 22% through root cause analysis and standardising the process."] },
  { when: "2020–2021", role: "Pre-Sales Engineer", org: "Mako Networks", chapter: "solutions",
    points: ["Demos of PCI DSS-compliant, cloud-managed network security for retail and financial services.", "Built the battlecards and evaluation guides the sales team used."] },
  { when: "2021–2022", role: "Pre-Sales Solutions Engineer", org: "Wejo", chapter: "solutions",
    points: ["SQL and Python proofs of concept on connected vehicle telematics for fleet and smart city customers.", "Represented Wejo at industry events and partner forums."] },
  { when: "2022–2023", role: "Head of Technical Sales Enablement", org: "Kinsta", chapter: "solutions",
    points: ["Built the global technical sales enablement function from scratch.", "3 certification tracks, 6 reusable demo frameworks and 10 technical sales playbooks."] },
  { when: "2024–2025", role: "EMEA Sales Engineer", org: "Kentico", chapter: "solutions",
    points: ["Built an AI-powered RFP and RFI tool in Python that cut response time 20%.", "Lifted enterprise conversion 15% with demos tied to each customer's own outcomes."] },
  { when: "2026", role: "Senior Solutions Consultant", org: "Dotfile", chapter: "solutions",
    points: ["Wrote configurable risk-scoring engines in JavaScript for regulated onboarding.", "Integrated with Salesforce, HubSpot and identity providers, and ran implementation workshops."] },
];

const CH: Record<Chapter, string> = { engineering: "Engineering", teaching: "Teaching", solutions: "Solutions engineering" };

export default function Career() {
  const [i, setI] = useState(STOPS.length - 1);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const go = (n: number) => { const k = (n + STOPS.length) % STOPS.length; setI(k); refs.current[k]?.focus(); };
  const s = STOPS[i];
  return (
    <div className="career">
      <ul className="career-key" aria-label="Key">
        {(Object.keys(CH) as Chapter[]).map(c => <li key={c}><i className={`dot ch-${c}`} />{CH[c]}</li>)}
      </ul>
      <div className="track" role="tablist" aria-label="Career, oldest to newest"
        onKeyDown={e => { if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); } }}>
        {STOPS.map((st, k) => (
          <button key={st.org + st.when} ref={el => { refs.current[k] = el; }} role="tab" aria-selected={k === i}
            tabIndex={k === i ? 0 : -1} className={`stop ch-${st.chapter}`} onClick={() => setI(k)}>
            <i className="dot" />
            <span className="stop-when">{st.when}</span>
            <span className="stop-org">{st.org}</span>
          </button>
        ))}
      </div>
      <div className="stop-detail" role="tabpanel" aria-live="polite">
        <p className="sub">{s.when}. {CH[s.chapter]}.</p>
        <h3>{s.role}, {s.org}</h3>
        <ul>{s.points.map(p => <li key={p}>{p}</li>)}</ul>
      </div>
    </div>
  );
}
