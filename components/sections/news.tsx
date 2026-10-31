import { useLocale, useTranslations } from "next-intl";
import { Cover } from "@/components/ui/cover";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/data/media";
import { t as tr } from "@/lib/i18n-data";

/** "What's new" — three image cards from the latest Instagram posts. */
export function News() {
  const t = useTranslations("news");
  const locale = useLocale();
  const cards = [
    {
      img: media.halloween,
      title: t("halloweenTitle"),
      text: t("halloweenText"),
    },
    {
      img: media.caramelKiss,
      title: t("caramelTitle"),
      text: t("caramelText"),
    },
    { img: media.sezarRoll, title: t("sezarTitle"), text: t("sezarText") },
  ];

  return (
    <section
      id="news"
      aria-labelledby="news-title"
      className="container-page py-20 md:py-28"
    >
      <SectionHeading
        id="news-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
      />
      <ul className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6">
        {cards.map((c, i) => (
          <li key={c.title}>
            <Reveal delay={i * 0.08}>
              <article className="group">
                <Cover
                  src={c.img.src}
                  alt={tr(c.img.alt, locale)}
                  className="aspect-4/5 rounded-card"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 768px) 33vw, 100vw"
                />
                <h3 className="mt-5 text-xl font-bold">{c.title}</h3>
                <p className="mt-1.5 text-muted">{c.text}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
