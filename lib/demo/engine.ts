/**
 * The demo receptionist's brain. Pure functions: settings + what the caller
 * said + the current time go in, the answer comes out. It only ever states
 * what is in the settings; anything else becomes a message for the owner.
 */
import type {
  AutomationKey,
  Booking,
  Config,
  DemoState,
  OutboxMessage,
  Service,
  TimeOff,
} from "./data";

export type Slot = { day: string; min: number; label: string };
export type Convo = {
  step: "idle" | "service" | "slot" | "name" | "message";
  service?: Service;
  slots?: Slot[];
  slot?: Slot;
};
export type Turn = {
  text: string;
  convo: Convo;
  chips?: string[];
  booking?: Booking;
  outbox?: OutboxMessage[];
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const IDLE: Convo = { step: "idle" };

const pad = (n: number) => String(n).padStart(2, "0");
export const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const nowMin = (d: Date) => d.getHours() * 60 + d.getMinutes();

export function fmtTime(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h % 12 || 12}${m ? `:${pad(m)}` : ""} ${h >= 12 ? "PM" : "AM"}`;
}

export function fmtDay(d: Date, now: Date) {
  const day = ymd(d);
  if (day === ymd(now)) return "today";
  if (day === ymd(addDays(now, 1))) return "tomorrow";
  return longDate(d);
}

/** "Monday Nov 23": no comma, so several dates read cleanly in one sentence. */
const longDate = (d: Date) =>
  `${d.toLocaleDateString("en-US", { weekday: "long" })} ${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

/** A slot label as it reads mid-sentence: "tomorrow at 9 AM", "Monday Nov 23 at 9 AM". */
const spoken = (label: string) => label.replace(/^(Today|Tomorrow)/, (m) => m.toLowerCase());

const fmtDate = (s: string) => longDate(fromYmd(s));

export const timeOffOn = (config: Config, day: string): TimeOff | undefined =>
  config.timeOff.find((t) => t.from && t.to && t.from <= day && day <= t.to);

/** Opening hours in minutes for a date, or null if closed or away. */
function hoursOn(config: Config, d: Date) {
  if (timeOffOn(config, ymd(d))) return null;
  const h = config.hours[d.getDay()];
  if (!h) return null;
  const open = toMin(h.open);
  const close = toMin(h.close);
  return close > open ? { open, close } : null;
}

export function getStatus(config: Config, now: Date) {
  const today = hoursOn(config, now);
  const m = nowMin(now);
  const timeOff = timeOffOn(config, ymd(now));
  if (today && m >= today.open && m < today.close) {
    return { open: true as const, closes: today.close };
  }
  for (let i = 0; i <= 120; i++) {
    const d = addDays(now, i);
    const h = hoursOn(config, d);
    if (!h || (i === 0 && m >= h.open)) continue;
    return { open: false as const, timeOff, reopens: `${fmtDay(d, now)} at ${fmtTime(h.open)}` };
  }
  return { open: false as const, timeOff, reopens: null };
}

const awayText = (config: Config, t: TimeOff) =>
  `${config.owner} is away until ${fmtDate(t.to)}${t.reason ? ` (${t.reason})` : ""}`;

export function statusSentence(config: Config, now: Date) {
  const s = getStatus(config, now);
  if (s.open) return `We're open right now until ${fmtTime(s.closes)}.`;
  const back = s.reopens ? ` We open again ${s.reopens}.` : "";
  if (s.timeOff) return `${awayText(config, s.timeOff)}, so we're closed.${back}`;
  return `We're closed right now.${back}`;
}

export function greeting(config: Config, now: Date): Turn {
  const s = getStatus(config, now);
  const status = s.open ? "" : ` ${statusSentence(config, now)} I can still book you in or take a message.`;
  return {
    text: `Hi, thanks for calling ${config.name}. I'm the AI assistant.${status} How can I help?`,
    convo: IDLE,
    chips: ["Book an appointment", "What are your hours?", "What do you charge?"],
  };
}

/** Free slots for a service, at most two per day so suggestions are spread out. */
export function findSlots(
  config: Config,
  bookings: Booking[],
  service: Service,
  from: Date,
  now: Date,
  opts: { count?: number; onlyThatDay?: boolean } = {},
): Slot[] {
  const count = opts.count ?? 3;
  const out: Slot[] = [];
  const first = startOfDay(from) < startOfDay(now) ? now : from;
  for (let i = 0; i <= 90 && out.length < count; i++) {
    const d = addDays(first, i);
    const h = hoursOn(config, d);
    const day = ymd(d);
    if (h) {
      const free: number[] = [];
      for (let m = h.open; m + service.minutes <= h.close; m += 30) {
        if (day === ymd(now) && m < nowMin(now) + 30) continue;
        const taken = bookings.some(
          (b) => b.day === day && m < b.min + b.minutes && b.min < m + service.minutes,
        );
        if (!taken) free.push(m);
      }
      const picks = free.length > 2 ? [free[0], free[Math.floor(free.length / 2)]] : free;
      for (const m of picks) {
        if (out.length < count) out.push({ day, min: m, label: `${cap(fmtDay(d, now))} at ${fmtTime(m)}` });
      }
    }
    if (opts.onlyThatDay) break;
  }
  return out;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function parseDay(text: string, now: Date): Date | null {
  const t = text.toLowerCase();
  if (/\b(today|tonight|right now|now)\b/.test(t)) return startOfDay(now);
  if (/\btomorrow\b/.test(t)) return addDays(now, 1);
  for (let i = 0; i < 7; i++) {
    const name = WEEKDAYS[i].toLowerCase();
    if (new RegExp(`\\b(${name}|${name.slice(0, 3)})s?\\b`).test(t)) {
      let diff = (i - now.getDay() + 7) % 7;
      if (diff === 0 && /\bnext\b/.test(t)) diff = 7;
      return addDays(now, diff);
    }
  }
  return null;
}

const findService = (config: Config, text: string) => {
  const t = text.toLowerCase();
  return config.services.find((s) => {
    const name = s.name.toLowerCase();
    return t.includes(name) || name.split(/\s+/).some((w) => w.length > 3 && t.includes(w));
  });
};

const priceLine = (s: Service) => `${s.name} is $${s.price} and takes about ${s.minutes} minutes`;

/** Why a given day is not available, in plain words. */
function closedReason(config: Config, d: Date, now: Date) {
  const off = timeOffOn(config, ymd(d));
  if (off) return `We're closed ${fmtDay(d, now)} because ${awayText(config, off)}.`;
  if (!config.hours[d.getDay()]) return `We're closed on ${WEEKDAYS[d.getDay()]}s.`;
  return null;
}

function offerSlots(state: DemoState, service: Service, now: Date, day: Date | null, after?: Date): Turn {
  const { config, bookings } = state;
  let lead = "";
  let slots: Slot[] = [];

  if (day) {
    const reason = closedReason(config, day, now);
    if (reason) {
      lead = `${reason} `;
    } else {
      slots = findSlots(config, bookings, service, day, now, { onlyThatDay: true });
      if (!slots.length) lead = `We're fully booked ${fmtDay(day, now)}. `;
    }
  } else if (!after) {
    const off = timeOffOn(config, ymd(now));
    if (off) lead = `${awayText(config, off)}, but I can book you in for when we're back. `;
  }

  if (!slots.length) slots = findSlots(config, bookings, service, after ?? day ?? now, now);

  if (!slots.length) {
    return {
      text: `${lead}I don't see any openings in the next few months. Tell me your name and number and I'll have ${config.owner} get back to you.`,
      convo: { step: "message" },
    };
  }

  const labels = slots.map((s) => spoken(s.label));
  const list = labels.length > 1 ? `${labels.slice(0, -1).join(", ")} or ${labels[labels.length - 1]}` : labels[0];
  const intro = lead ? `${lead}The closest openings for a ${service.name.toLowerCase()} are` : `For a ${service.name.toLowerCase()} I have`;
  return {
    text: `${intro} ${list}. Which works best?`,
    convo: { step: "slot", service, slots },
    chips: [...slots.map((s) => s.label), "Another day"],
  };
}

export function automationText(key: AutomationKey, config: Config, detail?: string): string {
  switch (key) {
    case "missedCallText":
      return `Sorry we missed your call at ${config.name}! Reply to this text to book, or call back any time. Our assistant answers 24/7.`;
    case "reminders":
      return `Reminder from ${config.name}: you have ${detail ?? "an appointment tomorrow"}. Reply C to confirm or R to reschedule.`;
    case "reviewRequest":
      return `Thanks for visiting ${config.name}! If you were happy with us, a quick Google review really helps a small business like ours.`;
    case "fillCancellation":
      return `A spot just opened at ${config.name}: ${detail ?? "tomorrow morning"}. Reply YES to take it. First reply gets it.`;
    case "winBack":
      return `It's been a while since we saw you at ${config.name}. Want to book your next visit? Reply here and we'll find you a time.`;
  }
}

let seq = 0;
export const newId = (now: Date) => `${now.getTime()}-${seq++}`;

export function makeMessage(
  now: Date,
  to: string,
  label: string,
  text: string,
  status: OutboxMessage["status"] = "sent",
): OutboxMessage {
  return { id: newId(now), at: now.getTime(), to, label, text, status };
}

function confirmBooking(state: DemoState, convo: Convo, name: string, now: Date): Turn {
  const { config } = state;
  const { service, slot } = convo;
  if (!service || !slot) return { text: "Sorry, let's start over. What can I book for you?", convo: IDLE };

  const stillFree = !state.bookings.some(
    (b) => b.day === slot.day && slot.min < b.min + b.minutes && b.min < slot.min + service.minutes,
  );
  if (!stillFree) {
    const next = offerSlots(state, service, now, null);
    return { ...next, text: `Sorry, that time was just taken. ${next.text}` };
  }

  const when = spoken(slot.label);
  const booking: Booking = {
    id: newId(now),
    serviceName: service.name,
    minutes: service.minutes,
    day: slot.day,
    min: slot.min,
    name,
  };
  const a = config.automations;
  const outbox = [
    makeMessage(now, name, "Booking confirmation", `You're booked at ${config.name}: ${service.name}, ${when}. ${config.address}.`),
    makeMessage(now, config.owner, "New booking alert", `${name} booked a ${service.name.toLowerCase()} ${when} through the AI receptionist.`),
    ...(a.reminders
      ? [makeMessage(now, name, "Reminder, 24 hours before", automationText("reminders", config, `a ${service.name.toLowerCase()} ${when}`), "scheduled")]
      : []),
    ...(a.reviewRequest
      ? [makeMessage(now, name, "Review request, after the visit", automationText("reviewRequest", config), "scheduled")]
      : []),
  ];
  return {
    text: `You're all set, ${name}. ${service.name}, ${when}. I'll text you a confirmation${a.reminders ? " and a reminder the day before" : ""}. Anything else?`,
    convo: IDLE,
    booking,
    outbox,
    chips: ["What are your hours?", "That's all, thanks"],
  };
}

function matchSlot(slots: Slot[], text: string): Slot | null {
  const t = text.toLowerCase().trim();
  const exact = slots.find((s) => s.label.toLowerCase() === t);
  if (exact) return exact;
  const ord = [/\b(first|1st|earliest)\b/, /\b(second|2nd|middle)\b/, /\b(third|3rd|last)\b/].findIndex((r) => r.test(t));
  if (ord >= 0 && slots[ord]) return slots[ord];
  const time = t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/);
  if (time) {
    const h = Number(time[1]);
    const mm = Number(time[2] ?? 0);
    const hits = slots.filter((s) => {
      const sh = Math.floor(s.min / 60);
      if (s.min % 60 !== mm) return false;
      if (time[3]) return sh === (h % 12) + (time[3] === "pm" ? 12 : 0);
      return sh % 12 === h % 12;
    });
    if (hits.length === 1) return hits[0];
  }
  if (/^(yes|yeah|yep|sure|ok|okay|sounds good|that works)\b/.test(t)) return slots[0];
  return null;
}

function hoursAnswer(config: Config, now: Date, day: Date | null): string {
  if (day && ymd(day) !== ymd(now)) {
    const reason = closedReason(config, day, now);
    if (reason) return `${reason} ${nextOpenAfter(config, day, now)}`.trim();
    const h = hoursOn(config, day)!;
    return `${cap(fmtDay(day, now))} we're open from ${fmtTime(h.open)} to ${fmtTime(h.close)}.`;
  }
  const lines = WEEKDAYS.map((name, i) => {
    const h = config.hours[i];
    return `${name.slice(0, 3)} ${h ? `${fmtTime(toMin(h.open))} to ${fmtTime(toMin(h.close))}` : "closed"}`;
  });
  return `${statusSentence(config, now)} Our regular hours are: ${lines.join(", ")}.`;
}

function nextOpenAfter(config: Config, day: Date, now: Date) {
  for (let i = 1; i <= 120; i++) {
    const d = addDays(day, i);
    const h = hoursOn(config, d);
    if (h) return `The next day we're open is ${fmtDay(d, now)}, from ${fmtTime(h.open)}.`;
  }
  return "";
}

function matchFaq(config: Config, text: string) {
  const words = new Set(text.toLowerCase().match(/[a-z]{4,}/g) ?? []);
  let best: { a: string; score: number } | null = null;
  for (const f of config.faqs) {
    const score = (f.q.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter(
      (w) => words.has(w) && !STOP.has(w),
    ).length;
    if (score > 0 && (!best || score > best.score)) best = { a: f.a, score };
  }
  return best?.a ?? null;
}
const STOP = new Set(["have", "there", "your", "with", "what", "that", "this", "take", "does", "offer", "work"]);

/** One turn of the call: what the caller said → what the receptionist answers. */
export function reply(state: DemoState, convo: Convo, input: string, now: Date): Turn {
  const { config } = state;
  const text = input.trim();
  const t = text.toLowerCase();
  const day = parseDay(t, now);

  if (convo.step === "name") {
    const name = text.replace(/^(it'?s|my name is|i'?m|this is|under)\s+/i, "").replace(/[.!]+$/, "").slice(0, 60);
    return confirmBooking(state, convo, name || "Guest", now);
  }

  if (convo.step === "message") {
    const off = timeOffOn(config, ymd(now));
    return {
      text: `Got it. I've sent that to ${config.owner}${off ? `, who is back after ${fmtDate(off.to)}` : " right away"}. Is there anything else I can help with?`,
      convo: IDLE,
      outbox: [makeMessage(now, config.owner, "Message from a caller", text.slice(0, 500))],
      chips: ["Book an appointment", "That's all, thanks"],
    };
  }

  if (convo.step === "slot" && convo.service && convo.slots) {
    const slot = matchSlot(convo.slots, text);
    if (slot) {
      return {
        text: `Great, ${spoken(slot.label)} it is. What name should I put the booking under?`,
        convo: { step: "name", service: convo.service, slot },
      };
    }
    if (day) return offerSlots(state, convo.service, now, day);
    if (/another|other|none|later|different|no\b|else/.test(t)) {
      const last = convo.slots[convo.slots.length - 1];
      return offerSlots(state, convo.service, now, null, addDays(fromYmd(last.day), 1));
    }
  }

  if (convo.step === "service") {
    const service = findService(config, t);
    if (service) return offerSlots(state, service, now, day);
  }

  if (/\b(bye|goodbye|that'?s all|no thanks|nothing else)\b/.test(t)) {
    return { text: `Thanks for calling ${config.name}. Have a great day!`, convo: IDLE };
  }

  if (/(speak|talk).*(someone|person|human|owner|manager|staff)|real person|leave a message|call me back|callback/.test(t) || t.includes(config.owner.toLowerCase())) {
    const off = timeOffOn(config, ymd(now));
    return {
      text: `${off ? awayText(config, off) : `${config.owner} can't come to the phone right now`}. Tell me your name, number and what you need, and I'll pass it on.`,
      convo: { step: "message" },
    };
  }

  const service = findService(config, t);

  if (/book|appointment|schedul|availab|opening|slot|come in|reserve|get in|fit me/.test(t)) {
    if (service) return offerSlots(state, service, now, day);
    if (config.services.length === 1) return offerSlots(state, config.services[0], now, day);
    return {
      text: "Happy to book you in. What would you like to come in for?",
      convo: { step: "service" },
      chips: config.services.map((s) => s.name),
    };
  }

  if (/price|cost|how much|charge|rate|fee/.test(t)) {
    const list = service ? priceLine(service) : config.services.map(priceLine).join("; ");
    return { text: `${list}. Would you like me to book you in?`, convo: service ? { step: "service" } : IDLE, chips: ["Book an appointment"] };
  }

  if (/vacation|holiday|away|time off/.test(t)) {
    const upcoming = config.timeOff.filter((o) => o.to >= ymd(now)).sort((a, b) => a.from.localeCompare(b.from))[0];
    return {
      text: upcoming
        ? `${config.owner} is away from ${fmtDate(upcoming.from)} to ${fmtDate(upcoming.to)}${upcoming.reason ? ` (${upcoming.reason})` : ""}. I can book you in before or after that.`
        : `There's no time off planned. ${statusSentence(config, now)}`,
      convo: IDLE,
      chips: ["Book an appointment"],
    };
  }

  if (/hour|open|close|when are you/.test(t)) {
    return { text: hoursAnswer(config, now, day), convo: IDLE, chips: ["Book an appointment"] };
  }

  if (/where|address|located|location|direction|find you/.test(t)) {
    return { text: `We're at ${config.address}.`, convo: IDLE, chips: ["Book an appointment"] };
  }

  const faq = matchFaq(config, t);
  if (faq) return { text: faq, convo: IDLE, chips: ["Book an appointment"] };

  if (service) return offerSlots(state, service, now, day);

  if (/service|offer|do you do|menu|what do you/.test(t)) {
    return {
      text: `We offer: ${config.services.map((s) => s.name.toLowerCase()).join(", ")}. Would you like to book one?`,
      convo: { step: "service" },
      chips: config.services.map((s) => s.name),
    };
  }

  if (day) return { text: hoursAnswer(config, now, day), convo: IDLE, chips: ["Book an appointment"] };

  return {
    text: `I'm not sure about that one, and I don't want to guess. I can take a message so ${config.owner} gets back to you, or book you an appointment. Which would you like?`,
    convo: IDLE,
    chips: ["Leave a message", "Book an appointment"],
  };
}
