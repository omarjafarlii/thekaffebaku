"use client";

import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  bakuToday,
  reservationSchema,
  type ReservationInput,
} from "@/lib/schemas";
import { submitReservation } from "@/app/actions";
import { info } from "@/data/info";
import { Button } from "@/components/ui/button";
import {
  Field,
  Honeypot,
  Input,
  Select,
  Textarea,
} from "@/components/forms/field";
import { Success } from "@/components/forms/success";
import { formatDate, parseIsoDate } from "@/lib/format";

/** 30-minute slots from opening until 1 h before closing. */
function useSlots(date: string | undefined) {
  return useMemo(() => {
    const day = date
      ? new Date(`${date}T12:00:00`).getDay()
      : new Date().getDay();
    const h = info.hours.find((x) => x.day === day);
    if (!h?.open || !h.close || h.closed) return [];
    const toMin = (s: string) =>
      Number(s.slice(0, 2)) * 60 + Number(s.slice(3));
    const out: string[] = [];
    for (let m = toMin(h.open); m <= toMin(h.close) - 60; m += 30) {
      out.push(
        `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
      );
    }
    return out;
  }, [date]);
}

export function ReservationForm() {
  const t = useTranslations("reservation");
  const te = useTranslations("errors");
  const locale = useLocale();
  const [done, setDone] = useState<ReservationInput | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReservationInput>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: bakuToday(),
      time: "",
      guests: 2,
      name: "",
      phone: "",
      note: "",
      company: "",
    },
  });

  const slots = useSlots(useWatch({ control, name: "date" }));
  const err = (key?: string) => (key ? te(key as "name") : undefined);

  if (done)
    return (
      <Success
        title={t("successTitle")}
        text={t("successText", {
          name: done.name,
          date: formatDate(parseIsoDate(done.date), locale, { weekday: true }),
          time: done.time,
          guests: done.guests,
        })}
        action={
          <Button variant="outline" onClick={() => setDone(null)}>
            {t("again")}
          </Button>
        }
      />
    );

  return (
    <form
      noValidate
      className="relative grid gap-x-4 sm:grid-cols-3"
      onSubmit={handleSubmit(async (values) => {
        const res = await submitReservation(values);
        if (res.ok) {
          setDone(values);
          reset();
        } else toast.error(te("server"));
      })}
    >
      <Honeypot {...register("company")} />

      <Field
        label={t("date")}
        htmlFor="rs-date"
        error={err(errors.date?.message)}
      >
        <Input
          id="rs-date"
          type="date"
          min={bakuToday()}
          aria-invalid={!!errors.date}
          aria-describedby="rs-date-error"
          {...register("date")}
        />
      </Field>

      <Field
        label={t("time")}
        htmlFor="rs-time"
        error={err(errors.time?.message)}
      >
        <Select
          id="rs-time"
          aria-invalid={!!errors.time}
          aria-describedby="rs-time-error"
          {...register("time")}
        >
          <option value="">—</option>
          {slots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>

      <Controller
        control={control}
        name="guests"
        render={({ field }) => (
          <Field
            label={t("guests")}
            htmlFor="rs-guests"
            error={err(errors.guests?.message)}
          >
            <div className="flex h-12 items-center justify-between rounded-xl border border-line bg-bg px-1.5">
              <button
                type="button"
                aria-label={t("less")}
                onClick={() =>
                  field.onChange(Math.max(1, (field.value ?? 1) - 1))
                }
                className="grid size-9 place-items-center rounded-lg hover:bg-surface-2"
              >
                <Minus className="size-4" />
              </button>
              <output
                id="rs-guests"
                aria-live="polite"
                className="text-lg font-bold tabular-nums"
              >
                {field.value}
              </output>
              <button
                type="button"
                aria-label={t("more")}
                onClick={() =>
                  field.onChange(Math.min(12, (field.value ?? 1) + 1))
                }
                className="grid size-9 place-items-center rounded-lg hover:bg-surface-2"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </Field>
        )}
      />

      <Field
        label={t("name")}
        htmlFor="rs-name"
        error={err(errors.name?.message)}
        className="sm:col-span-1"
      >
        <Input
          id="rs-name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby="rs-name-error"
          {...register("name")}
        />
      </Field>

      <Field
        label={t("phone")}
        htmlFor="rs-phone"
        error={err(errors.phone?.message)}
        className="sm:col-span-2"
      >
        <Input
          id="rs-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+994 __ ___ __ __"
          aria-invalid={!!errors.phone}
          aria-describedby="rs-phone-error"
          {...register("phone")}
        />
      </Field>

      <Field label={t("note")} htmlFor="rs-note" className="sm:col-span-3">
        <Textarea
          id="rs-note"
          rows={2}
          className="min-h-20"
          {...register("note")}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="sm:col-span-3"
      >
        {isSubmitting ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
