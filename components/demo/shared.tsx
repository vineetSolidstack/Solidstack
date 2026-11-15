"use client";

import * as React from "react";
import Link from "next/link";
import { Phone, Settings } from "lucide-react";
import { BookingWidget } from "@/components/demo/booking";
import { Receptionist } from "@/components/demo/receptionist";
import { getTemplate, type Config } from "@/lib/demo/data";
import { findSlots, fmtTime, fromYmd, getStatus, ymd } from "@/lib/demo/engine";
import { useDemo, useNow } from "@/lib/demo/store";
import { cn } from "@/lib/utils";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
const shortDate = (s: string) => fromYmd(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export type Images = Record<string, string>;
export const initial = (name: string) => name.replace(/^Dr\.?\s*/, "").charAt(0);

/** Everything a demo site needs: live settings, open/closed status and booking selections. */
export function useSite(slug: string) {
  const t = getTemplate(slug)!;
  const { config, bookings } = useDemo(slug);
  const now = useNow();
  const [calling, setCalling] = React.useState(false);
  const [serviceId, setServiceId] = React.useState(config.services[0]?.id ?? "");
  const [staffId, setStaffId] = React.useState("");

  const goBook = () => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  const nextFor = (id?: string) => {
    const service = config.services.find((s) => s.id === id) ?? config.services[0];
    return now && service ? (findSlots(config, bookings, service, now, now, { count: 1 })[0]?.label ?? null) : null;
  };

  return {
    slug,
    t,
    config,
    now,
    status: now ? getStatus(config, now) : null,
    statusText: (() => {
      const s = now ? getStatus(config, now) : null;
      if (!s) return "";
      if (s.open) return `Open now until ${fmtTime(s.closes)}`;
      return `${s.timeOff ? "Away" : "Closed"} now${s.reopens ? `, back ${s.reopens}` : ""}`;
    })(),
    upcomingOff: now ? config.timeOff.filter((o) => o.from && o.to >= ymd(now)) : [],
    nextFor,
    calling,
    call: () => setCalling(true),
    hangUp: () => setCalling(false),
    serviceId,
    setServiceId,
    staffId,
    setStaffId,
    goBook,
    bookService(id: string) {
      setServiceId(id);
      goBook();
    },
    bookWith(id: string) {
      setStaffId(id);
      const person = config.staff.find((p) => p.id === id);
      if (person?.services.length && !person.services.includes(serviceId)) setServiceId(person.services[0]);
      goBook();
    },
  };
}
export type Site = ReturnType<typeof useSite>;

/** CSS variables that theme the shared booking widget and call panel. */
export function themeVars(site: Site, radii: [string, string, string]): React.CSSProperties {
  const th = site.t.theme;
  return {
    "--d-bg": th.bg,
    "--d-fg": th.fg,
    "--d-muted": th.muted,
    "--d-card": th.card,
    "--d-line": th.line,
    "--d-accent": th.accent,
    "--d-accent-fg": th.accentFg,
    "--d-radius": th.radius,
    "--d-dark": th.dark,
    "--d-band": th.band,
    "--d-tile": th.tile,
    "--d-danger": th.danger,
    "--d-r-lg": radii[0],
    "--d-r-md": radii[1],
    "--d-r-sm": radii[2],
    colorScheme: th.scheme,
  } as React.CSSProperties;
}

export function DemoBar({ site }: { site: Site }) {
  return (
    <div className="relative z-30 bg-[#08080b] font-sans text-[0.82rem] text-[#c3c3ce]">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-4 py-1">
        <span>Demo site by SolidStack. {site.config.name} is a made-up business.</span>
        <span className="flex gap-4">
          <Link href="/#demo" className="flex min-h-11 items-center underline underline-offset-4">All demos</Link>
          <Link href={`/demo/${site.slug}/admin`} className="flex min-h-11 items-center gap-1.5 font-semibold text-white underline underline-offset-4">
            <Settings aria-hidden="true" className="h-3.5 w-3.5" /> Change the settings
          </Link>
        </span>
      </div>
    </div>
  );
}

/** The call panel, plus the always-reachable Book / Call controls. */
export function CallLayer({ site }: { site: Site }) {
  if (site.calling) return <Receptionist slug={site.slug} onClose={site.hangUp} />;
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[var(--d-line)] bg-[var(--d-card)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:hidden">
        <a href="#book" className="flex min-h-12 flex-1 items-center justify-center rounded-[var(--d-radius)] bg-[var(--d-accent)] font-semibold text-[var(--d-accent-fg)]">
          Book online
        </a>
        <button type="button" onClick={site.call} className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--d-radius)] border border-[var(--d-fg)] font-medium text-[var(--d-fg)]">
          <Phone aria-hidden="true" className="h-4 w-4" /> Call
        </button>
      </div>
      <button type="button" onClick={site.call} aria-label="Call our AI receptionist" className="fixed bottom-5 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[var(--d-accent)] text-[var(--d-accent-fg)] shadow-xl sm:flex">
        <Phone aria-hidden="true" className="h-6 w-6" />
      </button>
    </>
  );
}

export function Booking({ site, headingClass }: { site: Site; headingClass: string }) {
  const c = site.t.copy;
  return (
    <BookingWidget
      slug={site.slug}
      serviceId={site.serviceId}
      onService={site.setServiceId}
      staffId={site.staffId}
      onStaff={site.setStaffId}
      staffNoun={c.staffNoun}
      headingClass={headingClass}
      extra={c.extraLabel ? { label: c.extraLabel, placeholder: c.extraPlaceholder } : undefined}
      onCall={site.call}
    />
  );
}

export function HoursList({ site, rowClass, todayClass }: { site: Site; rowClass?: string; todayClass?: string }) {
  const { config, now } = site;
  return (
    <>
      <dl className="flex flex-col">
        {[1, 2, 3, 4, 5, 6, 0].map((i) => {
          const h = config.hours[i];
          const today = now?.getDay() === i;
          return (
            <div key={i} className={cn("flex justify-between gap-4 py-2.5", rowClass, today && (todayClass ?? "font-semibold"))}>
              <dt>{DAYS[i]}{today ? " (today)" : ""}</dt>
              <dd>{h ? `${fmtTime(toMin(h.open))} – ${fmtTime(toMin(h.close))}` : "Closed"}</dd>
            </div>
          );
        })}
      </dl>
      {site.upcomingOff.map((o) => (
        <p key={o.id} className="mt-4 border border-[var(--d-line)] px-4 py-3 text-[0.92rem]" style={{ borderRadius: "var(--d-r-sm)" }}>
          Closed {shortDate(o.from)} – {shortDate(o.to)}{o.reason ? `: ${o.reason}` : ""}. You can still book for after we&apos;re back.
        </p>
      ))}
    </>
  );
}

/** Who on the team does a given person's services, as readable text. */
export const skillsOf = (config: Config, serviceIds: string[]) =>
  (serviceIds.length ? config.services.filter((s) => serviceIds.includes(s.id)) : config.services).map((s) => s.name);
