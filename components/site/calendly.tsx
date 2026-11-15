"use client";

import * as React from "react";

/**
 * Calendly inline embed that only loads once it is close to the viewport,
 * so it costs nothing on first paint.
 */
export function CalendlyEmbed({ url }: { url: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [src, setSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const u = new URL(url);
        u.searchParams.set("embed_domain", window.location.hostname);
        u.searchParams.set("embed_type", "Inline");
        setSrc(u.toString());
        io.disconnect();
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [url]);

  return (
    <div
      ref={ref}
      className="h-[640px] overflow-hidden rounded-[var(--radius-card)] border border-line bg-elevated"
    >
      {src ? (
        <iframe
          src={src}
          title="Book a 15-minute call with SolidStack"
          loading="lazy"
          className="h-full w-full"
        />
      ) : (
        <div className="flex h-full items-center justify-center px-6 text-center text-[0.9rem] text-ink-3">
          <a href={url} className="underline underline-offset-4 hover:text-ink">
            Open the booking calendar
          </a>
        </div>
      )}
    </div>
  );
}
