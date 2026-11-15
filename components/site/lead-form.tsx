"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, Label, NativeSelect } from "@/components/ui/input";
import { CONSENT_AI_CALL_TEXT, CONSENT_EMAIL_TEXT } from "@/lib/consent";
import { businessTypes } from "@/lib/site";

type Status = "idle" | "sending" | "done";

export function LeadForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [consentEmail, setConsentEmail] = React.useState(false);
  const [consentAiCall, setConsentAiCall] = React.useState(false);
  const noConsent = !consentEmail && !consentAiCall;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (noConsent) {
      setError(
        "Please tick at least one box so we are allowed to send you your audit.",
      );
      return;
    }

    const data = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          businessName: data.get("businessName"),
          businessType: data.get("businessType"),
          phone: data.get("phone"),
          email: data.get("email"),
          consentEmail,
          consentAiCall,
          website: data.get("website"), // honeypot
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error);
      }
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        (err instanceof Error && err.message) ||
          "Something went wrong. Please try again or email hello@solidstack.tech.",
      );
    }
  }

  if (status === "done") {
    return (
      <div
        role="status"
        tabIndex={-1}
        ref={(el) => el?.focus()}
        className="card-lit rounded-[var(--radius-card)] border border-line p-7"
      >
        <CircleCheck aria-hidden="true" className="h-8 w-8 text-emerald-400" />
        <h3 className="mt-4 text-[1.25rem] text-ink">
          Thanks — your audit request is in.
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-3">
          We will get back to you using the contact method you agreed to. Want
          to talk sooner? Pick a time for a 15-minute call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Your name</Label>
          <Input id="name" name="name" autoComplete="name" required maxLength={120} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="businessName">Business name</Label>
          <Input
            id="businessName"
            name="businessName"
            autoComplete="organization"
            required
            maxLength={160}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="businessType">Business type</Label>
        <NativeSelect id="businessType" name="businessType" required defaultValue="">
          <option value="" disabled>
            Choose one
          </option>
          {businessTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={40}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="flex flex-col gap-4">
        <legend className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-3">
          How may we contact you?
        </legend>
        <div className="mt-3 flex items-start gap-3">
          <Checkbox
            id="consentEmail"
            checked={consentEmail}
            onCheckedChange={(v) => setConsentEmail(v === true)}
          />
          <label htmlFor="consentEmail" className="text-[0.9rem] leading-snug text-ink-2">
            {CONSENT_EMAIL_TEXT}
          </label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox
            id="consentAiCall"
            checked={consentAiCall}
            onCheckedChange={(v) => setConsentAiCall(v === true)}
          />
          <label htmlFor="consentAiCall" className="text-[0.9rem] leading-snug text-ink-2">
            {CONSENT_AI_CALL_TEXT}
          </label>
        </div>
      </fieldset>

      <p className="text-[0.85rem] leading-relaxed text-ink-3">
        Both boxes are optional, but we need at least one to reply. See our{" "}
        <Link href="/privacy" className="text-ink-2 underline underline-offset-4 hover:text-ink">
          Privacy Policy
        </Link>
        .
      </p>

      <p role="alert" className="min-h-5 text-[0.9rem] text-danger">
        {error}
      </p>

      <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto sm:self-start">
        {status === "sending" ? "Sending…" : "Get my free missed-calls audit"}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Button>
    </form>
  );
}
