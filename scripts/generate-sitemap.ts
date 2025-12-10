/**
 * Sitemap Generator
 * Generates sitemap.xml for SEO
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITE_URL = 'https://brain-rot.vercel.app'

// Define all static routes
const staticRoutes = [
  {
    path: '/',
    priority: 1.0,
    changefreq: 'daily',
  },
  {
    path: '/favorites',
    priority: 0.8,
    changefreq: 'weekly',
  },
]

/**
 * Generate sitemap XML
 */
function generateSitemap(): string {
  const timestamp = new Date().toISOString()

  const urls = staticRoutes
    .map(
      (route) => `
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${timestamp}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`
}

/**
 * Generate robots.txt
 */
function generateRobotsTxt(): string {
  return `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml`
}

/**
 * Main execution
 */
function main() {
  const distDir = path.join(__dirname, '..', '..', 'dist')
  const publicDir = path.join(__dirname, '..', '..', 'public')

  // Create public directory if it doesn't exist
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  // Generate sitemap.xml
  const sitemap = generateSitemap()
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap)
  console.log('✅ Generated sitemap.xml')

  // Generate robots.txt
  const robotsTxt = generateRobotsTxt()
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt)
  console.log('✅ Generated robots.txt')

  // Copy to dist if it exists (for production builds)
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)
    fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt)
    console.log('✅ Copied to dist/')
  }

  console.log(`\n📍 Sitemap URL: ${SITE_URL}/sitemap.xml`)
  console.log(`🤖 Robots.txt URL: ${SITE_URL}/robots.txt`)
}

main()
