import fs from "node:fs";
import path from "node:path";
import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AutoSite } from "@/components/demo/sites/auto";
import { DentalSite } from "@/components/demo/sites/dental";
import { SalonSite } from "@/components/demo/sites/salon";
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

/** Images dropped into /public/demo/<slug>, keyed by file name without extension. */
function demoImages(slug: string): Record<string, string> {
  const dir = path.join(process.cwd(), "public", "demo", slug);
  if (!fs.existsSync(dir)) return {};
  return Object.fromEntries(
    fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .map((f) => [f.replace(/\.[^.]+$/, ""), `/demo/${slug}/${f}`]),
  );
}

export default function DemoPage({ params }: PageProps<"/demo/[slug]">) {
  return (
    <Suspense>
      <Demo params={params} />
    </Suspense>
  );
}

async function Demo({ params }: Pick<PageProps<"/demo/[slug]">, "params">) {
  const { slug } = await params;
  if (!getTemplate(slug)) notFound();
  const images = demoImages(slug);
  if (slug === "auto") return <AutoSite slug={slug} images={images} />;
  if (slug === "dental") return <DentalSite slug={slug} images={images} />;
  return <SalonSite slug={slug} images={images} />;
}
