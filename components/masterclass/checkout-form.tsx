"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  CreditCard,
  Download,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Store,
} from "lucide-react";
import { info } from "@/data/info";
import { toast } from "sonner";
import { submitBooking } from "@/app/actions";
import type { Masterclass } from "@/data/masterclasses";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { Cover } from "@/components/ui/cover";
import { Field, Honeypot, Input, Textarea } from "@/components/forms/field";
import { Success } from "@/components/forms/success";
import { Quantity } from "@/components/masterclass/quantity";
import { t as tr } from "@/lib/i18n-data";
import { formatDate, parseIsoDate } from "@/lib/format";
import { calendarUrl, formatPrice } from "@/lib/masterclass";
import {
  bookingSchema,
  PAYMENT_METHODS,
  type BookingInput,
  type PaymentMethod,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

const paymentIcon = { card: CreditCard, cash: Store } satisfies Record<
  PaymentMethod,
  unknown
>;

type Done = {
  code: string;
  total: number;
  name: string;
  email: string;
  payment: PaymentMethod;
  quantity: number;
  sent: { email: boolean; whatsapp: boolean };
  receiptHtml: string;
};

export function CheckoutForm({
  mc,
  initialQty,
  max,
}: {
  mc: Masterclass;
  initialQty: number;
  max: number;
}) {
  const t = useTranslations("checkout");
  const te = useTranslations("errors");
  const tm = useTranslations("masterclass");
  const locale = useLocale();
  const [done, setDone] = useState<Done | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      slug: mc.slug,
      quantity: initialQty,
      name: "",
      phone: "",
      email: "",
      payment: "card",
      note: "",
      agree: false as unknown as true,
      company: "",
      locale: locale as BookingInput["locale"],
    },
  });

  const qty = useWatch({ control, name: "quantity" });
  const payment = useWatch({ control, name: "payment" });
  const total = mc.price * qty;
  const err = (key?: string) => (key ? te(key as "name") : undefined);
  const title = tr(mc.title, locale);
  const when = formatDate(parseIsoDate(mc.date), locale, { weekday: true });

  if (done)
    return (
      <div className="mt-10 rounded-panel bg-surface p-6 md:p-10">
        <Success
          title={t("successTitle")}
          text={t(done.payment === "card" ? "successCard" : "successCash", {
            name: done.name,
            email: done.email,
          })}
          action={
            <div className="flex flex-col items-center gap-6">
              <div className="rounded-card border-2 border-dashed border-line px-8 py-4 text-center">
                <p className="text-xs font-semibold text-muted">
                  {t("orderCode")}
                </p>
                <p className="text-2xl font-extrabold tracking-wider">
                  {done.code}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {title} · {when} · {mc.start}
                </p>
                <p className="mt-1 font-bold">
                  {done.quantity} × {formatPrice(mc.price, locale)} ={" "}
                  {formatPrice(done.total, locale)}
                </p>
              </div>
              <ul className="flex flex-col items-center gap-1.5 text-sm text-muted">
                {done.sent.email && (
                  <li className="flex items-center gap-2">
                    <Mail className="size-4 text-accent" />
                    {t("receiptEmail", { email: done.email })}
                  </li>
                )}
                {done.sent.whatsapp && (
                  <li className="flex items-center gap-2">
                    <MessageCircle className="size-4 text-accent" />
                    {t("receiptWhatsApp")}
                  </li>
                )}
              </ul>
              <Button
                size="lg"
                onClick={() => downloadReceipt(done.receiptHtml)}
              >
                <Download className="size-4" /> {t("downloadReceipt")}
              </Button>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={info.links.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline" })}
                >
                  <MapPin className="size-4" /> {t("openMap")}
                </a>
                <a
                  href={calendarUrl(mc, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "outline" })}
                >
                  <CalendarPlus className="size-4" /> {t("addCalendar")}
                </a>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href={`/masterclass/${mc.slug}`}
                  className={buttonVariants({ variant: "outline" })}
                >
                  {t("backToClass")}
                </Link>
                <Link href="/" className={buttonVariants()}>
                  {t("backHome")}
                </Link>
              </div>
            </div>
          }
        />
      </div>
    );

  return (
    <form
      noValidate
      className="relative mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-12"
      onSubmit={handleSubmit(async (values) => {
        const res = await submitBooking(values);
        if (res.ok)
          setDone({
            code: res.code,
            total: res.total,
            name: values.name,
            email: values.email,
            payment: values.payment,
            quantity: values.quantity,
            sent: res.sent,
            receiptHtml: res.receiptHtml,
          });
        else toast.error(te(res.error === "validation" ? "server" : res.error));
      })}
    >
      <Honeypot {...register("company")} />
      <input type="hidden" {...register("slug")} />

      {/* ---------- left: details ---------- */}
      <div className="flex min-w-0 flex-col gap-8">
        <fieldset className="rounded-panel bg-surface p-6 md:p-8">
          <legend className="sr-only">{t("contact")}</legend>
          <h2 className="mb-5 flex items-center gap-3 text-lg font-bold">
            <Step n={1} /> {t("contact")}
          </h2>
          <div className="grid gap-x-4 sm:grid-cols-2">
            <Field
              label={t("name")}
              htmlFor="co-name"
              error={err(errors.name?.message)}
              className="sm:col-span-2"
            >
              <Input
                id="co-name"
                autoComplete="name"
                aria-invalid={!!errors.name}
                aria-describedby="co-name-error"
                {...register("name")}
              />
            </Field>
            <Field
              label={t("phone")}
              htmlFor="co-phone"
              error={err(errors.phone?.message)}
            >
              <Input
                id="co-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+994 __ ___ __ __"
                aria-invalid={!!errors.phone}
                aria-describedby="co-phone-error"
                {...register("phone")}
              />
            </Field>
            <Field
              label={t("email")}
              htmlFor="co-email"
              error={err(errors.email?.message)}
            >
              <Input
                id="co-email"
                type="email"
                autoComplete="email"
                placeholder={t("emailHint")}
                aria-invalid={!!errors.email}
                aria-describedby="co-email-error"
                {...register("email")}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="rounded-panel bg-surface p-6 md:p-8">
          <legend className="sr-only">{t("payment")}</legend>
          <h2 className="mb-5 flex items-center gap-3 text-lg font-bold">
            <Step n={2} /> {t("payment")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {PAYMENT_METHODS.map((m) => {
              const Icon = paymentIcon[m];
              return (
                <label
                  key={m}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-card border-2 p-4 transition",
                    payment === m
                      ? "border-brand bg-surface-2/60"
                      : "border-line hover:border-forest-600",
                  )}
                >
                  <input
                    type="radio"
                    value={m}
                    className="mt-1 size-4 accent-forest-800"
                    {...register("payment")}
                  />
                  <span className="flex flex-col gap-1">
                    <span className="flex items-center gap-2 font-bold">
                      <Icon className="size-4 text-accent" aria-hidden />
                      {t(`pay_${m}`)}
                    </span>
                    <span className="text-sm text-muted">
                      {t(`pay_${m}_text`)}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
          <p role="alert" className="mt-2 min-h-5 text-sm text-danger">
            {err(errors.payment?.message)}
          </p>

          <Field label={t("note")} htmlFor="co-note" className="mt-2">
            <Textarea
              id="co-note"
              rows={2}
              className="min-h-20"
              placeholder={t("notePlaceholder")}
              {...register("note")}
            />
          </Field>

          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 shrink-0 accent-forest-800"
              aria-invalid={!!errors.agree}
              {...register("agree")}
            />
            <span>{t("agree")}</span>
          </label>
          <p role="alert" className="mt-1 min-h-5 text-sm text-danger">
            {err(errors.agree?.message)}
          </p>
        </fieldset>
      </div>

      {/* ---------- right: order summary ---------- */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex flex-col gap-5 rounded-panel bg-surface p-6 shadow-lift">
          <h2 className="text-lg font-bold">{t("summary")}</h2>
          <div className="flex gap-4">
            <Cover
              src={mc.cover.src}
              alt={tr(mc.cover.alt, locale)}
              className="size-20 shrink-0 rounded-xl"
              sizes="80px"
            />
            <div className="min-w-0">
              <p className="leading-snug font-bold">{title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <CalendarDays className="size-3.5" aria-hidden /> {when}
              </p>
              <p className="flex items-center gap-1.5 text-sm text-muted">
                <Clock className="size-3.5" aria-hidden /> {mc.start}–{mc.end}
              </p>
            </div>
          </div>

          <Controller
            control={control}
            name="quantity"
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="co-qty" className="text-sm font-semibold">
                  {tm("tickets")}
                </label>
                <Quantity
                  id="co-qty"
                  value={field.value}
                  max={max}
                  onChange={field.onChange}
                  className="w-32"
                />
              </div>
            )}
          />

          <dl className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">
                {t("subtotal", {
                  qty,
                  price: formatPrice(mc.price, locale),
                })}
              </dt>
              <dd className="tabular-nums">{formatPrice(total, locale)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">{t("serviceFee")}</dt>
              <dd>{t("free")}</dd>
            </div>
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3">
              <dt className="text-base font-bold">{t("total")}</dt>
              <dd className="text-2xl font-extrabold tabular-nums">
                {formatPrice(total, locale)}
              </dd>
            </div>
          </dl>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting
              ? t("sending")
              : t(payment === "card" ? "submit" : "submitCash", {
                  total: formatPrice(total, locale),
                })}
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock className="size-3.5" aria-hidden /> {t("secure")}
          </p>
        </div>
      </aside>
    </form>
  );
}

/**
 * Opens the browser's print dialog for the receipt only ("Save as PDF").
 * Uses a hidden iframe, so no pop-up blocker and the page stays as it is.
 * The receipt's <title> becomes the suggested PDF file name.
 */
function downloadReceipt(html: string) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden";
  frame.srcdoc = html;
  frame.onload = () => {
    const w = frame.contentWindow;
    if (!w) return;
    w.focus();
    w.print();
    // remove after the dialog closes (print() blocks in most browsers)
    setTimeout(() => frame.remove(), 60_000);
  };
  document.body.appendChild(frame);
}

function Step({ n }: { n: number }) {
  return (
    <span className="grid size-8 place-items-center rounded-pill bg-brand text-sm font-bold text-brand-fg">
      {n}
    </span>
  );
}
