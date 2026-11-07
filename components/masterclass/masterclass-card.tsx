import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Masterclass } from "@/data/masterclasses";
import { Cover } from "@/components/ui/cover";
import { SeatBadge } from "@/components/masterclass/seat-badge";
import { t as tr } from "@/lib/i18n-data";
import { formatDate, parseIsoDate } from "@/lib/format";
import { durationHours, formatPrice, seatState } from "@/lib/masterclass";
import { cn } from "@/lib/utils";

/** Event card (poster, date chip, price, availability) linking to the detail page. */
export function MasterclassCard({
  mc,
  today,
  className,
}: {
  mc: Masterclass;
  today: string;
  className?: string;
}) {
  const t = useTranslations("masterclass");
  const locale = useLocale();
  const d = parseIsoDate(mc.date);
  const [day, month] =
    locale === "en"
      ? formatDate({ ...d, year: null }, locale)
          .split(" ")
          .reverse()
      : formatDate({ ...d, year: null }, locale).split(" ");
  const state = seatState(mc, today);

  return (
    <Link
      href={`/masterclass/${mc.slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift",
        state === "ended" && "opacity-70",
        className,
      )}
    >
      <div className="relative">
        <Cover
          src={mc.cover.src}
          alt={tr(mc.cover.alt, locale)}
          className="aspect-4/3"
          imgClassName="transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        <div className="absolute top-3 left-3 flex min-w-14 flex-col items-center rounded-2xl bg-surface px-3 py-1.5 text-center shadow-soft">
          <span className="text-2xl leading-none font-extrabold">{day}</span>
          <span className="text-xs font-semibold text-muted">
            {month.slice(0, 3)}
          </span>
        </div>
        <span className="absolute top-3 right-3 rounded-pill bg-forest-800/85 px-3 py-1 text-xs font-bold text-cream-50 backdrop-blur">
          {t(`cat_${mc.category}`)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl leading-snug font-bold text-balance group-hover:underline">
          {tr(mc.title, locale)}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">
          {tr(mc.summary, locale)}
        </p>
        <p className="flex items-center gap-1.5 text-sm font-medium">
          <Clock className="size-4 text-accent" aria-hidden />
          {mc.start}–{mc.end} ·{" "}
          {t("hours", { hours: durationHours(mc, locale) })}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-2xl font-extrabold">
              {formatPrice(mc.price, locale)}
            </p>
            <p className="text-xs text-muted">{t("perPerson")}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <SeatBadge state={state} left={mc.seatsLeft} />
            <span className="inline-flex items-center gap-1 text-sm font-bold text-accent">
              {state === "open" || state === "last" ? t("buy") : t("details")}
              <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
