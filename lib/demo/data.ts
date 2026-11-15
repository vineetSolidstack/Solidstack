export type Service = { id: string; name: string; minutes: number; price: number; note?: string };
export type DayHours = { open: string; close: string } | null;
export type TimeOff = { id: string; from: string; to: string; reason: string };
/** services: ids this person does (empty = everything). daysOff: weekdays, 0 = Sunday. */
export type Staff = { id: string; name: string; role: string; services: string[]; daysOff: number[] };
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
  /** Optional team. When set, customers can choose who they book with. */
  staff: Staff[];
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
  staffId?: string;
  staffName?: string;
  note?: string;
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
    scheme: "light" | "dark";
    /** Hero and footer background, alternate section band, team tile, error text. */
    dark: string;
    band: string;
    tile: string;
    danger: string;
    /** [background, text] of the main hero button. */
    cta: [string, string];
    h1: string; // CSS font-size for the hero headline
    h2: string; // Tailwind size classes for section headings
    em: string; // classes for the highlighted hero word
  };
  copy: {
    heroLead: string;
    heroEm: string;
    menuEyebrow: string;
    menuTitle: string;
    menuLead: string;
    looksEyebrow: string;
    looksTitle: string;
    teamEyebrow: string;
    teamTitle: string;
    /** What a team member is called, e.g. "stylist". */
    staffNoun: string;
    /** Optional extra booking question, e.g. the vehicle. */
    extraLabel?: string;
    extraPlaceholder?: string;
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
    intro: "Cuts, colour and styling by appointment. Book online in under a minute, or call any time and our AI receptionist will find you a spot.",
    theme: {
      bg: "#f5f0e8",
      fg: "#1d1714",
      muted: "#685a50",
      card: "#fffaf2",
      line: "#1d171424",
      accent: "#8f4a2f",
      accentFg: "#ffffff",
      heading: "font-serif font-normal tracking-normal",
      radius: "999px",
      scheme: "light",
      dark: "#1d1714",
      band: "#ece4d8",
      tile: "#e6dccd",
      danger: "#b3261e",
      cta: ["#f7f1e8", "#1d1714"],
      h1: "clamp(3.2rem, 9vw, 7rem)",
      h2: "text-[2.8rem] sm:text-[3.4rem]",
      em: "italic",
    },
    copy: {
      heroLead: "Hair that feels like",
      heroEm: "you.",
      menuEyebrow: "The menu",
      menuTitle: "Services & prices",
      menuLead: "Clear prices, no surprises. Every appointment includes a consultation before we start.",
      looksEyebrow: "Lookbook",
      looksTitle: "Recent work",
      teamEyebrow: "The team",
      teamTitle: "Find your stylist",
      staffNoun: "stylist",
    },
    config: {
      name: "Luma Hair Studio",
      owner: "Maya",
      address: "214 Alder Street, Suite 2",
      hours: week("09:00", "18:00", { open: "09:00", close: "15:00" }),
      timeOff: [],
      services: [
        { id: "cut", name: "Cut & style", minutes: 45, price: 65, note: "wash, cut and blow-dry" },
        { id: "color", name: "Full colour", minutes: 120, price: 140, note: "single shade, roots to ends" },
        { id: "balayage", name: "Balayage", minutes: 180, price: 220, note: "hand-painted highlights" },
        { id: "gloss", name: "Gloss & treatment", minutes: 60, price: 75, note: "shine and repair" },
        { id: "blowout", name: "Blowout", minutes: 30, price: 40, note: "wash and style" },
        { id: "updo", name: "Occasion styling", minutes: 60, price: 90, note: "weddings and events" },
      ],
      staff: [
        { id: "lena", name: "Lena", role: "Senior stylist", services: ["cut", "gloss", "blowout", "updo"], daysOff: [1] },
        { id: "noor", name: "Noor", role: "Colour specialist", services: ["color", "balayage", "gloss"], daysOff: [6] },
        { id: "elise", name: "Elise", role: "Stylist", services: ["cut", "color", "blowout", "updo"], daysOff: [3] },
        { id: "theo", name: "Theo", role: "Master stylist", services: [], daysOff: [2] },
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
    intro: "Brakes, oil, diagnostics and tires. Book a slot online in under a minute, or call any time. Our AI receptionist answers even when we're under a car.",
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
      scheme: "dark",
      dark: "#0b0c0d",
      band: "#17191c",
      tile: "#23262a",
      danger: "#ff8a80",
      cta: ["#f5a524", "#111214"],
      h1: "clamp(2.4rem, 6.4vw, 5rem)",
      h2: "text-[1.9rem] sm:text-[2.5rem]",
      em: "not-italic text-[#f5a524]",
    },
    copy: {
      heroLead: "Honest repairs.",
      heroEm: "Back on the road fast.",
      menuEyebrow: "Price list",
      menuTitle: "Services & prices",
      menuLead: "Fixed prices for the common jobs. If we find anything else, we call you before we touch it.",
      looksEyebrow: "The shop",
      looksTitle: "Inside the workshop",
      teamEyebrow: "The crew",
      teamTitle: "Pick your technician",
      staffNoun: "technician",
      extraLabel: "Your vehicle",
      extraPlaceholder: "e.g. 2018 Honda Civic",
    },
    config: {
      name: "Ironside Auto",
      owner: "Dan",
      address: "88 Foundry Road",
      hours: week("07:30", "17:30", { open: "08:00", close: "12:00" }),
      timeOff: [],
      services: [
        { id: "oil", name: "Oil change", minutes: 30, price: 69, note: "synthetic oil and filter" },
        { id: "brakecheck", name: "Brake inspection", minutes: 30, price: 49, note: "credited if we do the repair" },
        { id: "pads", name: "Brake pad replacement", minutes: 90, price: 189, note: "per axle, parts included" },
        { id: "diag", name: "Diagnostics", minutes: 60, price: 95, note: "check-engine light and fault codes" },
        { id: "tires", name: "Tire rotation", minutes: 30, price: 39, note: "with pressure check" },
        { id: "ac", name: "A/C service", minutes: 60, price: 129, note: "leak test and recharge" },
      ],
      staff: [
        { id: "dan", name: "Dan", role: "Owner, master technician", services: [], daysOff: [] },
        { id: "marco", name: "Marco", role: "Brakes and diagnostics", services: ["brakecheck", "pads", "diag"], daysOff: [6] },
        { id: "priya", name: "Priya", role: "Service technician", services: ["oil", "tires", "ac", "brakecheck"], daysOff: [1] },
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
    intro: "Check-ups, cleanings and whitening for the whole family. Book online in under a minute, or call any time and our AI receptionist will book your visit.",
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
      scheme: "light",
      dark: "#0c2a2d",
      band: "#e6f0f0",
      tile: "#dcebeb",
      danger: "#b3261e",
      cta: ["#ffffff", "#10292c"],
      h1: "clamp(2.8rem, 7.4vw, 5.6rem)",
      h2: "text-[2.2rem] sm:text-[2.9rem]",
      em: "not-italic text-[#8fe0db]",
    },
    copy: {
      heroLead: "A calmer way to",
      heroEm: "see the dentist.",
      menuEyebrow: "Treatments",
      menuTitle: "Treatments & fees",
      menuLead: "Clear fees before you sit down. We check your insurance cover before every visit.",
      looksEyebrow: "The practice",
      looksTitle: "A look inside",
      teamEyebrow: "The team",
      teamTitle: "Choose who you see",
      staffNoun: "clinician",
      extraLabel: "Insurance provider",
      extraPlaceholder: "optional",
    },
    config: {
      name: "Brightside Dental",
      owner: "Dr. Patel",
      address: "1500 Lakeview Avenue, Floor 3",
      hours: week("08:00", "17:00", null),
      timeOff: [],
      services: [
        { id: "newpatient", name: "New patient exam", minutes: 60, price: 150, note: "exam, X-rays and a plan" },
        { id: "checkup", name: "Check-up", minutes: 30, price: 90, note: "routine exam" },
        { id: "cleaning", name: "Cleaning", minutes: 60, price: 130, note: "with our hygienist" },
        { id: "filling", name: "Filling", minutes: 60, price: 180, note: "tooth-coloured" },
        { id: "whitening", name: "Whitening", minutes: 90, price: 320, note: "in-chair, one visit" },
        { id: "emergency", name: "Emergency visit", minutes: 30, price: 120, note: "toothache or broken tooth" },
      ],
      staff: [
        { id: "patel", name: "Dr. Patel", role: "Dentist, practice owner", services: ["newpatient", "checkup", "filling", "whitening", "emergency"], daysOff: [] },
        { id: "kim", name: "Dr. Kim", role: "Dentist", services: ["newpatient", "checkup", "filling", "emergency"], daysOff: [3] },
        { id: "sofia", name: "Sofia", role: "Dental hygienist", services: ["cleaning", "whitening"], daysOff: [5] },
      ],
      faqs: [
        { id: "f1", q: "Do you accept insurance?", a: "We accept most major dental plans. Bring your card and we will check your cover before the visit." },
        { id: "f2", q: "I have a toothache or an emergency", a: "For a dental emergency we keep same-day spots. Ask me for an emergency visit and I will find the earliest opening." },
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
