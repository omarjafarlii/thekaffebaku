import { setRequestLocale } from "next-intl/server";
import { Intro } from "@/components/intro/intro";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { News } from "@/components/sections/news";
import { Marquee } from "@/components/sections/marquee";
import { SplitFeatures } from "@/components/sections/split-features";
import { WhyUs } from "@/components/sections/why-us";
import { Menu } from "@/components/sections/menu";
import { Masterclasses } from "@/components/sections/masterclasses";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { Rewards } from "@/components/sections/rewards";
import { Contact } from "@/components/sections/contact";
import { Visit } from "@/components/sections/visit";
import { Instagram } from "@/components/sections/instagram";
import { JsonLd } from "@/components/seo/json-ld";

/** Re-render hourly so past masterclasses drop off and seats stay current. */
export const revalidate = 3600;

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Intro />
      <Header />
      <main id="main">
        <Hero />
        <News />
        <Marquee />
        <div className="py-20 md:py-28">
          <SplitFeatures />
        </div>
        <Menu preview />
        <Masterclasses />
        <WhyUs />
        <About />
        <Reviews />
        <Rewards />
        <Contact />
        <Visit />
        <Instagram />
      </main>
      <Footer />
      <JsonLd locale={locale} />
    </>
  );
}
