"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReservationForm } from "@/components/forms/reservation-form";
import { FeedbackForm } from "@/components/forms/feedback-form";
import { info } from "@/data/info";
import { cn } from "@/lib/utils";

/** One section, two tabs: table reservation and feedback. */
export function Contact() {
  const t = useTranslations("contact");
  const [tab, setTab] = useState<"reserve" | "feedback">("reserve");

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-surface-2 py-20 md:py-28"
    >
      <div className="container-page flex flex-col items-center">
        <SectionHeading
          id="contact-title"
          eyebrow={t("eyebrow")}
          title={t("title")}
        />

        <div className="mt-10 w-full max-w-2xl rounded-panel bg-surface p-5 shadow-soft md:p-8">
          <div
            role="tablist"
            aria-label={t("title")}
            className="mb-6 grid grid-cols-2 gap-1 rounded-pill bg-bg p-1"
          >
            {(["reserve", "feedback"] as const).map((k) => (
              <button
                key={k}
                role="tab"
                type="button"
                id={`tab-${k}`}
                aria-selected={tab === k}
                aria-controls={`panel-${k}`}
                onClick={() => setTab(k)}
                className={cn(
                  "h-11 rounded-pill text-sm font-semibold transition-colors",
                  tab === k
                    ? "bg-brand text-brand-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                {k === "reserve" ? t("tabReserve") : t("tabFeedback")}
              </button>
            ))}
          </div>

          <div
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`tab-${tab}`}
          >
            {tab === "reserve" ? <ReservationForm /> : <FeedbackForm />}
          </div>

          {info.phone && tab === "reserve" && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-muted">
              {t("callInstead")}
              <a
                href={`tel:${info.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-1.5 font-bold text-fg hover:underline"
              >
                <Phone className="size-3.5" /> {info.phone}
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
