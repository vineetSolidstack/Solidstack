"use client";

import * as React from "react";
import { Mic, PhoneOff, Send, Volume2, VolumeX } from "lucide-react";
import { greeting, reply, type Convo, type Turn } from "@/lib/demo/engine";
import { updateDemo, useDemo } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

type Line = { from: "ai" | "caller"; text: string };
type Recognition = {
  lang: string;
  onresult: ((e: { results: { 0: { transcript: string } }[] }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
};

/** The "phone call": a transcript panel that can also speak and listen. */
export function Receptionist({ slug, onClose }: { slug: string; onClose: () => void }) {
  const state = useDemo(slug);
  const [lines, setLines] = React.useState<Line[]>([]);
  const [convo, setConvo] = React.useState<Convo>({ step: "idle" });
  const [chips, setChips] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState("");
  const [voice, setVoice] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const [note, setNote] = React.useState("");
  const logRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const started = React.useRef(false);

  const say = React.useCallback(
    (turn: Turn, speak: boolean) => {
      setLines((l) => [...l, { from: "ai", text: turn.text }]);
      setConvo(turn.convo);
      setChips(turn.chips ?? []);
      if (turn.booking || turn.outbox) {
        updateDemo(slug, (s) => ({
          ...s,
          bookings: turn.booking ? [...s.bookings, turn.booking] : s.bookings,
          outbox: turn.outbox ? [...turn.outbox, ...s.outbox].slice(0, 40) : s.outbox,
        }));
      }
      if (speak && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(turn.text));
      }
    },
    [slug],
  );

  // The receptionist picks up as soon as the call opens.
  React.useEffect(() => {
    if (started.current) return;
    started.current = true;
    say(greeting(state.config, new Date()), false);
    inputRef.current?.focus();
  }, [say, state.config]);

  React.useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [lines]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hangUp();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function send(text: string) {
    if (!text.trim()) return;
    setDraft("");
    setLines((l) => [...l, { from: "caller", text }]);
    say(reply(state, convo, text, new Date()), voice);
  }

  function hangUp() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    onClose();
  }

  function listen() {
    const w = window as unknown as Record<string, (new () => Recognition) | undefined>;
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) {
      setNote("Speaking isn't supported in this browser. Please type instead.");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.onresult = (e) => send(e.results[0][0].transcript);
    rec.onend = () => setListening(false);
    setListening(true);
    setNote("");
    rec.start();
  }

  const iconBtn =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--d-line)] text-[var(--d-fg)]";

  return (
    <div
      role="dialog"
      aria-label={`Call with the ${state.config.name} AI receptionist`}
      className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col border border-[var(--d-line)] bg-[var(--d-card)] text-[var(--d-fg)] shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[400px] sm:rounded-2xl"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--d-line)] p-4">
        <div>
          <p className="text-[0.95rem] font-semibold">{state.config.name}</p>
          <p className="text-[0.8rem] text-[var(--d-muted)]">You&apos;re speaking to an AI assistant.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={iconBtn}
            aria-pressed={voice}
            aria-label="Read answers out loud"
            onClick={() => setVoice((v) => !v)}
          >
            {voice ? <Volume2 aria-hidden="true" className="h-5 w-5" /> : <VolumeX aria-hidden="true" className="h-5 w-5" />}
          </button>
          <button
            type="button"
            aria-label="Hang up"
            onClick={hangUp}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c62828] text-white"
          >
            <PhoneOff aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={logRef} role="log" aria-live="polite" className="flex min-h-[220px] flex-1 flex-col gap-3 overflow-y-auto p-4">
        {lines.map((l, i) => (
          <p
            key={i}
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.92rem] leading-snug",
              l.from === "ai"
                ? "self-start border border-[var(--d-line)] bg-[var(--d-bg)]"
                : "self-end bg-[var(--d-accent)] text-[var(--d-accent-fg)]",
            )}
          >
            <span className="sr-only">{l.from === "ai" ? "Receptionist: " : "You: "}</span>
            {l.text}
          </p>
        ))}
      </div>

      {chips.length ? (
        <div className="flex flex-wrap gap-2 px-4 pb-3">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => send(c)}
              className="min-h-10 rounded-full border border-[var(--d-line)] px-3.5 text-[0.85rem] hover:border-[var(--d-accent)]"
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}

      <form
        className="flex items-center gap-2 border-t border-[var(--d-line)] p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <button type="button" className={cn(iconBtn, listening && "bg-[var(--d-accent)] text-[var(--d-accent-fg)]")} aria-label="Speak your answer" onClick={listen}>
          <Mic aria-hidden="true" className="h-5 w-5" />
        </button>
        <label htmlFor="caller-input" className="sr-only">
          Say something to the receptionist
        </label>
        <input
          id="caller-input"
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={listening ? "Listening…" : "Type what you'd say…"}
          autoComplete="off"
          className="h-11 min-w-0 flex-1 rounded-full border border-[var(--d-line)] bg-[var(--d-bg)] px-4 text-[0.95rem] placeholder:text-[var(--d-muted)]"
        />
        <button type="submit" aria-label="Send" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--d-accent)] text-[var(--d-accent-fg)]">
          <Send aria-hidden="true" className="h-4 w-4" />
        </button>
      </form>
      {note ? <p role="status" className="px-4 pb-3 text-[0.8rem] text-[var(--d-muted)]">{note}</p> : null}
    </div>
  );
}
