"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

type WinId = "kova" | "about" | "photo" | "factory";
type Pos = { x: number; y: number };

// Starting positions as fractions of the desk, so the layout works at any width.
const START: Record<WinId, { fx: number; y: number; w: number }> = {
  about:   { fx: 0.025, y: 26,  w: 300 },
  kova:    { fx: 0.335, y: 54,  w: 360 },
  photo:   { fx: 0.74, y: 22,   w: 240 },
  factory: { fx: 0.06, y: 300,  w: 330 },
};
const TITLES: Record<WinId, string> = {
  kova: "kova.app",
  about: "about.txt",
  photo: "amaka.jpg",
  factory: "factory-floor.txt",
};

function band(n: number) { return n >= 70 ? "healthy" : n >= 50 ? "at_risk" : "critical"; }
const BAND_LABEL = { healthy: "Healthy", at_risk: "At risk", critical: "Critical" } as const;

function MiniKova() {
  const [score, setScore] = useState(86);
  const [log, setLog] = useState<string[]>(["Brightline Logistics, 50 seats"]);
  const hit = (label: string, delta: number) => {
    const s = score;
    const n = Math.max(12, Math.min(100, s + delta));
    const crossed = band(n) !== band(s) && n < s;
    setScore(n);
    setLog(l => [crossed ? `${label}. Now ${BAND_LABEL[band(n)].toLowerCase()}: alert sent to the CSM` : `${label}. Health ${s} to ${n}`, ...l].slice(0, 3));
  };
  const b = band(score);
  const R = 40, C = 2 * Math.PI * R;
  return (
    <div className="mk">
      <div className="mk-top">
        <svg viewBox="0 0 100 100" className="mk-ring" role="img" aria-label={`Health score ${score}, ${BAND_LABEL[b]}`}>
          <circle cx="50" cy="50" r={R} className="mk-track" />
          <circle cx="50" cy="50" r={R} className={`mk-arc c-${b}`} strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} />
          <text x="50" y="56" textAnchor="middle" className={`mk-num c-${b}`}>{score}</text>
        </svg>
        <div>
          <span className={`band ${b}`}>{BAND_LABEL[b]}</span>
          <ul className="mk-log" aria-live="polite">{log.map((l, i) => <li key={i + l}>{l}</li>)}</ul>
        </div>
      </div>
      <div className="mk-btns">
        <button onClick={() => hit("Champion leaves", -10)}>Champion leaves</button>
        <button onClick={() => hit("Usage drops", -18)}>Usage drops</button>
        <button onClick={() => hit("Urgent ticket", -8)}>Urgent ticket</button>
        <button onClick={() => { setScore(86); setLog(["Back to the start"]); }}>Reset</button>
      </div>
      <p className="mk-foot">A preview. <Link href="/kova">Open the full product</Link>, with its real API and alert emails.</p>
    </div>
  );
}

export default function Desk() {
  const deskRef = useRef<HTMLDivElement>(null);
  const [wide, setWide] = useState(false);
  const [pos, setPos] = useState<Record<WinId, Pos> | null>(null);
  const [open, setOpen] = useState<Record<WinId, boolean>>({ kova: true, about: true, photo: !!site.photoUrl, factory: true });
  const [order, setOrder] = useState<WinId[]>(["factory", "about", "photo", "kova"]);
  const drag = useRef<{ id: WinId; dx: number; dy: number } | null>(null);

  const layout = useCallback(() => {
    const el = deskRef.current; if (!el) return;
    const w = el.clientWidth;
    const p = {} as Record<WinId, Pos>;
    (Object.keys(START) as WinId[]).forEach(id => {
      const s = START[id];
      p[id] = { x: Math.max(8, Math.min(w - s.w - 8, Math.round(s.fx * w))), y: s.y };
    });
    setPos(p);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px)");
    const set = () => { setWide(mq.matches); if (mq.matches) layout(); };
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, [layout]);

  const front = (id: WinId) => setOrder(o => [...o.filter(x => x !== id), id]);
  const show = (id: WinId) => { setOpen(o => ({ ...o, [id]: true })); front(id); };

  const onDown = (id: WinId) => (e: React.PointerEvent) => {
    if (!wide || !pos) return;
    if ((e.target as HTMLElement).closest("button")) return;
    const r = deskRef.current!.getBoundingClientRect();
    drag.current = { id, dx: e.clientX - r.left - pos[id].x, dy: e.clientY - r.top - pos[id].y };
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    front(id);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current; if (!d || !deskRef.current) return;
    const r = deskRef.current.getBoundingClientRect();
    const w = START[d.id].w;
    const x = Math.max(-w + 80, Math.min(r.width - 80, e.clientX - r.left - d.dx));
    const y = Math.max(0, Math.min(r.height - 90, e.clientY - r.top - d.dy));
    setPos(p => p ? { ...p, [d.id]: { x, y } } : p);
  };
  const onUp = () => { drag.current = null; };

  const win = (id: WinId, body: React.ReactNode) => {
    if (!open[id]) return null;
    const style = wide && pos ? { left: pos[id].x, top: pos[id].y, width: START[id].w, zIndex: 10 + order.indexOf(id) } : undefined;
    return (
      <section key={id} className={`win win-${id}`} style={style} aria-label={TITLES[id]} onPointerDown={() => front(id)}>
        <header className="win-bar" onPointerDown={onDown(id)} onPointerMove={onMove} onPointerUp={onUp}>
          <button className="win-x" aria-label={`Close ${TITLES[id]}`} onClick={() => setOpen(o => ({ ...o, [id]: false }))} />
          <span>{TITLES[id]}</span>
        </header>
        <div className="win-body">{body}</div>
      </section>
    );
  };

  return (
    <div className="desk-wrap">
      <div className="desk" ref={deskRef}>
        {win("about", (
          <div className="txt">
            <p>Senior Solutions Engineer, based in Northampton.</p>
            <p>Customers across EMEA and the Americas, in SaaS, AI, RegTech, security and connected data.</p>
            <p>Happiest between the customer, the product team and the code.</p>
          </div>
        ))}
        {win("kova", <MiniKova />)}
        {site.photoUrl ? win("photo", (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={site.photoUrl} alt={`${site.name}`} className="photo-img" width={250} height={312} />
        )) : null}
        {win("factory", (
          <div className="txt">
            <p>Before software, I was a manufacturing engineer. Lean Six Sigma on steel and composite lines at Fusion Building Systems lifted output 22%.</p>
            <p>I still map a customer&apos;s process like a production line: find where the work waits.</p>
          </div>
        ))}
        {wide ? <p className="desk-hint">Drag the windows. Reopen closed ones from the dock.</p> : null}
      </div>
      <nav className="dock" aria-label="Open a window">
        <button onClick={() => show("kova")} aria-pressed={open.kova}><i className="ic ic-kova" />Kova</button>
        <button onClick={() => show("about")} aria-pressed={open.about}><i className="ic ic-txt" />About</button>
        {site.photoUrl ? <button onClick={() => show("photo")} aria-pressed={open.photo}><i className="ic ic-img" />Photo</button> : null}
        <button onClick={() => show("factory")} aria-pressed={open.factory}><i className="ic ic-txt" />Factory floor</button>
        <a href="#terminal"><i className="ic ic-term" />Terminal</a>
        {site.email ? <a href={`mailto:${site.email}`}><i className="ic ic-mail" />Email</a> : null}
      </nav>
    </div>
  );
}
