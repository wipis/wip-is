export interface WorkItem {
  company: string;
  /** Omit for work with no live site; the name renders as plain text. */
  href?: string;
  /** Year the engagement started. Shown in the Work ledger. */
  year?: number;
  /** What the work was, e.g. "Vercel Academy". */
  project?: string;
  /** Link text shown after the name, e.g. "@bridgertower". */
  handle?: string;
}

// Client work and our own products in one ledger, sorted by year on render.
export { PUBLISHED_WORK as WORK_ITEMS } from "./work-posts";

export const SOCIAL_ITEMS: WorkItem[] = [
  { company: "Bridger X", href: "https://x.com/bridgertower", handle: "@bridgertower" },
  { company: "WIP LinkedIn", href: "https://www.linkedin.com/company/wipdes", handle: "@wipdes" },
  { company: "Bridger LinkedIn", href: "https://www.linkedin.com/in/brijr", handle: "@brijr" },
  { company: "WIP GitHub", href: "https://github.com/wipis", handle: "@wipis" },
  { company: "Bridger GitHub", href: "https://github.com/brijr", handle: "@brijr" },
  { company: "YouTube", href: "https://youtube.com/@bridgertower", handle: "@bridgertower" },
];

export const SERVICES: { group: string; items: string[] }[] = [
  { group: "Brand", items: ["Strategy", "Identity", "Advertising", "Typesetting"] },
  { group: "Product", items: ["Zero to One", "Design", "Design Systems"] },
  { group: "Engineering", items: ["Web Apps", "Native Apps", "AI", "GTM", "Open Source"] },
  { group: "Web", items: ["Design", "Development", "Landing Pages", "SEO"] },
  { group: "Growth", items: ["Marketing", "Analytics", "Content", "Advertising"] },
];

export const CREDITS = [
  "Site designed and built by WIP",
  "Typeface: Inter by Rasmus Andersson",
];
