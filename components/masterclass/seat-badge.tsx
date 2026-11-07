import { useTranslations } from "next-intl";
import type { SeatState } from "@/lib/masterclass";
import { cn } from "@/lib/utils";

const styles: Record<SeatState, string> = {
  open: "bg-forest-100 text-forest-800 dark:bg-forest-800 dark:text-cream-100",
  last: "bg-caramel-500 text-white",
  soldOut: "bg-ink-900 text-cream-50 dark:bg-cream-100 dark:text-ink-900",
  ended: "bg-surface-2 text-muted",
};

/** Small pill: "5 seats left" / "Last 3 seats!" / "Sold out" / "Ended". */
export function SeatBadge({
  state,
  left,
  className,
}: {
  state: SeatState;
  left: number;
  className?: string;
}) {
  const t = useTranslations("masterclass");
  const label = {
    open: t("seatsLeft", { count: left }),
    last: t("lastSeats", { count: left }),
    soldOut: t("soldOut"),
    ended: t("ended"),
  }[state];
  return (
    <span
      className={cn(
        "rounded-pill px-2.5 py-1 text-xs font-bold whitespace-nowrap",
        styles[state],
        className,
      )}
    >
      {label}
    </span>
  );
}
