"use client";

import { useTranslations } from "next-intl";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** − 2 + stepper for ticket count. */
export function Quantity({
  value,
  max,
  onChange,
  id,
  className,
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
  id?: string;
  className?: string;
}) {
  const t = useTranslations("masterclass");
  const btn =
    "grid size-9 place-items-center rounded-lg transition hover:bg-surface-2 disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div
      className={cn(
        "flex h-12 items-center justify-between rounded-xl border border-line bg-bg px-1.5",
        className,
      )}
    >
      <button
        type="button"
        aria-label={t("less")}
        disabled={value <= 1}
        onClick={() => onChange(Math.max(1, value - 1))}
        className={btn}
      >
        <Minus className="size-4" />
      </button>
      <output
        id={id}
        aria-live="polite"
        className="min-w-8 text-center text-lg font-bold tabular-nums"
      >
        {value}
      </output>
      <button
        type="button"
        aria-label={t("more")}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className={btn}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
