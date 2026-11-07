"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Ticket } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MAX_TICKETS_PER_ORDER } from "@/data/masterclasses";
import { buttonVariants } from "@/components/ui/button-variants";
import { Quantity } from "@/components/masterclass/quantity";
import { SeatBadge } from "@/components/masterclass/seat-badge";
import { info } from "@/data/info";
import { formatPrice, type SeatState } from "@/lib/masterclass";
import { InstagramIcon } from "@/components/brand/social-icons";

/** Sticky "price · quantity · Buy ticket" box on the detail page. */
export function TicketBox({
  slug,
  price,
  seatsLeft,
  seatsTotal,
  state,
}: {
  slug: string;
  price: number;
  seatsLeft: number;
  seatsTotal: number;
  state: SeatState;
}) {
  const t = useTranslations("masterclass");
  const locale = useLocale();
  const [qty, setQty] = useState(1);
  const max = Math.min(seatsLeft, MAX_TICKETS_PER_ORDER);
  const canBuy = state === "open" || state === "last";

  return (
    <div className="flex flex-col gap-5 rounded-panel bg-surface p-6 shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{t("price")}</p>
          <p className="text-3xl font-extrabold">
            {formatPrice(price, locale)}
          </p>
          <p className="text-xs text-muted">{t("perPerson")}</p>
        </div>
        <SeatBadge state={state} left={seatsLeft} />
      </div>

      {canBuy && (
        <div
          className="h-2 overflow-hidden rounded-pill bg-surface-2"
          role="img"
          aria-label={t("seatsOf", { left: seatsLeft, total: seatsTotal })}
        >
          <div
            className="h-full rounded-pill bg-accent"
            style={{
              width: `${((seatsTotal - seatsLeft) / seatsTotal) * 100}%`,
            }}
          />
        </div>
      )}

      {canBuy ? (
        <>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="tb-qty" className="text-sm font-semibold">
              {t("tickets")}
            </label>
            <Quantity
              id="tb-qty"
              value={qty}
              max={max}
              onChange={setQty}
              className="w-36"
            />
          </div>
          <div className="flex items-baseline justify-between border-t border-line pt-4">
            <span className="font-semibold">{t("total")}</span>
            <span className="text-2xl font-extrabold tabular-nums">
              {formatPrice(price * qty, locale)}
            </span>
          </div>
          <Link
            href={{
              pathname: `/masterclass/${slug}/checkout`,
              query: { qty },
            }}
            className={buttonVariants({ size: "lg", className: "w-full" })}
          >
            <Ticket className="size-4" /> {t("buy")}
          </Link>
          <p className="text-center text-xs text-muted">
            {t("seatsOf", { left: seatsLeft, total: seatsTotal })}
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-muted">{t("soldOutText")}</p>
          <a
            href={info.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full",
            })}
          >
            <InstagramIcon className="size-4" /> {t("follow")}
          </a>
        </>
      )}
    </div>
  );
}
