import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Terms",
  alternates: { canonical: "/terms" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      needs="This page needs the real terms of service before launch: what each plan includes, the 3-month minimum and month-to-month renewal, payment, cancellation and liability."
    />
  );
}
