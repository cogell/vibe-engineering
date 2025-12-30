/**
 * Cloudflare Worker entry point
 *
 * This Worker serves static assets from the [assets] binding.
 * The actual static file serving is handled by Cloudflare's asset
 * system - this code just delegates to it.
 *
 * For SPAs, the not_found_handling = "single-page-application" in
 * wrangler.toml ensures that unknown routes return index.html,
 * allowing client-side routing to work.
 */

interface Env {
  ASSETS: Fetcher
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Delegate to the ASSETS binding
    // This handles all static file serving including:
    // - index.html
    // - /assets/*.js (bundled JS)
    // - /assets/*.css (bundled CSS)
    // - Any other static files in public/
    return env.ASSETS.fetch(request)
  },
}
