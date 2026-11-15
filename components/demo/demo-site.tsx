"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, MapPin, Phone, Settings } from "lucide-react";
import { Receptionist } from "@/components/demo/receptionist";
import { getTemplate } from "@/lib/demo/data";
import { fmtTime, fromYmd, getStatus, ymd } from "@/lib/demo/engine";
import { useDemo, useNow } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
const shortDate = (s: string) => fromYmd(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function DemoSite({ slug }: { slug: string }) {
  const t = getTemplate(slug)!;
  const { config } = useDemo(slug);
  const now = useNow();
  const [calling, setCalling] = React.useState(false);
  const th = t.theme;
  const status = now ? getStatus(config, now) : null;
  const upcomingOff = now ? config.timeOff.filter((o) => o.from && o.to >= ymd(now)) : [];

  const vars = {
    "--d-bg": th.bg,
    "--d-fg": th.fg,
    "--d-muted": th.muted,
    "--d-card": th.card,
    "--d-line": th.line,
    "--d-accent": th.accent,
    "--d-accent-fg": th.accentFg,
    "--d-radius": th.radius,
    colorScheme: th.bg === "#111214" ? "dark" : "light",
  } as React.CSSProperties;

  const callButton = (
    <button
      type="button"
      onClick={() => setCalling(true)}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--d-radius)] bg-[var(--d-accent)] px-6 text-[0.95rem] font-semibold text-[var(--d-accent-fg)]"
    >
      <Phone aria-hidden="true" className="h-4 w-4" />
      Call our AI receptionist
    </button>
  );

  const hoursCard = (
    <div className="rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-6 text-left">
      <h2 className={cn("flex items-center gap-2 text-[1.15rem]", th.heading)}>
        <Clock aria-hidden="true" className="h-4 w-4 text-[var(--d-accent)]" /> Opening hours
      </h2>
      <dl className="mt-4 flex flex-col gap-1.5 text-[0.92rem]">
        {[1, 2, 3, 4, 5, 6, 0].map((i) => {
          const h = config.hours[i];
          return (
            <div key={i} className="flex justify-between gap-4">
              <dt className="text-[var(--d-muted)]">{DAYS[i]}</dt>
              <dd>{h ? `${fmtTime(toMin(h.open))} – ${fmtTime(toMin(h.close))}` : "Closed"}</dd>
            </div>
          );
        })}
      </dl>
      {upcomingOff.map((o) => (
        <p key={o.id} className="mt-4 rounded-lg border border-[var(--d-line)] px-3 py-2 text-[0.88rem]">
          Closed {shortDate(o.from)} – {shortDate(o.to)}
          {o.reason ? `: ${o.reason}` : ""}. Our AI receptionist still answers and books.
        </p>
      ))}
      <p className="mt-4 flex items-start gap-2 text-[0.92rem] text-[var(--d-muted)]">
        <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" /> {config.address}
      </p>
    </div>
  );

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

      <header className="container-page flex items-center justify-between gap-4 py-5">
        <span className={cn("text-[1.2rem]", th.heading)}>{config.name}</span>
        {status ? (
          <span className="flex items-center gap-2 text-[0.85rem] text-[var(--d-muted)]">
            <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", status.open ? "bg-emerald-500" : "bg-rose-500")} />
            {status.open ? `Open until ${fmtTime(status.closes)}` : status.timeOff ? "Away, calls still answered" : "Closed, calls still answered"}
          </span>
        ) : null}
      </header>

      <main id="main">
        <section
          className={cn(
            "container-page py-14 sm:py-20",
            th.layout === "center" && "flex flex-col items-center text-center",
            th.layout === "split" && "grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]",
          )}
        >
          <div className={cn(th.layout === "center" && "flex flex-col items-center")}>
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[var(--d-accent)]">{t.tagline}</p>
            <h1 className={cn("mt-4 max-w-[16ch] text-balance leading-[1.05]", th.heading)} style={{ fontSize: "clamp(2.3rem, 6vw, 4.2rem)" }}>
              {t.headline}
            </h1>
            <p className="mt-5 max-w-[52ch] text-[1.05rem] leading-relaxed text-[var(--d-muted)]">{t.intro}</p>
            <div className="mt-8">{callButton}</div>
            <p className="mt-3 text-[0.85rem] text-[var(--d-muted)]">Opens a practice call in your browser. No real phone needed.</p>
          </div>
          {th.layout === "split" ? hoursCard : null}
        </section>

        <section className="border-y border-[var(--d-line)]">
          <div className="container-page py-14">
            <h2 className={cn("text-[1.8rem]", th.heading)}>Services</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {config.services.map((s) => (
                <li key={s.id} className="rounded-2xl border border-[var(--d-line)] bg-[var(--d-card)] p-6">
                  <h3 className={cn("text-[1.15rem]", th.heading)}>{s.name}</h3>
                  <p className="mt-2 text-[0.92rem] text-[var(--d-muted)]">About {s.minutes} minutes</p>
                  <p className="mt-4 text-[1.4rem] font-semibold text-[var(--d-accent)]">${s.price}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {th.layout !== "split" ? (
          <section className="container-page grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className={cn("text-[1.8rem]", th.heading)}>Come and see us</h2>
              <p className="mt-4 max-w-[46ch] text-[var(--d-muted)]">
                Not sure when to come in? Call any time. The assistant knows our hours, our prices and our calendar.
              </p>
            </div>
            {hoursCard}
          </section>
        ) : null}
      </main>

      <footer className="border-t border-[var(--d-line)]">
        <p className="container-page py-8 text-[0.85rem] text-[var(--d-muted)]">
          {config.name} · {config.address} · Website template and AI receptionist by SolidStack.
        </p>
      </footer>

      {calling ? (
        <Receptionist slug={slug} onClose={() => setCalling(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setCalling(true)}
          aria-label="Call our AI receptionist"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--d-accent)] text-[var(--d-accent-fg)] shadow-xl"
        >
          <Phone aria-hidden="true" className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
