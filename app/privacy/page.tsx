import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      needs="This page needs the full policy text, reviewed by a lawyer, before launch: who the data controller is, the legal basis, how long data is kept, who it is shared with, and how people can withdraw consent."
    >
      <h2 className="text-[1.25rem] text-ink">What the audit form collects</h2>
      <p>
        When you request a free missed-calls audit we store your name, business
        name, business type, phone number and email address. We also store the
        time you submitted the form, the exact consent wording you agreed to,
        your IP address and your browser type, so we can show what you agreed
        to.
      </p>
      <p>
        We only email you if you ticked the email box, and we only call you
        with an AI voice assistant if you ticked the call box.
      </p>
      <p>
        Questions or requests to delete your data:{" "}
        <a href={`mailto:${site.email}`} className="underline underline-offset-4">
          {site.email}
        </a>
      </p>
    </LegalPage>
  );
}
