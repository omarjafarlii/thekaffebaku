/**
 * ============================================================
 *  MASTERCLASSES — paid workshops held at the café
 *   - slug: used in the URL (/az/masterclass/<slug>)
 *   - date "YYYY-MM-DD", start/end "HH:MM" (Baku time)
 *   - price in AZN per ticket
 *   - seatsLeft: update by hand as tickets sell (0 = sold out)
 *   - cover + gallery: paths in /public (replace with real photos
 *     from the workshops — same file names = no code changes)
 *
 *  NOTE: titles, dates and prices below are EXAMPLES. Replace them
 *  with the café's real schedule before going live.
 * ============================================================
 */

import type { Localized } from "@/lib/i18n-data";
import { media, type Media } from "@/data/media";

export type MasterclassCategory = "coffee" | "dessert" | "brunch";
export type MasterclassLevel = "beginner" | "all" | "advanced";

export type Masterclass = {
  slug: string;
  category: MasterclassCategory;
  level: MasterclassLevel;
  title: Localized;
  /** one line for cards */
  summary: Localized;
  /** paragraphs for the detail page */
  description: Localized[];
  /** "what you'll learn / what's included" bullet list */
  includes: Localized[];
  host: { name: string; role: Localized };
  date: string;
  start: string;
  end: string;
  price: number;
  seatsTotal: number;
  seatsLeft: number;
  /** spoken language(s) of the class */
  languages: ("az" | "en" | "ru")[];
  cover: Media;
  gallery: Media[];
};

const L = (az: string, en: string, ru: string): Localized => ({ az, en, ru });

export const masterclasses: Masterclass[] = [
  {
    slug: "latte-art-basics",
    category: "coffee",
    level: "beginner",
    title: L(
      "Latte Art: ilk ürəyini çək",
      "Latte Art: pour your first heart",
      "Латте-арт: первое сердце",
    ),
    summary: L(
      "Süd köpüyü, espresso və ilk naxışlar — barista ilə yan-yana.",
      "Milk texture, espresso and your first patterns — side by side with our barista.",
      "Молочная пена, эспрессо и первые узоры — рядом с бариста.",
    ),
    description: [
      L(
        "Bu masterklasda espresso maşınının arxasına keçirsiniz. Baristamız südü düzgün köpükləndirməyi, espresso ilə birləşdirməyi və klassik naxışları — ürək, tülpan və rozettanı — addım-addım göstərəcək.",
        "In this masterclass you step behind the espresso machine. Our barista will show you how to steam milk properly, combine it with espresso and pour the classic patterns — heart, tulip and rosetta — step by step.",
        "На этом мастер-классе вы встанете за эспрессо-машину. Наш бариста покажет, как правильно взбивать молоко, соединять его с эспрессо и рисовать классические узоры — сердце, тюльпан и розетту.",
      ),
      L(
        "Hər iştirakçı ən azı 6–8 fincan özü hazırlayır. Təcrübə tələb olunmur — sadəcə qəhvəni sevmək kifayətdir.",
        "Every guest pours at least 6–8 cups themselves. No experience needed — just a love of coffee.",
        "Каждый участник сам готовит минимум 6–8 чашек. Опыт не нужен — достаточно любить кофе.",
      ),
    ],
    includes: [
      L(
        "Espresso və süd haqqında nəzəriyyə",
        "Espresso and milk basics",
        "Теория эспрессо и молока",
      ),
      L(
        "Fərdi praktika espresso maşınında",
        "Hands-on practice on the machine",
        "Практика на эспрессо-машине",
      ),
      L(
        "Kruassan və istədiyiniz içki",
        "A croissant and a drink of your choice",
        "Круассан и напиток на выбор",
      ),
      L(
        "İştirak sertifikatı",
        "Certificate of participation",
        "Сертификат участника",
      ),
    ],
    host: {
      name: "The Kaffe",
      role: L("Baş barista", "Head barista", "Шеф-бариста"),
    },
    date: "2026-11-21",
    start: "12:00",
    end: "14:00",
    price: 45,
    seatsTotal: 8,
    seatsLeft: 5,
    languages: ["az", "ru"],
    cover: media.counter,
    gallery: [
      media.counter,
      media.caramelKiss,
      media.coffeeToGo,
      media.interior,
    ],
  },
  {
    slug: "tiramisu-masterclass",
    category: "dessert",
    level: "all",
    title: L(
      "Tiramisu masterklası",
      "Tiramisu masterclass",
      "Мастер-класс по тирамису",
    ),
    summary: L(
      "Qonaqlarımızın ən sevdiyi desertin resepti — indi sizin əlinizdə.",
      "The recipe behind our guests' favourite dessert — now in your hands.",
      "Рецепт самого любимого десерта наших гостей — теперь в ваших руках.",
    ),
    description: [
      L(
        "Google rəylərində 20-dən çox dəfə xatırlanan tiramisunu birlikdə hazırlayırıq: maskarpone kremi, espresso hopdurması və düzgün qatlar.",
        "Together we make the tiramisu mentioned in 20+ Google reviews: mascarpone cream, espresso soak and the perfect layers.",
        "Вместе готовим тирамису, о котором пишут в 20+ отзывах Google: крем из маскарпоне, пропитка эспрессо и правильные слои.",
      ),
      L(
        "Masterklasın sonunda öz hazırladığınız tiramisunu qutuda evə aparırsınız, resept kartı ilə birlikdə.",
        "At the end you take your own tiramisu home in a box, together with a recipe card.",
        "В конце вы забираете свой тирамису домой в коробке вместе с карточкой рецепта.",
      ),
    ],
    includes: [
      L(
        "Bütün ərzaqlar və avadanlıq",
        "All ingredients and equipment",
        "Все продукты и инвентарь",
      ),
      L(
        "Evə aparmaq üçün öz desertiniz",
        "Your own dessert to take home",
        "Свой десерт с собой",
      ),
      L("Resept kartı", "Recipe card", "Карточка рецепта"),
      L("Qəhvə və çay", "Coffee and tea", "Кофе и чай"),
    ],
    host: {
      name: "The Kaffe",
      role: L("Qənnadı ustası", "Pastry chef", "Кондитер"),
    },
    date: "2026-11-29",
    start: "15:00",
    end: "17:30",
    price: 55,
    seatsTotal: 10,
    seatsLeft: 3,
    languages: ["az", "en", "ru"],
    cover: media.desserts,
    gallery: [media.desserts, media.croissant, media.interior, media.cat],
  },
  {
    slug: "home-brewing",
    category: "coffee",
    level: "beginner",
    title: L(
      "Evdə filtr qəhvə: V60 və French press",
      "Filter coffee at home: V60 & French press",
      "Фильтр-кофе дома: V60 и френч-пресс",
    ),
    summary: L(
      "Evdə kafe səviyyəsində qəhvə dəmləməyin sirləri.",
      "The secrets of café-quality coffee in your own kitchen.",
      "Секреты кофе как в кафе — у вас на кухне.",
    ),
    description: [
      L(
        "Üyütmə, su temperaturu, nisbətlər və dəmləmə vaxtı — dadı nə dəyişir? Müxtəlif dənələri dadıb müqayisə edəcək və öz ideal reseptinizi tapacaqsınız.",
        "Grind size, water temperature, ratios and brew time — what changes the taste? You'll taste and compare different beans and find your own perfect recipe.",
        "Помол, температура воды, пропорции и время заваривания — что меняет вкус? Вы попробуете и сравните разные зёрна и найдёте свой идеальный рецепт.",
      ),
    ],
    includes: [
      L(
        "3 növ dənə ilə dadım (cupping)",
        "Cupping with 3 kinds of beans",
        "Каппинг 3 видов зёрен",
      ),
      L(
        "V60 və French press praktikası",
        "V60 and French press practice",
        "Практика на V60 и френч-прессе",
      ),
      L(
        "Evə 100 q qəhvə dənəsi",
        "100 g of beans to take home",
        "100 г зёрен с собой",
      ),
    ],
    host: {
      name: "The Kaffe",
      role: L("Barista", "Barista", "Бариста"),
    },
    date: "2026-12-06",
    start: "11:00",
    end: "13:00",
    price: 40,
    seatsTotal: 8,
    seatsLeft: 8,
    languages: ["az", "en"],
    cover: media.coffeeToGo,
    gallery: [media.coffeeToGo, media.counter, media.facade, media.neon],
  },
  {
    slug: "weekend-brunch",
    category: "brunch",
    level: "all",
    title: L(
      "Brunç masterklası: şakşuka və rice bowl",
      "Brunch masterclass: shakshuka & rice bowl",
      "Бранч мастер-класс: шакшука и rice bowl",
    ),
    summary: L(
      "Bütün gün səhər yeməyimizin iki ulduzunu birlikdə bişiririk.",
      "We cook the two stars of our all-day breakfast together.",
      "Готовим вместе двух звёзд нашего завтрака на весь день.",
    ),
    description: [
      L(
        "Ən çox təriflənən şakşukamızı və rəngarəng rice bowl-u sıfırdan hazırlayırıq. Sonra hamılıqla süfrə arxasında oturub hazırladıqlarımızı dadırıq.",
        "We make our most-praised shakshuka and a colourful rice bowl from scratch — then sit down together and enjoy what we cooked.",
        "Готовим с нуля нашу самую хвалёную шакшуку и яркий rice bowl — а потом садимся за общий стол и пробуем.",
      ),
    ],
    includes: [
      L("Bütün ərzaqlar", "All ingredients", "Все продукты"),
      L("Ortaq brunç süfrəsi", "A shared brunch table", "Общий бранч-стол"),
      L("Limitsiz qəhvə", "Unlimited coffee", "Безлимитный кофе"),
    ],
    host: {
      name: "The Kaffe",
      role: L("Aşpaz", "Chef", "Шеф-повар"),
    },
    date: "2026-12-13",
    start: "10:00",
    end: "12:30",
    price: 50,
    seatsTotal: 10,
    seatsLeft: 0,
    languages: ["az", "ru"],
    cover: media.riceBowl,
    gallery: [media.riceBowl, media.sezarRoll, media.croissant, media.interior],
  },
];

/** Most tickets one booking can include. */
export const MAX_TICKETS_PER_ORDER = 6;

export function getMasterclass(slug: string) {
  return masterclasses.find((m) => m.slug === slug);
}

/** Upcoming (today or later in Baku), soonest first. Past classes are hidden. */
export function upcomingMasterclasses(today: string) {
  return masterclasses
    .filter((m) => m.date >= today)
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
}
