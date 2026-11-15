"use client";

import * as React from "react";
import { CalendarCheck, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { daySlots, dayState, fmtTime, makeBooking, slotLabel, ymd } from "@/lib/demo/engine";
import { updateDemo, useDemo, useNow } from "@/lib/demo/store";
import type { Booking } from "@/lib/demo/data";
import { cn } from "@/lib/utils";

const PAGE = 7;
const MAX_DAYS = 56;
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const stepTitle = "text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-[var(--d-muted)]";
const pill =
  "min-h-11 rounded-[var(--d-radius)] border border-[var(--d-line)] px-4 text-[0.92rem] transition-colors hover:border-[var(--d-accent)] aria-pressed:border-[var(--d-accent)] aria-pressed:bg-[var(--d-accent)] aria-pressed:text-[var(--d-accent-fg)]";
const field =
  "h-12 w-full rounded-xl border border-[var(--d-line)] bg-[var(--d-bg)] px-4 text-[0.95rem] placeholder:text-[var(--d-muted)]";

/** Online booking: service → day → time → details. Shares one calendar with the phone receptionist. */
export function BookingWidget({
  slug,
  serviceId,
  onService,
  onCall,
}: {
  slug: string;
  serviceId: string;
  onService: (id: string) => void;
  onCall: () => void;
}) {
  const state = useDemo(slug);
  const { config, bookings } = state;
  const now = useNow();
  const [offset, setOffset] = React.useState(0);
  const [day, setDay] = React.useState<string | null>(null);
  const [min, setMin] = React.useState<number | null>(null);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [error, setError] = React.useState("");
  const [done, setDone] = React.useState<Booking | null>(null);

  const service = config.services.find((s) => s.id === serviceId) ?? config.services[0];

  if (!now || !service) {
    return <div className="min-h-[420px] rounded-3xl border border-[var(--d-line)] bg-[var(--d-card)]" />;
  }

  const days = Array.from({ length: PAGE }, (_, i) => addDays(now, offset + i));
  const selected = day ? days.find((d) => ymd(d) === day) ?? null : null;
  const times = selected ? daySlots(config, bookings, service, selected, now) : [];
  const groups = [
    { label: "Morning", items: times.filter((m) => m < 720) },
    { label: "Afternoon", items: times.filter((m) => m >= 720 && m < 1020) },
    { label: "Evening", items: times.filter((m) => m >= 1020) },
  ].filter((g) => g.items.length);

  function pickService(id: string) {
    onService(id);
    setMin(null);
  }

  function firstAvailable() {
    for (let i = 0; i < MAX_DAYS; i++) {
      const d = addDays(now!, i);
      const free = daySlots(config, bookings, service, d, now!);
      if (free.length) {
        setOffset(Math.floor(i / PAGE) * PAGE);
        setDay(ymd(d));
        setMin(free[0]);
        return;
      }
    }
    setError("There are no openings in the next 8 weeks. Please call and leave a message.");
  }

  function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!day || min === null) return setError("Please pick a day and a time first.");
    if (!name.trim()) return setError("Please tell us your name.");
    if (phone.replace(/\D/g, "").length < 7) return setError("Please enter a phone number so we can text your confirmation.");
    const current = new Date();
    const d = new Date(Number(day.slice(0, 4)), Number(day.slice(5, 7)) - 1, Number(day.slice(8)));
    if (!daySlots(config, bookings, service, d, current).includes(min)) {
      setMin(null);
      return setError("Sorry, that time was just taken. Please pick another.");
    }
    const slot = { day, min, label: slotLabel(d, min, current) };
    const made = makeBooking(config, service, slot, name.trim(), current, "online booking");
    updateDemo(slug, (s) => ({
      ...s,
      bookings: [...s.bookings, made.booking],
      outbox: [...made.outbox, ...s.outbox].slice(0, 40),
    }));
    setDone(made.booking);
    setError("");
  }

  if (done) {
    const d = new Date(Number(done.day.slice(0, 4)), Number(done.day.slice(5, 7)) - 1, Number(done.day.slice(8)));
    return (
      <div role="status" className="rounded-3xl border border-[var(--d-line)] bg-[var(--d-card)] p-8 text-center sm:p-12">
        <CalendarCheck aria-hidden="true" className="mx-auto h-10 w-10 text-[var(--d-accent)]" />
        <h3 className="mt-5 font-serif text-[2rem] font-normal leading-tight tracking-normal">You&apos;re booked, {done.name}.</h3>
        <p className="mt-3 text-[1.05rem]">
          {done.serviceName} · {slotLabel(d, done.min, now)}
        </p>
        <p className="mx-auto mt-3 max-w-[44ch] text-[0.92rem] text-[var(--d-muted)]">
          In a live site you would now get a confirmation text{config.automations.reminders ? " and a reminder the day before" : ""}. In this demo
          the texts appear in the settings page outbox.
        </p>
        <button
          type="button"
          className={cn(pill, "mt-7")}
          onClick={() => {
            setDone(null);
            setDay(null);
            setMin(null);
          }}
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={confirm} className="grid overflow-hidden rounded-3xl border border-[var(--d-line)] bg-[var(--d-card)] lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-9 p-6 sm:p-9">
        <fieldset>
          <legend className={stepTitle}>1. Choose a service</legend>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {config.services.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={s.id === service.id}
                onClick={() => pickService(s.id)}
                className="flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-[var(--d-line)] px-4 py-3 text-left transition-colors hover:border-[var(--d-accent)] aria-pressed:border-[var(--d-accent)] aria-pressed:bg-[var(--d-accent)] aria-pressed:text-[var(--d-accent-fg)]"
              >
                <span>
                  <span className="block text-[0.98rem] font-medium">{s.name}</span>
                  <span className="block text-[0.82rem] opacity-75">{s.minutes} min</span>
                </span>
                <span className="text-[0.98rem] font-semibold">${s.price}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <legend className={cn(stepTitle, "float-left")}>2. Pick a day</legend>
            <button type="button" onClick={firstAvailable} className="inline-flex min-h-11 items-center gap-1.5 text-[0.9rem] font-medium text-[var(--d-accent)] underline underline-offset-4">
              <Zap aria-hidden="true" className="h-4 w-4" /> First available
            </button>
          </div>
          <div className="mt-4 flex items-stretch gap-2">
            <button
              type="button"
              aria-label="Earlier days"
              disabled={offset === 0}
              onClick={() => setOffset((o) => Math.max(0, o - PAGE))}
              className="flex w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--d-line)] disabled:opacity-35"
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <div className="grid flex-1 grid-cols-4 gap-2 sm:grid-cols-7">
              {days.map((d) => {
                const id = ymd(d);
                const st = dayState(config, d);
                const free = st === "open" ? daySlots(config, bookings, service, d, now).length : 0;
                const note = st === "away" ? "Away" : st === "closed" ? "Closed" : free ? "" : "Full";
                return (
                  <button
                    key={id}
                    type="button"
                    disabled={!free}
                    aria-pressed={id === day}
                    aria-label={`${d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${note ? `, ${note.toLowerCase()}` : ""}`}
                    onClick={() => {
                      setDay(id);
                      setMin(null);
                      setError("");
                    }}
                    className="flex min-h-[68px] flex-col items-center justify-center rounded-xl border border-[var(--d-line)] px-1 py-2 transition-colors hover:border-[var(--d-accent)] disabled:opacity-45 disabled:hover:border-[var(--d-line)] aria-pressed:border-[var(--d-accent)] aria-pressed:bg-[var(--d-accent)] aria-pressed:text-[var(--d-accent-fg)]"
                  >
                    <span className="text-[0.72rem] uppercase tracking-[0.1em] opacity-75">
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="text-[1.15rem] font-semibold leading-tight">{d.getDate()}</span>
                    <span className="text-[0.68rem] opacity-75">{note || d.toLocaleDateString("en-US", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Later days"
              disabled={offset + PAGE >= MAX_DAYS}
              onClick={() => setOffset((o) => o + PAGE)}
              className="flex w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--d-line)] disabled:opacity-35"
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend className={stepTitle}>3. Pick a time</legend>
          {!selected ? (
            <p className="mt-4 text-[0.92rem] text-[var(--d-muted)]">Choose a day to see the free times.</p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {groups.map((g) => (
                <div key={g.label}>
                  <p className="text-[0.82rem] text-[var(--d-muted)]">{g.label}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {g.items.map((m) => (
                      <button key={m} type="button" aria-pressed={m === min} onClick={() => { setMin(m); setError(""); }} className={pill}>
                        {fmtTime(m)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </fieldset>
      </div>

      <div className="flex flex-col gap-5 border-t border-[var(--d-line)] bg-[var(--d-bg)] p-6 sm:p-9 lg:border-l lg:border-t-0">
        <p className={stepTitle}>4. Your details</p>
        <dl className="flex flex-col gap-2 text-[0.95rem]">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--d-muted)]">Service</dt>
            <dd className="text-right font-medium">{service.name}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--d-muted)]">When</dt>
            <dd className="text-right font-medium">{selected && min !== null ? slotLabel(selected, min, now) : "Not chosen yet"}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-[var(--d-line)] pt-2">
            <dt className="text-[var(--d-muted)]">Price</dt>
            <dd className="text-right text-[1.15rem] font-semibold">${service.price}</dd>
          </div>
        </dl>
        <div className="flex flex-col gap-2">
          <label htmlFor="bk-name" className="text-[0.85rem] font-medium">Your name</label>
          <input id="bk-name" className={field} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="bk-phone" className="text-[0.85rem] font-medium">Mobile number</label>
          <input id="bk-phone" className={field} type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
        </div>
        <p role="alert" className="min-h-5 text-[0.88rem] text-[#b3261e]">{error}</p>
        <button type="submit" className="min-h-12 rounded-[var(--d-radius)] bg-[var(--d-accent)] px-6 text-[0.98rem] font-semibold text-[var(--d-accent-fg)]">
          Confirm booking
        </button>
        <p className="text-[0.85rem] text-[var(--d-muted)]">
          No payment needed to book. Rather talk?{" "}
          <button type="button" onClick={onCall} className="font-medium text-[var(--d-fg)] underline underline-offset-4">
            Call the AI receptionist
          </button>
          .
        </p>
      </div>
    </form>
  );
}
