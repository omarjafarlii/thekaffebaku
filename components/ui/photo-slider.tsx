"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { Cover } from "@/components/ui/cover";
import { cn } from "@/lib/utils";

/**
 * Swipeable photo slider (CSS scroll-snap): swipe on touch, arrows on hover,
 * dots below. With 0–1 photos it renders a plain <Cover>.
 */
export function PhotoSlider({
  images,
  alt,
  className,
  sizes,
  icon,
  onSlideClick,
  labels,
  priority,
}: {
  images: string[];
  alt: string;
  className?: string;
  sizes?: string;
  icon?: LucideIcon;
  /** e.g. open the product popup */
  onSlideClick?: () => void;
  labels: { prev: string; next: string };
  priority?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const n = images.length;

  if (n <= 1)
    return (
      <div
        onClick={onSlideClick}
        className={cn(onSlideClick && "cursor-pointer", "contents")}
      >
        <Cover
          src={images[0] ?? null}
          alt={alt}
          className={className}
          sizes={sizes}
          icon={icon}
          priority={priority}
          imgClassName="transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    );

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = (i + n) % n;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className={cn("group/slider relative overflow-hidden", className)}>
      <div
        ref={track}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="absolute inset-0 scrollbar-none flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {images.map((src, i) => (
          <div
            key={src + i}
            onClick={onSlideClick}
            className={cn(
              "relative h-full w-full shrink-0 snap-center bg-surface-2",
              onSlideClick && "cursor-pointer",
            )}
          >
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              fill
              sizes={sizes}
              priority={priority && i === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {(["prev", "next"] as const).map((dir) => (
        <button
          key={dir}
          type="button"
          aria-label={labels[dir]}
          onClick={(e) => {
            e.stopPropagation();
            go(dir === "prev" ? index - 1 : index + 1);
          }}
          className={cn(
            "absolute top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-pill bg-surface/90 text-fg shadow-soft transition md:opacity-0 md:group-hover/slider:opacity-100 md:focus-visible:opacity-100",
            dir === "prev" ? "left-2" : "right-2",
          )}
        >
          {dir === "prev" ? (
            <ChevronLeft className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </button>
      ))}

      <div className="pointer-events-none absolute inset-x-0 bottom-2.5 flex justify-center gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-pill bg-white shadow transition-all",
              i === index ? "w-4" : "w-1.5 opacity-60",
            )}
          />
        ))}
      </div>
    </div>
  );
}
