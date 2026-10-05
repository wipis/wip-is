import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import { SITE_URL } from "./src/lib/constants";

export default defineConfig({
  // Absolute URLs are built from this (canonical link, OG tags, JSON-LD).
  site: SITE_URL,
  integrations: [react()],
  // Default output is `static` — every page is prerendered to HTML at build
  // time and `dist/` is uploaded as Worker static assets. The only server-side
  // behaviour left is the canonical-host redirect in src/worker.ts.
  vite: {
    plugins: [tailwindcss()],
  },
});
