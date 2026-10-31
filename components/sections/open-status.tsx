"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { info } from "@/data/info";
import { getOpenStatus, type OpenStatus as Status } from "@/lib/hours";
import { cn } from "@/lib/utils";

/** Live "Open now / Closed" pill in Baku time (UTC+4), refreshed every minute. */
export function OpenStatus({ className }: { className?: string }) {
  const t = useTranslations("visit");
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getOpenStatus(info.hours));
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status || status.state === "unknown")
    return <span className={cn("inline-block h-8", className)} />;

  const open = status.state === "open";
  const label = open
    ? `${t("openNow")} · ${t("closesAt", { time: status.closesAt })}`
    : `${t("closed")}${status.opensAt ? ` · ${t("opensAt", { time: status.opensAt })}` : ""}`;

  return (
    <span
      role="status"
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-pill px-3 text-sm font-semibold",
        open ? "bg-forest-100 text-forest-800" : "bg-cream-200 text-danger",
        className,
      )}
    >
      <span
        className={cn(
          "size-2 rounded-pill",
          open ? "bg-forest-600" : "bg-danger",
        )}
      />
      {label}
    </span>
  );
}
