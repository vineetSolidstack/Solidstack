import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DemoSite } from "@/components/demo/demo-site";
import { getTemplate, templates } from "@/lib/demo/data";

export const generateStaticParams = () => templates.map((t) => ({ slug: t.slug }));

export async function generateMetadata({ params }: PageProps<"/demo/[slug]">): Promise<Metadata> {
  const t = getTemplate((await params).slug);
  return {
    title: t ? `${t.kind} demo` : "Demo",
    description: t ? `A demo ${t.kind.toLowerCase()} website with an AI receptionist you can call in your browser.` : undefined,
    robots: { index: false },
  };
}

export default async function DemoPage({ params }: PageProps<"/demo/[slug]">) {
  const { slug } = await params;
  if (!getTemplate(slug)) notFound();
  return <DemoSite slug={slug} />;
}
