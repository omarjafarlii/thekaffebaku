"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { feedbackSchema, type FeedbackInput } from "@/lib/schemas";
import { submitFeedback } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Star } from "@/components/ui/stars";
import { Field, Honeypot, Input, Textarea } from "@/components/forms/field";
import { Success } from "@/components/forms/success";
import { cn } from "@/lib/utils";

export function FeedbackForm() {
  const t = useTranslations("feedback");
  const te = useTranslations("errors");
  const [done, setDone] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { name: "", email: "", message: "", company: "" },
  });

  const err = (key?: string) => (key ? te(key as "name") : undefined);

  if (done)
    return (
      <Success
        title={t("successTitle")}
        text={t("successText")}
        action={
          <Button variant="outline" onClick={() => setDone(false)}>
            {t("again")}
          </Button>
        }
      />
    );

  return (
    <form
      noValidate
      className="relative grid gap-x-4 sm:grid-cols-2"
      onSubmit={handleSubmit(async (values) => {
        const res = await submitFeedback(values);
        if (res.ok) {
          setDone(true);
          reset();
        } else toast.error(te("server"));
      })}
    >
      <Honeypot {...register("company")} />
      <Field
        label={t("name")}
        htmlFor="fb-name"
        error={err(errors.name?.message)}
      >
        <Input
          id="fb-name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby="fb-name-error"
          {...register("name")}
        />
      </Field>
      <Field
        label={t("email")}
        htmlFor="fb-email"
        error={err(errors.email?.message)}
      >
        <Input
          id="fb-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby="fb-email-error"
          {...register("email")}
        />
      </Field>

      <Controller
        control={control}
        name="rating"
        render={({ field }) => (
          <fieldset className="flex flex-col gap-1.5 sm:col-span-2">
            <legend className="mb-1.5 text-sm font-semibold">
              {t("rating")}
            </legend>
            <StarInput value={field.value} onChange={field.onChange} />
            <p role="alert" className="min-h-5 text-sm text-danger">
              {err(errors.rating?.message)}
            </p>
          </fieldset>
        )}
      />

      <Field
        label={t("message")}
        htmlFor="fb-message"
        error={err(errors.message?.message)}
        className="sm:col-span-2"
      >
        <Textarea
          id="fb-message"
          aria-invalid={!!errors.message}
          aria-describedby="fb-message-error"
          {...register("message")}
        />
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="sm:col-span-2"
      >
        {isSubmitting ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}

/** Accessible 1–5 star radio group with hover preview. */
function StarInput({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  const shown = hover || value || 0;
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <label
          key={n}
          onMouseEnter={() => setHover(n)}
          className={cn(
            "cursor-pointer rounded-lg p-0.5 transition-transform hover:scale-110 has-focus-visible:outline-2 has-focus-visible:outline-caramel-500",
            n <= shown ? "text-caramel-500" : "text-line",
          )}
        >
          <input
            type="radio"
            name="rating"
            value={n}
            checked={value === n}
            onChange={() => onChange(n)}
            className="sr-only"
          />
          <span className="sr-only">{n} / 5</span>
          <Star filled={n <= shown} className="size-8" />
        </label>
      ))}
    </div>
  );
}
