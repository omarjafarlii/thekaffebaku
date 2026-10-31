import { useLocale, useTranslations } from "next-intl";
import { Clock, MapPin, Navigation, Phone, ShoppingBag } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { CafeMap } from "@/components/sections/map";
import { OpenStatus } from "@/components/sections/open-status";
import { info } from "@/data/info";
import { t as tr } from "@/lib/i18n-data";
import { cn } from "@/lib/utils";

export function Visit() {
  const t = useTranslations("visit");
  const locale = useLocale();
  const allSame = info.hours.every(
    (h) => h.open === info.hours[0].open && h.close === info.hours[0].close,
  );

  return (
    <section
      id="visit"
      aria-labelledby="visit-title"
      className="container-page py-20 md:py-28"
    >
      <SectionHeading
        id="visit-title"
        eyebrow={t("eyebrow")}
        title={t("title")}
      />

      <div className="mt-12 grid overflow-hidden rounded-panel bg-surface shadow-soft lg:grid-cols-5">
        <div className="flex flex-col gap-7 p-6 md:p-10 lg:col-span-2">
          <div className="flex gap-4">
            <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
            <div>
              <h3 className="text-sm font-semibold text-muted">
                {t("address")}
              </h3>
              <address className="mt-1 text-lg font-semibold not-italic">
                {tr(info.address.street, locale)}
                <br />
                <span className="font-normal text-muted">
                  {tr(info.address.corner, locale)} ·{" "}
                  {tr(info.address.area, locale)},{" "}
                  {tr(info.address.city, locale)}
                </span>
              </address>
            </div>
          </div>

          <div className="flex gap-4">
            <Clock className="mt-0.5 size-5 shrink-0 text-accent" />
            <div className="flex flex-col items-start gap-2">
              <h3 className="text-sm font-semibold text-muted">{t("hours")}</h3>
              {allSame ? (
                <p className="text-lg font-semibold">
                  {t("everyDay")} · {info.hours[0].open}–{info.hours[0].close}
                </p>
              ) : null}
              <OpenStatus />
            </div>
          </div>

          {info.phone && (
            <div className="flex gap-4">
              <Phone className="mt-0.5 size-5 shrink-0 text-accent" />
              <div>
                <h3 className="text-sm font-semibold text-muted">
                  {t("contact")}
                </h3>
                <a
                  href={`tel:${info.phone.replace(/\s/g, "")}`}
                  className="mt-1 block text-lg font-semibold hover:underline"
                >
                  {info.phone}
                </a>
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-wrap gap-2">
            <a
              href={info.links.directions}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              <Navigation className="size-4" /> {t("directions")}
            </a>
            {info.phone && (
              <a
                href={`tel:${info.phone.replace(/\s/g, "")}`}
                className={buttonVariants({ variant: "outline" })}
              >
                <Phone className="size-4" /> {t("call")}
              </a>
            )}
            <a
              href={info.links.boltFood}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              <ShoppingBag className="size-4" /> {t("order")}
            </a>
          </div>
        </div>

        <div className="relative min-h-96 lg:col-span-3">
          <CafeMap label={t("mapLabel")} />
        </div>
      </div>
    </section>
  );
}
