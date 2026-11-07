import type { Masterclass } from "@/data/masterclasses";
import { info } from "@/data/info";
import { formatNumber } from "@/lib/format";
import { t as tr } from "@/lib/i18n-data";
import { siteUrl } from "@/lib/utils";

export { formatPrice } from "@/lib/format";

/** Class length in hours, e.g. 2 or 2.5 (formatted for the locale). */
export function durationHours(
  mc: Pick<Masterclass, "start" | "end">,
  locale: string,
) {
  const toMin = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
  const h = (toMin(mc.end) - toMin(mc.start)) / 60;
  return formatNumber(h, locale, Number.isInteger(h) ? 0 : 1);
}

export type SeatState = "ended" | "soldOut" | "last" | "open";

/** Availability label used on cards and the ticket box. */
export function seatState(mc: Masterclass, today: string): SeatState {
  if (mc.date < today) return "ended";
  if (mc.seatsLeft <= 0) return "soldOut";
  if (mc.seatsLeft <= 3) return "last";
  return "open";
}

/** Baku is UTC+4 all year. "2026-11-21" + "12:00" -> "20261121T080000Z" */
function utcStamp(date: string, time: string) {
  const d = new Date(`${date}T${time}:00+04:00`);
  return d
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

/** Google Calendar "add event" link with the café address. */
export function calendarUrl(mc: Masterclass, locale: string) {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: `${tr(mc.title, locale)} · ${info.fullName}`,
    dates: `${utcStamp(mc.date, mc.start)}/${utcStamp(mc.date, mc.end)}`,
    location: `${info.fullName}, ${tr(info.address.street, locale)}, ${tr(info.address.city, locale)}`,
    details: `${siteUrl}/${locale}/masterclass/${mc.slug}`,
    ctz: "Asia/Baku",
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}
