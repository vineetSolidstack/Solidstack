"use client";

import * as React from "react";
import Image from "next/image";
import { CalendarCheck, Check, MousePointer2, PhoneIncoming } from "lucide-react";
import { templates } from "@/lib/demo/data";
import { cn } from "@/lib/utils";

/**
 * Hero animation: a website assembling itself in a browser window.
 * Wireframe → navigation → headline typed → photo → button → services →
 * a call comes in and gets booked → live. Then it rebuilds for the next
 * demo business. Pauses off-screen; shows the finished state with reduced motion.
 */
const PHASES = ["wire", "nav", "headline", "photo", "cta", "cards", "call", "booked", "live"] as const;
const DURATION = [900, 750, 1700, 900, 750, 1000, 1500, 1700, 2600];
const LAST = PHASES.length - 1;
const at = (name: (typeof PHASES)[number]) => PHASES.indexOf(name);

// Where the fake cursor sits during each phase (% of the canvas).
const CURSOR: [number, number][] = [
  [50, 55], [78, 9], [30, 34], [76, 42], [20, 63], [50, 86], [80, 70], [80, 70], [92, 96],
];

const checklist = [
  { label: "Design", from: at("nav") },
  { label: "Website", from: at("cta") },
  { label: "Booking", from: at("cards") },
  { label: "AI receptionist", from: at("booked") },
  { label: "Live", from: at("live") },
];

export function SiteBuilder() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [site, setSite] = React.useState(0);
  const [phase, setPhase] = React.useState(0);
  const [typed, setTyped] = React.useState(0);
  const [leaving, setLeaving] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [still, setStill] = React.useState(false);

  const t = templates[site];
  const th = t.theme;
  const headline = `${t.copy.heroLead} ${t.copy.heroEm}`;
  const p = still ? LAST : phase;
  const on = (name: (typeof PHASES)[number]) => p >= at(name);

  // Run only while visible, and not at all for people who prefer no motion.
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => {
      mq.removeEventListener("change", sync);
      io.disconnect();
    };
  }, []);

  // Step through the build, then wipe and start the next business.
  React.useEffect(() => {
    if (!active || still) return;
    const id = window.setTimeout(() => {
      if (phase < LAST) {
        setPhase(phase + 1);
      } else if (!leaving) {
        setLeaving(true);
      } else {
        setSite((site + 1) % templates.length);
        setPhase(0);
        setTyped(0);
        setLeaving(false);
      }
    }, leaving ? 550 : DURATION[phase]);
    return () => window.clearTimeout(id);
  }, [active, still, phase, leaving, site]);

  // Type the headline one character at a time.
  React.useEffect(() => {
    if (!active || still || phase !== at("headline") || typed >= headline.length) return;
    const id = window.setTimeout(() => setTyped(typed + 1), 1300 / headline.length);
    return () => window.clearTimeout(id);
  }, [active, still, phase, typed, headline.length]);

  const shown = still || phase > at("headline") ? headline : phase === at("headline") ? headline.slice(0, typed) : "";
  const wire = "border border-dashed border-current/35 bg-transparent";
  const ease = "transition-all duration-700 ease-[var(--ease)]";
  const day = Math.min(7, 1 + Math.round((p / LAST) * 6));

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[1000px]">
      <p className="sr-only">
        Animation: a website for a local business builds itself step by step, from a wireframe to a finished page with online booking, and then an
        incoming phone call is answered by the AI receptionist and booked.
      </p>
      <div aria-hidden="true" className="absolute -inset-x-10 -bottom-16 top-16 -z-10 rounded-full opacity-80 blur-3xl" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 60%, rgba(109,94,248,0.45), transparent 70%)" }} />

      <div aria-hidden="true" className="overflow-hidden rounded-[var(--radius-card)] border border-line-2 bg-elevated text-left shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
        {/* Browser bar */}
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <div className="flex shrink-0 gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <div className="flex h-7 min-w-0 flex-1 items-center justify-center rounded-md bg-white/[0.04] px-3">
            <span className="truncate font-mono text-[0.7rem] text-ink-3">
              Building: <span className="text-ink">{t.kind} website</span>
            </span>
          </div>
          <span className="shrink-0 font-mono text-[0.7rem] tabular-nums text-accent-lo">Day {day} / 7</span>
        </div>
        <div className="h-[3px] bg-white/[0.04]">
          <div className="h-full origin-left bg-gradient-to-r from-accent to-secondary-accent transition-transform duration-700 ease-[var(--ease)]" style={{ transform: `scaleX(${leaving ? 0 : p / LAST})` }} />
        </div>

        {/* The page being built */}
        <div
          className={cn("relative aspect-[4/5] overflow-hidden transition-[background-color,color,opacity] duration-700 sm:aspect-[16/10]", leaving && "opacity-0")}
          style={{ backgroundColor: on("nav") ? th.bg : "#0d0d12", color: on("nav") ? th.fg : "#8a8a99" }}
        >
          <div className="flex h-full flex-col gap-[4%] p-[5%]">
            {/* Navigation */}
            <div className="flex items-center justify-between gap-3">
              <span className={cn(ease, "rounded px-2 py-1 text-[clamp(0.7rem,1.6vw,1rem)]", th.heading, on("nav") ? "border border-transparent" : cn(wire, "text-transparent"))}>
                {t.config.name}
              </span>
              <span className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={cn(ease, "hidden h-2 w-10 rounded-full sm:block", on("nav") ? "opacity-40" : wire)} style={{ backgroundColor: on("nav") ? th.fg : undefined, transitionDelay: `${i * 90}ms` }} />
                ))}
                <span className={cn(ease, "rounded-full px-3 py-1.5 text-[0.62rem] font-semibold", !on("nav") && cn(wire, "text-transparent"))} style={on("nav") ? { backgroundColor: th.accent, color: th.accentFg } : undefined}>
                  Book
                </span>
              </span>
            </div>

            {/* Headline + photo */}
            <div className="grid min-h-0 flex-1 grid-cols-1 gap-[5%] sm:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col justify-center gap-[7%]">
                <div className={cn(ease, "min-h-[2.2em] rounded-lg leading-[1.02] text-[clamp(1.25rem,3.9vw,2.9rem)]", th.heading, !on("headline") && wire)}>
                  {shown}
                  {phase === at("headline") && !still ? <span className="sb-caret ml-0.5 inline-block h-[0.9em] w-[2px] translate-y-[0.1em] bg-current" /> : null}
                </div>
                <div className="flex flex-col gap-1.5">
                  {[92, 70].map((w, i) => (
                    <span key={w} className={cn(ease, "h-2 rounded-full", on("headline") ? "opacity-30" : wire)} style={{ width: `${w}%`, backgroundColor: on("headline") ? th.fg : undefined, transitionDelay: `${i * 120}ms` }} />
                  ))}
                </div>
                <span
                  className={cn(ease, "self-start px-4 py-2 text-[clamp(0.62rem,1.3vw,0.82rem)] font-semibold", on("cta") ? "sb-pop" : cn(wire, "text-transparent"))}
                  style={{ borderRadius: th.radius, ...(on("cta") ? { backgroundColor: th.accent, color: th.accentFg } : {}) }}
                >
                  Book online
                </span>
              </div>
              <div className={cn(ease, "relative hidden overflow-hidden rounded-xl sm:block", !on("photo") && wire)}>
                <Image
                  src={`/demo/${t.slug}/hero.jpg`}
                  alt=""
                  fill
                  sizes="420px"
                  className="object-cover transition-[clip-path] duration-[900ms] ease-[var(--ease)]"
                  style={{ clipPath: on("photo") ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
                />
              </div>
            </div>

            {/* Services */}
            <div className="grid grid-cols-3 gap-[2.5%]">
              {t.config.services.slice(0, 3).map((s, i) => (
                <div
                  key={s.id}
                  className={cn(ease, "rounded-lg p-[7%]", on("cards") ? "translate-y-0" : cn(wire, "translate-y-1 text-transparent"))}
                  style={{ transitionDelay: `${i * 130}ms`, ...(on("cards") ? { backgroundColor: th.card, border: `1px solid ${th.line}` } : {}) }}
                >
                  <span className="block truncate text-[clamp(0.56rem,1.2vw,0.8rem)] font-medium">{s.name}</span>
                  <span className="mt-1 block text-[clamp(0.7rem,1.5vw,1rem)] font-semibold" style={on("cards") ? { color: th.accent } : undefined}>
                    ${s.price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* A call comes in and gets booked */}
          <div
            className={cn(
              "absolute bottom-[26%] right-[4%] flex items-center gap-2.5 rounded-2xl bg-[#101014] px-3.5 py-2.5 text-white shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)] transition-all duration-500 ease-[var(--ease)]",
              on("call") ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
          >
            <span className={cn("flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-500", on("booked") ? "bg-emerald-500" : "bg-accent")}>
              {on("booked") ? <CalendarCheck className="h-4 w-4" /> : <PhoneIncoming className={cn("h-4 w-4", p === at("call") && "sb-ring")} />}
            </span>
            <span className="text-[0.72rem] leading-tight">
              <span className="block font-semibold">{on("booked") ? "Appointment booked" : "Incoming call…"}</span>
              <span className="block text-white/65">{on("booked") ? "Added to the calendar" : "AI receptionist answering"}</span>
            </span>
          </div>

          {/* Live stamp */}
          <span
            className={cn(
              "absolute left-[5%] top-[14%] flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-500 ease-[var(--ease)] sm:left-auto sm:right-[5%]",
              on("live") ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" /> Live
          </span>

          {/* Cursor */}
          {!still ? (
            <MousePointer2
              className="absolute h-5 w-5 fill-white text-black drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] transition-[left,top] duration-700 ease-[var(--ease)]"
              style={{ left: `${CURSOR[p][0]}%`, top: `${CURSOR[p][1]}%` }}
            />
          ) : null}
        </div>
      </div>

      {/* What has been finished so far */}
      <ul aria-hidden="true" className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {checklist.map((c) => {
          const done = !leaving && p >= c.from;
          return (
            <li
              key={c.label}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] transition-colors duration-500",
                done ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-200" : "border-line text-ink-3",
              )}
            >
              <Check className={cn("h-3 w-3 transition-opacity duration-500", done ? "opacity-100" : "opacity-25")} />
              {c.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
