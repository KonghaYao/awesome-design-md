/**
 * Cloudflare Workers entry for Awesome DESIGN.md Demo Gallery
 * 
 * Deploy with: npx wrangler deploy
 * Requirements: Workers Static Assets (wrangler.toml [assets] config)
 */

// All 74 demo directories — hardcoded because Workers has no filesystem access
const DEMO_DIRS = [
  'airbnb', 'airtable', 'apple', 'binance', 'bmw', 'bmw-m', 'bugatti',
  'cal', 'claude', 'clay', 'clickhouse', 'cohere', 'coinbase', 'composio',
  'cursor', 'dell-1996', 'elevenlabs', 'expo', 'ferrari', 'figma',
  'framer', 'hashicorp', 'hp', 'ibm', 'intercom', 'kraken', 'lamborghini',
  'linear.app', 'lovable', 'mastercard', 'meta', 'minimax', 'mintlify',
  'miro', 'mistral.ai', 'mongodb', 'nike', 'nintendo-2001', 'notion',
  'nvidia', 'ollama', 'opencode.ai', 'pinterest', 'playstation', 'posthog',
  'raycast', 'renault', 'replicate', 'resend', 'revolut', 'runwayml',
  'sanity', 'sentry', 'shopify', 'slack', 'spacex', 'spotify', 'starbucks',
  'stripe', 'supabase', 'superhuman', 'tesla', 'theverge', 'together.ai',
  'uber', 'vercel', 'vodafone', 'voltagent', 'warp', 'webflow', 'wired',
  'wise', 'x.ai', 'zapier',
].sort()

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    // ── API: list all demos ──
    if (path === '/api/demos') {
      const demos = DEMO_DIRS.map(name => ({
        name,
        path: `design-md/${name}/demo.html`,
      }))
      return new Response(JSON.stringify(demos), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // ── Gallery index ──
    if (path === '/' || path === '/index.html') {
      // Fetch gallery.html from the static assets bucket
      const assetReq = new Request(new URL('/gallery.html', url.origin), request)
      const assetResp = await env.ASSETS.fetch(assetReq)
      const headers = new Headers(assetResp.headers)
      headers.set('Access-Control-Allow-Origin', '*')
      headers.set('Content-Type', 'text/html; charset=utf-8')
      return new Response(assetResp.body, { headers })
    }

    // ── Static assets (demo pages, etc.) ──
    try {
      const resp = await env.ASSETS.fetch(request)
      const headers = new Headers(resp.headers)
      headers.set('Access-Control-Allow-Origin', '*')
      return new Response(resp.body, { headers })
    } catch {
      return new Response('Not Found', { status: 404, headers: CORS_HEADERS })
    }
  },
}
