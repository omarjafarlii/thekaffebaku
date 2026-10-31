"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Menu as MenuIcon, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SocialLinks } from "@/components/layout/social-links";
import { buttonVariants } from "@/components/ui/button-variants";
import { NAV_ITEMS } from "@/lib/nav";
import { info } from "@/data/info";
import { cn } from "@/lib/utils";

/**
 * Floating white pill header (sticky). Becomes slightly more compact
 * and shadowed once the page is scrolled.
 */
export function Header() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only rounded-pill bg-brand px-5 py-3 text-brand-fg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60"
      >
        {t("skip")}
      </a>

      <header className="fixed inset-x-0 top-0 z-40 px-2 pt-2 md:px-4 md:pt-4">
        <div
          className={cn(
            "mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 rounded-pill bg-surface/95 pr-2 pl-3 backdrop-blur-md transition-shadow duration-300 md:pr-3 md:pl-4",
            scrolled ? "shadow-lift" : "shadow-soft",
          )}
        >
          <a
            href="#top"
            aria-label={t("home")}
            className="shrink-0 rounded-pill"
          >
            <Logo size={44} withName={false} className="sm:hidden" />
            <Logo size={44} className="hidden sm:inline-flex" />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className="rounded-pill px-3.5 py-2 text-sm font-semibold text-fg/80 transition hover:bg-surface-2 hover:text-fg"
                  >
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <LocaleSwitcher className="hidden md:flex" />
            <ThemeToggle className="hidden md:grid" />
            <a
              href="#menu"
              className={cn(
                buttonVariants({ size: "md" }),
                "ml-1 hidden sm:inline-flex",
              )}
            >
              {t("menu")}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("openMenu")}
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-pill bg-brand text-brand-fg lg:hidden"
            >
              <MenuIcon className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t("openMenu")}
            className="fixed inset-0 z-50 flex flex-col bg-forest-800 text-cream-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-20 items-center justify-between px-4">
              <Logo size={44} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("closeMenu")}
                className="grid size-11 place-items-center rounded-pill bg-cream-50/10"
                autoFocus
              >
                <X className="size-5" />
              </button>
            </div>
            <nav
              aria-label="Mobile"
              className="flex flex-1 flex-col justify-center px-6"
            >
              <ul className="flex flex-col gap-2">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <a
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 text-4xl font-bold tracking-tight"
                    >
                      {t(item.key)}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-5 border-t border-cream-50/15 px-6 py-6">
              <a
                href={info.links.boltFood}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "light", size: "lg" })}
              >
                {t("order")} · Bolt Food
              </a>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 rounded-pill bg-cream-50 p-1">
                  <LocaleSwitcher />
                  <ThemeToggle />
                </div>
                <SocialLinks />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
