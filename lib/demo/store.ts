"use client";

import * as React from "react";
import { getTemplate, type DemoState } from "./data";

/**
 * Demo settings live in the visitor's own browser (localStorage), so every
 * visitor gets a private sandbox and the demo needs no database.
 */
const key = (slug: string) => `solidstack-demo-v4:${slug}`;
const listeners = new Set<() => void>();
const defaults = new Map<string, DemoState>();
const cache = new Map<string, { raw: string; state: DemoState }>();

function defaultState(slug: string): DemoState {
  let s = defaults.get(slug);
  if (!s) {
    const t = getTemplate(slug);
    if (!t) throw new Error(`Unknown demo: ${slug}`);
    s = { config: t.config, bookings: [], outbox: [] };
    defaults.set(slug, s);
  }
  return s;
}

function read(slug: string): DemoState {
  const base = defaultState(slug);
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key(slug));
  } catch {}
  if (!raw) return base;
  const hit = cache.get(slug);
  if (hit?.raw === raw) return hit.state;
  try {
    const saved = JSON.parse(raw) as Partial<DemoState>;
    const state: DemoState = {
      config: { ...base.config, ...saved.config },
      bookings: saved.bookings ?? [],
      outbox: saved.outbox ?? [],
    };
    cache.set(slug, { raw, state });
    return state;
  } catch {
    return base;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb); // settings changed in another tab
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function updateDemo(slug: string, fn: (s: DemoState) => DemoState) {
  const next = fn(read(slug));
  try {
    window.localStorage.setItem(key(slug), JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

export function resetDemo(slug: string) {
  try {
    window.localStorage.removeItem(key(slug));
  } catch {}
  listeners.forEach((l) => l());
}

export function useDemo(slug: string): DemoState {
  return React.useSyncExternalStore(
    subscribe,
    () => read(slug),
    () => defaultState(slug),
  );
}

/** The current time, only after mount, so server and first client render match. */
export function useNow(): Date | null {
  const [now, setNow] = React.useState<Date | null>(null);
  React.useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
