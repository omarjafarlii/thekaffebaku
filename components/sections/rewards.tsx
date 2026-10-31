import { useTranslations } from "next-intl";
import { Cake, Coffee, Gift, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { buttonVariants } from "@/components/ui/button-variants";
import { InstagramIcon } from "@/components/brand/social-icons";
import { Logo } from "@/components/brand/logo";
import { info } from "@/data/info";
import { cn } from "@/lib/utils";

/** Loyalty teaser — no programme confirmed yet, so it's a "Coming soon" card. */
export function Rewards() {
  const t = useTranslations("rewards");
  const perks = [
    { Icon: Sparkles, label: t("perk1") },
    { Icon: Cake, label: t("perk2") },
    { Icon: Gift, label: t("perk3") },
  ];

  return (
    <section
      aria-labelledby="rewards-title"
      className="container-page py-20 md:py-28"
    >
      <Reveal>
        <div className="grid items-center gap-10 overflow-hidden rounded-panel bg-surface p-6 shadow-soft md:grid-cols-2 md:p-12">
          <div className="flex flex-col items-start gap-4">
            <span className="font-hand text-2xl text-accent">
              {t("eyebrow")}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="rewards-title" className="text-title font-bold">
                {t("title")}
              </h2>
              <span className="rounded-pill bg-caramel-500 px-3 py-1 text-xs font-bold text-white uppercase">
                {t("soon")}
              </span>
            </div>
            <p className="text-lead text-muted">{t("text")}</p>
            <ul className="mt-2 flex flex-col gap-3">
              {perks.map(({ Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 font-semibold"
                >
                  <span className="grid size-9 place-items-center rounded-pill bg-forest-100 text-forest-800">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <a
              href={info.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "mt-4")}
            >
              <InstagramIcon className="size-4" /> {t("notify")}
            </a>
          </div>

          {/* stamp card */}
          <div className="mx-auto w-full max-w-md rounded-card bg-forest-800 p-6 text-cream-50 shadow-lift md:p-8">
            <div className="flex items-center justify-between">
              <Logo size={40} className="text-cream-50" />
              <span className="text-xs font-bold tracking-widest text-caramel-400 uppercase">
                Rewards
              </span>
            </div>
            <ul className="mt-8 grid grid-cols-5 gap-2.5" aria-hidden>
              {Array.from({ length: 10 }, (_, i) => (
                <li
                  key={i}
                  className={cn(
                    "grid aspect-square place-items-center rounded-pill border",
                    i < 3
                      ? "border-caramel-400 bg-caramel-400 text-forest-900"
                      : "border-cream-50/25 text-cream-50/35",
                  )}
                >
                  <Coffee className="size-4" />
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-cream-100">
              @{info.instagramHandle}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
