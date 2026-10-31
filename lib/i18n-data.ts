import type { Locale } from "@/i18n/routing";

/** A string available in every site language. */
export type Localized = Record<Locale, string>;

/** Pick the right language from a Localized value (falls back to Azerbaijani). */
export function t(value: Localized | null | undefined, locale: string): string {
  if (!value) return "";
  return value[locale as Locale] ?? value.az;
}
