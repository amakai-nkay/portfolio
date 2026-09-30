"use client";
import { useEffect, useRef, useState } from "react";

type Line = { kind: "in" | "out" | "err" | "ok" | "dim"; text: string };
const KEY_STORE = "kova_sandbox_key";
const PROMPT = "amaka@kova:~$";

const HELP = `Commands
  kova new                      create your own sandbox
  kova score                    health score, reasons and next step
  kova send TYPE [key=value]    send a real event, e.g.
                                  kova send contact.left role=champion
                                  kova send usage.weekly active_users=12 logins=28
  kova events                   the last 8 events
  kova reset                    put the sandbox back to the start
  install                       run the same commands in your own terminal
  whoami | ls | cat FILE | clear | history`;

const FILES: Record<string, string> = {
  "about.txt": `Amaka Ikpeazu. Senior Solutions Engineer, Northampton, UK.
7+ years across SaaS, AI, RegTech and deep-tech startups, with customers
across EMEA and the Americas. Discovery, demos, APIs, integrations and
implementation, through to adoption and expansion.`,
  "skills.txt": `JavaScript, Python, SQL, Node.js, Bash, Linux command line, Git
REST APIs, webhooks, OAuth, GraphQL, Postman, iPaaS (Make, n8n, Zapier)
AWS, Azure, GCP, Kubernetes, CI/CD, PostgreSQL
LLMs, RAG, prompt engineering, agentic workflows, output evaluation
MEDDIC, POCs, enterprise demos, enablement, success plans`,
};

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: "dim", text: "Kova terminal. These commands call Kova's live API. Type help, or click a suggestion." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight }); }, [lines]);

  const print = (text: string, kind: Line["kind"] = "out") => setLines(l => [...l, ...text.split("\n").map(t => ({ kind, text: t }))]);
  const key = () => localStorage.getItem(KEY_STORE);

  const api = async (method: string, path: string, body?: unknown) => {
    const k = key();
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (k && path !== "/api/sandbox") headers.Authorization = `Bearer ${k}`;
    const r = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${j?.error?.message || "request failed"}`);
    return j;
  };

  const needKey = () => { if (!key()) { print("kova: no sandbox yet. Run: kova new", "err"); return true; } return false; };

  const run = async (raw: string) => {
    const cmd = raw.trim();
    setLines(l => [...l, { kind: "in", text: `${PROMPT} ${cmd}` }]);
    if (!cmd) return;
    setHist(h => [...h, cmd]); setHi(-1);
    const [c, ...args] = cmd.split(/\s+/);
    try {
      switch (c) {
        case "help": print(HELP); break;
        case "clear": setLines([]); break;
        case "whoami": print("amaka: Senior Solutions Engineer. Try: cat about.txt"); break;
        case "ls": print("about.txt  skills.txt  kova.sh"); break;
        case "pwd": print("/home/amaka"); break;
        case "history": print(hist.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join("\n") || "(empty)"); break;
        case "cat": {
          const f = args[0];
          if (!f) print("cat: which file? Try: ls", "err");
          else if (f === "kova.sh") print(`#!/usr/bin/env bash\n# kova.sh - a command-line client for the Kova API (Bash + curl + jq)\n# Full script: ${origin}/kova.sh  (or run: install)`);
          else if (FILES[f]) print(FILES[f]);
          else print(`cat: ${f}: No such file or directory`, "err");
          break;
        }
        case "install": case "curl": case "wget":
          print(`Run Kova from your own Linux or macOS terminal:\n\n  curl -sO ${origin}/kova.sh && chmod +x kova.sh\n  export KOVA_URL=${origin}\n  ./kova.sh new\n  ./kova.sh score\n\nNeeds curl. Output is tidier if jq is installed (sudo apt install jq).`);
          break;
        case "sudo": print("Nice try. This terminal doesn't need root.", "dim"); break;
        case "kova": await kova(args); break;
        default: print(`${c}: command not found. Type help`, "err");
      }
    } catch (e) { print(`kova: ${(e as Error).message}`, "err"); }
  };

  const kova = async (args: string[]) => {
    const [sub, ...rest] = args;
    setBusy(true);
    try {
      if (sub === "new") {
        const j = await api("POST", "/api/sandbox", {});
        localStorage.setItem(KEY_STORE, j.api_key);
        print("Sandbox created. Key saved for this browser.", "ok");
        print("Brightline Logistics is ready. Try: kova score");
      } else if (sub === "score") {
        if (needKey()) return;
        const j = await api("GET", "/api/v1/account");
        print(`${j.account.name}: ${j.health.score} (${j.health.band_label})`, j.health.band === "healthy" ? "ok" : "err");
        print(j.health.components.map((c: { label: string; score: number; max: number; reason: string }) =>
          `  ${(c.label + ":").padEnd(18)} ${String(Math.floor(c.score)).padStart(2)}/${c.max}  ${c.reason}`).join("\n"));
        print(`Next step: ${j.next_action}`, "dim");
      } else if (sub === "send") {
        if (needKey()) return;
        const [type, ...pairs] = rest;
        if (!type) { print("usage: kova send TYPE [key=value ...]", "err"); return; }
        const data: Record<string, string | number> = {};
        for (const p of pairs) {
          const i = p.indexOf("=");
          if (i < 1) { print(`kova: expected key=value, got '${p}'`, "err"); return; }
          const v = p.slice(i + 1);
          data[p.slice(0, i)] = /^-?\d+$/.test(v) ? Number(v) : v;
        }
        const j = await api("POST", "/api/v1/events", { type, data });
        print(j.event.description);
        print(`Health: ${j.health.previous} -> ${j.health.score} (${j.health.band})`, j.health.score < j.health.previous ? "err" : "ok");
        if (j.alert_triggered) print("Alert raised: the account dropped a band", "err");
      } else if (sub === "events") {
        if (needKey()) return;
        const j = await api("GET", "/api/v1/events");
        print(j.data.slice(0, 8).map((e: { created_at: string; source: string; description: string }) =>
          `${e.created_at.slice(0, 16).replace("T", " ")}  [${e.source}]  ${e.description}`).join("\n"));
      } else if (sub === "reset") {
        if (needKey()) return;
        await api("POST", "/api/v1/reset");
        print("Reset. Brightline is back to its starting point.", "ok");
      } else {
        print(HELP.split("\n").slice(0, 10).join("\n"));
      }
    } finally { setBusy(false); }
  };

  const submit = async (cmd: string) => { if (busy) return; setInput(""); await run(cmd); inputRef.current?.focus(); };

  const SUGGEST = ["kova new", "kova score", "kova send contact.left role=champion", "kova send usage.weekly active_users=14 logins=30", "kova events", "install"];

  return (
    <div className="term">
      <div className="term-bar"><span /><span /><span /><em>bash · kova</em></div>
      <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
        {lines.map((l, i) => <div key={i} className={`tl-${l.kind}`}>{l.text || "\u00a0"}</div>)}
        <div className="term-in">
          <span>{PROMPT}</span>
          <input ref={inputRef} value={input} spellCheck={false} autoCapitalize="off" autoComplete="off" aria-label="Terminal command"
            disabled={busy} placeholder={busy ? "running…" : ""}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") submit(input);
              else if (e.key === "ArrowUp") { e.preventDefault(); const n = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1); if (hist[n] !== undefined) { setHi(n); setInput(hist[n]); } }
              else if (e.key === "ArrowDown") { e.preventDefault(); if (hi < 0) return; const n = hi + 1; if (n >= hist.length) { setHi(-1); setInput(""); } else { setHi(n); setInput(hist[n]); } }
              else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); setLines([]); }
            }} />
        </div>
      </div>
      <div className="term-suggest" aria-label="Suggested commands">
        {SUGGEST.map(s => <button key={s} onClick={() => submit(s)} disabled={busy}>{s}</button>)}
      </div>
    </div>
  );
}
