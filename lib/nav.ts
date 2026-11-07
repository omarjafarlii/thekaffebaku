/**
 * Main navigation (keys map to messages "nav.*"). Every item scrolls to a
 * section of the home page; each section has its own "See more" button that
 * opens the full page (/menu, /masterclass, /rewards).
 */
export const NAV_ITEMS = [
  { href: "#menu", key: "menu" },
  { href: "#masterclasses", key: "masterclasses" },
  { href: "#rewards", key: "rewards" },
  { href: "#about", key: "about" },
  { href: "#contact", key: "contact" },
  { href: "#visit", key: "visit" },
] as const;

/**
 * Locale-prefixed link: "/az/menu" or "/az#about". Anchors work from
 * sub-pages too; on the home page the browser just scrolls (no reload).
 */
export const homeAnchor = (locale: string, href: string) => `/${locale}${href}`;
