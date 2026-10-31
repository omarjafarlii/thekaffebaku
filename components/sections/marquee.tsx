import { info } from "@/data/info";

/** Handwritten slogan ribbon. Decorative — hidden from screen readers. */
export function Marquee() {
  const words = [
    info.slogan,
    "Pet Friendly 🐾",
    "All-Day Breakfast",
    "Icherisheher, Baku",
  ];
  const row = [...words, ...words];
  return (
    <div
      aria-hidden
      className="overflow-hidden bg-forest-800 py-5 text-cream-100 dark:bg-forest-900"
    >
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span
                key={i}
                className="flex items-center font-hand text-3xl whitespace-nowrap md:text-4xl"
                lang="en"
              >
                <span className="px-6">{w}</span>
                <span className="text-caramel-400">✱</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
