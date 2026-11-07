import { useTranslations } from "next-intl";
import {
  ArrowRight,
  Coffee,
  ExternalLink,
  Gift,
  Smartphone,
  Stamp,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { Logo } from "@/components/brand/logo";
import { info } from "@/data/info";
import { cn } from "@/lib/utils";

const { signupUrl, termsUrl, stamps } = info.loyalty;

/**
 * Loyalty card (WalletPlus): buy 8 coffees, the 9th is on us.
 * Home page: teaser card + link to /rewards. Full page: + how it works.
 */
export function Rewards({ full = false }: { full?: boolean }) {
  const t = useTranslations("rewards");

  const steps = [
    { Icon: Smartphone, title: t("step1Title"), text: t("step1Text") },
    { Icon: Stamp, title: t("step2Title"), text: t("step2Text", { stamps }) },
    {
      Icon: Gift,
      title: t("step3Title"),
      text: t("step3Text", { free: stamps + 1 }),
    },
  ];

  return (
    <section
      id="rewards"
      aria-labelledby="rewards-title"
      className="container-page py-20 md:py-28"
    >
      <Reveal>
        <div className="grid items-center gap-10 overflow-hidden rounded-panel bg-surface p-6 shadow-soft md:grid-cols-2 md:p-12">
          <div className="flex flex-col items-start gap-4">
            <span className="font-hand text-2xl text-accent">
              {t("eyebrow")}
            </span>
            {full ? (
              <h1
                id="rewards-title"
                className="text-title font-bold text-balance"
              >
                {t("title", { stamps, free: stamps + 1 })}
              </h1>
            ) : (
              <h2
                id="rewards-title"
                className="text-title font-bold text-balance"
              >
                {t("title", { stamps, free: stamps + 1 })}
              </h2>
            )}
            <p className="text-lead text-muted">{t("text")}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "lg" })}
              >
                {t("join")} <ExternalLink className="size-4" />
              </a>
              {!full && (
                <Link
                  href="/rewards"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  {t("more")} <ArrowRight className="size-4" />
                </Link>
              )}
            </div>
            <p className="text-sm text-muted">{t("free")}</p>
          </div>

          <StampCard demo={3} />
        </div>
      </Reveal>

      {full && (
        <>
          <SectionHeading
            eyebrow={t("howEyebrow")}
            title={t("howTitle")}
            className="mt-20"
          />
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ Icon, title, text }, i) => (
              <li key={title}>
                <Reveal delay={i * 0.08} className="h-full">
                  <div className="flex h-full flex-col gap-3 rounded-card bg-surface p-6 shadow-soft">
                    <div className="flex items-center justify-between">
                      <span className="grid size-12 place-items-center rounded-pill bg-forest-800 text-cream-50">
                        <Icon className="size-5" />
                      </span>
                      <span className="font-hand text-4xl text-accent">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="text-muted">{text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-col items-center gap-4 text-center">
            <a
              href={signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg" })}
            >
              {t("join")} <ExternalLink className="size-4" />
            </a>
            <a
              href={termsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted underline underline-offset-4 hover:text-fg"
            >
              {t("terms")}
            </a>
          </div>
        </>
      )}
    </section>
  );
}

/** Visual stamp card: `stamps` cups + a gift slot; `demo` cups are filled. */
function StampCard({ demo }: { demo: number }) {
  const t = useTranslations("rewards");
  return (
    <div className="mx-auto w-full max-w-sm rounded-card bg-forest-800 p-6 text-cream-50 shadow-lift md:p-8">
      <div className="flex items-center justify-between">
        <Logo size={40} className="text-cream-50" />
        <span className="text-xs font-bold tracking-widest text-caramel-400 uppercase">
          Loyalty card
        </span>
      </div>
      <ul className="mt-8 grid grid-cols-3 gap-3" aria-hidden>
        {Array.from({ length: stamps + 1 }, (_, i) => {
          const gift = i === stamps;
          return (
            <li
              key={i}
              className={cn(
                "grid aspect-square place-items-center rounded-pill border-2",
                gift
                  ? "border-dashed border-caramel-400 text-caramel-400"
                  : i < demo
                    ? "border-caramel-400 bg-caramel-400 text-forest-900"
                    : "border-cream-50/25 text-cream-50/35",
              )}
            >
              {gift ? (
                <Gift className="size-6" />
              ) : (
                <Coffee className="size-5" />
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-6 flex items-center justify-between text-sm">
        <span className="text-cream-100">
          {t("progress", { have: demo, stamps })}
        </span>
        <span className="font-bold text-caramel-400">
          {t("giftLabel", { free: stamps + 1 })}
        </span>
      </div>
    </div>
  );
}
