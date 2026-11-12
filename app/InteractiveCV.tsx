"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Terminal from "./Terminal";
import { site } from "@/lib/site";
import { ROLES, INDUSTRIES, HIGHLIGHTS, JOBS, SKILLS, CERTS, VOICE_NOTES, type RoleId, type IndustryId } from "@/lib/cv";

const DEFAULT_HIGHLIGHTS = ["multi", "conv", "zero"];

function score(job: (typeof JOBS)[number], role: RoleId | null, ind: IndustryId | null) {
  return (role ? (job.roles[role] || 0) * 2 : 0) + (ind && job.industries.includes(ind) ? 3 : 0);
}

/* ---------- voice notes ---------- */
function VoiceNote({ title, length, src }: { title: string; length: string; src: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [p, setP] = useState(0);
  const toggle = () => {
    const a = ref.current; if (!a) return;
    if (a.paused) { document.querySelectorAll("audio").forEach(x => x !== a && x.pause()); a.play(); } else a.pause();
  };
  return (
    <li className={`vn${src ? "" : " vn-soon"}`}>
      <button className="vn-play" onClick={toggle} disabled={!src} aria-label={src ? `${playing ? "Pause" : "Play"}: ${title}` : `${title}, recording soon`}>
        <i className={playing ? "pause" : "play"} />
      </button>
      <div className="vn-body">
        <span className="vn-title">{title}</span>
        <span className="vn-bar"><i style={{ width: `${p * 100}%` }} /></span>
        <span className="vn-len">{src ? length : "Recording soon"}</span>
      </div>
      {src ? <audio ref={ref} src={src} preload="none"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => { setPlaying(false); setP(0); }}
        onTimeUpdate={e => { const a = e.currentTarget; setP(a.duration ? a.currentTime / a.duration : 0); }} /> : null}
    </li>
  );
}

export default function InteractiveCV() {
  const [role, setRole] = useState<RoleId | null>(null);
  const [ind, setInd] = useState<IndustryId | null>(null);
  const [skill, setSkill] = useState<string | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set(["dotfile"]));
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLDialogElement>(null);

  // Remember the visitor's choice for this browser only.
  useEffect(() => {
    try {
      const r = localStorage.getItem("cv_role") as RoleId | null; if (r && ROLES.some(x => x.id === r)) setRole(r);
      const i = localStorage.getItem("cv_ind") as IndustryId | null; if (i && INDUSTRIES.some(x => x.id === i)) setInd(i);
    } catch { /* storage unavailable */ }
  }, []);
  useEffect(() => { try { role ? localStorage.setItem("cv_role", role) : localStorage.removeItem("cv_role"); ind ? localStorage.setItem("cv_ind", ind) : localStorage.removeItem("cv_ind"); } catch { /* ignore */ } }, [role, ind]);

  const roleInfo = ROLES.find(r => r.id === role);
  const jobs = useMemo(() => {
    const list = JOBS.map(j => ({ ...j, s: score(j, role, ind) }));
    if (role || ind) list.sort((a, b) => b.s - a.s || b.start - a.start);
    return list;
  }, [role, ind]);

  // When the order changes, open the most relevant job.
  useEffect(() => { if (role || ind) setOpen(new Set([jobs[0].id])); }, [role, ind]); // eslint-disable-line react-hooks/exhaustive-deps

  const highlights = useMemo(() => {
    let ids = roleInfo ? [...roleInfo.highlights] : [...DEFAULT_HIGHLIGHTS];
    if (ind === "manufacturing" && !ids.includes("lean")) ids = [...ids.slice(0, 2), "lean"];
    return ids.map(id => ({ id, ...HIGHLIGHTS[id] }));
  }, [roleInfo, ind]);

  /* ---- smooth reordering (FLIP) ---- */
  const els = useRef(new Map<string, HTMLElement>());
  const tops = useRef(new Map<string, number>());
  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    els.current.forEach((el, id) => {
      const now = el.offsetTop, before = tops.current.get(id);
      if (!reduce && before !== undefined && before !== now) {
        el.style.transition = "none";
        el.style.transform = `translateY(${before - now}px)`;
        requestAnimationFrame(() => { el.style.transition = "transform .45s cubic-bezier(.2,.7,.2,1)"; el.style.transform = ""; });
      }
      tops.current.set(id, now);
    });
  }, [jobs]);
  // Opening a job moves the ones below it; record their new positions without animating.
  useLayoutEffect(() => { els.current.forEach((el, id) => tops.current.set(id, el.offsetTop)); }, [open]);

  const toggle = (id: string) => setOpen(o => { const n = new Set(o); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const copyEmail = () => navigator.clipboard?.writeText(site.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }, () => {});

  return (
    <main className="cv">
      {/* ---------- hero ---------- */}
      <section className="cv-hero" aria-labelledby="cv-name">
        <div className="wrap cv-hero-top">
          <p className="cv-kicker">Senior Solutions Engineer in {site.location}</p>
          <h1 id="cv-name" className="cv-name"><span>Amaka</span><span className="sr"> Ikpeazu</span></h1>
        </div>
        <div className="cv-band">
          <div className="wrap">
            <p className="cv-name cv-name-last" aria-hidden="true">Ikpeazu</p>
            <div className="cv-band-grid">
              <div>
                <p className="cv-headline">I help businesses understand, evaluate and successfully adopt complex software.</p>
                <p className="cv-sub">7+ years across SaaS, AI, RegTech, connected data and manufacturing, with customers across EMEA and the Americas.</p>
              </div>
              <div className="cv-contact">
                <a className="cv-btn light" href={`mailto:${site.email}`}>Email me</a>
                <a className="cv-btn outline" href={site.linkedin}>LinkedIn</a>
                <button className="cv-btn outline" onClick={() => window.print()}>Save as PDF</button>
              </div>
            </div>
          </div>
          {site.photoUrl ? (
            <div className="cv-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={site.photoUrl} alt={site.name} width={320} height={400} />
              {site.introVideoUrl ? <button className="cv-photo-play" onClick={() => videoRef.current?.showModal()}><i className="play" />Meet me in 60 seconds</button> : null}
            </div>
          ) : null}
        </div>
      </section>
      {site.introVideoUrl ? (
        <dialog ref={videoRef} className="cv-video" onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
          <video src={site.introVideoUrl} controls playsInline />
          <button onClick={() => videoRef.current?.close()}>Close</button>
        </dialog>
      ) : null}

      {/* ---------- switcher ---------- */}
      <div className="cv-switch">
        <div className="wrap">
          <div className="cv-switch-row" role="group" aria-label="What are you hiring for?">
            <span className="cv-switch-label">Hiring for</span>
            <button className="chip" aria-pressed={!role} onClick={() => setRole(null)}>Everything</button>
            {ROLES.map(r => <button key={r.id} className="chip" aria-pressed={role === r.id} onClick={() => setRole(r.id)}>{r.label}</button>)}
          </div>
          <div className="cv-switch-row" role="group" aria-label="Which industry?">
            <span className="cv-switch-label">In</span>
            <button className="chip small" aria-pressed={!ind} onClick={() => setInd(null)}>Any industry</button>
            {INDUSTRIES.map(i => <button key={i.id} className="chip small" aria-pressed={ind === i.id} onClick={() => setInd(i.id)}>{i.label}</button>)}
          </div>
        </div>
      </div>

      <section className="wrap cv-section" aria-live="polite">
        <p className="cv-roleline">{roleInfo ? roleInfo.line : "Pick what you're hiring for above and this page puts the relevant experience first."}</p>
        <ul className="cv-hl">
          {highlights.map(h => (
            <li key={h.id} className="hl-in"><b>{h.big}</b><span>{h.label}</span><small>{h.where}</small></li>
          ))}
        </ul>
      </section>

      {/* ---------- experience ---------- */}
      <section className="wrap cv-section" id="experience" aria-labelledby="h-exp">
        <div className="cv-sec-head">
          <h2 id="h-exp">Experience</h2>
          <p className="sub">{role || ind ? "Most relevant first" : "Newest first"}. Click a role to open it.</p>
        </div>
        <ol className="jobs">
          {jobs.map(j => {
            const isOpen = open.has(j.id);
            const match = !!skill && j.skills.includes(skill);
            const fit = (role || ind) && j.s >= 4;
            return (
              <li key={j.id} ref={el => { if (el) els.current.set(j.id, el); else els.current.delete(j.id); }}
                className={`job${isOpen ? " open" : ""}${skill && !match ? " dim" : ""}`}>
                <button className="job-head" aria-expanded={j.points.length ? isOpen : undefined} disabled={!j.points.length}
                  onClick={() => toggle(j.id)}>
                  <span className="job-when">{j.when}</span>
                  <span className="job-main">
                    <span className="job-org">{j.org}{fit ? <em className="fit">Strong fit</em> : null}{match ? <em className="fit skill">Uses {skill}</em> : null}</span>
                    <span className="job-role">{j.role}</span>
                  </span>
                  <span className="job-line">{j.line}</span>
                  {j.points.length ? <i className="job-toggle" aria-hidden="true" /> : <span />}
                </button>
                <div className="job-points">
                  {j.points.length ? <ul>{j.points.map(p => <li key={p}>{p}</li>)}</ul> : null}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="cv-edu"><b>BEng Design and Manufacturing Engineering</b>, Southampton Solent University, 2012–2017</p>
      </section>

      {/* ---------- skills ---------- */}
      <section className="wrap cv-section" id="skills" aria-labelledby="h-skills">
        <div className="cv-sec-head">
          <h2 id="h-skills">Skills</h2>
          <p className="sub">Click a skill to see where I used it.</p>
        </div>
        <ul className="pills">
          {SKILLS.map(s => {
            const lit = role ? s.roles.includes(role) : true;
            return (
              <li key={s.name}>
                <button className={`pill${lit ? " lit" : ""}`} aria-pressed={skill === s.name}
                  onClick={() => { setSkill(k => k === s.name ? null : s.name); document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
                  {s.name}
                </button>
              </li>
            );
          })}
        </ul>
        {skill ? <button className="cv-clear" onClick={() => setSkill(null)}>Clear skill filter</button> : null}
        <p className="cv-certs"><b>Certifications.</b> {CERTS.join(". ")}.</p>
      </section>

      {/* ---------- voice notes ---------- */}
      <section className="wrap cv-section" aria-labelledby="h-voice">
        <div className="cv-sec-head">
          <h2 id="h-voice">Hear it from me</h2>
          <p className="sub">Short voice notes, so you don&apos;t have to read.</p>
        </div>
        <ul className="vns">{VOICE_NOTES.map(v => <VoiceNote key={v.title} {...v} />)}</ul>
      </section>

      {/* ---------- built ---------- */}
      <section className="wrap cv-section cv-built" id="built" aria-labelledby="h-built">
        <div>
          <h2 id="h-built">Try something I built</h2>
          <p className="sub cv-built-sub">
            Kova is a side project: a small customer health app with a real API, a Postgres database and a Make workflow
            that sends real alert emails. The terminal calls it live.
          </p>
          <ul className="cv-links">
            <li><Link href="/kova">Open the Kova app</Link></li>
            <li><Link href="/kova/docs">Read the API docs</Link></li>
            <li><Link href="/architecture">See how it&apos;s built</Link></li>
          </ul>
        </div>
        <Terminal />
      </section>

      {/* ---------- contact ---------- */}
      <section className="cv-end" id="contact" aria-labelledby="h-contact">
        <div className="wrap cv-end-grid">
          <div>
            <h2 id="h-contact">Let&apos;s talk</h2>
            <p>Looking for solutions engineering, customer success and enablement roles at technically driven SaaS and AI companies.</p>
          </div>
          <div className="cv-end-links">
            <button className="cv-mail" onClick={copyEmail}>{copied ? "Copied" : site.email}<small>{copied ? "Paste it anywhere" : "Click to copy"}</small></button>
            <a href={site.linkedin}>LinkedIn</a>
            <span>{site.location}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
