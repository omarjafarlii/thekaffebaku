"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** AZ / EN / RU switcher. */
export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={cn(
        "flex items-center gap-0.5",
        pending && "opacity-60",
        className,
      )}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={l === locale}
          onClick={() =>
            startTransition(() =>
              router.replace(`${pathname}${window.location.hash}`, {
                locale: l,
                scroll: false,
              }),
            )
          }
          className={cn(
            "h-8 rounded-pill px-2.5 text-xs font-bold uppercase transition",
            l === locale
              ? "bg-brand text-brand-fg"
              : "text-muted hover:text-fg",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
