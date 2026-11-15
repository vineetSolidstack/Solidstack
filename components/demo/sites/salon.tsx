"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowDown, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/site/reveal";
import { Booking, CallLayer, DemoBar, HoursList, initial, skillsOf, themeVars, useSite, type Images } from "@/components/demo/shared";
import { cn } from "@/lib/utils";

const display = "font-[family-name:var(--font-fraunces)] font-light tracking-[-0.02em]";
const label = "text-[0.72rem] font-semibold uppercase tracking-[0.24em]";

/** Editorial, magazine-style salon site: arches, oversized serif, slow motion. */
export function SalonSite({ slug, images }: { slug: string; images: Images }) {
  const site = useSite(slug);
  const { config } = site;
  const [skill, setSkill] = React.useState("");
  const team = config.staff.filter((p) => !skill || p.services.length === 0 || p.services.includes(skill));
  const looks = ["look-1", "look-2", "look-3", "look-4"].filter((k) => images[k]);
  const words = config.services.map((s) => s.name);

  return (
    <div style={themeVars(site, ["2rem", "1.25rem", "0.9rem"])} className="min-h-dvh overflow-x-clip bg-[var(--d-bg)] text-[var(--d-fg)]">
      <DemoBar site={site} />

      {/* Hero: headline left, arched photo right, spinning booking seal */}
      <header className="container-page flex items-center justify-between gap-4 py-6">
        <span className={cn(display, "text-[1.7rem] italic")}>{config.name}</span>
        <nav aria-label="Sections" className="flex items-center gap-1 text-[0.92rem]">
          <a href="#menu" className="hidden min-h-11 items-center px-3 hover:underline sm:flex">Menu</a>
          <a href="#team" className="hidden min-h-11 items-center px-3 hover:underline sm:flex">Team</a>
          <a href="#visit" className="hidden min-h-11 items-center px-3 hover:underline sm:flex">Visit</a>
          <a href="#book" className="ml-2 flex min-h-11 items-center rounded-full bg-[var(--d-fg)] px-5 font-medium text-[var(--d-bg)]">Book</a>
        </nav>
      </header>

      <section className="container-page grid items-end gap-12 pb-16 pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24 lg:pt-10">
        <div>
          <p className={cn(label, "flex items-center gap-2.5 text-[var(--d-accent)]")}>
            {site.status ? <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", site.status.open ? "bg-emerald-600" : "bg-amber-600")} /> : null}
            {site.statusText || " "}
          </p>
          <h1 className={cn(display, "mt-6 leading-[0.92]")} style={{ fontSize: "clamp(3.6rem, 11vw, 9rem)" }}>
            Hair that
            <br />
            feels like
            <br />
            <em className="font-normal text-[var(--d-accent)]">you.</em>
          </h1>
          <div className="mt-9 flex max-w-[34rem] flex-col gap-7 border-t border-[var(--d-line)] pt-7 sm:flex-row sm:items-start">
            <p className="flex-1 text-[1.05rem] leading-relaxed text-[var(--d-muted)]">{site.t.intro}</p>
            <button type="button" onClick={site.call} className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full border border-[var(--d-fg)] px-5 font-medium transition-colors hover:bg-[var(--d-fg)] hover:text-[var(--d-bg)]">
              <Phone aria-hidden="true" className="h-4 w-4" /> Call the AI receptionist
            </button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:justify-self-end">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-[var(--d-tile)]">
            {images.hero ? <Image src={images.hero} alt="" fill priority sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" /> : null}
          </div>
          <a href="#book" aria-label="Book an appointment online" className="group absolute -bottom-8 -left-4 flex h-36 w-36 items-center justify-center rounded-full bg-[var(--d-accent)] text-white shadow-xl sm:-left-12 sm:h-40 sm:w-40">
            <svg aria-hidden="true" viewBox="0 0 100 100" className="demo-spin absolute inset-0 h-full w-full">
              <defs>
                <path id="seal" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text fill="currentColor" fontSize="8.6" letterSpacing="2.2" className="font-sans font-semibold uppercase">
                <textPath href="#seal">Book online · Open 24/7 · Book online · Open 24/7 ·</textPath>
              </text>
            </svg>
            <ArrowDown aria-hidden="true" className="h-8 w-8 transition-transform group-hover:translate-y-1" />
          </a>
        </div>
      </section>

      {/* Service names drifting past */}
      <div aria-hidden="true" className="overflow-hidden border-y border-[var(--d-line)] py-5">
        <div className="demo-marquee flex w-max">
          {[0, 1].map((n) => (
            <div key={n} className="flex shrink-0 items-center">
              {words.map((w) => (
                <span key={w} className={cn(display, "flex items-center whitespace-nowrap text-[2.4rem] italic sm:text-[3.2rem]")}>
                  {w}
                  <span className="mx-7 text-[1.2rem] not-italic text-[var(--d-accent)]">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main id="main">
        {/* Menu: numbered editorial list */}
        <section id="menu" className="container-page grid gap-10 py-20 lg:grid-cols-[0.75fr_1.25fr] lg:py-32">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className={cn(label, "text-[var(--d-accent)]")}>The menu</p>
            <h2 className={cn(display, "mt-4 text-[3rem] leading-[0.98] sm:text-[4rem]")}>
              Services <em className="font-normal">&amp;</em> prices
            </h2>
            <p className="mt-5 max-w-[34ch] leading-relaxed text-[var(--d-muted)]">{site.t.copy.menuLead}</p>
            {images.studio ? (
              <div className="relative mt-10 hidden aspect-[4/5] max-w-[20rem] overflow-hidden rounded-[2rem] lg:block">
                <Image src={images.studio} alt="" fill sizes="320px" className="object-cover" />
              </div>
            ) : null}
          </div>
          <ol className="border-t border-[var(--d-fg)]">
            {config.services.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => site.bookService(s.id)}
                  aria-label={`Book ${s.name}, ${s.minutes} minutes, $${s.price}`}
                  className="group flex w-full items-center gap-5 border-b border-[var(--d-line)] py-7 text-left transition-[padding,background-color] duration-300 hover:bg-[var(--d-band)] hover:px-5"
                >
                  <span className="hidden w-8 text-[0.8rem] tabular-nums text-[var(--d-muted)] sm:block">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className={cn(display, "block text-[1.9rem] leading-tight sm:text-[2.4rem]")}>{s.name}</span>
                    <span className="mt-1 block text-[0.9rem] text-[var(--d-muted)]">
                      {s.minutes} min{s.note ? ` · ${s.note}` : ""}
                    </span>
                  </span>
                  <span className={cn(display, "text-[1.7rem] italic")}>${s.price}</span>
                  <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--d-fg)] transition-colors group-hover:bg-[var(--d-fg)] group-hover:text-[var(--d-bg)]">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </section>

        {/* Lookbook: sideways scroll */}
        {looks.length ? (
          <section aria-labelledby="looks-title" className="pb-20 lg:pb-32">
            <div className="container-page flex items-end justify-between gap-6">
              <h2 id="looks-title" className={cn(display, "text-[3rem] leading-[0.98] sm:text-[4rem]")}>
                Recent <em className="font-normal text-[var(--d-accent)]">work</em>
              </h2>
              <p className={cn(label, "hidden text-[var(--d-muted)] sm:block")}>Scroll →</p>
            </div>
            <ul tabIndex={0} aria-label="Lookbook photos" className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 lg:px-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))]">
              {looks.map((k, i) => (
                <li
                  key={k}
                  className={cn(
                    "relative w-[70vw] max-w-[22rem] shrink-0 snap-center overflow-hidden sm:w-[38vw]",
                    i % 2 ? "mt-12 aspect-[4/5] rounded-[2rem]" : "aspect-[3/4] rounded-t-[999px]",
                  )}
                >
                  <Image src={images[k]} alt="" fill sizes="(min-width: 640px) 352px, 70vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Team: arch portraits */}
        {config.staff.length ? (
          <section id="team" className="bg-[var(--d-dark)] text-[#f4ece1]">
            <div className="container-page py-20 lg:py-32">
              <div className="flex flex-wrap items-end justify-between gap-8">
                <div>
                  <p className={cn(label, "text-[#e2a184]")}>The team</p>
                  <h2 className={cn(display, "mt-4 text-[3rem] leading-[0.98] sm:text-[4rem]")}>
                    Find <em className="font-normal">your</em> stylist
                  </h2>
                </div>
                <div role="group" aria-label="Filter the team by service" className="flex max-w-[34rem] flex-wrap gap-2">
                  {[{ id: "", name: "Everyone" }, ...config.services].map((s) => (
                    <button
                      key={s.id || "all"}
                      type="button"
                      aria-pressed={skill === s.id}
                      onClick={() => setSkill(s.id)}
                      className="min-h-10 rounded-full border border-white/30 px-4 text-[0.85rem] transition-colors hover:border-white aria-pressed:border-[#f4ece1] aria-pressed:bg-[#f4ece1] aria-pressed:text-[#1d1714]"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
              <ul className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
                {team.map((p, i) => (
                  <li key={p.id} className={cn("flex flex-col", i % 2 && "lg:mt-14")}>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] bg-[#2c221d]">
                      {images[`team-${p.id}`] ? (
                        <Image src={images[`team-${p.id}`]} alt={p.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                      ) : (
                        <span aria-hidden="true" className={cn(display, "absolute inset-0 flex items-center justify-center text-[7rem] italic text-[#e2a184]")}>
                          {initial(p.name)}
                        </span>
                      )}
                    </div>
                    <h3 className={cn(display, "mt-5 text-[2rem] leading-tight")}>{p.name}</h3>
                    <p className="text-[0.9rem] text-[#c9bcae]">{p.role}</p>
                    <p className="mt-2 flex-1 text-[0.85rem] leading-relaxed text-[#c9bcae]">{skillsOf(config, p.services).join(" · ")}</p>
                    <button type="button" onClick={() => site.bookWith(p.id)} className="mt-4 inline-flex min-h-11 items-center gap-2 self-start border-b border-[#f4ece1] text-[0.95rem] font-medium hover:text-[#e2a184]">
                      Book with {p.name} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
              {team.length === 0 ? <p className="mt-8 text-[#c9bcae]">Nobody on the team offers that yet.</p> : null}
            </div>
          </section>
        ) : null}

        {/* Booking */}
        <section id="book" className="scroll-mt-6 bg-[var(--d-band)]">
          <div className="container-page py-20 lg:py-32">
            <Reveal>
              <p className={cn(label, "text-[var(--d-accent)]")}>Book online</p>
              <h2 className={cn(display, "mt-4 text-[3rem] leading-[0.98] sm:text-[4rem]")}>
                Pick <em className="font-normal">your</em> time
              </h2>
            </Reveal>
            <div className="mt-10">
              <Booking site={site} headingClass={display} />
            </div>
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="container-page grid gap-12 py-20 lg:grid-cols-2 lg:py-32">
          <div>
            <h2 className={cn(display, "leading-[0.95]")} style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
              See you <em className="font-normal text-[var(--d-accent)]">soon.</em>
            </h2>
            <p className="mt-7 flex items-start gap-2.5 text-[1.1rem]">
              <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[var(--d-accent)]" /> {config.address}
            </p>
            <p className="mt-5 max-w-[42ch] leading-relaxed text-[var(--d-muted)]">
              Questions about colour, timing or prices? Call any time. The assistant knows our hours, our menu and our calendar, and {config.owner} gets a
              message for anything it can&apos;t answer.
            </p>
          </div>
          <div>
            <p className={cn(label, "text-[var(--d-accent)]")}>Opening hours</p>
            <div className="mt-4 text-[1.02rem]">
              <HoursList site={site} rowClass="border-b border-[var(--d-line)]" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--d-line)]">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 pb-28 pt-8 sm:pb-8">
          <span className={cn(display, "text-[1.5rem] italic")}>{config.name}</span>
          <p className="text-[0.88rem] text-[var(--d-muted)]">{config.address} · Website and AI receptionist by SolidStack.</p>
        </div>
      </footer>

      <CallLayer site={site} />
    </div>
  );
}
