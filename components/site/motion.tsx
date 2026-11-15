"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Thin bar at the very top that fills as you scroll down the page. */
export function ScrollProgress() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-gradient-to-r from-accent via-accent-lo to-secondary-accent" />
    </div>
  );
}

/** Soft light that follows the pointer across the whole page background. */
export function PointerGlow() {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (reduced() || !window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: PointerEvent) => {
      if (ref.current) ref.current.style.transform = `translate3d(${e.clientX - 300}px, ${e.clientY - 300}px, 0)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 hidden h-[600px] w-[600px] rounded-full opacity-60 [@media(pointer:fine)]:block"
      style={{ background: "radial-gradient(circle, rgba(109,94,248,0.16), transparent 62%)", transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)" }}
    />
  );
}

/** Tilts its content toward the pointer and lights it where the pointer is. */
export function Tilt({ children, className, max = 7 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || reduced()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * max}deg) rotateY(${(x - 0.5) * max}deg) translateY(-4px)`;
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={cn("tilt relative h-full transition-transform duration-300 ease-out will-change-transform", className)}>
      {children}
    </div>
  );
}

/** Counts up to a number the first time it scrolls into view. */
export function CountUp({ value, prefix = "" }: { value: number; prefix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const k = Math.min(1, (now - start) / 1100);
          el.textContent = `${prefix}${Math.round(value * (1 - Math.pow(1 - k, 3)))}`;
          if (k < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, prefix]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {value}
    </span>
  );
}

/** Headline whose words rise into place one after another. */
export function Words({ text, className, start = 0 }: { text: string; className?: string; start?: number }) {
  return (
    <span className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="word-rise inline-block" style={{ animationDelay: `${start + i * 90}ms` }}>
          {w}
          {" "}
        </span>
      ))}
    </span>
  );
}
