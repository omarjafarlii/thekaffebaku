import { useLocale, useTranslations } from "next-intl";
import { Logo } from "@/components/brand/logo";
import { SocialLinks } from "@/components/layout/social-links";
import { info } from "@/data/info";
import { NAV_ITEMS } from "@/lib/nav";
import { t as tr } from "@/lib/i18n-data";

export function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tv = useTranslations("visit");
  const locale = useLocale();
  const h = info.hours[0];

  return (
    <footer className="bg-forest-800 text-cream-100 dark:bg-forest-900">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <Logo size={48} className="text-cream-50" />
          <p className="font-hand text-2xl text-caramel-400" lang="en">
            {info.slogan}
          </p>
        </div>

        <nav aria-label={t("explore")}>
          <h2 className="mb-4 text-sm font-bold text-cream-50">
            {t("explore")}
          </h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {NAV_ITEMS.map((i) => (
              <li key={i.key}>
                <a href={i.href} className="hover:text-white hover:underline">
                  {tn(i.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-bold text-cream-50">{t("visit")}</h2>
          <address className="flex flex-col gap-2.5 text-sm not-italic">
            <a
              href={info.links.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              {tr(info.address.street, locale)}, {tr(info.address.city, locale)}
            </a>
            {info.phone && (
              <a
                href={`tel:${info.phone.replace(/\s/g, "")}`}
                className="hover:text-white"
              >
                {info.phone}
              </a>
            )}
            <span>
              {tv("everyDay")} {h.open}–{h.close}
            </span>
          </address>
        </div>

        <div>
          <h2 className="mb-4 text-sm font-bold text-cream-50">
            {t("follow")}
          </h2>
          <SocialLinks />
        </div>
      </div>
      <div className="border-t border-cream-50/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-cream-100/80 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {info.fullName}. {t("rights")}
          </p>
          <a href="#top" className="hover:text-white">
            ↑ {t("backToTop")}
          </a>
        </div>
      </div>
    </footer>
  );
}
