/**
 * Redirects every non-canonical hostname to CANONICAL_HOST, then serves
 * the static site from the assets binding.
 *
 * wip.is, wip-design.com, wipdes.com, wip0.com, wip.ad, and wipds.com are all
 * attached to this Worker. Cloudflare has no primary-domain setting, so the
 * canonical choice is enforced here.
 *
 * Hashed assets are excluded in wrangler.jsonc (`run_worker_first`) so they
 * are served directly. Only document requests reach this script.
 */

import { CANONICAL_HOST } from "./lib/constants";

interface Env {
  ASSETS: {
    fetch(input: Request): Promise<Response>;
  };
}

const EXEMPT_SUFFIXES = [
  // Preview and version URLs must keep working on their own hostname.
  ".workers.dev",
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

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (!isExempt(url.hostname)) {
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
    }

    return env.ASSETS.fetch(request);
  },
};
