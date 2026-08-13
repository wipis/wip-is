# wip.is

Homepage of [wip.is](https://wip.is) — Astro, Tailwind CSS v4, deployed to Cloudflare Pages.

The site is fully prerendered and ships no UI framework: the interactive pieces
(theme toggle, copy-to-clipboard email, the WIP mark's hover state, smooth
scrolling) are plain `<script>` tags in their own `.astro` components.

## Commands

| Command             | Action                               |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | Dev server at `localhost:4321`       |
| `pnpm build`        | Build the static site to `dist/`     |
| `pnpm preview`      | Serve the built site locally         |
| `pnpm check`        | Typecheck `.astro` and `.ts` files   |
| `pnpm run deploy`   | Build and deploy to Cloudflare Pages |

`deploy` needs `pnpm run` — bare `pnpm deploy` is pnpm's own workspace command
and errors out.

## Layout

```
src/
  pages/index.astro       The only route
  layouts/Base.astro      <head>, JSON-LD, theme bootstrap, Lenis
  components/             UI, one .astro file each
  lib/                    Site constants, theme logic, link + mark data
  styles/globals.css      Tailwind entry, theme tokens, font fallback
functions/_middleware.ts  Canonical-host 301 (Cloudflare Pages Function)
public/_routes.json       Keeps static assets from invoking that Function
```

## Notes

- **Theme.** An inline script in `Base.astro` applies the `light`/`dark` class
  before first paint to avoid a flash; everything after that lives in
  `src/lib/theme.ts`. The `localStorage` key and values match the `next-themes`
  setup this site used previously, so existing preferences carry over.
- **Canonical host.** Several domains point at the same Pages project and
  Cloudflare has no "primary domain" setting, so `functions/_middleware.ts`
  301s every non-canonical hostname to `wip.is`. `.pages.dev` is exempt so
  preview deployments stay reachable.
- **Deploys are direct uploads,** not Git-triggered — pushing to GitHub does
  not update the site. The Pages project has no Git provider connected, so
  `pnpm run deploy` is the only thing that ships it. The script passes
  `CLOUDFLARE_ACCOUNT_ID` because this login has several accounts and Pages
  configs reject an `account_id` key.
- **Copyright year** in the footer is baked in at build time.
