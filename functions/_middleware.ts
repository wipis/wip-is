/**
 * Redirects every non-canonical hostname to CANONICAL_HOST.
 *
 * wip.is, wip-design.com, wipdes.com, wip0.com and wip.ad are all attached to
 * the same Pages project, so without this they each serve a full 200 copy of
 * the site. Cloudflare Pages has no "primary domain" setting, so the canonical
 * choice has to be enforced here.
 *
 * This replaces the Nitro middleware the site ran on before. public/_routes.json
 * keeps static assets from invoking this Function at all — only document
 * requests, the ones that matter for canonicalisation, reach it.
 */

// Wrangler bundles this file separately from the Astro app, so the import is
// relative — the `~/*` tsconfig alias is not available here.
import { CANONICAL_HOST } from "../src/lib/constants";

// Cloudflare's Pages Functions types are not installed; the shape used here is
// small enough to declare locally.
interface PagesContext {
  request: Request;
  next: () => Promise<Response>;
}

const EXEMPT_SUFFIXES = [
  // Preview deployments must keep working on their own hostname.
  ".pages.dev",
  // Local development.
  ".local",
  ".localhost",
];

const EXEMPT_HOSTS = new Set([
  CANONICAL_HOST,
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
]);

function isExempt(hostname: string) {
  if (EXEMPT_HOSTS.has(hostname)) return true;
  return EXEMPT_SUFFIXES.some((suffix) => hostname.endsWith(suffix));
}

export const onRequest = (context: PagesContext) => {
  const url = new URL(context.request.url);

  if (isExempt(url.hostname)) return context.next();

  url.protocol = "https:";
  url.hostname = CANONICAL_HOST;
  url.port = "";

  return new Response(null, {
    status: 301,
    headers: {
      location: url.href,
      "cache-control": "public, max-age=3600",
    },
  });
};
