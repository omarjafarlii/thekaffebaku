import { useLocale, useTranslations } from "next-intl";
import { PenLine } from "lucide-react";
import { reviews } from "@/data/reviews";
import { info } from "@/data/info";
import { Stars } from "@/components/ui/stars";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { GoogleIcon } from "@/components/brand/social-icons";
import { formatDate, formatNumber } from "@/lib/format";

/** Rating summary + horizontally scrollable review cards (snap). */
export function Reviews() {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const { value, count } = info.ratings.google;
  const writeHref = info.links.googleWriteReview ?? info.links.googleMaps;

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="bg-forest-800 py-20 text-cream-50 md:py-28 dark:bg-forest-900"
    >
      <div className="container-page flex flex-col items-center gap-6 text-center">
        <SectionHeading
          id="reviews-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
          onDark
        />
        {value && count ? (
          <div className="flex items-center gap-4">
            <span className="text-6xl font-extrabold tracking-tight">
              {formatNumber(value, locale, 1)}
            </span>
            <div className="flex flex-col items-start gap-1">
              <Stars value={value} className="text-caramel-400" />
              <span className="flex items-center gap-1.5 text-sm text-cream-100">
                <GoogleIcon className="size-4" /> {t("basedOn", { count })}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <ul className="mt-12 scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:px-8 lg:justify-center">
        {reviews.map((r) => (
          <li key={r.id} className="w-80 shrink-0 snap-start md:w-96">
            <article className="flex h-full flex-col gap-4 rounded-card bg-cream-50 p-6 text-ink-900">
              <Stars value={r.rating} />
              <p className="flex-1 leading-relaxed" lang={r.lang}>
                “{r.text}”
              </p>
              <footer className="flex items-center gap-3 border-t border-cream-300 pt-4">
                <span className="grid size-10 place-items-center rounded-pill bg-forest-800 font-bold text-cream-50">
                  {r.author.charAt(0)}
                </span>
                <div className="flex-1 text-sm">
                  <p className="font-bold">{r.author}</p>
                  <p className="text-ink-600">
                    {formatDate({ ...r.date, day: null }, locale)}
                  </p>
                </div>
                <GoogleIcon className="size-5 text-ink-600" />
                <span className="sr-only">{t(`source_${r.source}`)}</span>
              </footer>
            </article>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <a
          href={writeHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "light", size: "lg" })}
        >
          <PenLine className="size-4" /> {t("write")}
        </a>
      </div>
    </section>
  );
}
