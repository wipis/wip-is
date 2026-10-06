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
export const WORK_ITEMS: WorkItem[] = [
  { company: "Shape FS", href: "https://shapefs.com", year: 2026, project: "Founding Engineer" },
  { company: "Gui", href: "https://usegui.com", year: 2026, project: "Creator and Maintainer" },
  { company: "MatterOS", href: "https://matter-os.com", year: 2026, project: "Product Engineering" },
  { company: "RxVortex", href: "https://rxvortex.com", year: 2026, project: "AI Engineering" },
  { company: "Vercel", href: "https://vercel.com", year: 2025, project: "Vercel Academy" },
  { company: "Laravel", href: "https://laravel.com", year: 2025, project: "Nightwatch Launch" },
  { company: "Browserbase", href: "https://browserbase.com", year: 2025, project: "Browser Use Launch" },
  { company: "Supermetal", href: "https://supermetal.io", year: 2026, project: "Web Design and Development" },
  { company: "Julius", href: "https://julius.ai", year: 2024, project: "Product Design" },
  { company: "Route", href: "https://route.com", year: 2023, project: "Brand Strategy" },
  { company: "Tackle.io", href: "https://tackle.io", year: 2022, project: "Web Development" },
  { company: "Outr.ai", href: "https://outr.ai", year: 2024, project: "Full Service" },
  { company: "File Logic", href: "https://filelogic.ai", year: 2025, project: "Product" },
  { company: "Ampry", href: "https://ampry.com", year: 2020, project: "Product" },
  { company: "Swyftfin", href: "https://swyftfin.com", year: 2025, project: "Product" },
  { company: "Advocate Media", href: "https://advocatemedia.com", year: 2026, project: "Brand and Web Design" },
  { company: "Alpine Codex", href: "https://alpinecodex.com", year: 2024, project: "Marketing Software" },
  { company: "Payve", href: "https://payve.vercel.app", year: 2026, project: "Brand and Web Design" },
  { company: "Confetti Recruiting", href: "https://www.confettirecruiting.com", year: 2026, project: "Brand and Web Design" },
  { company: "Strive Pharmacy", href: "https://strivepharmacy.com", year: 2026, project: "Product Engineering" },
  { company: "Noon.Design", href: "https://noon.design", year: 2026, project: "GTM Engineering" },
  { company: "Zion", href: "https://zion.surf", year: 2018, project: "Graphic Design" },
  { company: "BYU", href: "https://byu.edu", year: 2018, project: "Graphic Design and Typesetting" },
  // Our own products and open source.
  { company: "Iris", href: "https://github.com/brijr/iris", year: 2026, project: "Open Source" },
  { company: "ShipGTM", href: "https://shipgtm.com", year: 2026, project: "Content Creator" },
  { company: "Wrk.so", href: "https://wrk.so", year: 2025, project: "Product" },
  { company: "Meta MCP", href: "https://github.com/brijr/meta-mcp", year: 2025, project: "Open Source" },
  { company: "Payload Starter", href: "https://payloadstarter.dev", year: 2025, project: "Open Source" },
  { company: "Router.so", href: "https://router.so", year: 2024, project: "Product" },
  { company: "Components", href: "https://components.work", year: 2024, project: "Open Source" },
  { company: "Next WP", href: "https://next-wp.com", year: 2024, project: "Open Source" },
  { company: "Craft Design System", href: "https://craft-ds.com", year: 2024, project: "Open Source" },
];

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
