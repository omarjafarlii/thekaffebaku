import Image from "next/image";
import { Coffee, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Rounded, object-cover image. When `src` is null, renders a calm
 * branded tile (cream + coffee icon) instead of a stock photo.
 */
export function Cover({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  priority,
  imgClassName,
  icon: Icon = Coffee,
}: {
  src: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  imgClassName?: string;
  /** icon for the empty state */
  icon?: LucideIcon;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        src ? "bg-surface-2" : "bg-forest-100 dark:bg-forest-800",
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imgClassName)}
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center text-forest-800/40 dark:text-cream-100/40"
          aria-hidden
        >
          <Icon className="size-1/4" strokeWidth={1.25} />
        </div>
      )}
    </div>
  );
}
