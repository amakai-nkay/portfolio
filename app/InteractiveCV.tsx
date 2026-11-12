"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Terminal from "./Terminal";
import { site } from "@/lib/site";
import {
  NAME, SUMMARY, NOW, LOOKING_FOR, ROLES, INDUSTRIES, HIGHLIGHTS, JOBS, SKILL_GROUPS, CERTS, EDUCATION, VOICE_NOTES,
  type RoleId, type IndustryId, type Point,
} from "@/lib/cv";

const DEFAULT_HIGHLIGHTS = ["multi", "conv", "zero"];
const SHOWN = 3;            // bullets shown before "show more"
const PILLS_SHOWN = 10;     // skills shown per group before "show all"
const LINKED = new Set(JOBS.flatMap(j => j.skills));

function jobScore(job: (typeof JOBS)[number], role: RoleId | null, ind: IndustryId | null) {
  return (role ? (job.roles[role] || 0) * 2 : 0) + (ind && job.industries.includes(ind) ? 3 : 0);
}
function pointScore(p: Point, role: RoleId | null, ind: IndustryId | null) {
  return (role && p.roles.includes(role) ? 2 : 0) + (ind && p.industries?.includes(ind) ? 1 : 0);
}

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
  const [more, setMore] = useState<Set<string>>(new Set());
  const [allSkills, setAllSkills] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      const r = localStorage.getItem("cv_role") as RoleId | null; if (r && ROLES.some(x => x.id === r)) setRole(r);
      const i = localStorage.getItem("cv_ind") as IndustryId | null; if (i && INDUSTRIES.some(x => x.id === i)) setInd(i);
    } catch { /* storage unavailable */ }
  }, []);
  useEffect(() => {
    try {
      if (role) localStorage.setItem("cv_role", role); else localStorage.removeItem("cv_role");
      if (ind) localStorage.setItem("cv_ind", ind); else localStorage.removeItem("cv_ind");
    } catch { /* ignore */ }
  }, [role, ind]);

  const roleInfo = ROLES.find(r => r.id === role);
  const tailored = !!(role || ind);

  const jobs = useMemo(() => {
    const list = JOBS.map(j => ({
      ...j,
      s: jobScore(j, role, ind),
      pts: j.points.map((p, i) => ({ ...p, i, s: pointScore(p, role, ind) }))
        .sort((a, b) => (tailored ? b.s - a.s : 0) || a.i - b.i),
    }));
    if (tailored) list.sort((a, b) => b.s - a.s || b.start - a.start);
    return list;
  }, [role, ind, tailored]);

  useEffect(() => { if (tailored) setOpen(new Set([jobs[0].id])); }, [role, ind]); // eslint-disable-line react-hooks/exhaustive-deps

  const highlights = useMemo(() => {
    let ids = roleInfo ? [...roleInfo.highlights] : [...DEFAULT_HIGHLIGHTS];
    const swap = ind === "manufacturing" ? "lean" : ind === "iot" ? "iot" : null;
    if (swap && !ids.includes(swap)) ids = [...ids.slice(0, 2), swap];
    return ids.map(id => ({ id, ...HIGHLIGHTS[id] }));
  }, [roleInfo, ind]);

  const groups = useMemo(() => SKILL_GROUPS
    .map((g, i) => ({ ...g, i, s: (role && g.roles.includes(role) ? 2 : 0) + (ind && g.industries?.includes(ind) ? 2 : 0) }))
    .sort((a, b) => (tailored ? b.s - a.s : 0) || a.i - b.i), [role, ind, tailored]);

  /* smooth reordering (FLIP) */
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
  useLayoutEffect(() => { els.current.forEach((el, id) => tops.current.set(id, el.offsetTop)); }, [open, more]);

  const flip = (set: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) =>
    set(o => { const n = new Set(o); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const copyEmail = () => navigator.clipboard?.writeText(site.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); }, () => {});
  const pickSkill = (name: string) => {
    setSkill(k => (k === name ? null : name));
    document.getElementById("experience")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="cv">
      {/* hero */}
      <section className="wrap cv-hero" aria-labelledby="cv-name">
        <div className="cv-hero-text">
          <p className="cv-kicker">Senior Solutions Engineer, {site.location}</p>
          <h1 id="cv-name" className="cv-name">{NAME.full}</h1>
          <p className="cv-headline">I help businesses understand, evaluate and successfully adopt complex software.</p>
          {SUMMARY.map(p => <p key={p.slice(0, 20)} className="cv-summary">{p}</p>)}
          <p className="cv-now"><i aria-hidden="true" />{NOW}</p>
          <div className="cv-ctas">
            <a className="cv-btn solid" href={`mailto:${site.email}`}>Email me</a>
            <a className="cv-btn" href={site.linkedin}>LinkedIn</a>
            <button className="cv-btn" onClick={() => window.print()}>Save as PDF</button>
          </div>
        </div>
        {site.photoUrl ? (
          <div className="cv-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.photoUrl} alt={NAME.full} width={360} height={450} />
            {site.introVideoUrl ? <button className="cv-photo-play" onClick={() => videoRef.current?.showModal()}><i className="play" />Meet me in 60 seconds</button> : null}
          </div>
        ) : null}
      </section>
      {site.introVideoUrl ? (
        <dialog ref={videoRef} className="cv-video" onClick={e => { if (e.target === e.currentTarget) e.currentTarget.close(); }}>
          <video src={site.introVideoUrl} controls playsInline />
          <button onClick={() => videoRef.current?.close()}>Close</button>
        </dialog>
      ) : null}

      {/* switcher */}
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
        <p className="cv-roleline">{roleInfo ? roleInfo.line : "Pick what you're hiring for above. The experience, examples and skills below rearrange to match."}</p>
        <ul className="cv-hl">
          {highlights.map(h => <li key={h.id} className="hl-in"><b>{h.big}</b><span>{h.label}</span><small>{h.where}</small></li>)}
        </ul>
      </section>

      {/* experience */}
      <section className="wrap cv-section" id="experience" aria-labelledby="h-exp">
        <div className="cv-sec-head">
          <h2 id="h-exp">Experience</h2>
          <p className="sub">{tailored ? "Most relevant first, with the examples that fit put first." : "Newest first."} Click a role to open it.</p>
        </div>
        <ol className="jobs">
          {jobs.map(j => {
            const isOpen = open.has(j.id);
            const showAll = more.has(j.id);
            const match = !!skill && j.skills.includes(skill);
            const fit = tailored && j.s >= 4;
            const pts = showAll ? j.pts : j.pts.slice(0, SHOWN);
            return (
              <li key={j.id} ref={el => { if (el) els.current.set(j.id, el); else els.current.delete(j.id); }}
                className={`job${isOpen ? " open" : ""}${skill && !match ? " dim" : ""}`}>
                <button className="job-head" aria-expanded={j.points.length ? isOpen : undefined} disabled={!j.points.length} onClick={() => flip(setOpen, j.id)}>
                  <span className="job-when">{j.when}{j.note ? <small>{j.note}</small> : null}</span>
                  <span className="job-main">
                    <span className="job-org">{j.org}{fit ? <em className="fit">Strong fit</em> : null}{match ? <em className="fit skill">Uses {skill}</em> : null}</span>
                    <span className="job-role">{j.role}</span>
                  </span>
                  <span className="job-line">{j.line}</span>
                  {j.points.length ? <i className="job-toggle" aria-hidden="true" /> : <span />}
                </button>
                {j.points.length ? (
                  <div className="job-points">
                    <div>
                      <ul>{pts.map(p => <li key={p.i} className={tailored && p.s > 0 ? "rel" : ""}>{p.text}</li>)}</ul>
                      {j.pts.length > SHOWN ? (
                        <button className="job-more" onClick={() => flip(setMore, j.id)}>
                          {showAll ? "Show fewer" : `Show ${j.pts.length - SHOWN} more`}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="cv-edu"><b>Education.</b> {EDUCATION}</p>
      </section>

      {/* skills */}
      <section className="wrap cv-section" id="skills" aria-labelledby="h-skills">
        <div className="cv-sec-head">
          <h2 id="h-skills">Skills</h2>
          <p className="sub">Skills with a dot link to experience: click one to see where I used it.</p>
        </div>
        <div className="sgroups">
          {groups.map(g => {
            const lit = tailored ? g.s > 0 : true;
            const expanded = allSkills.has(g.title);
            const items = expanded ? g.items : g.items.slice(0, PILLS_SHOWN);
            return (
              <div key={g.title} className={`sgroup${lit ? "" : " quiet"}`}>
                <h3>{g.title}</h3>
                <ul className="pills">
                  {items.map(name => (
                    <li key={name}>
                      {LINKED.has(name)
                        ? <button className="pill link" aria-pressed={skill === name} onClick={() => pickSkill(name)}>{name}</button>
                        : <span className="pill">{name}</span>}
                    </li>
                  ))}
                </ul>
                {g.items.length > PILLS_SHOWN ? (
                  <button className="sgroup-more" onClick={() => flip(setAllSkills, g.title)}>
                    {expanded ? "Show fewer" : `Show all ${g.items.length}`}
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
        {skill ? <button className="cv-clear" onClick={() => setSkill(null)}>Clear the {skill} filter</button> : null}
        <p className="cv-certs"><b>Certifications.</b> {CERTS.join(". ")}.</p>
      </section>

      {/* voice notes */}
      <section className="wrap cv-section" aria-labelledby="h-voice">
        <div className="cv-sec-head">
          <h2 id="h-voice">Hear it from me</h2>
          <p className="sub">Short voice notes, if you&apos;d rather listen.</p>
        </div>
        <ul className="vns">{VOICE_NOTES.map(v => <VoiceNote key={v.title} {...v} />)}</ul>
      </section>

      {/* looking for */}
      <section className="wrap cv-section cv-look" id="looking-for" aria-labelledby="h-look">
        <h2 id="h-look">What I&apos;m looking for</h2>
        <div>
          <p className="cv-look-lead">{LOOKING_FOR[0]}</p>
          {LOOKING_FOR.slice(1).map(p => <p key={p.slice(0, 20)}>{p}</p>)}
        </div>
      </section>

      {/* built */}
      <section className="wrap cv-section cv-built" id="built" aria-labelledby="h-built">
        <div>
          <h2 id="h-built">Try something I built</h2>
          <p className="cv-built-sub">
            Kova is a customer health app I built: a real API, a Postgres database and a Make workflow that sends alert
            emails. The terminal calls it live.
          </p>
          <ul className="cv-links">
            <li><Link href="/kova">Open the Kova app</Link></li>
            <li><Link href="/kova/docs">Read the API docs</Link></li>
            <li><Link href="/architecture">See how it&apos;s built</Link></li>
          </ul>
        </div>
        <Terminal />
      </section>

      {/* contact */}
      <section className="cv-end" id="contact" aria-labelledby="h-contact">
        <div className="wrap cv-end-grid">
          <div>
            <h2 id="h-contact">Let&apos;s talk</h2>
            <p>Solutions engineering, customer success, sales enablement and AI roles at technically driven SaaS and AI companies.</p>
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
