import type { DayHours } from "@/data/info";

export const BAKU_TZ = "Asia/Baku";

/** Current weekday (0=Sun) and minutes since midnight in Baku (UTC+4). */
export function bakuNow(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BAKU_TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    day: days.indexOf(get("weekday")),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export type OpenStatus =
  | { state: "open"; closesAt: string }
  | { state: "closed"; opensAt: string | null }
  | { state: "unknown"; closesAt: string | null };

/**
 * Computes live open/closed status. Handles closing after midnight
 * (e.g. 09:00–01:00). Returns "unknown" when hours are incomplete.
 */
export function getOpenStatus(
  hours: DayHours[],
  date = new Date(),
): OpenStatus {
  const { day, minutes } = bakuNow(date);
  const today = hours.find((h) => h.day === day);
  const yesterday = hours.find((h) => h.day === (day + 6) % 7);

  // Still open from yesterday's late shift?
  if (yesterday?.open && yesterday.close && !yesterday.closed) {
    const o = toMin(yesterday.open);
    const c = toMin(yesterday.close);
    if (c < o && minutes < c)
      return { state: "open", closesAt: yesterday.close };
  }

  if (!today || today.closed) return { state: "closed", opensAt: null };
  if (!today.open || !today.close)
    return { state: "unknown", closesAt: today.close };

  const o = toMin(today.open);
  const c = toMin(today.close);
  const isOpen = c > o ? minutes >= o && minutes < c : minutes >= o;
  if (isOpen) return { state: "open", closesAt: today.close };
  if (minutes < o) return { state: "closed", opensAt: today.open };

  const tomorrow = hours.find((h) => h.day === (day + 1) % 7);
  return { state: "closed", opensAt: tomorrow?.open ?? null };
}
