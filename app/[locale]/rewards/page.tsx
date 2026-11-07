import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Rewards } from "@/components/sections/rewards";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/rewards">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rewards" });
  return {
    title: t("metaTitle"),
    description: t("text"),
    alternates: { canonical: `/${locale}/rewards` },
  };
}

export default async function Page({ params }: PageProps<"/[locale]/rewards">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <Header />
      <main id="main" className="pt-header">
        <div id="top">
          <Rewards full />
        </div>
      </main>
      <Footer />
    </>
  );
}
