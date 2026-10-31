"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { CakeSlice, Coffee, EggFried, Search, ShoppingBag } from "lucide-react";
import {
  menu,
  menuCategories,
  type MenuCategory,
  type MenuItem,
  type MenuTag,
} from "@/data/menu";
import { info } from "@/data/info";
import { t as tr } from "@/lib/i18n-data";
import { formatNumber } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cover } from "@/components/ui/cover";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { InstagramIcon } from "@/components/brand/social-icons";
import { cn } from "@/lib/utils";

type Filter = "all" | MenuCategory;

const tagStyles: Record<MenuTag, string> = {
  vegan: "bg-forest-100 text-forest-800",
  sugarFree: "bg-cream-200 text-ink-900",
  new: "bg-caramel-500 text-white",
  popular: "bg-forest-800 text-cream-50",
};

const categoryIcon = {
  drinks: Coffee,
  breakfast: EggFried,
  desserts: CakeSlice,
} satisfies Record<MenuCategory, unknown>;

const normalize = (s: string) =>
  s
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/** Interactive menu: category tabs, search, product grid, detail modal. */
export function Menu() {
  const t = useTranslations("menu");
  const tp = useTranslations("placeholder");
  const locale = useLocale();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [selected, setSelected] = useState<MenuItem | null>(null);

  const items = useMemo(() => {
    const q = normalize(deferred.trim());
    return menu.filter((item) => {
      if (filter !== "all" && item.category !== filter) return false;
      if (!q) return true;
      // search all languages, so "tiramisu" and "тирамису" both match
      return normalize(Object.values(item.name).join(" ")).includes(q);
    });
  }, [filter, deferred]);

  const price = (p: number | null) =>
    p === null ? tp("price") : `${formatNumber(p, locale, 2)} ${t("currency")}`;
  const filters: Filter[] = ["all", ...menuCategories];

  return (
    <section
      id="menu"
      aria-labelledby="menu-title"
      className="bg-surface py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeading
          id="menu-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
        />

        <div className="mt-10 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div
            role="tablist"
            aria-label={t("title")}
            className="scrollbar-none flex max-w-full gap-1 overflow-x-auto rounded-pill bg-bg p-1"
          >
            {filters.map((f) => (
              <button
                key={f}
                role="tab"
                type="button"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  "h-10 shrink-0 rounded-pill px-5 text-sm font-semibold transition-colors",
                  filter === f
                    ? "bg-brand text-brand-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                {f === "all" ? t("all") : t(`cat_${f}`)}
              </button>
            ))}
          </div>
          <label className="relative w-full md:w-72">
            <span className="sr-only">{t("searchLabel")}</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search")}
              className="h-12 w-full rounded-pill border border-line bg-bg pr-4 pl-11 text-base placeholder:text-muted focus:border-forest-600 focus:outline-none"
            />
          </label>
        </div>

        <motion.ul
          layout
          className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="min-w-0"
              >
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="group w-full text-left"
                >
                  <div className="relative">
                    <Cover
                      src={item.image}
                      alt={tr(item.name, locale)}
                      className="aspect-square rounded-card"
                      icon={categoryIcon[item.category]}
                      imgClassName="transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                    />
                    {item.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              "rounded-pill px-2.5 py-1 text-xs font-bold",
                              tagStyles[tag],
                            )}
                          >
                            {t(`tag_${tag}`)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className="mt-3 truncate text-base font-bold group-hover:underline md:text-lg">
                    {tr(item.name, locale)}
                  </h3>
                  <p className="text-sm text-muted">{price(item.price)}</p>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {items.length === 0 && (
          <p className="py-16 text-center text-muted">{t("empty")}</p>
        )}

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <a
            href={info.links.boltFood}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "lg" })}
          >
            <ShoppingBag className="size-4" /> {t("order")}
          </a>
          <a
            href={info.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <InstagramIcon className="size-4" /> {t("fullMenu")}
          </a>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        {selected && (
          <DialogContent closeLabel={t("close")}>
            <ProductDetail item={selected} price={price} />
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

function ProductDetail({
  item,
  price,
}: {
  item: MenuItem;
  price: (p: number | null) => string;
}) {
  const t = useTranslations("menu");
  const locale = useLocale();
  const [size, setSize] = useState(0);
  const current = item.sizes ? item.sizes[size].price : item.price;

  return (
    <div className="grid md:grid-cols-2">
      <Cover
        src={item.image}
        alt={tr(item.name, locale)}
        icon={categoryIcon[item.category]}
        className="aspect-square"
        sizes="(min-width: 768px) 384px, 100vw"
      />
      <div className="flex flex-col gap-5 p-6 md:p-8">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-pill bg-surface-2 px-3 py-1 text-xs font-bold">
            {t(`cat_${item.category}`)}
          </span>
          {item.tags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded-pill px-3 py-1 text-xs font-bold",
                tagStyles[tag],
              )}
            >
              {t(`tag_${tag}`)}
            </span>
          ))}
        </div>
        <DialogTitle className="text-subtitle font-bold">
          {tr(item.name, locale)}
        </DialogTitle>
        <DialogDescription className="text-muted">
          {item.description ? tr(item.description, locale) : t("noDescription")}
        </DialogDescription>

        {item.sizes && (
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">{t("sizes")}</legend>
            <div className="flex gap-2">
              {item.sizes.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  aria-pressed={size === i}
                  onClick={() => setSize(i)}
                  className={cn(
                    "h-10 flex-1 rounded-pill border text-sm font-semibold transition",
                    size === i
                      ? "border-brand bg-brand text-brand-fg"
                      : "border-line hover:border-forest-600",
                  )}
                >
                  {tr(s.label, locale)}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {item.ingredients && (
          <div>
            <h4 className="mb-1 text-sm font-semibold">{t("ingredients")}</h4>
            <p className="text-muted">{tr(item.ingredients, locale)}</p>
          </div>
        )}

        <p className="mt-auto border-t border-line pt-5 text-xl font-bold">
          {price(current)}
        </p>
      </div>
    </div>
  );
}
