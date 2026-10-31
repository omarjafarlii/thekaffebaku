import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border border-line bg-bg px-4 text-base text-fg transition placeholder:text-muted focus:border-forest-600 focus:outline-none aria-invalid:border-danger";

/** Label + control + error message. */
export function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      <p
        id={`${htmlFor}-error`}
        role="alert"
        className="min-h-5 text-sm text-danger"
      >
        {error}
      </p>
    </div>
  );
}

export const Input = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<"input">
>(function Input({ className, ...props }, ref) {
  return (
    <input ref={ref} className={cn(control, "h-12", className)} {...props} />
  );
});

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.ComponentPropsWithoutRef<"textarea">
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(control, "min-h-28 resize-y py-3", className)}
      {...props}
    />
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  React.ComponentPropsWithoutRef<"select">
>(function Select({ className, ...props }, ref) {
  return (
    <select ref={ref} className={cn(control, "h-12", className)} {...props} />
  );
});

/** Hidden honeypot field to catch bots. */
export function Honeypot(props: React.ComponentPropsWithoutRef<"input">) {
  return (
    <div aria-hidden className="absolute -left-full size-px overflow-hidden">
      <label>
        Company
        <input tabIndex={-1} autoComplete="off" {...props} />
      </label>
    </div>
  );
}
