/**
 * Deno Deploy entry for Awesome DESIGN.md Demo Gallery
 *
 * Deploy with: deployctl deploy --project=awesome-design-md gallery-deno.ts
 * Local dev: deno run --allow-net --allow-read gallery-deno.ts
 */

// All 74 demo directories — hardcoded because Deno Deploy has no readDir
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

const MIME_TYPES: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  css: 'text/css',
  js: 'text/javascript',
  json: 'application/json',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  ico: 'image/x-icon',
  woff2: 'font/woff2',
  woff: 'font/woff',
  ttf: 'font/ttf',
}

function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? ''
  return MIME_TYPES[ext] || 'application/octet-stream'
}

// Preload gallery.html at startup (cached in memory)
let galleryHtml: string | null = null
async function getGalleryHtml(): Promise<string> {
  if (!galleryHtml) {
    galleryHtml = await Deno.readTextFile('./gallery.html')
  }
  return galleryHtml
}

// Serve a static file
async function serveFile(filePath: string): Promise<Response | null> {
  try {
    const content = await Deno.readTextFile(filePath)
    return new Response(content, {
      headers: {
        'Content-Type': getContentType(filePath),
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return null
  }
}

Deno.serve(async (request: Request) => {
  const url = new URL(request.url)
  const path = url.pathname

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // ── API: list all demos ──
  if (path === '/api/demos') {
    const demos = DEMO_DIRS.map(name => ({
      name,
      path: `design-md/${name}/demo.html`,
    }))
    return new Response(JSON.stringify(demos), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // ── Gallery index ──
  if (path === '/' || path === '/index.html') {
    const html = await getGalleryHtml()
    return new Response(html, {
      headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  // ── Static files ──
  // Remove leading slash for file path
  const filePath = `.${path}`
  const fileResp = await serveFile(filePath)
  if (fileResp) return fileResp

  return new Response('Not Found', { status: 404, headers: corsHeaders })
})
