import { z } from "zod";
import {
  CONSENT_AI_CALL_TEXT,
  CONSENT_EMAIL_TEXT,
  CONSENT_VERSION,
} from "@/lib/consent";
import { businessTypes } from "@/lib/site";

const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  businessName: z.string().trim().min(1).max(160),
  businessType: z.enum(businessTypes.map((t) => t.value)),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/\D/g, "").length >= 7),
  email: z.email().max(254),
  consentEmail: z.boolean(),
  consentAiCall: z.boolean(),
  website: z.string().nullish(), // honeypot
});

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json(
      { error: "Please check the form and fill in every field." },
      { status: 400 },
    );
  }
  const lead = parsed.data;

  // Bots fill the hidden field. Pretend it worked and store nothing.
  if (lead.website) {
    return Response.json({ ok: true });
  }

  if (!lead.consentEmail && !lead.consentAiCall) {
    return Response.json(
      { error: "Please tick at least one contact box so we can reply." },
      { status: 400 },
    );
  }

  const webhook = process.env.LEADS_WEBHOOK_URL;
  const failed = Response.json(
    { error: "We could not save your request. Please email hello@solidstack.tech." },
    { status: 503 },
  );
  if (!webhook) {
    console.error("Lead not stored: LEADS_WEBHOOK_URL is not set.");
    return failed;
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    null;

  const record = {
    submitted_at: new Date().toISOString(),
    name: lead.name,
    business_name: lead.businessName,
    business_type: lead.businessType,
    phone: lead.phone,
    email: lead.email,
    consent_email: lead.consentEmail,
    consent_email_text: lead.consentEmail ? CONSENT_EMAIL_TEXT : null,
    consent_ai_call: lead.consentAiCall,
    consent_ai_call_text: lead.consentAiCall ? CONSENT_AI_CALL_TEXT : null,
    consent_version: CONSENT_VERSION,
    ip,
    user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`Webhook answered ${res.status}`);
  } catch (err) {
    console.error("Lead not stored:", err);
    return failed;
  }

  return Response.json({ ok: true });
}
