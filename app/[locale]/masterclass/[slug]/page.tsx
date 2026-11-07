import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  Languages,
  MapPin,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Gallery } from "@/components/masterclass/gallery";
import { TicketBox } from "@/components/masterclass/ticket-box";
import { getMasterclass, masterclasses } from "@/data/masterclasses";
import { info } from "@/data/info";
import { t as tr } from "@/lib/i18n-data";
import { formatDate, parseIsoDate } from "@/lib/format";
import { durationHours, formatPrice, seatState } from "@/lib/masterclass";
import { bakuToday } from "@/lib/schemas";

export const revalidate = 3600;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    masterclasses.map((m) => ({ locale, slug: m.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/masterclass/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const mc = getMasterclass(slug);
  if (!mc) return {};
  return {
    title: tr(mc.title, locale),
    description: tr(mc.summary, locale),
    alternates: { canonical: `/${locale}/masterclass/${slug}` },
    openGraph: { images: [mc.cover.src] },
  };
}

export default async function MasterclassPage({
  params,
}: PageProps<"/[locale]/masterclass/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const mc = getMasterclass(slug);
  if (!mc) notFound();

  const t = await getTranslations("masterclass");
  const state = seatState(mc, bakuToday());
  const title = tr(mc.title, locale);

  const facts = [
    {
      icon: CalendarDays,
      label: t("date"),
      value: formatDate(parseIsoDate(mc.date), locale, { weekday: true }),
    },
    {
      icon: Clock,
      label: t("time"),
      value: `${mc.start}–${mc.end} · ${t("hours", { hours: durationHours(mc, locale) })}`,
    },
    {
      icon: Languages,
      label: t("language"),
      value: mc.languages.map((l) => t(`lang_${l}`)).join(", "),
    },
    { icon: Sparkles, label: t("level"), value: t(`level_${mc.level}`) },
    {
      icon: UserRound,
      label: t("host"),
      value: `${tr(mc.host.role, locale)} · ${mc.host.name}`,
    },
    {
      icon: MapPin,
      label: t("location"),
      value: `${info.fullName}, ${tr(info.address.street, locale)}`,
    },
  ];

  const eventLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description: tr(mc.summary, locale),
    startDate: `${mc.date}T${mc.start}:00+04:00`,
    endDate: `${mc.date}T${mc.end}:00+04:00`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    image: mc.gallery.map((g) => g.src),
    location: {
      "@type": "Place",
      name: info.fullName,
      address: tr(info.address.street, "en") + ", Baku",
    },
    offers: {
      "@type": "Offer",
      price: mc.price,
      priceCurrency: "AZN",
      availability:
        mc.seatsLeft > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
    },
  };

  return (
    <>
      <Header />
      <main id="main" className="pt-header">
        <div id="top" className="container-page py-8 md:py-12">
          <Link
            href="/masterclass"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-fg"
          >
            <ArrowLeft className="size-4" /> {t("back")}
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
            <div className="flex min-w-0 flex-col gap-10">
              <Gallery photos={mc.gallery} title={title} />

              <header className="flex flex-col gap-3">
                <span className="w-fit rounded-pill bg-forest-100 px-3 py-1 text-xs font-bold text-forest-800 dark:bg-forest-800 dark:text-cream-100">
                  {t(`cat_${mc.category}`)}
                </span>
                <h1 className="text-title font-bold text-balance">{title}</h1>
                <p className="text-lead text-muted">{tr(mc.summary, locale)}</p>
              </header>

              <dl className="grid gap-4 sm:grid-cols-2">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-start gap-3 rounded-card bg-surface p-4"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-surface-2 text-accent">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-xs font-semibold text-muted">
                        {label}
                      </dt>
                      <dd className="font-semibold">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <section aria-labelledby="mc-about">
                <h2 id="mc-about" className="text-subtitle font-bold">
                  {t("about")}
                </h2>
                <div className="mt-4 flex flex-col gap-4 text-lead text-fg/85">
                  {mc.description.map((p, i) => (
                    <p key={i}>{tr(p, locale)}</p>
                  ))}
                </div>
              </section>

              <section aria-labelledby="mc-includes">
                <h2 id="mc-includes" className="text-subtitle font-bold">
                  {t("includes")}
                </h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {mc.includes.map((x, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-pill bg-forest-800 text-cream-50">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      {tr(x, locale)}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <TicketBox
                slug={mc.slug}
                price={mc.price}
                seatsLeft={mc.seatsLeft}
                seatsTotal={mc.seatsTotal}
                state={state}
              />
            </aside>
          </div>
        </div>

        {/* Mobile: fixed buy bar so the CTA is always in reach */}
        {(state === "open" || state === "last") && (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xl font-extrabold">
                  {formatPrice(mc.price, locale)}
                </p>
                <p className="text-xs text-muted">{t("perPerson")}</p>
              </div>
              <Link
                href={`/masterclass/${mc.slug}/checkout`}
                className="inline-flex h-12 items-center rounded-pill bg-brand px-7 font-semibold text-brand-fg"
              >
                {t("buy")}
              </Link>
            </div>
          </div>
        )}
      </main>
      <div className="bg-forest-800 pb-20 lg:pb-0 dark:bg-forest-900">
        <Footer />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(eventLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}
