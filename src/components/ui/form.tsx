import * as React from "react";
import { cn } from "@/lib/utils";

const controlBase =
  "w-full rounded-xl border bg-white px-4 text-[15px] text-ink-900 placeholder:text-ink-400 " +
  "transition-colors focus:border-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-700/10 " +
  "disabled:cursor-not-allowed disabled:bg-ink-100";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-semibold text-ink-800", className)}
      {...props}
    />
  );
}

export function Hint({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1.5 text-xs text-ink-500", className)} {...props} />;
}

export function ErrorText({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-medium text-accent-600">
      {children}
    </p>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="ml-0.5 text-accent-500">*</span> : null}
      </Label>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : hint ? <Hint>{hint}</Hint> : null}
    </div>
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "h-12",
        invalid ? "border-accent-400 focus:border-accent-500 focus:ring-accent-500/15" : "border-ink-200",
        className
      )}
      {...props}
    />
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(function Textarea({ className, invalid, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "min-h-32 resize-y py-3 leading-relaxed",
        invalid ? "border-accent-400 focus:border-accent-500 focus:ring-accent-500/15" : "border-ink-200",
        className
      )}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(function Select({ className, invalid, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        "h-12 appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22%237a7a7a%22 stroke-width=%221.6%22><path d=%22M6 8l4 4 4-4%22/></svg>')] bg-[length:20px_20px] bg-[right_0.9rem_center] bg-no-repeat pr-11",
        invalid ? "border-accent-400 focus:border-accent-500 focus:ring-accent-500/15" : "border-ink-200",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
