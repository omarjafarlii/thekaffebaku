/**
 * ============================================================
 *  PHOTOS — all from the café's own Instagram (@thekaffe.baku)
 *  and its Google Maps listing. Files live in /public/media/.
 *
 *  Instagram images are the public web previews (~500–640 px).
 *  Replace them with the original high-resolution files when
 *  available (same file names = no code changes).
 * ============================================================
 */

import type { Localized } from "@/lib/i18n-data";

export type Media = {
  src: string;
  alt: Localized;
  source: "instagram" | "google";
};

const m = (
  src: string,
  az: string,
  en: string,
  ru: string,
  source: Media["source"] = "instagram",
): Media => ({
  src,
  alt: { az, en, ru },
  source,
});

export const media = {
  interior: m(
    "/media/interior.jpg",
    "The Kaffe-nin interyeri",
    "Inside The Kaffe",
    "Интерьер The Kaffe",
    "google",
  ),
  exterior: m(
    "/media/exterior.jpg",
    "The Kaffe-nin girişi, İstiqlaliyyət küçəsi",
    "The Kaffe entrance on Istiqlaliyyat St",
    "Вход в The Kaffe, ул. Истиглалият",
    "google",
  ),
  facade: m(
    "/media/facade.jpg",
    "Yaşıl tentli fasad",
    "Façade with the green awning",
    "Фасад с зелёным навесом",
  ),
  counter: m(
    "/media/counter.jpg",
    "Bar və menyu",
    "The counter and menu",
    "Барная стойка и меню",
  ),
  cat: m(
    "/media/cat.jpg",
    "Kafenin pişiyi",
    "One of the café cats",
    "Котик кафе",
  ),
  croissant: m(
    "/media/croissant-coffee.jpg",
    "Kruassan və kapuçino",
    "Croissant and cappuccino",
    "Круассан и капучино",
  ),
  coffeeToGo: m(
    "/media/coffee-to-go.jpg",
    "Özünlə apar qəhvə",
    "Coffee to go",
    "Кофе с собой",
  ),
  desserts: m(
    "/media/desserts.jpg",
    "Tiramisu, panna kotta, maqnoliya pudinqi, enerji topları",
    "Tiramisu, panna cotta, magnolia pudding, energy balls",
    "Тирамису, панна-котта, магнолия-пудинг, энергетические шарики",
  ),
  riceBowl: m("/media/rice-bowl.jpg", "Rice Bowl", "Rice Bowl", "Rice Bowl"),
  sezarRoll: m(
    "/media/sezar-roll.jpg",
    "Sezar roll",
    "Caesar roll",
    "Цезарь-ролл",
  ),
  caramelKiss: m(
    "/media/caramel-kiss.jpg",
    "Caramel Kiss",
    "Caramel Kiss",
    "Caramel Kiss",
  ),
  halloween: m(
    "/media/halloween.jpg",
    "Halloween at The KAFFE",
    "Halloween at The KAFFE",
    "Halloween в The KAFFE",
  ),
  neon: m(
    "/media/neon-sign.jpg",
    "The Kaffe — Coffee Vibes",
    "The Kaffe — Coffee Vibes",
    "The Kaffe — Coffee Vibes",
  ),
} satisfies Record<string, Media>;

/** Instagram strip near the footer */
export const instagramFeed: Media[] = [
  media.coffeeToGo,
  media.halloween,
  media.cat,
  media.desserts,
  media.facade,
  media.croissant,
];
