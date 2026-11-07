import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MasterclassCard } from "@/components/masterclass/masterclass-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button-variants";
import { InstagramIcon } from "@/components/brand/social-icons";
import { upcomingMasterclasses } from "@/data/masterclasses";
import { info } from "@/data/info";
import { bakuToday } from "@/lib/schemas";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/masterclass">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "masterclass" });
  return {
    title: t("metaTitle"),
    description: t("intro"),
    alternates: { canonical: `/${locale}/masterclass` },
  };
}

export default async function MasterclassListPage({
  params,
}: PageProps<"/[locale]/masterclass">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("masterclass");
  const today = bakuToday();
  const list = upcomingMasterclasses(today);

  return (
    <>
      <Header />
      <main id="main" className="pt-header">
        <div id="top" className="container-page py-14 md:py-20">
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} level={1}>
            {t("intro")}
          </SectionHeading>

          {list.length > 0 ? (
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((mc) => (
                <li key={mc.slug} className="min-w-0">
                  <MasterclassCard mc={mc} today={today} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-12 flex flex-col items-center gap-5 py-10 text-center">
              <p className="max-w-md text-muted">{t("empty")}</p>
              <a
                href={info.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ size: "lg" })}
              >
                <InstagramIcon className="size-4" /> {t("follow")}
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
