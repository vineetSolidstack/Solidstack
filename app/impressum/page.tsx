import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = {
  title: "Impressum",
  alternates: { canonical: "/impressum" },
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      needs="This page needs the legal details of the business before launch: company or owner name, postal address, contact details, and any registration and tax numbers that apply."
    />
  );
}
