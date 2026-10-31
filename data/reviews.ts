/**
 * ============================================================
 *  REVIEWS — real Google Maps reviews of "The Kaffe Loopie"
 *  Collected 2026-10-31. Google shows relative dates
 *  ("3 months ago"), stored here as the approximate month.
 *  Add new reviews at the top.
 * ============================================================
 */

export type ReviewSource = "google" | "instagram";

export type Review = {
  id: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  /** approximate month of the review */
  date: { year: number; month: number };
  text: string;
  lang: "az" | "en" | "ru";
  source: ReviewSource;
};

export const reviews: Review[] = [
  {
    id: "g-muskaan",
    author: "Muskaan Agarwal",
    rating: 5,
    date: { year: 2026, month: 9 },
    text: "Amazing vibe, best tiramisu i ever had - mussst try. And very friendly and cute catsss. Loved the place ❤️",
    lang: "en",
    source: "google",
  },
  {
    id: "g-aina",
    author: "Айна Д.",
    rating: 5,
    date: { year: 2026, month: 7 },
    text: "We had breakfast here twice during our stay, and everything was excellent! The breakfasts were delicious, the coffee was amazing, and every dish was fresh and beautifully presented. The staff were incredibly friendly, welcoming, and attentive.",
    lang: "en",
    source: "google",
  },
  {
    id: "g-natalia",
    author: "Natalia Acuña",
    rating: 5,
    date: { year: 2026, month: 7 },
    text: "I ordered the Shakshuka, filtered coffee, and dessert, and everything was absolutely delicious. The service was outstanding. The café itself has a warm, cozy atmosphere that makes you want to stay longer. 💜",
    lang: "en",
    source: "google",
  },
  {
    id: "g-ilayda",
    author: "Ilayda Murtazayeva",
    rating: 5,
    date: { year: 2026, month: 7 },
    text: "I tried Shakshuka here — you have to try breakfast here. Best breakfast in Baku. Coffee also so delicious, and near Icherisheher. The staff are so friendly. Cozy music playlist and cats. Thanks the kaffe 💚",
    lang: "en",
    source: "google",
  },
  {
    id: "g-sora",
    author: "Sora Sumikiri",
    rating: 5,
    date: { year: 2026, month: 6 },
    text: "Thank you for good food and wonderful emotions! Very friendly cafe. Recommend for coffee, breakfast. Delicious cakes 😊",
    lang: "en",
    source: "google",
  },
];
