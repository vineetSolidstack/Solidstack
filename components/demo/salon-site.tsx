"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Phone, Settings } from "lucide-react";
import { BookingWidget } from "@/components/demo/booking";
import { Receptionist } from "@/components/demo/receptionist";
import { fmtTime, fromYmd, getStatus, ymd } from "@/lib/demo/engine";
import { useDemo, useNow } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
const shortDate = (s: string) => fromYmd(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });

const serif = "font-serif font-normal tracking-normal";
const eyebrow = "text-[0.75rem] font-semibold uppercase tracking-[0.22em]";

const vars = {
  "--d-bg": "#f5f0e8",
  "--d-fg": "#1d1714",
  "--d-muted": "#685a50",
  "--d-card": "#fffaf2",
  "--d-line": "#1d171424",
  "--d-accent": "#8f4a2f",
  "--d-accent-fg": "#ffffff",
  "--d-radius": "999px",
  colorScheme: "light",
} as React.CSSProperties;

/**
 * Salon template. `images` maps a slot name (hero, studio, look-1 … look-4) to
 * a file in /public/demo/salon. Sections without an image fall back gracefully.
 */
export function SalonSite({ slug, images }: { slug: string; images: Record<string, string> }) {
  const { config } = useDemo(slug);
  const now = useNow();
  const [calling, setCalling] = React.useState(false);
  const [serviceId, setServiceId] = React.useState(config.services[0]?.id ?? "");
  const status = now ? getStatus(config, now) : null;
  const upcomingOff = now ? config.timeOff.filter((o) => o.from && o.to >= ymd(now)) : [];
  const looks = ["look-1", "look-2", "look-3", "look-4"].filter((k) => images[k]);

  function bookService(id: string) {
    setServiceId(id);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div style={vars} className="min-h-dvh bg-[var(--d-bg)] text-[var(--d-fg)]">
      <div className="bg-[#08080b] text-[0.82rem] text-[#c3c3ce]">
        <div className="container-page flex flex-wrap items-center justify-between gap-x-4 py-1">
          <span>Demo site by SolidStack. {config.name} is a made-up business.</span>
          <span className="flex gap-4">
            <Link href="/#demo" className="flex min-h-11 items-center underline underline-offset-4">All demos</Link>
            <Link href={`/demo/${slug}/admin`} className="flex min-h-11 items-center gap-1.5 font-semibold text-white underline underline-offset-4">
              <Settings aria-hidden="true" className="h-3.5 w-3.5" /> Change the settings
            </Link>
          </span>
        </div>
      </div>

      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#1d1714] text-[#f7f1e8]">
        {images.hero ? (
          <Image src={images.hero} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
        ) : (
          <div aria-hidden="true" className="absolute inset-0 -z-20" style={{ background: "radial-gradient(120% 90% at 80% 10%, #6b3a26 0%, #2a1c16 45%, #1d1714 100%)" }} />
        )}
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: "linear-gradient(90deg, rgba(20,15,12,0.88) 0%, rgba(20,15,12,0.55) 55%, rgba(20,15,12,0.25) 100%)" }} />

        <header className="container-page flex items-center justify-between gap-4 py-6">
          <span className={cn(serif, "text-[1.6rem]")}>{config.name}</span>
          <nav aria-label="Salon" className="flex items-center gap-1 text-[0.92rem]">
            <a href="#services" className="hidden min-h-11 items-center px-3 hover:underline sm:flex">Services</a>
            <a href="#visit" className="hidden min-h-11 items-center px-3 hover:underline sm:flex">Visit</a>
            <a href="#book" className="ml-2 flex min-h-11 items-center rounded-full border border-white/40 px-5 font-medium hover:bg-white/10">Book</a>
          </nav>
        </header>

        <div className="container-page pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-36 lg:pt-32">
          {status ? (
            <p className="flex items-center gap-2 text-[0.88rem] text-[#e6dccf]">
              <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", status.open ? "bg-emerald-400" : "bg-amber-400")} />
              {status.open
                ? `Open now until ${fmtTime(status.closes)}`
                : `${status.timeOff ? "Away" : "Closed"} right now${status.reopens ? `, back ${status.reopens}` : ""}. Booking is open 24/7.`}
            </p>
          ) : (
            <p className="h-[1.4rem]" />
          )}
          <h1 className={cn(serif, "mt-6 max-w-[13ch] text-balance leading-[0.98]")} style={{ fontSize: "clamp(3.2rem, 9vw, 7rem)" }}>
            Hair that feels like <em>you.</em>
          </h1>
          <p className="mt-6 max-w-[46ch] text-[1.1rem] leading-relaxed text-[#e6dccf]">
            Cuts, colour and styling by appointment. Book online in under a minute, or call any time and our AI receptionist will find you a spot.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#book" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-[#f7f1e8] px-7 py-3.5 text-[1rem] font-semibold text-[#1d1714]">
              Book an appointment <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </a>
            <button type="button" onClick={() => setCalling(true)} className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/45 px-7 py-3.5 text-[1rem] font-medium hover:bg-white/10">
              <Phone aria-hidden="true" className="h-4 w-4" /> Call our AI receptionist
            </button>
          </div>
        </div>
      </section>

      <main id="main">
        {/* Services */}
        <section id="services" className="container-page grid gap-12 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:py-28">
          <div>
            <p className={cn(eyebrow, "text-[var(--d-accent)]")}>The menu</p>
            <h2 className={cn(serif, "mt-4 text-[2.8rem] leading-[1.02] sm:text-[3.4rem]")}>Services &amp; prices</h2>
            <p className="mt-5 max-w-[40ch] leading-relaxed text-[var(--d-muted)]">
              Clear prices, no surprises. Every appointment includes a consultation before we start.
            </p>
            {images.studio ? (
              <div className="relative mt-10 hidden aspect-[4/5] overflow-hidden rounded-[2rem] lg:block">
                <Image src={images.studio} alt="Inside the salon" fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" />
              </div>
            ) : null}
          </div>
          <ul className="border-t border-[var(--d-line)]">
            {config.services.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-[var(--d-line)] py-6">
                <div className="min-w-[10rem] flex-1">
                  <h3 className={cn(serif, "text-[1.7rem] leading-tight")}>{s.name}</h3>
                  <p className="mt-1 text-[0.9rem] text-[var(--d-muted)]">
                    {s.minutes} minutes{s.note ? ` · ${s.note}` : ""}
                  </p>
                </div>
                <span className="text-[1.25rem] font-semibold">${s.price}</span>
                <button type="button" onClick={() => bookService(s.id)} aria-label={`Book ${s.name}`} className="min-h-11 rounded-full border border-[var(--d-fg)] px-5 text-[0.9rem] font-medium transition-colors hover:bg-[var(--d-fg)] hover:text-[var(--d-bg)]">
                  Book
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Lookbook: only shown once images are added */}
        {looks.length ? (
          <section aria-labelledby="looks-title" className="container-page pb-20 lg:pb-28">
            <p className={cn(eyebrow, "text-[var(--d-accent)]")}>Lookbook</p>
            <h2 id="looks-title" className={cn(serif, "mt-4 text-[2.8rem] leading-[1.02] sm:text-[3.4rem]")}>Recent work</h2>
            <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {looks.map((k, i) => (
                <li key={k} className={cn("relative aspect-[3/4] overflow-hidden rounded-[1.5rem]", i % 2 === 1 && "lg:mt-10")}>
                  <Image src={images[k]} alt={`Hairstyle example ${i + 1}`} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Booking */}
        <section id="book" className="scroll-mt-6 border-y border-[var(--d-line)] bg-[#ece4d8]">
          <div className="container-page py-20 lg:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className={cn(eyebrow, "text-[var(--d-accent)]")}>Book online</p>
                <h2 className={cn(serif, "mt-4 text-[2.8rem] leading-[1.02] sm:text-[3.4rem]")}>Pick your time</h2>
              </div>
              <p className="max-w-[40ch] text-[var(--d-muted)]">Live availability, day or night. Booked by phone or online, it all lands in the same calendar.</p>
            </div>
            <div className="mt-10">
              <BookingWidget slug={slug} serviceId={serviceId} onService={setServiceId} onCall={() => setCalling(true)} />
            </div>
          </div>
        </section>

        {/* Visit */}
        <section id="visit" className="container-page grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className={cn(eyebrow, "text-[var(--d-accent)]")}>Visit</p>
            <h2 className={cn(serif, "mt-4 text-[2.8rem] leading-[1.02] sm:text-[3.4rem]")}>Come and see us</h2>
            <p className="mt-6 flex items-start gap-2.5 text-[1.05rem]">
              <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[var(--d-accent)]" /> {config.address}
            </p>
            <p className="mt-5 max-w-[44ch] leading-relaxed text-[var(--d-muted)]">
              Questions about colour, timing or prices? Call any time. The assistant knows our hours, our menu and our calendar, and {config.owner} gets a
              message for anything it can&apos;t answer.
            </p>
            <button type="button" onClick={() => setCalling(true)} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--d-fg)] px-6 font-medium hover:bg-[var(--d-fg)] hover:text-[var(--d-bg)]">
              <Phone aria-hidden="true" className="h-4 w-4" /> Call our AI receptionist
            </button>
          </div>
          <div className="rounded-3xl border border-[var(--d-line)] bg-[var(--d-card)] p-7 sm:p-9">
            <h3 className={cn(serif, "text-[1.8rem]")}>Opening hours</h3>
            <dl className="mt-5 flex flex-col text-[0.98rem]">
              {[1, 2, 3, 4, 5, 6, 0].map((i) => {
                const h = config.hours[i];
                const today = now?.getDay() === i;
                return (
                  <div key={i} className={cn("flex justify-between gap-4 border-b border-[var(--d-line)] py-2.5 last:border-b-0", today && "font-semibold")}>
                    <dt>{DAYS[i]}{today ? " (today)" : ""}</dt>
                    <dd>{h ? `${fmtTime(toMin(h.open))} – ${fmtTime(toMin(h.close))}` : "Closed"}</dd>
                  </div>
                );
              })}
            </dl>
            {upcomingOff.map((o) => (
              <p key={o.id} className="mt-5 rounded-2xl bg-[#ece4d8] px-4 py-3 text-[0.92rem]">
                Closed {shortDate(o.from)} – {shortDate(o.to)}{o.reason ? `: ${o.reason}` : ""}. You can still book for after we&apos;re back.
              </p>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#1d1714] text-[#e6dccf]">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-10">
          <span className={cn(serif, "text-[1.5rem] text-[#f7f1e8]")}>{config.name}</span>
          <p className="text-[0.88rem]">{config.address} · Website and AI receptionist by SolidStack.</p>
        </div>
      </footer>

      {calling ? (
        <Receptionist slug={slug} onClose={() => setCalling(false)} />
      ) : (
        <button type="button" onClick={() => setCalling(true)} aria-label="Call our AI receptionist" className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--d-accent)] text-white shadow-xl">
          <Phone aria-hidden="true" className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
