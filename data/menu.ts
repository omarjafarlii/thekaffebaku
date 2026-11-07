/**
 * ============================================================
 *  MENU — edit freely
 *   - name / description in az, en, ru
 *   - price: AZN number, or use `sizes` (each size has its own price)
 *   - images: photos in /public — several = swipeable slider.
 *     Empty [] shows a branded placeholder tile.
 *   - addons: ids of the extra groups below (syrups, milk, …).
 *     Each option has its own price; the popup adds them to the total.
 *   - tags: "vegan" | "sugarFree" | "new" | "popular"
 *
 *  PHOTOS: /media/*.jpg are the café's own (Instagram). /media/menu/*.jpg
 *  are free stock photos from Unsplash (unsplash.com/license — commercial use
 *  OK, no attribution needed). Swap them for real photos of your own drinks
 *  and desserts when you have them (same file name = no code change).
 *
 *  ⚠️  PRICES ARE EXAMPLES (typical Baku café prices). The café's real
 *  price list was not published online — replace every number below
 *  with the current menu before going live.
 * ============================================================
 */

import type { Localized } from "@/lib/i18n-data";

export type MenuCategory = "coffee" | "cold" | "tea" | "breakfast" | "desserts";
export type MenuTag = "vegan" | "sugarFree" | "new" | "popular";

const L = (az: string, en: string, ru: string): Localized => ({ az, en, ru });

/* ------------------------------------------------------------------
   Extras (add-ons). `single` = choose one (radio), `multi` = any (checkbox).
   ------------------------------------------------------------------ */

export type AddonOption = { id: string; name: Localized; price: number };
export type AddonGroup = {
  id: string;
  title: Localized;
  type: "single" | "multi";
  /** multi: most options a guest can pick */
  max?: number;
  options: AddonOption[];
};

const o = (id: string, name: Localized, price: number): AddonOption => ({
  id,
  name,
  price,
});

export const addonGroups = {
  milk: {
    id: "milk",
    title: L("Süd", "Milk", "Молоко"),
    type: "single",
    options: [
      o("regular", L("Adi süd", "Regular milk", "Обычное молоко"), 0),
      o("lactose-free", L("Laktozasız", "Lactose-free", "Безлактозное"), 1),
      o("oat", L("Yulaf südü", "Oat milk", "Овсяное"), 1.5),
      o("almond", L("Badam südü", "Almond milk", "Миндальное"), 1.5),
      o("coconut", L("Kokos südü", "Coconut milk", "Кокосовое"), 1.5),
    ],
  },
  syrup: {
    id: "syrup",
    title: L("Siroplar", "Syrups", "Сиропы"),
    type: "multi",
    max: 3,
    options: [
      o("vanilla", L("Vanil", "Vanilla", "Ваниль"), 1),
      o("caramel", L("Karamel", "Caramel", "Карамель"), 1),
      o(
        "salted-caramel",
        L("Duzlu karamel", "Salted caramel", "Солёная карамель"),
        1,
      ),
      o("hazelnut", L("Fındıq", "Hazelnut", "Лесной орех"), 1),
      o("coconut", L("Kokos", "Coconut", "Кокос"), 1),
      o("chocolate", L("Şokolad", "Chocolate", "Шоколад"), 1),
      o("lavender", L("Lavanda", "Lavender", "Лаванда"), 1.2),
    ],
  },
  coffeeExtras: {
    id: "coffeeExtras",
    title: L("Əlavələr", "Extras", "Добавки"),
    type: "multi",
    options: [
      o(
        "shot",
        L("Əlavə espresso şotu", "Extra espresso shot", "Доп. шот эспрессо"),
        1.5,
      ),
      o("cream", L("Çalınmış qaymaq", "Whipped cream", "Взбитые сливки"), 1),
      o("marshmallow", L("Marşmallou", "Marshmallows", "Маршмеллоу"), 1),
      o("cinnamon", L("Darçın", "Cinnamon", "Корица"), 0),
    ],
  },
  teaExtras: {
    id: "teaExtras",
    title: L("Əlavələr", "Extras", "Добавки"),
    type: "multi",
    options: [
      o("lemon", L("Limon", "Lemon", "Лимон"), 0.5),
      o("honey", L("Bal", "Honey", "Мёд"), 1),
      o("mint", L("Nanə", "Mint", "Мята"), 0.5),
      o("jam", L("Mürəbbə", "Homemade jam", "Варенье"), 1.5),
    ],
  },
  breakfastExtras: {
    id: "breakfastExtras",
    title: L("Əlavələr", "Extras", "Добавки"),
    type: "multi",
    options: [
      o("egg", L("Əlavə yumurta", "Extra egg", "Доп. яйцо"), 1.5),
      o("avocado", L("Avokado", "Avocado", "Авокадо"), 3),
      o("cheese", L("Pendir", "Cheese", "Сыр"), 1.5),
      o("toast", L("Tost çörəyi", "Toast", "Тост"), 1),
    ],
  },
  dessertExtras: {
    id: "dessertExtras",
    title: L("Əlavələr", "Extras", "Добавки"),
    type: "multi",
    options: [
      o(
        "ice-cream",
        L("Dondurma topu", "Scoop of ice cream", "Шарик мороженого"),
        2.5,
      ),
      o(
        "chocolate-sauce",
        L("Şokolad sousu", "Chocolate sauce", "Шоколадный соус"),
        0.5,
      ),
      o(
        "caramel-sauce",
        L("Karamel sousu", "Caramel sauce", "Карамельный соус"),
        0.5,
      ),
      o("berries", L("Təzə giləmeyvə", "Fresh berries", "Свежие ягоды"), 2),
    ],
  },
} satisfies Record<string, AddonGroup>;

export type AddonGroupId = keyof typeof addonGroups;

/* ------------------------------------------------------------------
   Items
   ------------------------------------------------------------------ */

export type MenuItem = {
  id: string;
  category: MenuCategory;
  name: Localized;
  description: Localized | null;
  price: number | null;
  sizes?: { label: Localized; price: number }[];
  ingredients: Localized | null;
  tags: MenuTag[];
  images: string[];
  addons: AddonGroupId[];
};

export const menuCategories: MenuCategory[] = [
  "coffee",
  "cold",
  "tea",
  "breakfast",
  "desserts",
];

const item = (
  id: string,
  category: MenuCategory,
  name: Localized,
  extra: Partial<Omit<MenuItem, "id" | "category" | "name">> = {},
): MenuItem => ({
  id,
  category,
  name,
  description: null,
  price: null,
  ingredients: null,
  tags: [],
  images: [],
  addons: [],
  ...extra,
});

const S = L("Kiçik · 250 ml", "Small · 250 ml", "Маленький · 250 мл");
const M = L("Orta · 350 ml", "Medium · 350 ml", "Средний · 350 мл");
const B = L("Böyük · 450 ml", "Large · 450 ml", "Большой · 450 мл");
const sizes = (s: number, m: number, b: number) => [
  { label: S, price: s },
  { label: M, price: m },
  { label: B, price: b },
];

/** Milk-based coffee: milk choice + syrups + extras */
const milkCoffee: AddonGroupId[] = ["milk", "syrup", "coffeeExtras"];

export const menu: MenuItem[] = [
  // ---------------- Coffee ----------------
  item("espresso", "coffee", L("Espresso", "Espresso", "Эспрессо"), {
    description: L(
      "Klassik, sıx və ətirli — günün ən yaxşı başlanğıcı.",
      "Classic, rich and aromatic — the best start to the day.",
      "Классический, плотный и ароматный — лучшее начало дня.",
    ),
    sizes: [
      {
        label: L("Tək · 30 ml", "Single · 30 ml", "Одинарный · 30 мл"),
        price: 3,
      },
      {
        label: L("Dubl · 60 ml", "Double · 60 ml", "Двойной · 60 мл"),
        price: 4.5,
      },
    ],
    addons: ["syrup"],
    images: ["/media/menu/espresso-1.jpg", "/media/menu/espresso-2.jpg"],
  }),
  item("americano", "coffee", L("Amerikano", "Americano", "Американо"), {
    sizes: sizes(4, 4.5, 5),
    addons: ["milk", "syrup", "coffeeExtras"],
    images: ["/media/coffee-to-go.jpg", "/media/menu/americano-2.jpg"],
  }),
  item("cappuccino", "coffee", L("Kapuçino", "Cappuccino", "Капучино"), {
    description: L(
      "Espresso, isti süd və məxməri süd köpüyü.",
      "Espresso, steamed milk and velvety milk foam.",
      "Эспрессо, горячее молоко и бархатная пена.",
    ),
    sizes: sizes(5, 6, 7),
    tags: ["popular"],
    addons: milkCoffee,
    images: [
      "/media/croissant-coffee.jpg",
      "/media/menu/cappuccino-2.jpg",
      "/media/coffee-to-go.jpg",
    ],
  }),
  item("latte", "coffee", L("Latte", "Latte", "Латте"), {
    description: L(
      "Yumşaq espresso və çox süd — sirop ilə əla gedir.",
      "Mellow espresso with plenty of milk — great with a syrup.",
      "Мягкий эспрессо и много молока — отлично с сиропом.",
    ),
    sizes: sizes(5.5, 6.5, 7.5),
    addons: milkCoffee,
    images: [
      "/media/menu/latte-1.jpg",
      "/media/menu/latte-2.jpg",
      "/media/coffee-to-go.jpg",
    ],
  }),
  item("flat-white", "coffee", L("Flat White", "Flat White", "Флэт уайт"), {
    description: L(
      "Dubl ristretto və nazik süd köpüyü — güclü qəhvə sevənlər üçün.",
      "Double ristretto with a thin layer of milk — for strong-coffee lovers.",
      "Двойной ристретто и тонкий слой молока — для любителей крепкого.",
    ),
    price: 6,
    addons: milkCoffee,
    images: ["/media/menu/flat-white-1.jpg", "/media/menu/flat-white-2.jpg"],
  }),
  item("raf", "coffee", L("Raf", "Raf", "Раф"), {
    description: L(
      "Espresso, qaymaq və vanil şəkəri birlikdə çalınır.",
      "Espresso whipped together with cream and vanilla sugar.",
      "Эспрессо, взбитый со сливками и ванильным сахаром.",
    ),
    sizes: [
      { label: M, price: 6.5 },
      { label: B, price: 7.5 },
    ],
    addons: ["syrup", "coffeeExtras"],
    images: ["/media/menu/raf-1.jpg"],
  }),
  item("mocha", "coffee", L("Moka", "Mocha", "Мокко"), {
    sizes: sizes(6, 7, 8),
    addons: milkCoffee,
    images: ["/media/menu/mocha-1.jpg"],
  }),
  item(
    "caramel-kiss",
    "coffee",
    L("Caramel Kiss", "Caramel Kiss", "Caramel Kiss"),
    {
      description: L(
        "Yeni sevimliniz — karamelli qəhvə kokteyli.",
        "Meet your new favourite — a caramel coffee creation.",
        "Ваш новый фаворит — карамельный кофейный напиток.",
      ),
      sizes: [
        { label: M, price: 7.5 },
        { label: B, price: 8.5 },
      ],
      tags: ["new"],
      addons: milkCoffee,
      images: ["/media/caramel-kiss.jpg"],
    },
  ),
  item(
    "filter-coffee",
    "coffee",
    L("Filtr qəhvə", "Filter coffee", "Фильтр-кофе"),
    {
      description: L(
        "Gündəlik dəyişən dənələrdən V60 ilə dəmlənir.",
        "Brewed on V60 from beans that change daily.",
        "Заваривается на V60 из зёрен, которые меняются каждый день.",
      ),
      price: 5,
      addons: ["milk", "syrup"],
      images: [
        "/media/menu/filter-coffee-1.jpg",
        "/media/menu/filter-coffee-2.jpg",
      ],
    },
  ),

  // ---------------- Cold drinks ----------------
  item("iced-latte", "cold", L("Buzlu latte", "Iced latte", "Айс-латте"), {
    sizes: [
      { label: M, price: 6.5 },
      { label: B, price: 7.5 },
    ],
    tags: ["popular"],
    addons: milkCoffee,
    images: ["/media/menu/iced-latte-1.jpg", "/media/menu/iced-latte-2.jpg"],
  }),
  item(
    "iced-americano",
    "cold",
    L("Buzlu amerikano", "Iced americano", "Айс-американо"),
    {
      sizes: [
        { label: M, price: 5 },
        { label: B, price: 6 },
      ],
      addons: ["syrup"],
      images: ["/media/menu/iced-americano-1.jpg"],
    },
  ),
  item("frappe", "cold", L("Frappe", "Frappé", "Фраппе"), {
    price: 7,
    addons: milkCoffee,
    images: ["/media/menu/frappe-1.jpg", "/media/menu/frappe-2.jpg"],
  }),
  item(
    "lemonade",
    "cold",
    L("Ev limonadı", "Homemade lemonade", "Домашний лимонад"),
    {
      description: L(
        "Təzə limon, nanə və qazlı su. Gündəlik dad: soruşun!",
        "Fresh lemon, mint and sparkling water. Ask about today's flavour!",
        "Свежий лимон, мята и газированная вода. Спросите вкус дня!",
      ),
      price: 6,
      tags: ["vegan"],
      addons: ["syrup"],
      images: ["/media/menu/lemonade-1.jpg", "/media/menu/lemonade-2.jpg"],
    },
  ),

  // ---------------- Tea & more ----------------
  item(
    "black-tea",
    "tea",
    L("Qara çay (dəmlik)", "Black tea (pot)", "Чёрный чай (чайник)"),
    {
      price: 5,
      tags: ["vegan"],
      addons: ["teaExtras"],
      images: ["/media/menu/black-tea-1.jpg", "/media/menu/black-tea-2.jpg"],
    },
  ),
  item("herbal-tea", "tea", L("Bitki çayı", "Herbal tea", "Травяной чай"), {
    description: L(
      "Kəklikotu, itburnu və ya nanə — seçiminizə görə.",
      "Thyme, rosehip or mint — your choice.",
      "Чабрец, шиповник или мята — на ваш выбор.",
    ),
    price: 6,
    tags: ["vegan", "sugarFree"],
    addons: ["teaExtras"],
    images: ["/media/menu/herbal-tea-1.jpg", "/media/menu/herbal-tea-2.jpg"],
  }),
  item("matcha-latte", "tea", L("Matça latte", "Matcha latte", "Матча-латте"), {
    sizes: [
      { label: M, price: 7.5 },
      { label: B, price: 8.5 },
    ],
    addons: ["milk", "syrup"],
    images: [
      "/media/menu/matcha-latte-1.jpg",
      "/media/menu/matcha-latte-2.jpg",
    ],
  }),
  item(
    "hot-chocolate",
    "tea",
    L("İsti şokolad", "Hot chocolate", "Горячий шоколад"),
    {
      sizes: [
        { label: M, price: 6 },
        { label: B, price: 7 },
      ],
      addons: ["milk", "coffeeExtras"],
      images: [
        "/media/menu/hot-chocolate-1.jpg",
        "/media/menu/hot-chocolate-2.jpg",
      ],
    },
  ),

  // ---------------- All-day breakfast ----------------
  item("shakshuka", "breakfast", L("Şakşuka", "Shakshuka", "Шакшука"), {
    description: L(
      "Qonaqlarımızın ən çox təriflədiyi səhər yeməyi.",
      "The breakfast our guests rave about most.",
      "Завтрак, который гости хвалят чаще всего.",
    ),
    price: 10,
    tags: ["popular"],
    addons: ["breakfastExtras"],
    images: ["/media/menu/shakshuka-1.jpg", "/media/menu/shakshuka-2.jpg"],
  }),
  item("rice-bowl", "breakfast", L("Rice Bowl", "Rice Bowl", "Rice Bowl"), {
    description: L(
      "Düyü, bişmiş yumurta, brokoli, qarğıdalı, bolqar bibəri və göyərti.",
      "Rice, boiled egg, broccoli, corn, bell pepper and greens.",
      "Рис, варёное яйцо, брокколи, кукуруза, болгарский перец и зелень.",
    ),
    price: 12,
    addons: ["breakfastExtras"],
    images: ["/media/rice-bowl.jpg"],
  }),
  item(
    "sezar-roll",
    "breakfast",
    L("Sezar roll", "Caesar roll", "Цезарь-ролл"),
    {
      description: L(
        "Lavaşda Sezar, təzə salatla.",
        "Caesar wrapped in flatbread, served with fresh salad.",
        "Цезарь в лаваше со свежим салатом.",
      ),
      price: 11,
      addons: ["breakfastExtras"],
      images: ["/media/sezar-roll.jpg"],
    },
  ),
  item("croissant", "breakfast", L("Kruassan", "Croissant", "Круассан"), {
    price: 4.5,
    addons: ["dessertExtras"],
    images: ["/media/croissant-coffee.jpg"],
  }),
  item("granola", "breakfast", L("Qranola", "Granola", "Гранола"), {
    description: L(
      "Yoqurt, ev qranolası, mövsüm meyvələri və bal.",
      "Yoghurt, homemade granola, seasonal fruit and honey.",
      "Йогурт, домашняя гранола, сезонные фрукты и мёд.",
    ),
    price: 9,
    addons: ["dessertExtras"],
    images: ["/media/menu/granola-2.jpg", "/media/menu/granola-1.jpg"],
  }),

  // ---------------- Desserts ----------------
  item("tiramisu", "desserts", L("Tiramisu", "Tiramisu", "Тирамису"), {
    description: L(
      "Ən çox sevilən desertimiz — Google rəylərində 20-dən çox dəfə xatırlanır.",
      "Our most-loved dessert — mentioned in 20+ Google reviews.",
      "Наш самый любимый десерт — упоминается в 20+ отзывах Google.",
    ),
    price: 7,
    tags: ["popular"],
    addons: ["dessertExtras"],
    images: ["/media/desserts.jpg"],
  }),
  item(
    "panna-cotta",
    "desserts",
    L("Panna kotta", "Panna cotta", "Панна-котта"),
    {
      price: 6,
      addons: ["dessertExtras"],
      images: ["/media/menu/panna-cotta-1.jpg", "/media/desserts.jpg"],
    },
  ),
  item(
    "magnolia",
    "desserts",
    L("Maqnoliya pudinqi", "Magnolia pudding", "Магнолия-пудинг"),
    {
      price: 6.5,
      addons: ["dessertExtras"],
      images: ["/media/menu/magnolia-1.jpg", "/media/desserts.jpg"],
    },
  ),
  item(
    "energy-balls",
    "desserts",
    L("Enerji topları", "Energy balls", "Энергетические шарики"),
    {
      price: 4,
      tags: ["vegan", "sugarFree"],
      images: ["/media/menu/energy-balls-1.jpg", "/media/desserts.jpg"],
    },
  ),
  item("cheesecake", "desserts", L("Çizkeyk", "Cheesecake", "Чизкейк"), {
    price: 7.5,
    addons: ["dessertExtras"],
    images: ["/media/menu/cheesecake-1.jpg"],
  }),
  item(
    "chocolate-mousse",
    "desserts",
    L("Şokolad mussu", "Chocolate mousse", "Шоколадный мусс"),
    {
      price: 6.5,
      addons: ["dessertExtras"],
      images: [
        "/media/menu/chocolate-mousse-1.jpg",
        "/media/menu/chocolate-mousse-2.jpg",
      ],
    },
  ),
  item("gelato", "desserts", L("Gelato", "Gelato", "Джелато"), {
    sizes: [
      { label: L("1 top", "1 scoop", "1 шарик"), price: 3.5 },
      { label: L("2 top", "2 scoops", "2 шарика"), price: 6 },
      { label: L("3 top", "3 scoops", "3 шарика"), price: 8 },
    ],
    addons: ["dessertExtras"],
    images: ["/media/menu/gelato-1.jpg", "/media/menu/gelato-2.jpg"],
  }),
];

/** Lowest price shown on cards ("from 5 ₼"). */
export function startingPrice(item: MenuItem): number | null {
  if (item.sizes?.length) return Math.min(...item.sizes.map((s) => s.price));
  return item.price;
}
