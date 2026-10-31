import Image from "next/image";
import { brand } from "@/data/brand";
import { info } from "@/data/info";
import { cn } from "@/lib/utils";

/**
 * Original logo. Uses the vector file when provided (data/brand.ts),
 * otherwise the original Instagram badge, shown small and round.
 */
export function Logo({
  className,
  size = 44,
  withName = true,
}: {
  className?: string;
  size?: number;
  withName?: boolean;
}) {
  if (brand.logoSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- vector logo
      <img
        src={brand.logoSvg}
        alt={info.fullName}
        style={{ height: size }}
        className={cn("w-auto", className)}
      />
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <Image
        src={brand.badge}
        alt={info.fullName}
        width={size}
        height={size}
        className="rounded-pill ring-1 ring-black/5"
        style={{ width: size, height: size }}
        priority
      />
      {withName && (
        <span className="text-base leading-none font-extrabold tracking-tight">
          {info.fullName}
        </span>
      )}
    </span>
  );
}
