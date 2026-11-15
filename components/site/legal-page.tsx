import * as React from "react";
import Link from "next/link";
import { Logo, Placeholder } from "@/components/site/primitives";

export function LegalPage({
  title,
  needs,
  children,
}: {
  title: string;
  needs: string;
  children?: React.ReactNode;
}) {
  return (
    <main id="main" className="container-page max-w-[760px] py-12">
      <Link href="/" className="inline-flex min-h-11 items-center rounded-lg">
        <Logo />
      </Link>
      <h1 className="mt-12 text-[2.4rem] text-ink">{title}</h1>
      <div className="mt-8">
        <Placeholder title={title}>{needs}</Placeholder>
      </div>
      <div className="mt-10 flex flex-col gap-4 text-[0.95rem] leading-relaxed text-ink-2">
        {children}
      </div>
      <Link
        href="/"
        className="mt-12 inline-flex min-h-11 items-center text-[0.9rem] text-ink-2 underline underline-offset-4 hover:text-ink"
      >
        Back to the homepage
      </Link>
    </main>
  );
}
