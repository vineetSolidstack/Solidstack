"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowRight, Disc3, Droplets, MapPin, Phone, RotateCw, Snowflake, TriangleAlert, Wrench } from "lucide-react";
import { Booking, CallLayer, DemoBar, HoursList, initial, skillsOf, themeVars, useSite, type Images } from "@/components/demo/shared";
import { cn } from "@/lib/utils";

const display = "font-[family-name:var(--font-barlow)] font-extrabold uppercase tracking-[-0.01em]";
const mono = "font-mono text-[0.7rem] uppercase tracking-[0.16em]";
const panel = "border border-[var(--d-line)] bg-[var(--d-card)]";

// "What's wrong?" shortcuts. Each points at a service id and is hidden if that service was removed.
const symptoms = [
  { icon: Disc3, text: "Brakes squeak or grind", service: "brakecheck" },
  { icon: TriangleAlert, text: "Warning light is on", service: "diag" },
  { icon: Droplets, text: "Due for an oil change", service: "oil" },
  { icon: Snowflake, text: "A/C isn't cold", service: "ac" },
  { icon: RotateCw, text: "Tires wearing unevenly", service: "tires" },
];

const steps = [
  ["Book a slot", "Online or by phone, any hour. Pick the job and the time."],
  ["Drop it off", "Hand over the keys. Tell us anything we should know."],
  ["We call first", "If we find more, you get a call and a price before we touch it."],
  ["Drive away", "Pay the price you were quoted and get back on the road."],
];

/** Corner marks that make a panel read like a technical drawing. */
function Brackets() {
  return (
    <>
      {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
        <span key={c} aria-hidden="true" className={cn("absolute h-4 w-4 border-[var(--d-accent)]", c)} />
      ))}
    </>
  );
}

/** Industrial, dashboard-style auto shop site: condensed type, hard corners, live tiles. */
export function AutoSite({ slug, images }: { slug: string; images: Images }) {
  const site = useSite(slug);
  const { config } = site;
  const looks = ["look-1", "look-2", "look-3", "look-4"].filter((k) => images[k]);
  const quick = symptoms.filter((s) => config.services.some((x) => x.id === s.service));
  const next = site.nextFor();

  return (
    <div style={themeVars(site, ["4px", "3px", "2px"])} className="min-h-dvh overflow-x-clip bg-[var(--d-bg)] text-[var(--d-fg)]">
      <DemoBar site={site} />
      <div aria-hidden="true" className="demo-hazard h-2" />

      <div className="demo-gridlines">
        <header className="container-page flex items-center justify-between gap-4 py-5">
          <span className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center bg-[var(--d-accent)] text-[var(--d-accent-fg)]">
              <Wrench className="h-5 w-5" />
            </span>
            <span className={cn(display, "text-[1.3rem] leading-none sm:text-[1.6rem]")}>{config.name}</span>
          </span>
          <nav aria-label="Sections" className={cn(mono, "flex items-center gap-1")}>
            <a href="#services" className="hidden min-h-11 items-center px-3 hover:text-[var(--d-accent)] sm:flex">Services</a>
            <a href="#crew" className="hidden min-h-11 items-center px-3 hover:text-[var(--d-accent)] sm:flex">Crew</a>
            <a href="#visit" className="hidden min-h-11 items-center px-3 hover:text-[var(--d-accent)] sm:flex">Visit</a>
            <a href="#book" className="ml-2 flex min-h-11 items-center whitespace-nowrap bg-[var(--d-accent)] px-4 font-semibold text-[var(--d-accent-fg)]">Book a slot</a>
          </nav>
        </header>

        {/* Hero: wall-to-wall headline over a dashboard of live tiles */}
        <section className="container-page pb-16 pt-8 lg:pb-24">
          <h1 className={cn(display, "leading-[0.84]")} style={{ fontSize: "clamp(3.6rem, 13.5vw, 11.5rem)" }}>
            Honest repairs.
            <br />
            <span className="text-transparent [-webkit-text-stroke:2px_var(--d-accent)]">Back on the</span>{" "}
            <span className="text-[var(--d-accent)]">road fast.</span>
          </h1>

          <div className="mt-10 grid gap-3 lg:grid-cols-4 lg:grid-rows-2">
            <div className={cn(panel, "relative min-h-[260px] overflow-hidden lg:col-span-2 lg:row-span-2")}>
              {images.hero ? <Image src={images.hero} alt="" fill priority sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" /> : null}
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <Brackets />
              <p className="absolute inset-x-5 bottom-5 max-w-[42ch] text-[1.02rem] leading-relaxed text-[#f2f0ea]">{site.t.intro}</p>
            </div>

            <div className={cn(panel, "relative flex flex-col justify-between p-5 lg:col-span-2")}>
              <Brackets />
              <p className={cn(mono, "text-[var(--d-muted)]")}>Next free slot</p>
              <p className={cn(display, "mt-3 text-[2.6rem] leading-none text-[var(--d-accent)] sm:text-[3.4rem]")}>{next ?? " "}</p>
              <a href="#book" className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 self-start bg-[var(--d-accent)] px-6 font-semibold text-[var(--d-accent-fg)]">
                Book it <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>

            <div className={cn(panel, "flex flex-col justify-between p-5")}>
              <p className={cn(mono, "text-[var(--d-muted)]")}>Shop status</p>
              <p className="mt-3 flex items-center gap-2.5 text-[1.05rem] font-semibold">
                {site.status ? (
                  <span aria-hidden="true" className={cn("h-3 w-3 rounded-full", site.status.open ? "bg-emerald-400 shadow-[0_0_12px_#34d399]" : "bg-red-500 shadow-[0_0_12px_#ef4444]")} />
                ) : null}
                {site.statusText || " "}
              </p>
              <p className="mt-2 text-[0.88rem] text-[var(--d-muted)]">Booking stays open 24/7.</p>
            </div>

            <button type="button" onClick={site.call} className={cn(panel, "group flex flex-col justify-between p-5 text-left transition-colors hover:border-[var(--d-accent)]")}>
              <span className={cn(mono, "text-[var(--d-muted)]")}>AI receptionist</span>
              <span className={cn(display, "mt-3 flex items-center gap-3 text-[1.9rem] leading-none")}>
                <Phone aria-hidden="true" className="h-6 w-6 text-[var(--d-accent)]" /> Call now
              </span>
              <span className="mt-2 text-[0.88rem] text-[var(--d-muted)]">Answers every call, day or night.</span>
            </button>
          </div>
        </section>
      </div>

      <main id="main">
        {/* What's wrong? */}
        {quick.length ? (
          <section aria-labelledby="wrong-title" className="border-y border-[var(--d-line)] bg-[var(--d-band)]">
            <div className="container-page py-12">
              <h2 id="wrong-title" className={cn(display, "text-[2.2rem] leading-none sm:text-[2.8rem]")}>
                What&apos;s wrong with it?
              </h2>
              <p className="mt-2 text-[var(--d-muted)]">Pick the closest one and we&apos;ll line up the right job.</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {quick.map((s) => (
                  <li key={s.service}>
                    <button
                      type="button"
                      onClick={() => site.bookService(s.service)}
                      className={cn(panel, "group flex h-full min-h-[104px] w-full flex-col justify-between gap-4 p-4 text-left transition-colors hover:border-[var(--d-accent)] hover:bg-[var(--d-accent)] hover:text-[var(--d-accent-fg)]")}
                    >
                      <s.icon aria-hidden="true" className="h-6 w-6 text-[var(--d-accent)] group-hover:text-[var(--d-accent-fg)]" />
                      <span className="text-[0.98rem] font-semibold leading-snug">{s.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* Services: spec sheet */}
        <section id="services" className="container-page py-20 lg:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className={cn(display, "leading-[0.88]")} style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}>
              Price <span className="text-[var(--d-accent)]">list</span>
            </h2>
            <p className="max-w-[38ch] text-[var(--d-muted)]">{site.t.copy.menuLead}</p>
          </div>
          <div className={cn(mono, "mt-10 hidden grid-cols-[3rem_1fr_7rem_6rem_8rem] gap-4 border-b border-[var(--d-fg)] pb-3 text-[var(--d-muted)] md:grid")}>
            <span>No.</span>
            <span>Job</span>
            <span>Time</span>
            <span>Price</span>
            <span />
          </div>
          <ul>
            {config.services.map((s, i) => (
              <li key={s.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-[var(--d-line)] py-5 transition-colors hover:bg-[var(--d-band)] md:grid-cols-[3rem_1fr_7rem_6rem_8rem]">
                <span className={cn(mono, "hidden text-[var(--d-accent)] md:block")}>{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className={cn(display, "block text-[1.7rem] leading-none sm:text-[2rem]")}>{s.name}</span>
                  {s.note ? <span className="mt-1.5 block text-[0.9rem] text-[var(--d-muted)]">{s.note}</span> : null}
                </span>
                <span className={cn(mono, "hidden md:block")}>{s.minutes} min</span>
                <span className={cn(display, "text-[1.7rem] leading-none text-[var(--d-accent)]")}>${s.price}</span>
                <button type="button" onClick={() => site.bookService(s.id)} aria-label={`Book ${s.name}`} className={cn(mono, "col-span-2 min-h-11 border border-[var(--d-fg)] px-4 font-semibold transition-colors hover:border-[var(--d-accent)] hover:bg-[var(--d-accent)] hover:text-[var(--d-accent-fg)] md:col-span-1")}>
                  Book <span className="md:hidden">· {s.minutes} min</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* How a visit works */}
        <section aria-labelledby="steps-title" className="border-y border-[var(--d-line)] bg-[var(--d-band)]">
          <div className="container-page py-16 lg:py-20">
            <h2 id="steps-title" className={cn(mono, "text-[var(--d-accent)]")}>How a visit works</h2>
            <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(([title, body], i) => (
                <li key={title}>
                  <span aria-hidden="true" className={cn(display, "block text-[5.5rem] leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_var(--d-muted)]")}>{i + 1}</span>
                  <h3 className={cn(display, "mt-4 text-[1.6rem] leading-none")}>{title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-[var(--d-muted)]">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Workshop mosaic */}
        {looks.length ? (
          <section aria-labelledby="shop-title" className="container-page py-20 lg:py-28">
            <h2 id="shop-title" className={cn(display, "leading-[0.88]")} style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}>
              Inside the <span className="text-[var(--d-accent)]">shop</span>
            </h2>
            <ul className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-3 lg:auto-rows-[220px] lg:grid-cols-4">
              {looks.map((k, i) => (
                <li key={k} className={cn("group relative overflow-hidden border border-[var(--d-line)]", i === 0 && "col-span-2 row-span-2", i === 3 && "col-span-2 lg:col-span-2")}>
                  <Image src={images[k]} alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Crew: ID badges */}
        {config.staff.length ? (
          <section id="crew" className="container-page pb-20 lg:pb-28">
            <h2 className={cn(display, "leading-[0.88]")} style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}>
              Pick your <span className="text-[var(--d-accent)]">tech</span>
            </h2>
            <ul className="mt-10 grid gap-3 lg:grid-cols-3">
              {config.staff.map((p, i) => (
                <li key={p.id} className={cn(panel, "relative flex gap-5 p-5")}>
                  <Brackets />
                  <div className="relative h-28 w-24 shrink-0 overflow-hidden bg-[var(--d-accent)] text-[var(--d-accent-fg)]">
                    {images[`team-${p.id}`] ? (
                      <Image src={images[`team-${p.id}`]} alt={p.name} fill sizes="96px" className="object-cover" />
                    ) : (
                      <span aria-hidden="true" className={cn(display, "absolute inset-0 flex items-center justify-center text-[4.5rem] leading-none")}>{initial(p.name)}</span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className={cn(mono, "text-[var(--d-muted)]")}>Tech {String(i + 1).padStart(2, "0")}</p>
                    <h3 className={cn(display, "mt-1 text-[2rem] leading-none")}>{p.name}</h3>
                    <p className="mt-1 text-[0.9rem] text-[var(--d-muted)]">{p.role}</p>
                    <ul className="mt-3 flex flex-1 flex-wrap content-start gap-1.5">
                      {skillsOf(config, p.services).map((n) => (
                        <li key={n} className={cn(mono, "border border-[var(--d-line)] px-2 py-1 text-[0.62rem]")}>{n}</li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => site.bookWith(p.id)} className={cn(mono, "mt-4 min-h-11 self-start border border-[var(--d-fg)] px-4 font-semibold transition-colors hover:border-[var(--d-accent)] hover:bg-[var(--d-accent)] hover:text-[var(--d-accent-fg)]")}>
                      Book with {p.name}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Booking */}
        <section id="book" className="scroll-mt-6 border-y border-[var(--d-line)] bg-[var(--d-band)]">
          <div className="container-page py-20 lg:py-28">
            <h2 className={cn(display, "leading-[0.88]")} style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}>
              Book a <span className="text-[var(--d-accent)]">slot</span>
            </h2>
            <div className="mt-10">
              <Booking site={site} headingClass={display} />
            </div>
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="container-page grid gap-10 py-20 lg:grid-cols-[1fr_1.1fr] lg:py-28">
          <div>
            <h2 className={cn(display, "leading-[0.88]")} style={{ fontSize: "clamp(2.8rem, 8vw, 6rem)" }}>
              Find <span className="text-[var(--d-accent)]">us</span>
            </h2>
            <p className="mt-6 flex items-start gap-2.5 text-[1.1rem] font-semibold">
              <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[var(--d-accent)]" /> {config.address}
            </p>
            <p className="mt-4 max-w-[42ch] leading-relaxed text-[var(--d-muted)]">
              Not sure what the car needs? Call any time. The assistant knows our hours, prices and calendar, and {config.owner} gets a message for anything
              it can&apos;t answer.
            </p>
            <button type="button" onClick={site.call} className="mt-7 inline-flex min-h-12 items-center gap-2 border border-[var(--d-fg)] px-6 font-semibold transition-colors hover:border-[var(--d-accent)] hover:bg-[var(--d-accent)] hover:text-[var(--d-accent-fg)]">
              <Phone aria-hidden="true" className="h-4 w-4" /> Call the AI receptionist
            </button>
          </div>
          <div className={cn(panel, "relative p-6 sm:p-8")}>
            <Brackets />
            <p className={cn(mono, "text-[var(--d-accent)]")}>Opening hours</p>
            <div className="mt-4 font-mono text-[0.92rem]">
              <HoursList site={site} rowClass="border-b border-[var(--d-line)]" todayClass="text-[var(--d-accent)]" />
            </div>
          </div>
        </section>
      </main>

      <div aria-hidden="true" className="demo-hazard h-2" />
      <footer>
        <div className="container-page flex flex-wrap items-center justify-between gap-4 pb-28 pt-8 sm:pb-8">
          <span className={cn(display, "text-[1.4rem] leading-none")}>{config.name}</span>
          <p className={cn(mono, "text-[var(--d-muted)]")}>{config.address} · Website and AI receptionist by SolidStack</p>
        </div>
      </footer>

      <CallLayer site={site} />
    </div>
  );
}
