import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, MapPin } from "lucide-react";
import { Cover } from "@/components/ui/cover";
import { buttonVariants } from "@/components/ui/button-variants";
import { Star } from "@/components/ui/stars";
import { info } from "@/data/info";
import { media } from "@/data/media";
import { t as tr } from "@/lib/i18n-data";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Full-height rounded photo hero (the café's own interior photo). */
export function Hero() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const { value, count } = info.ratings.google;

  return (
    <section
      id="top"
      aria-label={info.fullName}
      className="h-svh min-h-140 p-2 md:p-4"
    >
      <div className="relative isolate flex h-full flex-col items-center justify-center overflow-hidden rounded-panel text-cream-50">
        <Cover
          src={media.interior.src}
          alt={tr(media.interior.alt, locale)}
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-forest-950/55" />

        <div className="flex flex-col items-center gap-5 px-4 text-center">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold tracking-wide text-cream-100">
            <MapPin className="size-4" /> {t("eyebrow")}
          </p>
          <h1 className="text-hero font-extrabold">{info.fullName}</h1>
          <p
            className="font-hand text-3xl text-cream-100 md:text-4xl"
            lang="en"
          >
            {info.slogan}
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <a
              href="#menu"
              className={buttonVariants({ variant: "light", size: "lg" })}
            >
              {t("ctaMenu")}
            </a>
            <a
              href={info.links.directions}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-cream-50",
              )}
            >
              {t("ctaDirections")}
            </a>
          </div>
        </div>

        {value && count ? (
          <a
            href={info.links.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-pill bg-cream-50/15 px-3 py-2 text-sm font-semibold backdrop-blur-md transition hover:bg-cream-50/25 md:bottom-8 md:left-8"
          >
            <Star className="text-caramel-400" />
            {formatNumber(value, locale, 1)}
            <span className="font-normal text-cream-100">
              · {t("rating", { count })}
            </span>
          </a>
        ) : null}

        <a
          href="#news"
          className="absolute right-5 bottom-5 hidden items-center gap-2 text-sm text-cream-100 transition hover:text-white md:right-8 md:bottom-8 md:flex"
        >
          <ArrowDown className="size-4" /> {t("scroll")}
        </a>
      </div>
    </section>
  );
}
