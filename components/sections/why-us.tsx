import { useLocale, useTranslations } from "next-intl";
import { Coffee, MapPin, PawPrint, Sofa } from "lucide-react";
import { Cover } from "@/components/ui/cover";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { media } from "@/data/media";
import { t as tr } from "@/lib/i18n-data";

/** Four tall photo tiles with overlay captions. */
export function WhyUs() {
  const t = useTranslations("why");
  const locale = useLocale();
  const tiles = [
    {
      img: media.croissant,
      title: t("coffeeTitle"),
      label: t("coffeeLabel"),
      Icon: Coffee,
    },
    {
      img: media.cat,
      title: t("catsTitle"),
      label: t("catsLabel"),
      Icon: PawPrint,
    },
    {
      img: media.counter,
      title: t("atmosphereTitle"),
      label: t("atmosphereLabel"),
      Icon: Sofa,
    },
    {
      img: media.facade,
      title: t("cityTitle"),
      label: t("cityLabel"),
      Icon: MapPin,
    },
  ];

  return (
    <section aria-labelledby="why-title" className="py-20 md:py-28">
      <SectionHeading
        id="why-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
        className="container-page"
      />
      <ul className="mt-12 grid grid-cols-2 gap-2 px-2 md:gap-3 md:px-4 lg:grid-cols-4">
        {tiles.map(({ img, title, label, Icon }, i) => (
          <li key={label}>
            <Reveal delay={i * 0.06}>
              <article className="group relative isolate aspect-3/4 overflow-hidden rounded-card text-cream-50">
                <Cover
                  src={img.src}
                  alt={tr(img.alt, locale)}
                  className="absolute inset-0 -z-10"
                  imgClassName="transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                />
                <div className="absolute inset-0 -z-10 bg-linear-to-t from-forest-950/80 via-forest-950/20 to-forest-950/30" />
                <div className="flex h-full flex-col justify-between p-4 md:p-6">
                  <span className="grid size-9 place-items-center rounded-pill bg-cream-50/20 backdrop-blur">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-lg leading-tight font-bold md:text-2xl">
                      {title}
                    </h3>
                    <p className="mt-2 text-xs font-bold tracking-widest text-cream-100 uppercase">
                      {label}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
