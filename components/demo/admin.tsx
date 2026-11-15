"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, Label } from "@/components/ui/input";
import { Logo } from "@/components/site/primitives";
import { automationInfo, type AutomationKey, type Config } from "@/lib/demo/data";
import { automationText, findSlots, fmtTime, fromYmd, makeMessage, newId, ymd } from "@/lib/demo/engine";
import { resetDemo, updateDemo, useDemo } from "@/lib/demo/store";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const niceDate = (s: string) => fromYmd(s).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card-lit rounded-[var(--radius-card)] border border-line p-6 sm:p-7">
      <h2 className="text-[1.25rem] text-ink">{title}</h2>
      {hint ? <p className="mt-2 max-w-[62ch] text-[0.9rem] leading-relaxed text-ink-3">{hint}</p> : null}
      <div className="mt-6 flex flex-col gap-4">{children}</div>
    </section>
  );
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-2 text-ink-3 hover:text-danger">
      <Trash2 aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}

function AddButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" className="self-start" onClick={onClick}>
      <Plus aria-hidden="true" className="h-4 w-4" /> {children}
    </Button>
  );
}

export function DemoAdmin({ slug }: { slug: string }) {
  const { config, bookings, outbox } = useDemo(slug);
  const set = (patch: Partial<Config>) => updateDemo(slug, (s) => ({ ...s, config: { ...s.config, ...patch } }));
  const send = (to: string, label: string, text: string) =>
    updateDemo(slug, (s) => ({ ...s, outbox: [makeMessage(new Date(), to, label, text), ...s.outbox].slice(0, 40) }));

  function testAutomation(key: AutomationKey, title: string) {
    const now = new Date();
    const slot = findSlots(config, bookings, config.services[0] ?? { id: "x", name: "Visit", minutes: 30, price: 0 }, now, now, { count: 1 })[0];
    send(
      key === "fillCancellation" ? "Waiting list" : key === "winBack" ? "Past customers" : "Caller",
      `${title} (test)`,
      automationText(key, config, key === "fillCancellation" ? slot?.label : undefined),
    );
  }

  function cancelBooking(id: string) {
    const b = bookings.find((x) => x.id === id);
    updateDemo(slug, (s) => ({ ...s, bookings: s.bookings.filter((x) => x.id !== id) }));
    if (b && config.automations.fillCancellation) {
      send("Waiting list", "Fill a cancelled slot", automationText("fillCancellation", config, `${niceDate(b.day)} at ${fmtTime(b.min)}`));
    }
  }

  function vacationFromToday() {
    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 6);
    set({ timeOff: [...config.timeOff, { id: newId(now), from: ymd(now), to: ymd(end), reason: "on vacation" }] });
  }

  return (
    <main id="main" className="container-page max-w-[900px] py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex min-h-11 items-center rounded-lg"><Logo /></Link>
        <Button asChild size="sm">
          <Link href={`/demo/${slug}`}>Open the site and call</Link>
        </Button>
      </div>

      <h1 className="mt-10 text-[2.2rem] text-ink">Receptionist settings</h1>
      <p className="mt-3 max-w-[62ch] leading-relaxed text-ink-3">
        This is what the business owner sees. Change anything, then call the receptionist: it answers from these
        settings straight away. Changes are saved in your browser only.
      </p>

      <div className="mt-10 flex flex-col gap-6">
        <Card title="Business">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="b-name">Business name</Label>
              <Input id="b-name" value={config.name} onChange={(e) => set({ name: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="b-owner">Owner&apos;s name</Label>
              <Input id="b-owner" value={config.owner} onChange={(e) => set({ owner: e.target.value })} />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="b-address">Address</Label>
            <Input id="b-address" value={config.address} onChange={(e) => set({ address: e.target.value })} />
          </div>
        </Card>

        <Card title="Opening hours" hint="Outside these hours the receptionist says you're closed, tells the caller when you reopen, and still books them in.">
          {[1, 2, 3, 4, 5, 6, 0].map((i) => {
            const h = config.hours[i];
            const setDay = (v: Config["hours"][number]) => set({ hours: config.hours.map((x, j) => (j === i ? v : x)) });
            return (
              <div key={i} className="flex flex-wrap items-center gap-3">
                <div className="flex w-36 items-center gap-3">
                  <Checkbox id={`open-${i}`} checked={!!h} onCheckedChange={(v) => setDay(v === true ? { open: "09:00", close: "17:00" } : null)} />
                  <label htmlFor={`open-${i}`} className="text-[0.95rem] text-ink-2">{DAYS[i]}</label>
                </div>
                {h ? (
                  <div className="flex items-center gap-2">
                    <Input aria-label={`${DAYS[i]} opens at`} type="time" className="w-[8.5rem]" value={h.open} onChange={(e) => setDay({ ...h, open: e.target.value })} />
                    <span className="text-ink-3">to</span>
                    <Input aria-label={`${DAYS[i]} closes at`} type="time" className="w-[8.5rem]" value={h.close} onChange={(e) => setDay({ ...h, close: e.target.value })} />
                  </div>
                ) : (
                  <span className="text-[0.9rem] text-ink-3">Closed</span>
                )}
              </div>
            );
          })}
        </Card>

        <Card title="Vacation and closed days" hint="While you're away the receptionist tells callers, explains when you're back, and offers the next free appointment after your return.">
          {config.timeOff.map((o) => {
            const patch = (p: Partial<typeof o>) => set({ timeOff: config.timeOff.map((x) => (x.id === o.id ? { ...x, ...p } : x)) });
            return (
              <div key={o.id} className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`from-${o.id}`}>From</Label>
                  <Input id={`from-${o.id}`} type="date" className="w-[10.5rem]" value={o.from} onChange={(e) => patch({ from: e.target.value })} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor={`to-${o.id}`}>To</Label>
                  <Input id={`to-${o.id}`} type="date" className="w-[10.5rem]" value={o.to} min={o.from} onChange={(e) => patch({ to: e.target.value })} />
                </div>
                <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
                  <Label htmlFor={`why-${o.id}`}>Reason callers hear</Label>
                  <Input id={`why-${o.id}`} value={o.reason} placeholder="on vacation" onChange={(e) => patch({ reason: e.target.value })} />
                </div>
                <RemoveButton label="Remove this time off" onClick={() => set({ timeOff: config.timeOff.filter((x) => x.id !== o.id) })} />
              </div>
            );
          })}
          <AddButton onClick={vacationFromToday}>Add a week off from today</AddButton>
        </Card>

        <Card title="Services and prices" hint="The receptionist quotes these prices and uses the length to find a gap in your calendar.">
          {config.services.map((s) => {
            const patch = (p: Partial<typeof s>) => set({ services: config.services.map((x) => (x.id === s.id ? { ...x, ...p } : x)) });
            return (
              <div key={s.id} className="flex flex-wrap items-end gap-3">
                <div className="flex min-w-[10rem] flex-1 flex-col gap-2">
                  <Label htmlFor={`sn-${s.id}`}>Service</Label>
                  <Input id={`sn-${s.id}`} value={s.name} onChange={(e) => patch({ name: e.target.value })} />
                </div>
                <div className="flex w-28 flex-col gap-2">
                  <Label htmlFor={`sm-${s.id}`}>Minutes</Label>
                  <Input id={`sm-${s.id}`} type="number" min={15} step={15} value={s.minutes} onChange={(e) => patch({ minutes: Math.max(15, Number(e.target.value) || 15) })} />
                </div>
                <div className="flex w-28 flex-col gap-2">
                  <Label htmlFor={`sp-${s.id}`}>Price $</Label>
                  <Input id={`sp-${s.id}`} type="number" min={0} value={s.price} onChange={(e) => patch({ price: Math.max(0, Number(e.target.value) || 0) })} />
                </div>
                <RemoveButton label={`Remove ${s.name}`} onClick={() => set({ services: config.services.filter((x) => x.id !== s.id) })} />
              </div>
            );
          })}
          <AddButton onClick={() => set({ services: [...config.services, { id: newId(new Date()), name: "New service", minutes: 30, price: 50 }] })}>Add a service</AddButton>
        </Card>

        {config.staff.length ? (
          <Card title="Team" hint="Customers can pick a stylist online or ask for one by name on the phone. Untick the days each person works to mark them off.">
            {config.staff.map((p) => {
              const patch = (v: Partial<typeof p>) => set({ staff: config.staff.map((x) => (x.id === p.id ? { ...x, ...v } : x)) });
              return (
                <div key={p.id} className="flex flex-col gap-3 border-b border-line pb-5 last:border-b-0 last:pb-0">
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="flex min-w-[8rem] flex-1 flex-col gap-2">
                      <Label htmlFor={`tn-${p.id}`}>Name</Label>
                      <Input id={`tn-${p.id}`} value={p.name} onChange={(e) => patch({ name: e.target.value })} />
                    </div>
                    <div className="flex min-w-[8rem] flex-1 flex-col gap-2">
                      <Label htmlFor={`tr-${p.id}`}>Role</Label>
                      <Input id={`tr-${p.id}`} value={p.role} onChange={(e) => patch({ role: e.target.value })} />
                    </div>
                    <RemoveButton label={`Remove ${p.name}`} onClick={() => set({ staff: config.staff.filter((x) => x.id !== p.id) })} />
                  </div>
                  <div role="group" aria-label={`Days ${p.name} works`} className="flex flex-wrap gap-x-4 gap-y-2">
                    {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                      <span key={d} className="flex items-center gap-2">
                        <Checkbox
                          id={`td-${p.id}-${d}`}
                          checked={!p.daysOff.includes(d)}
                          onCheckedChange={(v) => patch({ daysOff: v === true ? p.daysOff.filter((x) => x !== d) : [...p.daysOff, d] })}
                        />
                        <label htmlFor={`td-${p.id}-${d}`} className="text-[0.88rem] text-ink-2">{DAYS[d].slice(0, 3)}</label>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
            <AddButton onClick={() => set({ staff: [...config.staff, { id: newId(new Date()), name: "New stylist", role: "Stylist", services: [], daysOff: [] }] })}>Add a team member</AddButton>
          </Card>
        ) : null}

        <Card title="Extra answers" hint="Teach it answers to common questions. If a caller asks something that isn't here, it never guesses: it takes a message for you instead.">
          {config.faqs.map((f) => {
            const patch = (p: Partial<typeof f>) => set({ faqs: config.faqs.map((x) => (x.id === f.id ? { ...x, ...p } : x)) });
            return (
              <div key={f.id} className="flex items-end gap-3">
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`q-${f.id}`}>When callers ask</Label>
                    <Input id={`q-${f.id}`} value={f.q} onChange={(e) => patch({ q: e.target.value })} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={`a-${f.id}`}>It answers</Label>
                    <Input id={`a-${f.id}`} value={f.a} onChange={(e) => patch({ a: e.target.value })} />
                  </div>
                </div>
                <RemoveButton label="Remove this answer" onClick={() => set({ faqs: config.faqs.filter((x) => x.id !== f.id) })} />
              </div>
            );
          })}
          <AddButton onClick={() => set({ faqs: [...config.faqs, { id: newId(new Date()), q: "", a: "" }] })}>Add an answer</AddButton>
        </Card>

        <Card title="Messages that bring customers in" hint="Switch on the texts you want sent automatically. Press “Send a test” to see the exact wording in the outbox below.">
          {automationInfo.map((a) => (
            <div key={a.key} className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line pb-4 last:border-b-0 last:pb-0">
              <Checkbox
                id={`auto-${a.key}`}
                checked={config.automations[a.key]}
                onCheckedChange={(v) => set({ automations: { ...config.automations, [a.key]: v === true } })}
              />
              <label htmlFor={`auto-${a.key}`} className="min-w-[12rem] flex-1">
                <span className="block text-[0.98rem] font-medium text-ink">{a.title}</span>
                <span className="block text-[0.88rem] leading-snug text-ink-3">{a.why}</span>
              </label>
              <Button type="button" variant="outline" size="sm" onClick={() => testAutomation(a.key, a.title)}>
                Send a test
              </Button>
            </div>
          ))}
        </Card>

        <Card title="Bookings" hint="Appointments made by the receptionist land here. Cancel one to see the “fill a cancelled slot” text go out.">
          {bookings.length === 0 ? (
            <p className="text-[0.92rem] text-ink-3">No bookings yet. Call the receptionist and book one.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {[...bookings].sort((a, b) => (a.day + a.min).localeCompare(b.day + b.min)).map((b) => (
                <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line px-4 py-3">
                  <span className="text-[0.95rem] text-ink-2">
                    <strong className="text-ink">{b.name}</strong> · {b.serviceName}{b.staffName ? ` with ${b.staffName}` : ""} · {niceDate(b.day)} at {fmtTime(b.min)}{b.note ? ` · “${b.note}”` : ""}
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={() => cancelBooking(b.id)}>Cancel</Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Outbox" hint="Demo only: these texts are shown here and never actually sent to anyone.">
          {outbox.length === 0 ? (
            <p className="text-[0.92rem] text-ink-3">Nothing yet.</p>
          ) : (
            <ul aria-live="polite" className="flex flex-col gap-3">
              {outbox.map((m) => (
                <li key={m.id} className="rounded-xl border border-line px-4 py-3">
                  <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-accent-lo">
                    {m.label} · to {m.to} · {m.status === "scheduled" ? "scheduled" : "sent"}
                  </p>
                  <p className="mt-2 text-[0.92rem] leading-snug text-ink-2">{m.text}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Button type="button" variant="outline" size="sm" className="self-start" onClick={() => resetDemo(slug)}>
          Reset this demo to the original settings
        </Button>
      </div>
    </main>
  );
}
