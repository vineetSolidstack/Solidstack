"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUDIT_CTA, Logo } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
        solid
          ? "border-line bg-canvas/85 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Main"
        className="container-page flex h-[72px] items-center justify-between gap-4"
      >
        <a href="#top" className="flex min-h-11 items-center rounded-lg">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 min-[900px]:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="flex min-h-11 items-center rounded-full px-3.5 text-[0.875rem] text-ink-2 transition-colors duration-300 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden min-[560px]:inline-flex">
            <a href="#audit">{AUDIT_CTA}</a>
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-2 text-ink-2 min-[900px]:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line min-[900px]:hidden"
      >
        <ul className="container-page flex flex-col py-3">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center text-[1rem] text-ink-2 hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="pb-3 pt-2 min-[560px]:hidden">
            <Button asChild className="w-full">
              <a href="#audit" onClick={() => setOpen(false)}>
                {AUDIT_CTA}
              </a>
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
