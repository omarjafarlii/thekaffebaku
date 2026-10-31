/**
 * ============================================================
 *  MENU — edit freely
 *   - name / description in az, en, ru
 *   - price in AZN (number) or null -> shows "[QİYMƏT]"
 *   - image: path in /public (e.g. "/media/tiramisu.jpg") or null
 *   - tags: "vegan" | "sugarFree" | "new" | "popular"
 *
 *  Items come from the café's Instagram posts (Sezar roll, Rice Bowl,
 *  Caramel Kiss, croissant, the dessert line-up) and Google reviews
 *  (Shakshuka, filter coffee). Prices were NOT published -> null.
 *  Full menu: Instagram highlight "Menu".
 * ============================================================
 */

import type { Localized } from "@/lib/i18n-data";

export type MenuCategory = "drinks" | "breakfast" | "desserts";
export type MenuTag = "vegan" | "sugarFree" | "new" | "popular";

export type MenuItem = {
  id: string;
  category: MenuCategory;
  name: Localized;
  description: Localized | null;
  price: number | null;
  sizes?: { label: Localized; price: number | null }[];
  ingredients: Localized | null;
  tags: MenuTag[];
  image: string | null;
};

export const menuCategories: MenuCategory[] = [
  "drinks",
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
  image: null,
  ...extra,
});

export const menu: MenuItem[] = [
  // ---------------- Drinks ----------------
  item(
    "caramel-kiss",
    "drinks",
    { az: "Caramel Kiss", en: "Caramel Kiss", ru: "Caramel Kiss" },
    {
      description: {
        az: "Yeni sevimliniz — karamelli qəhvə kokteyli.",
        en: "Meet your new favourite — a caramel coffee creation.",
        ru: "Ваш новый фаворит — карамельный кофейный напиток.",
      },
      tags: ["new"],
      image: "/media/caramel-kiss.jpg",
    },
  ),
  item("cappuccino", "drinks", {
    az: "Kapuçino",
    en: "Cappuccino",
    ru: "Капучино",
  }),
  item("filter-coffee", "drinks", {
    az: "Filtr qəhvə",
    en: "Filter coffee",
    ru: "Фильтр-кофе",
  }),
  item(
    "coffee-to-go",
    "drinks",
    { az: "Özünlə apar qəhvə", en: "Coffee to go", ru: "Кофе с собой" },
    {
      image: "/media/coffee-to-go.jpg",
    },
  ),

  // ---------------- All-day breakfast ----------------
  item(
    "shakshuka",
    "breakfast",
    { az: "Şakşuka", en: "Shakshuka", ru: "Шакшука" },
    {
      description: {
        az: "Qonaqlarımızın ən çox təriflədiyi səhər yeməyi.",
        en: "The breakfast our guests rave about most.",
        ru: "Завтрак, который гости хвалят чаще всего.",
      },
      tags: ["popular"],
    },
  ),
  item(
    "rice-bowl",
    "breakfast",
    { az: "Rice Bowl", en: "Rice Bowl", ru: "Rice Bowl" },
    {
      description: {
        az: "Düyü, bişmiş yumurta, brokoli, qarğıdalı, bolqar bibəri və göyərti.",
        en: "Rice, boiled egg, broccoli, corn, bell pepper and greens.",
        ru: "Рис, варёное яйцо, брокколи, кукуруза, болгарский перец и зелень.",
      },
      image: "/media/rice-bowl.jpg",
    },
  ),
  item(
    "sezar-roll",
    "breakfast",
    { az: "Sezar roll", en: "Caesar roll", ru: "Цезарь-ролл" },
    {
      description: {
        az: "Lavaşda Sezar, təzə salatla.",
        en: "Caesar wrapped in flatbread, served with fresh salad.",
        ru: "Цезарь в лаваше со свежим салатом.",
      },
      image: "/media/sezar-roll.jpg",
    },
  ),
  item(
    "croissant",
    "breakfast",
    { az: "Kruassan", en: "Croissant", ru: "Круассан" },
    {
      image: "/media/croissant-coffee.jpg",
    },
  ),
  item("granola", "breakfast", { az: "Qranola", en: "Granola", ru: "Гранола" }),

  // ---------------- Desserts ----------------
  item(
    "tiramisu",
    "desserts",
    { az: "Tiramisu", en: "Tiramisu", ru: "Тирамису" },
    {
      description: {
        az: "Ən çox sevilən desertimiz — Google rəylərində 20-dən çox dəfə xatırlanır.",
        en: "Our most-loved dessert — mentioned in 20+ Google reviews.",
        ru: "Наш самый любимый десерт — упоминается в 20+ отзывах Google.",
      },
      tags: ["popular"],
      image: "/media/desserts.jpg",
    },
  ),
  item("panna-cotta", "desserts", {
    az: "Panna kotta",
    en: "Panna cotta",
    ru: "Панна-котта",
  }),
  item("magnolia", "desserts", {
    az: "Maqnoliya pudinqi",
    en: "Magnolia pudding",
    ru: "Магнолия-пудинг",
  }),
  item("energy-balls", "desserts", {
    az: "Enerji topları",
    en: "Energy balls",
    ru: "Энергетические шарики",
  }),
  item("cheesecake", "desserts", {
    az: "Çizkeyk",
    en: "Cheesecake",
    ru: "Чизкейк",
  }),
  item("chocolate-mousse", "desserts", {
    az: "Şokolad mussu",
    en: "Chocolate mousse",
    ru: "Шоколадный мусс",
  }),
  item("gelato", "desserts", { az: "Gelato", en: "Gelato", ru: "Джелато" }),
];
