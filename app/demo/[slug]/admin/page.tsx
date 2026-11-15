import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoAdmin } from "@/components/demo/admin";
import { getTemplate, templates } from "@/lib/demo/data";

export const generateStaticParams = () => templates.map((t) => ({ slug: t.slug }));

export const metadata: Metadata = { title: "Receptionist settings", robots: { index: false } };

export default async function DemoAdminPage({ params }: PageProps<"/demo/[slug]/admin">) {
  const { slug } = await params;
  if (!getTemplate(slug)) notFound();
  return <DemoAdmin slug={slug} />;
}
