"use client";
import { useEffect, useRef, useState } from "react";
import { ROLES, type RoleId } from "@/lib/cv";

const LINE1 = "Hi, I'm Amaka.";
const LINE2 = "What are you hiring for?";

// A typewriter welcome. Picking an answer tailors the page underneath, then the sheet lifts away.
export default function Welcome({ replay, onPick }: { replay: number; onPick: (r: RoleId | null) => void }) {
  const [state, setState] = useState<"hidden" | "typing" | "ready" | "leaving">("typing");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [pressed, setPressed] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const first = useRef(true);

  const clear = () => { timers.current.forEach(t => clearTimeout(t)); timers.current = []; };
  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)); };

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("cv_welcomed") === "1"; } catch { /* ignore */ }
    if (first.current && seen) { first.current = false; setState("hidden"); return; }
    first.current = false;

    clear(); setA(""); setB(""); setPressed(null); setState("typing");
    document.documentElement.classList.add("welcome-lock");
    window.scrollTo(0, 0);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setA(LINE1); setB(LINE2); setState("ready"); return clear; }

    // uneven key timing so it feels typed, not animated
    const key = (c: string) => (c === " " ? 90 : c === "," || c === "." || c === "?" ? 220 : 40 + Math.random() * 65);
    let t = 400;
    [...LINE1].forEach((_, i) => { t += key(LINE1[i]); later(() => setA(LINE1.slice(0, i + 1)), t); });
    t += 450; // carriage return
    [...LINE2].forEach((_, i) => { t += key(LINE2[i]) * 0.6; later(() => setB(LINE2.slice(0, i + 1)), t); });
    later(() => setState("ready"), t + 250);
    return clear;
  }, [replay]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state === "hidden") document.documentElement.classList.remove("welcome-lock");
  }, [state]);

  const pick = (r: RoleId | null, id: string) => {
    if (state === "leaving") return;
    clear(); setA(LINE1); setB(LINE2);
    setPressed(id);
    onPick(r);
    try { sessionStorage.setItem("cv_welcomed", "1"); } catch { /* ignore */ }
    later(() => setState("leaving"), 220);
    later(() => setState("hidden"), 1150);
  };

  useEffect(() => {
    if (state !== "typing" && state !== "ready") return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") pick(null, "skip"); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  if (state === "hidden") return null;
  const typingA = a.length < LINE1.length;
  return (
    <div className={`welcome ${state}`} role="dialog" aria-modal="true" aria-labelledby="welcome-q">
      <div className="welcome-sheet">
        <p className="welcome-hi" aria-label={LINE1}>
          {a}{typingA ? <span className="caret" aria-hidden="true" /> : null}
        </p>
        <p className="welcome-q" id="welcome-q" aria-label={LINE2}>
          {b}{!typingA ? <span className="caret" aria-hidden="true" /> : null}
        </p>
        <div className="welcome-keys">
          {ROLES.map((r, i) => (
            <button key={r.id} className={`key${r.extra ? " alt" : ""}${pressed === r.id ? " down" : ""}`}
              style={{ transitionDelay: state === "ready" ? `${i * 55}ms` : "0ms" }}
              onClick={() => pick(r.id, r.id)} tabIndex={state === "ready" ? 0 : -1}>
              {r.short}
            </button>
          ))}
          <button className={`key ghost${pressed === "all" ? " down" : ""}`} style={{ transitionDelay: state === "ready" ? `${ROLES.length * 55}ms` : "0ms" }}
            onClick={() => pick(null, "all")} tabIndex={state === "ready" ? 0 : -1}>Just having a look</button>
        </div>
        <p className="welcome-hint">Pick one and the page rearranges itself around it.</p>
        <button className="welcome-skip" onClick={() => pick(null, "skip")}>Skip intro</button>
      </div>
    </div>
  );
}
