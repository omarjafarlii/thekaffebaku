import { info } from "@/data/info";
import { reviews } from "@/data/reviews";
import { t as tr } from "@/lib/i18n-data";
import { siteUrl } from "@/lib/utils";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** schema.org CafeOrCoffeeShop structured data. Only confirmed fields are emitted. */
export function JsonLd({ locale }: { locale: string }) {
  const rating = info.ratings.google.value ? info.ratings.google : null; // only first-party Google rating
  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: info.fullName,
    alternateName: info.name,
    image: `${siteUrl}/media/exterior.jpg`,
    priceRange: "₼₼",
    slogan: info.slogan,
    url: `${siteUrl}/${locale}`,
    servesCuisine: ["Coffee", "Breakfast", "Desserts"],
    address: {
      "@type": "PostalAddress",
      streetAddress: tr(info.address.street, locale),
      addressLocality: tr(info.address.city, locale),
      postalCode: info.address.postalCode,
      addressCountry: info.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: info.geo.lat,
      longitude: info.geo.lng,
    },
    hasMap: info.links.googleMaps,
    sameAs: [
      info.social.instagram,
      info.social.tiktok,
      info.social.facebook,
    ].filter(Boolean),
    ...(info.phone ? { telephone: info.phone } : {}),
    ...(info.email ? { email: info.email } : {}),
    ...(info.hours.every((h) => h.open && h.close)
      ? {
          openingHoursSpecification: info.hours
            .filter((h) => !h.closed)
            .map((h) => ({
              "@type": "OpeningHoursSpecification",
              dayOfWeek: dayNames[h.day],
              opens: h.open,
              closes: h.close,
            })),
        }
      : {}),
    ...(rating?.value && rating.count
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.value,
            reviewCount: rating.count,
          },
        }
      : {}),
    ...(info.amenities.petFriendly
      ? {
          amenityFeature: [
            {
              "@type": "LocationFeatureSpecification",
              name: "Pet friendly",
              value: true,
            },
          ],
        }
      : {}),
    ...(reviews.some((r) => r.source === "google" && r.rating)
      ? {
          review: reviews
            .filter((r) => r.source === "google" && r.rating)
            .map((r) => ({
              "@type": "Review",
              author: { "@type": "Person", name: r.author },
              reviewRating: { "@type": "Rating", ratingValue: r.rating },
              reviewBody: r.text,
            })),
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
