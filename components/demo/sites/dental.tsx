"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, CalendarCheck, ChevronDown, ClipboardCheck, HeartPulse, MapPin, Phone, ShieldCheck, Smile, Sparkles, Stethoscope, Syringe, Waves } from "lucide-react";
import { Booking, CallLayer, DemoBar, HoursList, initial, skillsOf, themeVars, useSite, type Images } from "@/components/demo/shared";
import { cn } from "@/lib/utils";

const display = "font-[family-name:var(--font-jakarta)] font-bold tracking-[-0.04em]";
const accentWord = "font-serif font-normal italic tracking-normal text-[var(--d-accent)]";
const pastel = ["#d9f2ee", "#e8e4fb", "#ffe8dc", "#dcecfb", "#fdf0c8", "#e3f4d9"];
const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  newpatient: ClipboardCheck,
  checkup: Stethoscope,
  cleaning: Waves,
  filling: Syringe,
  whitening: Sparkles,
  emergency: HeartPulse,
};

const firstVisit = [
  { icon: CalendarCheck, title: "Book in a minute", body: "Choose a time online, or call and let the assistant find one for you." },
  { icon: ShieldCheck, title: "We check your cover", body: "Tell us your insurance and we confirm what's covered before you arrive." },
  { icon: Smile, title: "Meet your dentist", body: "A calm first visit: an exam, a clear plan and fees you know up front." },
];

/** Soft, airy dental site: pastel shapes, floating cards, rounded everything. */
export function DentalSite({ slug, images }: { slug: string; images: Images }) {
  const site = useSite(slug);
  const { config } = site;
  const next = site.nextFor();
  const emergency = config.services.find((s) => s.id === "emergency");
  const emergencySlot = emergency ? site.nextFor("emergency") : null;
  const collage = ["look-2", "hero", "look-1"].filter((k) => images[k]);
  const body = "font-[family-name:var(--font-jakarta)]";

  return (
    <div style={themeVars(site, ["2rem", "1.25rem", "1rem"])} className={cn(body, "min-h-dvh overflow-x-clip bg-[var(--d-bg)] text-[var(--d-fg)]")}>
      <DemoBar site={site} />

      {/* Floating glass navigation */}
      <header className="sticky top-3 z-20 px-4 pt-3">
        <div className="mx-auto flex max-w-[980px] items-center justify-between gap-3 rounded-full border border-white/70 bg-white/75 py-2 pl-6 pr-2 shadow-[0_10px_40px_-18px_rgba(15,42,46,0.45)] backdrop-blur-xl">
          <span className={cn(display, "text-[1.1rem]")}>{config.name}</span>
          <nav aria-label="Sections" className="flex items-center gap-1 text-[0.9rem] font-medium">
            <a href="#treatments" className="hidden min-h-11 items-center rounded-full px-3.5 hover:bg-[var(--d-band)] sm:flex">Treatments</a>
            <a href="#team" className="hidden min-h-11 items-center rounded-full px-3.5 hover:bg-[var(--d-band)] sm:flex">Team</a>
            <a href="#questions" className="hidden min-h-11 items-center rounded-full px-3.5 hover:bg-[var(--d-band)] sm:flex">Questions</a>
            <a href="#book" className="flex min-h-11 items-center rounded-full bg-[var(--d-accent)] px-5 font-semibold text-white">Book a visit</a>
          </nav>
        </div>
      </header>

      {/* Hero: centred, pastel shapes, tilted photo cards with live chips */}
      <section className="relative isolate">
        <div aria-hidden="true" className="absolute inset-x-0 -top-24 -z-10 h-[720px] overflow-hidden">
          <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-[#cdeee9] blur-3xl" />
          <div className="absolute right-[-6rem] top-0 h-[460px] w-[460px] rounded-full bg-[#e3defa] blur-3xl" />
          <div className="absolute left-1/2 top-64 h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-[#ffe6d8] blur-3xl" />
        </div>
        <div className="container-page flex flex-col items-center pb-10 pt-14 text-center sm:pt-20">
          <p className="inline-flex min-h-9 items-center gap-2 rounded-full bg-white px-4 text-[0.85rem] font-medium shadow-sm">
            {site.status ? <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", site.status.open ? "bg-emerald-500" : "bg-amber-500")} /> : null}
            {site.statusText ? `${site.statusText} · booking open 24/7` : " "}
          </p>
          <h1 className={cn(display, "mt-7 max-w-[13ch] text-balance leading-[1]")} style={{ fontSize: "clamp(2.9rem, 8.4vw, 6.4rem)" }}>
            A calmer way to <span className={accentWord}>see the dentist.</span>
          </h1>
          <p className="mt-6 max-w-[50ch] text-[1.1rem] leading-relaxed text-[var(--d-muted)]">{site.t.intro}</p>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#book" className="inline-flex min-h-13 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-[var(--d-accent)] px-7 py-3.5 font-semibold text-white shadow-[0_14px_30px_-12px_var(--d-accent)] sm:w-auto">
              Book a visit <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <button type="button" onClick={site.call} className="inline-flex min-h-13 w-full max-w-xs items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold shadow-sm sm:w-auto">
              <Phone aria-hidden="true" className="h-4 w-4 text-[var(--d-accent)]" /> Call the AI receptionist
            </button>
          </div>

          {collage.length ? (
            <div className="relative mt-16 flex w-full max-w-[940px] items-end justify-center gap-4 sm:gap-6">
              {collage.map((k, i) => (
                <div
                  key={k}
                  className={cn(
                    "relative overflow-hidden rounded-[2rem] border-4 border-white shadow-[0_30px_60px_-30px_rgba(15,42,46,0.5)]",
                    i === 1 ? "z-10 aspect-[4/5] w-[46%]" : "aspect-[3/4] w-[27%]",
                    i === 0 && "-rotate-6",
                    i === 2 && "rotate-6",
                    collage.length === 1 && "w-full max-w-[420px] rotate-0",
                  )}
                >
                  <Image src={images[k]} alt="" fill priority={i === 1} sizes="(min-width: 640px) 430px, 50vw" className="object-cover" />
                </div>
              ))}
              {next ? (
                <p className="absolute -top-6 left-0 z-20 rounded-2xl bg-white px-4 py-3 text-left shadow-[0_18px_40px_-18px_rgba(15,42,46,0.5)] sm:left-6">
                  <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--d-muted)]">Next opening</span>
                  <span className="block text-[1rem] font-bold text-[var(--d-accent)]">{next}</span>
                </p>
              ) : null}
              <p className="absolute -bottom-5 right-0 z-20 flex items-center gap-2.5 rounded-2xl bg-[var(--d-fg)] px-4 py-3 text-left text-white shadow-xl sm:right-6">
                <Phone aria-hidden="true" className="h-4 w-4 text-[#8fe0db]" />
                <span className="text-[0.9rem] font-semibold">Calls answered day and night</span>
              </p>
            </div>
          ) : null}
        </div>
      </section>

      <main id="main">
        {/* In pain? */}
        {emergency ? (
          <section aria-labelledby="pain-title" className="container-page pt-16">
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-[#ffe8dc] p-7 sm:p-9">
              <div>
                <h2 id="pain-title" className={cn(display, "text-[1.8rem] leading-tight sm:text-[2.2rem]")}>
                  In pain? <span className={cn(accentWord, "text-[#b04a1f]")}>We&apos;ll see you fast.</span>
                </h2>
                <p className="mt-2 text-[1rem] text-[#5a3a2a]">
                  {emergencySlot ? `Earliest emergency visit: ${emergencySlot}.` : "We keep time for emergencies. Call and the assistant will find the earliest visit."}
                </p>
              </div>
              <button type="button" onClick={() => site.bookService(emergency.id)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#10292c] px-6 font-semibold text-white">
                Book an emergency visit <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </section>
        ) : null}

        {/* Treatments: pastel icon cards */}
        <section id="treatments" className="container-page py-20 lg:py-28">
          <div className="mx-auto max-w-[40rem] text-center">
            <h2 className={cn(display, "text-[2.5rem] leading-[1.05] sm:text-[3.4rem]")}>
              Treatments with <span className={accentWord}>clear fees</span>
            </h2>
            <p className="mt-4 text-[1.05rem] text-[var(--d-muted)]">{site.t.copy.menuLead}</p>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {config.services.map((s, i) => {
              const Icon = icons[s.id] ?? Sparkles;
              return (
                <li key={s.id} className="group flex flex-col rounded-[2rem] bg-white p-7 shadow-[0_20px_50px_-34px_rgba(15,42,46,0.55)] transition-transform duration-300 hover:-translate-y-1.5">
                  <span aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: pastel[i % pastel.length] }}>
                    <Icon className="h-6 w-6 text-[var(--d-fg)]" />
                  </span>
                  <h3 className={cn(display, "mt-6 text-[1.45rem]")}>{s.name}</h3>
                  <p className="mt-1.5 flex-1 text-[0.95rem] text-[var(--d-muted)]">
                    {s.minutes} minutes{s.note ? ` · ${s.note}` : ""}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <span className={cn(display, "text-[1.6rem]")}>${s.price}</span>
                    <button type="button" onClick={() => site.bookService(s.id)} aria-label={`Book ${s.name}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-[var(--d-band)] px-5 text-[0.92rem] font-semibold transition-colors group-hover:bg-[var(--d-accent)] group-hover:text-white">
                      Book <ArrowRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* First visit */}
        <section aria-labelledby="first-title" className="bg-[var(--d-fg)] text-white">
          <div className="container-page grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-28">
            <div>
              <h2 id="first-title" className={cn(display, "text-[2.5rem] leading-[1.05] sm:text-[3.4rem]")}>
                Your first visit, <span className={cn(accentWord, "text-[#8fe0db]")}>step by step</span>
              </h2>
              <ol className="mt-10 flex flex-col gap-7">
                {firstVisit.map((s, i) => (
                  <li key={s.title} className="flex gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                      <s.icon aria-hidden="true" className="h-5 w-5 text-[#8fe0db]" />
                    </span>
                    <div>
                      <h3 className="text-[1.15rem] font-bold tracking-[-0.01em]">
                        {i + 1}. {s.title}
                      </h3>
                      <p className="mt-1 max-w-[42ch] text-[0.98rem] leading-relaxed text-[#b9cfd0]">{s.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {images.studio ? (
              <div className="relative aspect-[5/4] overflow-hidden rounded-[2.5rem]">
                <Image src={images.studio} alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
              </div>
            ) : null}
          </div>
        </section>

        {/* Team: round portraits */}
        {config.staff.length ? (
          <section id="team" className="container-page py-20 lg:py-28">
            <div className="mx-auto max-w-[40rem] text-center">
              <h2 className={cn(display, "text-[2.5rem] leading-[1.05] sm:text-[3.4rem]")}>
                Choose <span className={accentWord}>who you see</span>
              </h2>
              <p className="mt-4 text-[1.05rem] text-[var(--d-muted)]">Book with a familiar face every time, or take the earliest opening.</p>
            </div>
            <ul className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-12">
              {config.staff.map((p, i) => (
                <li key={p.id} className="flex w-[15rem] flex-col items-center text-center">
                  <div className="relative h-40 w-40 overflow-hidden rounded-full border-[6px] border-white shadow-[0_24px_50px_-28px_rgba(15,42,46,0.6)]" style={{ backgroundColor: pastel[i % pastel.length] }}>
                    {images[`team-${p.id}`] ? (
                      <Image src={images[`team-${p.id}`]} alt={p.name} fill sizes="160px" className="object-cover" />
                    ) : (
                      <span aria-hidden="true" className={cn(display, "absolute inset-0 flex items-center justify-center text-[4rem]")}>{initial(p.name)}</span>
                    )}
                  </div>
                  <h3 className={cn(display, "mt-5 text-[1.4rem]")}>{p.name}</h3>
                  <p className="text-[0.92rem] text-[var(--d-muted)]">{p.role}</p>
                  <ul className="mt-3 flex flex-1 flex-wrap content-start justify-center gap-1.5">
                    {skillsOf(config, p.services).map((n) => (
                      <li key={n} className="rounded-full bg-[var(--d-band)] px-3 py-1 text-[0.78rem] font-medium">{n}</li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => site.bookWith(p.id)} className="mt-5 min-h-11 rounded-full border-2 border-[var(--d-accent)] px-5 text-[0.92rem] font-semibold text-[var(--d-accent)] transition-colors hover:bg-[var(--d-accent)] hover:text-white">
                    Book with {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Booking */}
        <section id="book" className="scroll-mt-24 bg-[var(--d-band)]">
          <div className="container-page py-20 lg:py-28">
            <h2 className={cn(display, "text-center text-[2.5rem] leading-[1.05] sm:text-[3.4rem]")}>
              Pick a time that <span className={accentWord}>suits you</span>
            </h2>
            <div className="mt-10">
              <Booking site={site} headingClass={display} />
            </div>
          </div>
        </section>

        {/* Questions + visit */}
        <section id="questions" className="container-page grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <h2 className={cn(display, "text-[2.5rem] leading-[1.05] sm:text-[3rem]")}>
              Good <span className={accentWord}>questions</span>
            </h2>
            <div className="mt-8 flex flex-col gap-3">
              {config.faqs.filter((f) => f.q && f.a).map((f) => (
                <details key={f.id} className="group rounded-[1.5rem] bg-white px-6 shadow-[0_16px_40px_-34px_rgba(15,42,46,0.6)]">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 text-[1.05rem] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--d-accent)] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-6 leading-relaxed text-[var(--d-muted)]">{f.a}</p>
                </details>
              ))}
              <button type="button" onClick={site.call} className="flex min-h-16 items-center justify-between gap-4 rounded-[1.5rem] bg-[var(--d-accent)] px-6 text-left text-[1.05rem] font-semibold text-white">
                Something else? Ask the AI receptionist <Phone aria-hidden="true" className="h-5 w-5 shrink-0" />
              </button>
            </div>
          </div>
          <div id="visit" className="rounded-[2rem] bg-white p-7 shadow-[0_20px_50px_-34px_rgba(15,42,46,0.55)] sm:p-9">
            <h2 className={cn(display, "text-[1.8rem]")}>Visit us</h2>
            <p className="mt-3 flex items-start gap-2.5 text-[1.02rem]">
              <MapPin aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--d-accent)]" /> {config.address}
            </p>
            <div className="mt-6 text-[0.98rem]">
              <HoursList site={site} rowClass="border-b border-[var(--d-line)]" todayClass="font-bold text-[var(--d-accent)]" />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--d-band)]">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 pb-28 pt-8 sm:pb-8">
          <span className={cn(display, "text-[1.2rem]")}>{config.name}</span>
          <p className="text-[0.88rem] text-[var(--d-muted)]">{config.address} · Website and AI receptionist by SolidStack.</p>
        </div>
      </footer>

      <CallLayer site={site} />
    </div>
  );
}
