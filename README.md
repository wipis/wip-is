# wip-design.com

Homepage of [wip-design.com](https://wip-design.com) — Astro, Tailwind CSS v4, deployed to the Cloudflare Worker `wip`.

The site is fully prerendered and ships no UI framework: the interactive pieces
(theme toggle, copy-to-clipboard email, the WIP mark's hover state, smooth
scrolling) are plain `<script>` tags in their own `.astro` components.

## Commands

| Command             | Action                               |
| ------------------- | ------------------------------------ |
| `bun dev`           | Dev server at `localhost:4321`       |
| `bun build`         | Build the static site to `dist/`     |
| `bun preview`       | Serve the built site locally         |
| `bun check`         | Typecheck `.astro` and `.ts` files   |
| `bun run deploy`    | Build and deploy to the `wip` Worker |

## Layout

```
src/
  pages/index.astro       The only route
  layouts/Base.astro      <head>, JSON-LD, theme bootstrap, Lenis
  components/             UI, one .astro file each
  lib/                    Site constants, theme logic, link + mark data
  styles/globals.css      Tailwind entry, theme tokens, font fallback
  worker.ts               Canonical-host 301, then serves dist/ assets
```

## Notes

- **Theme.** An inline script in `Base.astro` applies the `light`/`dark` class
  before first paint to avoid a flash; everything after that lives in
  `src/lib/theme.ts`. The `localStorage` key and values match the `next-themes`
  setup this site used previously, so existing preferences carry over.
- **Canonical host.** Several domains point at the same Worker and Cloudflare
  has no primary-domain setting, so `src/worker.ts` 301s every non-canonical
  hostname, including `wip.is`, to `wip-design.com`. `.workers.dev` is exempt
  so preview URLs stay reachable.
- **Deploys.** Cloudflare Workers Builds runs `bun run build`, then
  `npx wrangler deploy`. `bun run deploy` does the same from this machine.
  The Worker name in `wrangler.jsonc` is `wip`.
- **Copyright year** in the footer is baked in at build time.
