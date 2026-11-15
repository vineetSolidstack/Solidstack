import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const fieldClass =
  "h-12 w-full rounded-xl border border-line-2 bg-white/[0.03] px-4 text-[0.95rem] text-ink placeholder:text-ink-4 transition-colors duration-300 focus:border-accent-lo focus:bg-white/[0.05] aria-[invalid=true]:border-danger";

function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

function NativeSelect({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(fieldClass, "appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
      />
    </div>
  );
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-3",
        className,
      )}
      {...props}
    />
  );
}

export { Input, NativeSelect, Label };
