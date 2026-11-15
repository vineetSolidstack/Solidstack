import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  MonitorX,
  MoonStar,
  Phone,
  PhoneMissed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendlyEmbed } from "@/components/site/calendly";
import { Header } from "@/components/site/header";
import { LeadForm } from "@/components/site/lead-form";
import {
  AUDIT_CTA,
  Eyebrow,
  Logo,
  Placeholder,
  SectionHeading,
} from "@/components/site/primitives";
import { CountUp, PointerGlow, ScrollProgress, Tilt, Words } from "@/components/site/motion";
import { Reveal } from "@/components/site/reveal";
import { SiteBuilder } from "@/components/site/site-builder";
import { templates } from "@/lib/demo/data";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const problems = [
  {
    icon: PhoneMissed,
    title: "Missed calls are lost customers",
    body: "When nobody picks up, most callers don't leave a message. They call the next business on the list.",
  },
  {
    icon: MoonStar,
    title: "After-hours calls go unanswered",
    body: "People call when they're free: evenings, weekends, lunch breaks. That's exactly when you're closed or busy.",
  },
  {
    icon: MonitorX,
    title: "An outdated site sends people away",
    body: "If your website looks old or is hard to use on a phone, visitors leave before they ever book.",
  },
];

const steps = [
  {
    label: "Step 1 — 15 minutes",
    title: "A quick call",
    body: "Tell us about your business, your hours and how you take bookings today. That's all we need from you.",
  },
  {
    label: "Step 2 — 7 days",
    title: "We build it",
    body: "We set up your website and your AI receptionist, and connect them to your phone number and your calendar.",
  },
  {
    label: "Step 3 — Every day after",
    title: "You get more bookings",
    body: "Calls get answered day and night, missed calls get a text back, and appointments land in your calendar.",
  },
];

const plans = [
  {
    name: "Starter",
    blurb: "Stop losing callers. Every call answered, every missed call followed up.",
    price: "$149",
    setup: "+ $300 one-time setup",
    features: [
      "AI receptionist that answers calls 24/7",
      "Missed-call text-back",
      "Appointment booking",
    ],
    popular: false,
  },
  {
    name: "Growth",
    blurb: "Everything in Starter, plus regular Reels that keep you in front of locals.",
    price: "$549",
    setup: "+ $300 one-time setup",
    features: [
      "Everything in Starter",
      "8 Reels a month",
      "Posted for you to Instagram and Facebook",
    ],
    popular: true,
  },
  {
    name: "Full",
    blurb: "The whole front desk: your website, your phones and your social media.",
    price: "$899",
    setup: "+ $750 one-time setup",
    features: [
      "A new website",
      "AI receptionist",
      "12 Reels a month",
      "Comment and DM replies",
    ],
    popular: false,
  },
];

const faqs = [
  {
    q: "Do I need to be technical?",
    a: "No. We set everything up for you. You answer a few questions on a 15-minute call and we handle the rest.",
  },
  {
    q: "What if the AI can't answer?",
    a: "It takes a message with the caller's name, number and what they need, and sends it to you right away so you can call them back.",
  },
  {
    q: "Will callers know it's an AI?",
    a: "Yes. It says so at the start of every call.",
  },
  {
    q: "Can I keep my phone number?",
    a: "Yes. Your number stays yours. Calls are simply forwarded to the AI receptionist when you want it to answer.",
  },
  {
    q: "Is there a contract?",
    a: "There is a 3-month minimum. After that it's month-to-month.",
  },
  {
    q: "Who owns the website?",
    a: "You do.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  areaServed: { "@type": "Country", name: "United States" },
  priceRange: "$149–$899 per month",
  ...(site.phoneE164 ? { telephone: site.phoneE164 } : {}),
  sameAs: [site.linkedinUrl, site.instagramUrl].filter(Boolean),
};

const footerLink =
  "flex min-h-11 items-center text-[0.875rem] text-ink-3 transition-colors duration-300 hover:text-ink";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-bloom absolute -top-40 left-1/2 h-[820px] w-[1400px] -translate-x-1/2" />
        <div className="aurora aurora-a -left-40 top-24 h-[460px] w-[460px] bg-[#6d5ef8]" />
        <div className="aurora aurora-b -right-40 top-[40vh] h-[520px] w-[520px] bg-[#35d6e8] opacity-15" />
        <div className="ambient-grid absolute inset-0" />
      </div>
      <PointerGlow />
      <ScrollProgress />

      <Header />

      <main id="main" className="relative z-10">
        {/* 2. Hero */}
        <section id="top" className="overflow-x-clip px-6 pb-16 pt-[128px] sm:pt-[152px] lg:pb-24 lg:pt-[176px]">
          <div className="mx-auto flex max-w-[1200px] flex-col items-center text-center">
            <h1
              className="mx-auto max-w-[14ch] text-balance"
              style={{ fontSize: "clamp(2.6rem, 6.4vw, 4.9rem)" }}
            >
              <Words text="Never miss a booking" className="text-ink" />
              <span className="word-rise text-gradient-accent inline-block font-serif font-normal italic" style={{ animationDelay: "420ms" }}>
                again.
              </span>
            </h1>
            <p className="fade-up mx-auto mt-6 max-w-[52ch] text-pretty text-[1.0625rem] leading-relaxed text-ink-2" style={{ animationDelay: "560ms" }}>
              A website and an AI receptionist for salons, med spas and auto
              shops, live in 7 days.
            </p>
            <div className="fade-up mt-9 flex w-full flex-col items-center justify-center gap-3 sm:flex-row" style={{ animationDelay: "700ms" }}>
              <Button asChild className="w-full max-w-xs sm:w-auto sm:max-w-none">
                <a href="#audit">
                  {AUDIT_CTA}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="w-full max-w-xs sm:w-auto">
                <a href="#demo">Hear the AI receptionist</a>
              </Button>
            </div>

            <div className="fade-up mt-16 w-full lg:mt-20" style={{ animationDelay: "850ms" }}>
              <SiteBuilder />
            </div>
          </div>
        </section>

        {/* Who it's for, drifting past */}
        <div aria-hidden="true" className="overflow-hidden border-t border-line py-4">
          <div className="demo-marquee flex w-max">
            {[0, 1].map((n) => (
              <div key={n} className="flex shrink-0 items-center">
                {["Salons", "Med spas", "Dentists", "Auto shops", "HVAC", "Plumbers", "Barbershops"].map((w) => (
                  <span key={w} className="flex items-center whitespace-nowrap font-serif text-[1.5rem] italic text-ink-3">
                    {w}
                    <span className="mx-6 font-sans text-[0.8rem] not-italic text-accent-lo">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Problem strip */}
        <section aria-labelledby="problem-title" className="border-y border-line bg-white/[0.012]">
          <h2 id="problem-title" className="sr-only">
            Why local businesses lose bookings
          </h2>
          <ul className="container-page grid min-[900px]:grid-cols-3">
            {problems.map((p) => (
              <li
                key={p.title}
                className="flex gap-4 border-line py-8 max-[899px]:border-b max-[899px]:last:border-b-0 min-[900px]:border-r min-[900px]:px-7 min-[900px]:first:pl-0 min-[900px]:last:border-r-0 min-[900px]:last:pr-0"
              >
                <span
                  aria-hidden="true"
                  className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-line-2 text-accent-lo"
                  style={{
                    backgroundImage:
                      "linear-gradient(140deg, rgba(109,94,248,0.22), rgba(53,214,232,0.14))",
                  }}
                >
                  <p.icon className={cn("h-5 w-5", p.icon === PhoneMissed && "ring-wiggle")} />
                </span>
                <div>
                  <h3 className="text-[1.0625rem] leading-snug tracking-[-0.02em] text-ink">{p.title}</h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-3">{p.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. How it works */}
        <section id="how-it-works" className="section-y">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                eyebrow="How it works"
                title="Three steps."
                accent="We do the work."
                lead="No software to learn and nothing to install. You keep running your business while we set everything up."
              />
            </Reveal>
            <Reveal className="mt-14">
              <ol className="card-lit relative grid overflow-hidden rounded-[var(--radius-card)] border border-line min-[900px]:grid-cols-3">
                <li aria-hidden="true" className="draw-line absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-accent via-accent-lo to-secondary-accent" />
                {steps.map((s, i) => (
                  <li
                    key={s.title}
                    style={{ transitionDelay: `${200 + i * 260}ms` }}
                    className="stagger flex flex-col border-line p-7 max-[899px]:border-b max-[899px]:last:border-b-0 min-[900px]:border-r min-[900px]:last:border-r-0"
                  >
                    <span aria-hidden="true" className="font-serif text-[3.25rem] italic leading-none text-white/[0.13]">
                      0{i + 1}
                    </span>
                    <span className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent-lo">
                      {s.label}
                    </span>
                    <h3 className="mt-2.5 text-[1.0625rem] text-ink">{s.title}</h3>
                    <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-3">{s.body}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        {/* 5. Live demo */}
        <section id="demo" className="pb-[clamp(72px,11vw,148px)]">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                center
                eyebrow="Live demo"
                title="Try it on a demo site."
                accent="Call the AI receptionist."
                lead="Pick a business like yours. Call the receptionist in your browser, then open the settings, change the hours or add a vacation, and call again to hear it adapt."
              />
            </Reveal>
            <ul className="mt-14 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(288px,100%),1fr))]">
              {templates.map((t, i) => (
                <li key={t.slug}>
                  <Reveal delay={i * 110} className="h-full">
                    <Tilt>
                    <div className="group card-lit flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line transition-colors duration-500 hover:border-accent-lo/50">
                      <div aria-hidden="true" className="relative flex h-48 flex-col justify-end overflow-hidden p-5 text-white">
                        <Image
                          src={`/demo/${t.slug}/hero.jpg`}
                          alt=""
                          fill
                          sizes="(min-width: 900px) 380px, 100vw"
                          className="object-cover transition-transform duration-[1200ms] ease-[var(--ease)] group-hover:scale-110"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        <span className="relative text-[0.7rem] font-semibold uppercase tracking-[0.16em]" style={{ color: t.theme.scheme === "dark" ? t.theme.accent : "#fff" }}>
                          {t.tagline}
                        </span>
                        <span className={cn("relative mt-1 text-[1.6rem] leading-tight", t.theme.heading)}>{t.config.name}</span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-[1.0625rem] text-ink">{t.kind}</h3>
                        <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-ink-3">
                          A full website with a receptionist that knows the hours, prices and calendar.
                        </p>
                        <Button asChild variant="outline" className="mt-6 w-full">
                          <Link href={`/demo/${t.slug}`}>
                            Open the {t.kind.toLowerCase()} demo
                            <ArrowRight aria-hidden="true" className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    </Tilt>
                  </Reveal>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-center text-[0.9rem] text-ink-2">
              You&apos;ll be speaking to an AI assistant. The demo businesses are made up.
            </p>
            {site.phoneE164 ? (
              <p className="mt-3 text-center text-[0.9rem] text-ink-3">
                Prefer a real phone call?{" "}
                <a href={`tel:${site.phoneE164}`} className="inline-flex min-h-11 items-center gap-1.5 text-ink underline underline-offset-4">
                  <Phone aria-hidden="true" className="h-4 w-4" />
                  Call our AI receptionist on {site.phoneDisplay || site.phoneE164}
                </a>
              </p>
            ) : null}

            {site.showProofPlaceholder ? (
              <div className="mt-10">
                <Placeholder title="Customer results">
                  Real customer quotes, call recordings or booking numbers go
                  here once we have them. Hide this block with
                  showProofPlaceholder in lib/site.ts.
                </Placeholder>
              </div>
            ) : null}
          </div>
        </section>

        {/* 6. Pricing */}
        <section id="pricing" className="section-y border-t border-line">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                center
                eyebrow="Pricing"
                title="Simple monthly pricing."
                accent="No surprises."
                lead="Pick the plan that fits. Every plan is set up for you and live in 7 days."
              />
            </Reveal>
            <div className="mt-16 grid items-stretch gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(288px,100%),1fr))]">
              {plans.map((plan, i) => (
                <Reveal key={plan.name} delay={i * 110} className="h-full">
                  <Tilt max={4} className={cn(plan.popular && "spin-border")}>
                  <div
                    className={cn(
                      "relative z-[1] flex h-full flex-col rounded-[var(--radius-card)] border p-7",
                      plan.popular
                        ? "border-accent-lo/40 shadow-[0_30px_80px_-30px_rgba(109,94,248,0.55)]"
                        : "card-lit border-line",
                    )}
                    style={
                      plan.popular
                        ? {
                            backgroundImage:
                              "linear-gradient(180deg, rgba(109,94,248,0.14), rgba(109,94,248,0.04))",
                            backgroundColor: "var(--elevated)",
                          }
                        : undefined
                    }
                  >
                    {plan.popular ? (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent px-3 py-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-white">
                        Most popular
                      </span>
                    ) : null}
                    <h3 className="font-mono text-[0.78rem] font-normal uppercase tracking-[0.18em] text-ink-2">
                      {plan.name}
                    </h3>
                    <p className="mt-3.5 min-h-[3.25rem] text-[0.9rem] leading-relaxed text-ink-3">{plan.blurb}</p>
                    <p className="mt-6 flex flex-wrap items-baseline gap-2">
                      <span
                        className="font-semibold tracking-[-0.04em] text-ink"
                        style={{ fontSize: "clamp(2.1rem, 3.4vw, 2.7rem)", lineHeight: 1 }}
                      >
                        <CountUp value={Number(plan.price.replace("$", ""))} prefix="$" />
                      </span>
                      <span className="text-[0.875rem] text-ink-3">per month</span>
                    </p>
                    <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent-lo">
                      {plan.setup}
                    </p>
                    <ul className="mt-7 flex flex-1 flex-col gap-3">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[0.9rem] leading-snug text-ink-2">
                          <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent-lo" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" className="mt-8 w-full">
                      <a href="#audit" aria-label={`Start with ${plan.name}`}>
                        Start with {plan.name}
                      </a>
                    </Button>
                  </div>
                  </Tilt>
                </Reveal>
              ))}
            </div>
            <p className="mx-auto mt-12 max-w-[64ch] text-center text-[0.9rem] leading-relaxed text-ink-3">
              Month-to-month after a 3-month minimum.
            </p>
          </div>
        </section>

        {/* 7. Custom projects */}
        <section id="custom" className="pb-[clamp(72px,11vw,148px)]">
          <div className="container-page">
            <Reveal>
              <div className="card-lit flex flex-col gap-6 rounded-[var(--radius-card)] border border-line p-7 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <Eyebrow>Custom projects</Eyebrow>
                  <h2 className="mt-4 text-[1.6rem] text-ink">Need something bigger?</h2>
                  <p className="mt-3 max-w-[58ch] text-[0.95rem] leading-relaxed text-ink-3">
                    We also build SaaS dashboards and AI products. Tell us what
                    you have in mind and we&apos;ll send you a fixed quote.
                  </p>
                </div>
                <Button asChild variant="outline" className="shrink-0 self-start lg:self-auto">
                  <a href={`mailto:${site.email}?subject=Custom%20project`}>
                    Email us about a custom project
                  </a>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 8. FAQ */}
        <section id="faq" className="section-y border-t border-line">
          <div className="container-page">
            <Reveal>
              <SectionHeading center eyebrow="Questions" title="The things people ask first." />
            </Reveal>
            <div className="mx-auto mt-12 max-w-[820px]">
              <Accordion type="single" collapsible defaultValue="faq-0" className="border-t border-line">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* 9. Lead form */}
        <section id="audit" className="section-y border-t border-line">
          <div className="container-page">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Eyebrow>Free missed-calls audit</Eyebrow>
                <h2 className="mt-5 text-balance text-ink" style={{ fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)" }}>
                  Free missed-calls audit
                </h2>
                <p className="mb-9 mt-4 max-w-[48ch] text-pretty leading-relaxed text-ink-3">
                  Tell us about your business. We&apos;ll look at how many calls
                  you&apos;re likely missing and what that costs you in
                  bookings. No charge, no obligation.
                </p>
                <LeadForm />
              </div>
              <div>
                <h3 className="text-[1.25rem] text-ink">Prefer to talk it through?</h3>
                <p className="mb-6 mt-3 max-w-[48ch] text-[0.95rem] leading-relaxed text-ink-3">
                  Pick a time for a quick 15-minute call instead.
                </p>
                <CalendlyEmbed url={site.calendlyUrl} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Footer */}
      <footer className="relative z-10 border-t border-line">
        <div className="container-page py-14">
          <div className="flex flex-col gap-12 lg:flex-row lg:justify-between lg:gap-16">
            <div className="max-w-sm">
              <Logo />
              <p className="mt-4 text-[0.875rem] leading-relaxed text-ink-3">
                Websites and AI receptionists for appointment-based local
                businesses.
              </p>
            </div>
            <div className="grid gap-10 min-[560px]:grid-cols-2 lg:gap-16">
              <nav aria-label="Contact">
                <h2 className="font-mono text-[0.7rem] font-normal uppercase tracking-[0.18em] text-ink-3">Contact</h2>
                <ul className="mt-4 flex flex-col gap-1">
                  <li>
                    <a href={`mailto:${site.email}`} className={footerLink}>{site.email}</a>
                  </li>
                  {site.phoneE164 ? (
                    <li>
                      <a href={`tel:${site.phoneE164}`} className={footerLink}>
                        {site.phoneDisplay || site.phoneE164}
                      </a>
                    </li>
                  ) : null}
                  {site.linkedinUrl ? (
                    <li>
                      <a href={site.linkedinUrl} rel="noopener" className={footerLink}>LinkedIn</a>
                    </li>
                  ) : null}
                  {site.instagramUrl ? (
                    <li>
                      <a href={site.instagramUrl} rel="noopener" className={footerLink}>Instagram</a>
                    </li>
                  ) : null}
                </ul>
              </nav>
              <nav aria-label="Legal">
                <h2 className="font-mono text-[0.7rem] font-normal uppercase tracking-[0.18em] text-ink-3">Legal</h2>
                <ul className="mt-4 flex flex-col gap-1">
                  <li><Link href="/impressum" className={footerLink}>Impressum</Link></li>
                  <li><Link href="/privacy" className={footerLink}>Privacy Policy</Link></li>
                  <li><Link href="/terms" className={footerLink}>Terms</Link></li>
                </ul>
              </nav>
            </div>
          </div>
          <p className="mt-14 border-t border-line pt-8 text-[0.8125rem] text-ink-3">
            © SolidStack. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
