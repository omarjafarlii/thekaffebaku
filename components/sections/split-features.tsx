import { useLocale, useTranslations } from "next-intl";
import { Cover } from "@/components/ui/cover";
import { buttonVariants } from "@/components/ui/button-variants";
import { media, type Media } from "@/data/media";
import { t as tr } from "@/lib/i18n-data";
import { cn } from "@/lib/utils";

/**
 * Starbucks-style split blocks: photo on one side, solid brand panel
 * with centered heading, text and an outline button on the other.
 */
export function SplitFeatures() {
  const t = useTranslations("split");
  const locale = useLocale();

  const blocks: {
    img: Media;
    eyebrow: string;
    title: string;
    text: string;
    cta: string;
    reverse?: boolean;
    tone: "green" | "cream";
  }[] = [
    {
      img: media.desserts,
      eyebrow: t("dessertsEyebrow"),
      title: t("dessertsTitle"),
      text: t("dessertsText"),
      cta: t("dessertsCta"),
      tone: "green",
    },
    {
      img: media.riceBowl,
      eyebrow: t("breakfastEyebrow"),
      title: t("breakfastTitle"),
      text: t("breakfastText"),
      cta: t("breakfastCta"),
      reverse: true,
      tone: "cream",
    },
  ];

  return (
    <section
      aria-label={t("dessertsEyebrow")}
      className="container-page flex flex-col gap-4 md:gap-6"
    >
      {blocks.map((b) => (
        <article
          key={b.title}
          className="grid overflow-hidden rounded-panel md:grid-cols-2"
        >
          <Cover
            src={b.img.src}
            alt={tr(b.img.alt, locale)}
            className={cn(
              "aspect-square md:aspect-auto md:min-h-128",
              b.reverse && "md:order-2",
            )}
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-4 px-6 py-14 text-center md:px-14",
              b.tone === "green"
                ? "bg-forest-800 text-cream-50"
                : "bg-surface-2 text-fg",
            )}
          >
            <span
              className={cn(
                "font-hand text-3xl",
                b.tone === "green" ? "text-caramel-400" : "text-accent",
              )}
              lang="en"
            >
              {b.eyebrow}
            </span>
            <h2 className="max-w-md text-title font-bold text-balance">
              {b.title}
            </h2>
            <p
              className={cn(
                "max-w-md text-lead",
                b.tone === "green" ? "text-cream-100" : "text-muted",
              )}
            >
              {b.text}
            </p>
            <a
              href="#menu"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "mt-3",
              )}
            >
              {b.cta}
            </a>
          </div>
        </article>
      ))}
    </section>
  );
}
