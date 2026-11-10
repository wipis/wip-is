export interface WorkItem {
  company: string;
  /** Omit for work with no live site; the name renders as plain text. */
  href?: string;
  /** Year the engagement started. Shown in the Work ledger. */
  year?: number;
  /** What the work was, e.g. "Vercel Academy". */
  project?: string;
  /** A shorter `project` for phones, so the line fits. */
  projectShort?: string;
  /** Link text shown after the name, e.g. "@bridgertower". */
  handle?: string;
}

// Client work and our own products in one ledger, sorted by year on render.
export { LISTED_WORK as WORK_ITEMS } from "./work-posts";

export const SOCIAL_ITEMS: WorkItem[] = [
  { company: "YouTube", href: "https://youtube.com/@bridgertower", handle: "@bridgertower" },
  { company: "Bridger X", href: "https://x.com/bridgertower", handle: "@bridgertower" },
  { company: "WIP LinkedIn", href: "https://www.linkedin.com/company/wipdes", handle: "@wipdes" },
  { company: "Bridger LinkedIn", href: "https://www.linkedin.com/in/brijr", handle: "@brijr" },
  { company: "WIP GitHub", href: "https://github.com/wipis", handle: "@wipis" },
  { company: "Bridger GitHub", href: "https://github.com/brijr", handle: "@brijr" },
];

/** `mobile` is the shorter set shown on phones, so each group fits on one line. */
export const SERVICES: { group: string; items: string[]; mobile: string[] }[] = [
  { group: "Product Design", items: ["Zero to One", "Interfaces", "Design Systems"], mobile: ["Zero to One", "Interfaces"] },
  { group: "Engineering", items: ["Web Apps", "Native Apps", "Frontend", "Open Source"], mobile: ["Web Apps", "Native Apps"] },
  { group: "AI Engineering", items: ["Agents", "LLM Apps", "Evals", "AI Interfaces"], mobile: ["Agents", "LLM Apps", "Evals"] },
  { group: "Brand and Web", items: ["Identity", "Websites", "Landing Pages"], mobile: ["Identity", "Websites"] },
];

export const CREDITS = [
  "Site designed and built by WIP",
];
