"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import {
  CakeSlice,
  Check,
  Coffee,
  CupSoda,
  EggFried,
  Leaf,
  Plus,
  Search,
  ShoppingBag,
} from "lucide-react";
import {
  addonGroups,
  menu,
  menuCategories,
  startingPrice,
  type AddonGroup,
  type MenuCategory,
  type MenuItem,
  type MenuTag,
} from "@/data/menu";
import { info } from "@/data/info";
import { t as tr } from "@/lib/i18n-data";
import { formatPrice } from "@/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { PhotoSlider } from "@/components/ui/photo-slider";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { Quantity } from "@/components/masterclass/quantity";
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
  coffee: Coffee,
  cold: CupSoda,
  tea: Leaf,
  breakfast: EggFried,
  desserts: CakeSlice,
} satisfies Record<MenuCategory, unknown>;

const normalize = (s: string) =>
  s
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

/** Featured items on the home page (photos first, popular next). */
const PREVIEW_COUNT = 8;
const featured = [...menu]
  .sort(
    (a, b) =>
      Number(b.images.length > 0) - Number(a.images.length > 0) ||
      Number(b.tags.includes("popular")) - Number(a.tags.includes("popular")),
  )
  .slice(0, PREVIEW_COUNT);

/**
 * Interactive menu: category tabs, search, product grid, detail popup.
 * `preview` (home page): a few featured items + "Full menu" link to /menu.
 */
export function Menu({ preview = false }: { preview?: boolean }) {
  const t = useTranslations("menu");
  const tp = useTranslations("placeholder");
  const locale = useLocale();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [selected, setSelected] = useState<MenuItem | null>(null);

  const items = useMemo(() => {
    if (preview) return featured;
    const q = normalize(deferred.trim());
    return menu.filter((item) => {
      if (filter !== "all" && item.category !== filter) return false;
      if (!q) return true;
      // search all languages, so "tiramisu" and "тирамису" both match
      return normalize(Object.values(item.name).join(" ")).includes(q);
    });
  }, [filter, deferred, preview]);

  const cardPrice = (item: MenuItem) => {
    const p = startingPrice(item);
    if (p === null) return tp("price");
    return item.sizes && item.sizes.length > 1
      ? t("from", { price: formatPrice(p, locale) })
      : formatPrice(p, locale);
  };
  const filters: Filter[] = ["all", ...menuCategories];
  const slider = { prev: t("prev"), next: t("next") };

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
          level={preview ? 2 : 1}
        />

        <div
          hidden={preview}
          className="mt-10 flex flex-col items-center gap-4 md:flex-row md:justify-between"
        >
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
                className="group min-w-0"
              >
                <div className="relative">
                  <PhotoSlider
                    images={item.images}
                    alt={tr(item.name, locale)}
                    className="aspect-square rounded-card"
                    icon={categoryIcon[item.category]}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    onSlideClick={() => setSelected(item)}
                    labels={slider}
                  />
                  {item.tags.length > 0 && (
                    <div className="pointer-events-none absolute top-3 left-3 flex flex-wrap gap-1">
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
                <button
                  type="button"
                  onClick={() => setSelected(item)}
                  className="mt-3 flex w-full items-start justify-between gap-2 text-left"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-base font-bold group-hover:underline md:text-lg">
                      {tr(item.name, locale)}
                    </span>
                    <span className="block text-sm font-semibold text-accent">
                      {cardPrice(item)}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-pill bg-brand text-lg leading-none text-brand-fg transition group-hover:scale-110"
                  >
                    +
                  </span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {items.length === 0 && (
          <p className="py-16 text-center text-muted">{t("empty")}</p>
        )}

        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {preview && (
            <Link href="/menu" className={buttonVariants({ size: "lg" })}>
              {t("seeAll", { count: menu.length })}{" "}
              <ArrowRight className="size-4" />
            </Link>
          )}
          <a
            href={info.links.boltFood}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              variant: preview ? "outline" : "primary",
              size: "lg",
            })}
          >
            <ShoppingBag className="size-4" /> {t("order")}
          </a>
          <a
            hidden={preview}
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
          <DialogContent
            closeLabel={t("close")}
            className="flex max-h-[92svh] flex-col overflow-hidden md:max-h-[min(680px,88svh)] md:min-h-[480px] md:max-w-4xl md:flex-row"
          >
            <ProductDetail key={selected.id} item={selected} />
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}

/** Popup: photos, size, extras (each with its own price) and a live total. */
function ProductDetail({ item }: { item: MenuItem }) {
  const t = useTranslations("menu");
  const tp = useTranslations("placeholder");
  const locale = useLocale();
  const groups: AddonGroup[] = item.addons.map((id) => addonGroups[id]);
  const hasSizes = !!item.sizes && item.sizes.length > 1;

  const [size, setSize] = useState(hasSizes ? 1 : 0);
  const [qty, setQty] = useState(1);
  /** groupId -> selected option ids (single groups start on their first, free option) */
  const [picked, setPicked] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(
      groups.map((g) => [g.id, g.type === "single" ? [g.options[0].id] : []]),
    ),
  );

  const base = item.sizes?.length ? item.sizes[size].price : item.price;
  const chosen = groups.flatMap((g) =>
    g.options
      .filter((o) => picked[g.id]?.includes(o.id))
      // the default (first) option of a "choose one" group isn't news
      .filter((o) => g.type === "multi" || o.id !== g.options[0].id),
  );
  const extras = chosen.reduce((sum, o) => sum + o.price, 0);
  const unit = base === null ? null : base + extras;

  const toggle = (g: AddonGroup, id: string) =>
    setPicked((prev) => {
      const cur = prev[g.id] ?? [];
      if (g.type === "single") return { ...prev, [g.id]: [id] };
      if (cur.includes(id))
        return { ...prev, [g.id]: cur.filter((x) => x !== id) };
      if (g.max && cur.length >= g.max) return prev;
      return { ...prev, [g.id]: [...cur, id] };
    });

  /** e.g. "Medium · Oat milk · Vanilla" */
  const summary = [
    hasSizes ? tr(item.sizes![size].label, locale).split(" · ")[0] : null,
    ...chosen.map((o) => tr(o.name, locale)),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      {/* ---------- media ---------- */}
      <div className="relative h-64 shrink-0 sm:h-80 md:h-auto md:w-[45%]">
        <PhotoSlider
          images={item.images}
          alt={tr(item.name, locale)}
          icon={categoryIcon[item.category]}
          className="h-full w-full"
          sizes="(min-width: 768px) 420px, 100vw"
          labels={{ prev: t("prev"), next: t("next") }}
          priority
        />
        {item.tags.length > 0 && (
          <div className="pointer-events-none absolute top-4 left-4 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-pill px-3 py-1 text-xs font-bold shadow-soft",
                  tagStyles[tag],
                )}
              >
                {t(`tag_${tag}`)}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ---------- details ---------- */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-6 sm:px-8 md:pt-8">
          <span className="font-hand text-xl text-accent">
            {t(`cat_${item.category}`)}
          </span>
          <div className="flex items-start justify-between gap-4 md:pr-12">
            <DialogTitle className="text-2xl leading-tight font-bold md:text-3xl">
              {tr(item.name, locale)}
            </DialogTitle>
            <p className="shrink-0 pt-1 text-xl font-extrabold tabular-nums md:text-2xl">
              {base === null ? tp("price") : formatPrice(base, locale)}
            </p>
          </div>
          <DialogDescription className="mt-2 text-muted">
            {item.description
              ? tr(item.description, locale)
              : t("noDescription")}
          </DialogDescription>

          {hasSizes && (
            <Block title={t("sizes")}>
              <div
                role="radiogroup"
                aria-label={t("sizes")}
                className="grid gap-1 rounded-2xl bg-surface-2 p-1"
                style={{
                  gridTemplateColumns: `repeat(${item.sizes!.length}, minmax(0, 1fr))`,
                }}
              >
                {item.sizes!.map((s, i) => {
                  const [name, volume] = tr(s.label, locale).split(" · ");
                  return (
                    <button
                      key={i}
                      type="button"
                      role="radio"
                      aria-checked={size === i}
                      onClick={() => setSize(i)}
                      className={cn(
                        "flex flex-col items-center rounded-xl px-2 py-2.5 transition",
                        size === i
                          ? "bg-surface shadow-soft"
                          : "text-muted hover:text-fg",
                      )}
                    >
                      <span className="text-sm font-bold">{name}</span>
                      {volume && <span className="text-xs">{volume}</span>}
                      <span
                        className={cn(
                          "mt-0.5 text-xs font-bold tabular-nums",
                          size === i && "text-accent",
                        )}
                      >
                        {formatPrice(s.price, locale)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Block>
          )}

          {groups.map((g) => (
            <Block
              key={g.id}
              title={tr(g.title, locale)}
              hint={
                g.type === "single"
                  ? t("chooseOne")
                  : g.max
                    ? t("upTo", { max: g.max })
                    : t("optional")
              }
            >
              <div
                role={g.type === "single" ? "radiogroup" : "group"}
                aria-label={tr(g.title, locale)}
                className="flex flex-wrap gap-2"
              >
                {g.options.map((o) => {
                  const on = picked[g.id]?.includes(o.id) ?? false;
                  const blocked =
                    !on &&
                    g.type === "multi" &&
                    !!g.max &&
                    (picked[g.id]?.length ?? 0) >= g.max;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      role={g.type === "single" ? "radio" : "checkbox"}
                      aria-checked={on}
                      disabled={blocked}
                      onClick={() => toggle(g, o.id)}
                      className={cn(
                        "inline-flex h-10 items-center gap-1.5 rounded-pill border px-3.5 text-sm font-semibold transition active:scale-97 disabled:opacity-35",
                        on
                          ? "border-brand bg-brand text-brand-fg"
                          : "border-line bg-bg hover:border-forest-600",
                      )}
                    >
                      {g.type === "multi" &&
                        (on ? (
                          <Check className="size-3.5" strokeWidth={3} />
                        ) : (
                          <Plus className="size-3.5" strokeWidth={2.5} />
                        ))}
                      {tr(o.name, locale)}
                      {o.price > 0 && (
                        <span
                          className={cn(
                            "text-xs font-bold tabular-nums",
                            on ? "opacity-75" : "text-accent",
                          )}
                        >
                          +{formatPrice(o.price, locale)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Block>
          ))}

          {item.ingredients && (
            <Block title={t("ingredients")}>
              <p className="text-muted">{tr(item.ingredients, locale)}</p>
            </Block>
          )}
        </div>

        {/* ---------- order bar ---------- */}
        {unit !== null && (
          <div className="shrink-0 border-t border-line bg-surface px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
            {summary && (
              <p className="mb-2 truncate text-xs text-muted">{summary}</p>
            )}
            <div className="flex items-center gap-3">
              <Quantity
                value={qty}
                max={20}
                onChange={setQty}
                className="w-28 shrink-0"
              />
              <a
                href={info.links.boltFood}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({
                  size: "lg",
                  className: "min-w-0 flex-1 justify-between px-5",
                })}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <ShoppingBag className="size-4 shrink-0" />
                  <span className="truncate">{t("orderShort")}</span>
                </span>
                <span className="tabular-nums">
                  {formatPrice(unit * qty, locale)}
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Block({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 border-t border-line pt-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-bold">{title}</h3>
        {hint && (
          <span className="rounded-pill bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted">
            {hint}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
