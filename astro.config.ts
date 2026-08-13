import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import { SITE_URL } from "./src/lib/constants";

export default defineConfig({
  // Absolute URLs are built from this (canonical link, OG tags, JSON-LD).
  site: SITE_URL,
  // Default output is `static` — every page is prerendered to HTML at build
  // time and `dist/` is uploaded to Cloudflare Pages as plain assets. The only
  // server-side behaviour left is the canonical-host redirect, which runs as a
  // Pages Function. See functions/_middleware.ts
  vite: {
    plugins: [tailwindcss()],
  },
});
