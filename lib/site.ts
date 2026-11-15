/**
 * Site-wide settings. Fill in the empty values before launch.
 * Anything left empty is hidden on the page (or shown as a marked
 * [PLACEHOLDER] block where the section cannot work without it).
 */
export const site = {
  name: "SolidStack",
  url: "https://www.solidstack.tech",
  email: "hello@solidstack.tech",

  /** Demo line for the AI receptionist, E.164 format, e.g. "+15551234567". */
  phoneE164: "",
  /** The same number as people should read it, e.g. "(555) 123-4567". */
  phoneDisplay: "",

  linkedinUrl: "",
  instagramUrl: "",

  /** Calendly event used for the 15-minute intro call. */
  calendlyUrl:
    "https://calendly.com/vineet-mechatronicker/30min?hide_gdpr_banner=1&hide_landing_page_details=1&hide_event_type_details=1",

  /** Show the marked [PLACEHOLDER] block where customer proof will go. */
  showProofPlaceholder: true,

  title: "SolidStack — Never miss a booking again",
  description:
    "A website and an AI receptionist for salons, med spas, dentists, auto shops, HVAC and plumbers. Answers calls 24/7, texts back missed calls and books appointments. Live in 7 days.",
} as const;

export const businessTypes = [
  { value: "salon", label: "Salon or barbershop" },
  { value: "med_spa", label: "Med spa" },
  { value: "dental", label: "Dental practice" },
  { value: "auto", label: "Auto shop" },
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "other", label: "Other" },
] as const;

export type BusinessType = (typeof businessTypes)[number]["value"];
