"use client";

import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-line", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header asChild>
      <h3>
        <AccordionPrimitive.Trigger
          className={cn(
            "group flex min-h-14 w-full items-center justify-between gap-5 py-5 text-left",
            className,
          )}
          {...props}
        >
          <span className="text-[1rem] font-medium leading-snug tracking-normal text-ink">
            {children}
          </span>
          <span
            aria-hidden="true"
            className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-line-2 text-ink-2 transition-all duration-[450ms] ease-[var(--ease)] group-data-[state=open]:rotate-45 group-data-[state=open]:border-accent group-data-[state=open]:bg-accent group-data-[state=open]:text-white"
          >
            <Plus className="h-3.5 w-3.5" />
          </span>
        </AccordionPrimitive.Trigger>
      </h3>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="accordion-content overflow-hidden"
      {...props}
    >
      <p
        className={cn(
          "pb-6 pr-10 text-[0.95rem] leading-relaxed text-ink-3",
          className,
        )}
      >
        {children}
      </p>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
