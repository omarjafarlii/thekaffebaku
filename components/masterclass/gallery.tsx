"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import type { Media } from "@/data/media";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { t as tr } from "@/lib/i18n-data";
import { cn } from "@/lib/utils";

/** Main photo with arrows + thumbnail strip; click opens a lightbox. */
export function Gallery({ photos, title }: { photos: Media[]; title: string }) {
  const t = useTranslations("masterclass");
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const n = photos.length;
  const go = (d: number) => setIndex((i) => (i + d + n) % n);
  const current = photos[index];

  const arrows = (
    <>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label={t("prev")}
        className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-pill bg-surface/90 text-fg shadow-soft transition hover:bg-surface"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label={t("next")}
        className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-pill bg-surface/90 text-fg shadow-soft transition hover:bg-surface"
      >
        <ChevronRight className="size-5" />
      </button>
    </>
  );

  return (
    <div
      className="flex flex-col gap-3"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        if (e.key === "ArrowRight") go(1);
      }}
    >
      <div className="relative aspect-4/3 overflow-hidden rounded-panel bg-surface-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group absolute inset-0 cursor-zoom-in"
          aria-label={`${t("gallery")}: ${tr(current.alt, locale)}`}
        >
          <Image
            key={current.src}
            src={current.src}
            alt={tr(current.alt, locale)}
            fill
            priority
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="animate-fade-in object-cover"
          />
          <span className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-pill bg-surface/90 text-fg opacity-0 shadow-soft transition group-hover:opacity-100">
            <Expand className="size-4" />
          </span>
        </button>
        {n > 1 && arrows}
        <span className="absolute bottom-3 left-3 rounded-pill bg-forest-950/70 px-3 py-1 text-xs font-bold text-cream-50 tabular-nums">
          {index + 1} / {n}
        </span>
      </div>

      {n > 1 && (
        <ul className="scrollbar-none flex gap-2 overflow-x-auto">
          {photos.map((p, i) => (
            <li key={p.src + i} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={t("photo", { n: i + 1 })}
                aria-current={i === index}
                className={cn(
                  "relative block size-20 overflow-hidden rounded-xl border-2 transition md:size-24",
                  i === index
                    ? "border-accent"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={p.src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          closeLabel={t("close")}
          className="bg-forest-950 md:max-w-5xl"
        >
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <div
            className="relative aspect-4/3 w-full"
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") go(-1);
              if (e.key === "ArrowRight") go(1);
            }}
          >
            <Image
              key={current.src}
              src={current.src}
              alt={tr(current.alt, locale)}
              fill
              sizes="(min-width: 768px) 1024px, 100vw"
              className="animate-fade-in object-contain"
            />
            {n > 1 && arrows}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
