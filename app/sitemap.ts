import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { masterclasses } from "@/data/masterclasses";
import { siteUrl } from "@/lib/utils";

const entry = (path: string, priority: number): MetadataRoute.Sitemap =>
  routing.locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: locale === routing.defaultLocale ? priority : priority * 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
      ),
    },
  }));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry("", 1),
    ...entry("/menu", 0.9),
    ...entry("/rewards", 0.7),
    ...entry("/masterclass", 0.8),
    ...masterclasses.flatMap((m) => entry(`/masterclass/${m.slug}`, 0.7)),
  ];
}
