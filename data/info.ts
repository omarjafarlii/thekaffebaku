/**
 * ============================================================
 *  THE KAFFE LOOPIE — BUSINESS INFO
 *  Edit this file to update contact data, hours and links.
 *  `null` = not confirmed -> the site shows a placeholder or hides it.
 *
 *  Sources (collected 2026-10-31):
 *   - Google Maps listing "The Kaffe Loopie" (address, phone, hours,
 *     rating, Bolt Food link)
 *   - Instagram @thekaffe.baku (bio, slogan, followers, posts)
 * ============================================================
 */

import type { Localized } from "@/lib/i18n-data";

export type DayHours = {
  /** 0 = Sunday … 6 = Saturday */
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** "HH:MM" Baku time */
  open: string | null;
  close: string | null;
  closed?: boolean;
};

const everyDay = (open: string, close: string): DayHours[] =>
  ([1, 2, 3, 4, 5, 6, 0] as const).map((day) => ({ day, open, close }));

export const info = {
  name: "The Kaffe",
  fullName: "The Kaffe Loopie",
  instagramHandle: "thekaffe.baku",
  /** Brand slogan from Instagram bio — verbatim */
  slogan: "Coffee. Brunch. Sweet Moments.",
  bio: ["All-Day Breakfast & Signature Desserts", "Pet Friendly 🐾"],
  instagramFollowers: 5561,

  address: {
    street: {
      az: "İstiqlaliyyət küçəsi 45",
      en: "45 Istiqlaliyyat St",
      ru: "ул. Истиглалият, 45",
    } satisfies Localized,
    area: {
      az: "İçərişəhər yaxınlığı, Səbail",
      en: "Next to Icherisheher, Sabail",
      ru: "Рядом с Ичеришехер, Сабаил",
    } satisfies Localized,
    /** corner landmark visible on the façade */
    corner: {
      az: "Zərgərpalan küçəsinin tini",
      en: "Corner of Zargarpalan St",
      ru: "Угол ул. Заргарпалан",
    } satisfies Localized,
    city: { az: "Bakı", en: "Baku", ru: "Баку" } satisfies Localized,
    postalCode: "AZ1001",
    countryCode: "AZ",
  },

  geo: { lat: 40.3685863, lng: 49.8329237 },

  /** Display format */
  phone: "+994 77 171 01 77" as string | null,
  /** International digits only — set if this number is on WhatsApp */
  whatsapp: null as string | null,
  email: null as string | null,

  social: {
    instagram: "https://www.instagram.com/thekaffe.baku/",
    tiktok: null as string | null,
    facebook: null as string | null,
  },

  links: {
    googleMaps: "https://maps.app.goo.gl/3YgzaHTCWcWzfMDa9",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=The+Kaffe+Loopie+Baku",
    /** https://search.google.com/local/writereview?placeid=PLACE_ID — falls back to googleMaps */
    googleWriteReview: null as string | null,
    boltFood: "https://food.bolt.eu/en-US/335/p/195376",
  },

  /** Google Maps: every day 07:00–23:00 */
  hours: everyDay("07:00", "23:00"),

  ratings: {
    google: { value: 4.9 as number | null, count: 330 as number | null },
  },

  amenities: {
    petFriendly: true,
    residentCats: true, // "we adopt our cats from the street" — owner reply on Google
    allDayBreakfast: true,
    delivery: true, // Bolt Food
  },

  /**
   * Loyalty card on WalletPlus: "8 kofe al, 9-cu hədiyyə".
   * Sign-up is phone number + SMS code on the WalletPlus page.
   */
  loyalty: {
    signupUrl: "https://thekaffe.walletplus.az/signup?id=18",
    termsUrl: "https://thekaffe.walletplus.az/terms.php",
    /** coffees to buy; the next one is free */
    stamps: 8,
  },
} as const;

export type Info = typeof info;
