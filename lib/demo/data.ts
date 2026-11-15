export type Service = { id: string; name: string; minutes: number; price: number };
export type DayHours = { open: string; close: string } | null;
export type TimeOff = { id: string; from: string; to: string; reason: string };
export type Faq = { id: string; q: string; a: string };

export type AutomationKey =
  | "missedCallText"
  | "reminders"
  | "reviewRequest"
  | "fillCancellation"
  | "winBack";

export type Config = {
  name: string;
  owner: string;
  address: string;
  /** Index 0 = Sunday. null = closed that day. */
  hours: DayHours[];
  timeOff: TimeOff[];
  services: Service[];
  faqs: Faq[];
  automations: Record<AutomationKey, boolean>;
};

export type Booking = {
  id: string;
  serviceName: string;
  minutes: number;
  day: string; // YYYY-MM-DD
  min: number; // minutes after midnight
  name: string;
};

export type OutboxMessage = {
  id: string;
  at: number;
  to: string;
  label: string;
  text: string;
  status: "sent" | "scheduled";
};

export type DemoState = {
  config: Config;
  bookings: Booking[];
  outbox: OutboxMessage[];
};

export type Template = {
  slug: string;
  kind: string;
  tagline: string;
  headline: string;
  intro: string;
  theme: {
    bg: string;
    fg: string;
    muted: string;
    card: string;
    line: string;
    accent: string;
    accentFg: string;
    heading: string; // Tailwind classes for headings
    radius: string;
    layout: "center" | "left" | "split";
  };
  config: Config;
};

const allOn: Record<AutomationKey, boolean> = {
  missedCallText: true,
  reminders: true,
  reviewRequest: true,
  fillCancellation: true,
  winBack: false,
};

const week = (open: string, close: string, sat: DayHours): DayHours[] => [
  null,
  { open, close },
  { open, close },
  { open, close },
  { open, close },
  { open, close },
  sat,
];

/** Three fictional businesses. Everything here can be changed in the admin. */
export const templates: Template[] = [
  {
    slug: "salon",
    kind: "Hair salon",
    tagline: "Hair studio",
    headline: "Good hair, without the phone tag.",
    intro: "Cuts, colour and styling by appointment. Call any time, day or night, and our assistant will find you a spot.",
    theme: {
      bg: "#f6f1ea",
      fg: "#2a211c",
      muted: "#6b5d53",
      card: "#fffaf3",
      line: "#2a211c22",
      accent: "#8a4b33",
      accentFg: "#ffffff",
      heading: "font-serif font-normal tracking-[-0.01em]",
      radius: "999px",
      layout: "center",
    },
    config: {
      name: "Luma Hair Studio",
      owner: "Maya",
      address: "214 Alder Street, Suite 2",
      hours: week("09:00", "18:00", { open: "09:00", close: "15:00" }),
      timeOff: [],
      services: [
        { id: "cut", name: "Haircut", minutes: 45, price: 55 },
        { id: "color", name: "Colour", minutes: 120, price: 140 },
        { id: "blowout", name: "Blowout", minutes: 30, price: 40 },
      ],
      faqs: [
        { id: "f1", q: "Do you take walk-ins?", a: "We work by appointment, but I can usually find you a spot within a day or two." },
        { id: "f2", q: "Is there parking?", a: "Yes, there is free street parking right out front." },
      ],
      automations: allOn,
    },
  },
  {
    slug: "auto",
    kind: "Auto shop",
    tagline: "Auto repair",
    headline: "Honest repairs. Calls answered 24/7.",
    intro: "Brakes, oil, diagnostics. Call us when it suits you. Our assistant books you in, even when we're under a car.",
    theme: {
      bg: "#111214",
      fg: "#f3f1ec",
      muted: "#a7a59e",
      card: "#1a1c1f",
      line: "#ffffff1f",
      accent: "#f5a524",
      accentFg: "#111214",
      heading: "font-mono font-semibold uppercase tracking-[-0.02em]",
      radius: "6px",
      layout: "left",
    },
    config: {
      name: "Ironside Auto",
      owner: "Dan",
      address: "88 Foundry Road",
      hours: week("07:30", "17:30", { open: "08:00", close: "12:00" }),
      timeOff: [],
      services: [
        { id: "oil", name: "Oil change", minutes: 30, price: 69 },
        { id: "brakes", name: "Brake inspection", minutes: 60, price: 49 },
        { id: "diag", name: "Diagnostic check", minutes: 60, price: 95 },
      ],
      faqs: [
        { id: "f1", q: "Do you offer a shuttle or loaner car?", a: "We can give you a ride within five miles while your car is with us." },
        { id: "f2", q: "Do you work on electric vehicles?", a: "We service brakes, tires and suspension on electric vehicles, but not the battery system." },
      ],
      automations: allOn,
    },
  },
  {
    slug: "dental",
    kind: "Dental practice",
    tagline: "Family dentistry",
    headline: "A calmer way to book the dentist.",
    intro: "Check-ups, cleanings and whitening for the whole family. Our assistant answers every call and books your visit.",
    theme: {
      bg: "#f4f8f8",
      fg: "#10292c",
      muted: "#4d6669",
      card: "#ffffff",
      line: "#10292c1f",
      accent: "#0f6f74",
      accentFg: "#ffffff",
      heading: "font-sans font-semibold tracking-[-0.035em]",
      radius: "14px",
      layout: "split",
    },
    config: {
      name: "Brightside Dental",
      owner: "Dr. Patel",
      address: "1500 Lakeview Avenue, Floor 3",
      hours: week("08:00", "17:00", null),
      timeOff: [],
      services: [
        { id: "checkup", name: "Check-up", minutes: 30, price: 90 },
        { id: "cleaning", name: "Cleaning", minutes: 60, price: 130 },
        { id: "whitening", name: "Whitening", minutes: 90, price: 320 },
      ],
      faqs: [
        { id: "f1", q: "Do you accept insurance?", a: "We accept most major dental plans. Bring your card and we will check your cover before the visit." },
        { id: "f2", q: "I have a toothache or an emergency", a: "For a dental emergency we keep same-day spots. Let me book the earliest opening for you." },
      ],
      automations: allOn,
    },
  },
];

export const getTemplate = (slug: string) => templates.find((t) => t.slug === slug);

export const automationInfo: {
  key: AutomationKey;
  title: string;
  why: string;
}[] = [
  {
    key: "missedCallText",
    title: "Missed-call text-back",
    why: "If a caller hangs up, they get a text within seconds so they don't call a competitor.",
  },
  {
    key: "reminders",
    title: "Appointment reminders",
    why: "A text the day before, so fewer people forget and fewer chairs sit empty.",
  },
  {
    key: "reviewRequest",
    title: "Review request after the visit",
    why: "Asks happy customers for a Google review. More reviews bring more new callers.",
  },
  {
    key: "fillCancellation",
    title: "Fill a cancelled slot",
    why: "When someone cancels, people waiting for a spot get a text offering it.",
  },
  {
    key: "winBack",
    title: "Win-back message",
    why: "A friendly nudge to customers who haven't booked in a while.",
  },
];
