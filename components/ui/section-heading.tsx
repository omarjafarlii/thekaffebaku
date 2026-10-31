import { cn } from "@/lib/utils";

/** Centered section title with a small handwritten eyebrow. */
export function SectionHeading({
  eyebrow,
  title,
  id,
  align = "center",
  className,
  children,
  onDark,
}: {
  eyebrow: string;
  title: string;
  id?: string;
  align?: "center" | "left";
  className?: string;
  children?: React.ReactNode;
  /** lighter eyebrow colour for dark backgrounds */
  onDark?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      <span
        className={cn(
          "font-hand text-2xl",
          onDark ? "text-caramel-400" : "text-accent",
        )}
      >
        {eyebrow}
      </span>
      <h2 id={id} className="max-w-3xl text-title font-bold text-balance">
        {title}
      </h2>
      {children ? (
        <div className="mt-2 max-w-2xl text-lead text-muted">{children}</div>
      ) : null}
    </div>
  );
}
