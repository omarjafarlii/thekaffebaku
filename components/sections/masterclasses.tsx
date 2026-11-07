import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { upcomingMasterclasses } from "@/data/masterclasses";
import { MasterclassCard } from "@/components/masterclass/masterclass-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { bakuToday } from "@/lib/schemas";

/** Home-page teaser: the next three paid masterclasses. */
export function Masterclasses() {
  const t = useTranslations("masterclass");
  const today = bakuToday();
  const list = upcomingMasterclasses(today);
  if (list.length === 0) return null;

  return (
    <section
      id="masterclasses"
      aria-labelledby="masterclasses-title"
      className="container-page py-20 md:py-28"
    >
      <SectionHeading
        id="masterclasses-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
      >
        {t("intro")}
      </SectionHeading>

      <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.slice(0, 3).map((mc, i) => (
          <li key={mc.slug} className="min-w-0">
            <Reveal delay={i * 0.08} className="h-full">
              <MasterclassCard mc={mc} today={today} />
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-12 flex justify-center">
        <Link
          href="/masterclass"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          {t("viewAll")} <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
