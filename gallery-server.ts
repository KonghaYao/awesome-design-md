import { readdir, stat } from 'node:fs/promises'
import { join, extname } from 'node:path'

const PORT = 3456
const DESIGN_MD_DIR = './design-md'

async function scanDemos(): Promise<{ name: string; path: string }[]> {
  const entries = await readdir(DESIGN_MD_DIR, { withFileTypes: true })
  const demos: { name: string; path: string }[] = []

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const demoPath = join(DESIGN_MD_DIR, entry.name, 'demo.html')
      try {
        const s = await stat(demoPath)
        if (s.isFile()) {
          demos.push({ name: entry.name, path: `design-md/${entry.name}/demo.html` })
        }
      } catch {
        // no demo.html in this directory
      }
    }
  }

  demos.sort((a, b) => a.name.localeCompare(b.name))
  return demos
}

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
  const ext = extname(filePath).slice(1).toLowerCase()
  return MIME_TYPES[ext] || 'application/octet-stream'
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url)
    const pathname = url.pathname

    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    // API: list all demos
    if (pathname === '/api/demos') {
      const demos = await scanDemos()
      return new Response(JSON.stringify(demos), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Gallery index page
    if (pathname === '/' || pathname === '/index.html') {
      const galleryHtml = await Bun.file('gallery.html').text()
      return new Response(galleryHtml, {
        headers: { ...corsHeaders, 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    // Static files
    const filePath = `.${pathname}`
    const file = Bun.file(filePath)
    if (await file.exists()) {
      return new Response(file, {
        headers: { ...corsHeaders, 'Content-Type': getContentType(pathname) },
      })
    }

    return new Response('Not Found', { status: 404, headers: corsHeaders })
  },
})

console.log(`🎨 Demo Gallery running at http://localhost:${PORT}`)
console.log(`📦 ${(await scanDemos()).length} demos available`)
