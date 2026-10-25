"use client";
import { useEffect, useRef, useState } from "react";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setN(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 900;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <b ref={ref}>{n}{suffix}</b>;
}

export default function Wins() {
  return (
    <ul className="wins" aria-label="Selected results">
      <li><b>Multi-million</b><span>Commercial and enterprise revenue impact</span><small>Influencing multi-million-dollar opportunities across EMEA and the Americas through technical discovery, solution architecture, proof-of-concept delivery and ROI validation</small></li>
      <li><CountUp to={15} suffix="%" /><span>Higher enterprise conversion</span><small>From technical narratives tied to outcomes each customer defined</small></li>
      <li><CountUp to={20} suffix="%" /><span>Faster RFP and RFI responses</span><small>From an AI-powered automation tool I built in Python, with human review</small></li>
      <li><b>Built from zero</b><span>Global technical sales enablement at Kinsta</span><small>3 certification tracks, 6 reusable demo frameworks and 10 technical sales playbooks, used across global teams</small></li>
    </ul>
  );
}
