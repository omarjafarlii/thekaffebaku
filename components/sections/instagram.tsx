"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { instagramFeed } from "@/data/media";
import { info } from "@/data/info";
import { t as tr } from "@/lib/i18n-data";
import { formatNumber } from "@/lib/format";
import { Cover } from "@/components/ui/cover";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button-variants";
import { InstagramIcon } from "@/components/brand/social-icons";

/** Instagram strip: 6 recent photos, click for a lightbox. */
export function Instagram() {
  const t = useTranslations("instagram");
  const tg = useTranslations("reviews");
  const tm = useTranslations("menu");
  const locale = useLocale();
  const [index, setIndex] = useState<number | null>(null);
  const go = (d: number) =>
    setIndex((i) =>
      i === null ? i : (i + d + instagramFeed.length) % instagramFeed.length,
    );
  const current = index !== null ? instagramFeed[index] : null;

  return (
    <section aria-labelledby="ig-title" className="pt-20 md:pt-28">
      <div className="container-page flex flex-col items-center gap-3 text-center">
        <h2 id="ig-title" className="text-subtitle font-bold">
          @{info.instagramHandle}
        </h2>
        <p className="text-muted">
          {t("followers", {
            count: formatNumber(info.instagramFollowers, locale),
          })}
        </p>
        <a
          href={info.social.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "outline", size: "md" })}
        >
          <InstagramIcon className="size-4" /> {t("follow")}
        </a>
      </div>

      <ul className="mt-10 grid grid-cols-3 gap-1 md:grid-cols-6">
        {instagramFeed.map((m, i) => (
          <li key={m.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="group block w-full"
              aria-label={tr(m.alt, locale)}
            >
              <Cover
                src={m.src}
                alt={tr(m.alt, locale)}
                className="aspect-square"
                imgClassName="transition duration-500 group-hover:scale-105 group-hover:opacity-90"
                sizes="(min-width: 768px) 17vw, 33vw"
              />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={index !== null} onOpenChange={(o) => !o && setIndex(null)}>
        {current && (
          <DialogContent closeLabel={tm("close")} className="md:max-w-lg">
            <DialogTitle className="sr-only">
              {tr(current.alt, locale)}
            </DialogTitle>
            <Cover
              src={current.src}
              alt={tr(current.alt, locale)}
              className="aspect-4/5"
              sizes="512px"
            />
            <div className="flex items-center justify-between p-4">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={tg("prev")}
                className="grid size-10 place-items-center rounded-pill hover:bg-surface-2"
              >
                <ChevronLeft className="size-5" />
              </button>
              <p className="text-sm text-muted">{tr(current.alt, locale)}</p>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={tg("next")}
                className="grid size-10 place-items-center rounded-pill hover:bg-surface-2"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
