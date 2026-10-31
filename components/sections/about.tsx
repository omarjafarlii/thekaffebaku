import { useLocale, useTranslations } from "next-intl";
import { Cover } from "@/components/ui/cover";
import { Reveal } from "@/components/ui/reveal";
import { info } from "@/data/info";
import { media } from "@/data/media";
import { t as tr } from "@/lib/i18n-data";
import { formatNumber } from "@/lib/format";

/** About: the brand's own words + a few real numbers. */
export function About() {
  const t = useTranslations("about");
  const locale = useLocale();
  const h = info.hours[0];

  const stats = [
    {
      value: `${formatNumber(info.ratings.google.value ?? 0, locale, 1)} ★`,
      label: t("statRating"),
    },
    { value: `${info.ratings.google.count}+`, label: t("statReviews") },
    {
      value: formatNumber(info.instagramFollowers, locale),
      label: t("statFollowers"),
    },
    { value: `${h.open}–${h.close}`, label: t("statHours") },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="container-page py-20 md:py-28"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Cover
            src={media.exterior.src}
            alt={tr(media.exterior.alt, locale)}
            className="aspect-4/5 rounded-panel"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <span className="font-hand text-2xl text-accent">{t("eyebrow")}</span>
          <h2
            id="about-title"
            className="mt-2 text-title font-bold text-balance"
            lang="en"
          >
            {t("title")}
          </h2>
          <p className="mt-6 text-lead text-muted">{t("p1")}</p>
          <p className="mt-4 text-lead text-muted">{t("p2")}</p>
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-card bg-line">
            {stats.map((s) => (
              <div key={s.label} className="bg-bg p-5">
                <dt className="text-sm text-muted">{s.label}</dt>
                <dd className="mt-1 text-2xl font-extrabold tracking-tight">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
