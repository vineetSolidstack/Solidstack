import * as React from "react";
import { cn } from "@/lib/utils";

export const AUDIT_CTA = "Get my free missed-calls audit";

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 items-center justify-center rounded-[10px] shadow-[0_4px_14px_-4px_rgba(109,94,248,0.7)]"
        style={{
          backgroundImage:
            "linear-gradient(150deg, var(--accent-lo), var(--accent) 55%, var(--accent-hi))",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#fff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12.5 9.5 18 20 6.5" />
        </svg>
      </span>
      <span className="text-[1.05rem] font-semibold tracking-[-0.03em] text-ink">
        SolidStack
      </span>
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-[22px] shrink-0 bg-line-2" />
      <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-ink-3">
        {children}
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  lead,
  center,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  lead?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("flex flex-col", center && "items-center text-center")}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        className="mt-5 max-w-[24ch] text-balance"
        style={{ fontSize: "clamp(2rem, 4.2vw, 3.1rem)" }}
      >
        <span className="text-ink">{title}</span>
        {accent ? (
          <>
            {" "}
            <span className="font-serif font-normal italic text-ink-3">
              {accent}
            </span>
          </>
        ) : null}
      </h2>
      {lead ? (
        <p className="mt-5 max-w-[62ch] text-pretty leading-relaxed text-ink-3">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Clearly marked stand-in for content that must be real before launch. */
export function Placeholder({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border-2 border-dashed border-amber-300/60 bg-amber-300/[0.04] p-6 text-center">
      <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-amber-200">
        [PLACEHOLDER] {title}
      </p>
      <p className="mx-auto mt-3 max-w-[60ch] text-[0.9rem] leading-relaxed text-ink-2">
        {children}
      </p>
    </div>
  );
}
