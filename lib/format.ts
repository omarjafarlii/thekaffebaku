/**
 * Deterministic number/date formatting.
 * Browsers (e.g. Chrome) don't ship Azerbaijani Intl data, so
 * `toLocaleString("az")` differs between server and client and breaks
 * hydration. These helpers produce identical output everywhere.
 */

const SEP: Record<string, { group: string; decimal: string }> = {
  az: { group: ".", decimal: "," },
  ru: { group: " ", decimal: "," },
  en: { group: ",", decimal: "." },
};

export function formatNumber(value: number, locale: string, decimals = 0) {
  const { group, decimal } = SEP[locale] ?? SEP.en;
  const [int, frac] = value.toFixed(decimals).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, group);
  return frac ? `${grouped}${decimal}${frac}` : grouped;
}

const MONTHS: Record<string, string[]> = {
  az: [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avqust",
    "sentyabr",
    "oktyabr",
    "noyabr",
    "dekabr",
  ],
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

const WEEKDAYS: Record<string, string[]> = {
  az: [
    "bazar",
    "bazar ertəsi",
    "çərşənbə axşamı",
    "çərşənbə",
    "cümə axşamı",
    "cümə",
    "şənbə",
  ],
  ru: [
    "воскресенье",
    "понедельник",
    "вторник",
    "среда",
    "четверг",
    "пятница",
    "суббота",
  ],
  en: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
};

/** "26 aprel" / "26 апреля" / "April 26"; without a day: "aprel 2026" / "апрель 2026" / "April 2026". */
export function formatDate(
  d: { year: number | null; month: number; day: number | null },
  locale: string,
  opts: { weekday?: boolean } = {},
) {
  if (d.day === null) {
    const nominative = (NOMINATIVE[locale] ?? MONTHS.en)[d.month - 1];
    return d.year ? `${nominative} ${d.year}` : nominative;
  }
  const months = MONTHS[locale] ?? MONTHS.en;
  const m = months[d.month - 1];
  let out = locale === "en" ? `${m} ${d.day}` : `${d.day} ${m}`;
  if (d.year) out += locale === "en" ? `, ${d.year}` : ` ${d.year}`;
  if (opts.weekday && d.year) {
    const wd = (WEEKDAYS[locale] ?? WEEKDAYS.en)[
      new Date(d.year, d.month - 1, d.day).getDay()
    ];
    out = locale === "en" ? `${wd}, ${out}` : `${out}, ${wd}`;
  }
  return out;
}

/** Month names for "month year" (Russian needs the nominative case). */
const NOMINATIVE: Record<string, string[]> = {
  az: MONTHS.az,
  ru: [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ],
  en: MONTHS.en,
};

/** Parse "YYYY-MM-DD" into parts. */
export function parseIsoDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}
