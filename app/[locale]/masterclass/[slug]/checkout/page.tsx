import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckoutForm } from "@/components/masterclass/checkout-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { getMasterclass, MAX_TICKETS_PER_ORDER } from "@/data/masterclasses";
import { seatState } from "@/lib/masterclass";
import { bakuToday } from "@/lib/schemas";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/masterclass/[slug]/checkout">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  // personal-data form: keep it out of search results
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: PageProps<"/[locale]/masterclass/[slug]/checkout">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const mc = getMasterclass(slug);
  if (!mc) notFound();

  const t = await getTranslations("checkout");
  const tm = await getTranslations("masterclass");
  const state = seatState(mc, bakuToday());
  const canBuy = state === "open" || state === "last";

  const max = Math.min(mc.seatsLeft, MAX_TICKETS_PER_ORDER);
  const requested = Number((await searchParams).qty);
  const qty = Number.isInteger(requested)
    ? Math.min(Math.max(requested, 1), Math.max(max, 1))
    : 1;

  return (
    <>
      <Header />
      <main id="main" className="pt-header">
        <div id="top" className="container-page py-8 md:py-12">
          <Link
            href={`/masterclass/${mc.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-fg"
          >
            <ArrowLeft className="size-4" /> {t("backToClass")}
          </Link>

          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            align="left"
            className="mt-6"
          />

          {canBuy ? (
            <CheckoutForm mc={mc} initialQty={qty} max={max} />
          ) : (
            <div className="mt-10 flex flex-col items-start gap-5 rounded-panel bg-surface p-8">
              <p className="text-lead">{t("soldOut")}</p>
              <Link
                href="/masterclass"
                className={buttonVariants({ size: "lg" })}
              >
                {tm("viewAll")}
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
