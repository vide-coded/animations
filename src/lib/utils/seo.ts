/**
 * SEO Utilities
 * Manages dynamic meta tags, Open Graph, and Twitter Card metadata
 */

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image'
  canonicalUrl?: string
  noindex?: boolean
}

const DEFAULT_SEO: SEOConfig = {
  title: 'Brain-Rot - Canvas Animation Gallery',
  description:
    'Explore mesmerizing canvas animations. A collection of interactive particle systems, waves, geometric patterns, and glitch effects.',
  keywords: ['canvas', 'animation', 'javascript', 'particles', 'webgl', 'creative coding'],
  ogImage: '/og-image.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
}

/**
 * Update document meta tags dynamically
 */
export function updateMetaTags(config: Partial<SEOConfig>) {
  const seo = { ...DEFAULT_SEO, ...config }

  // Update title
  document.title = seo.title

  // Update or create meta tags
  updateMeta('description', seo.description)

  if (seo.keywords && seo.keywords.length > 0) {
    updateMeta('keywords', seo.keywords.join(', '))
  }

  // Open Graph tags
  updateMetaProperty('og:title', seo.title)
  updateMetaProperty('og:description', seo.description)
  updateMetaProperty('og:type', seo.ogType || 'website')

  if (seo.ogImage) {
    updateMetaProperty('og:image', getAbsoluteUrl(seo.ogImage))
    updateMetaProperty('og:image:width', '1200')
    updateMetaProperty('og:image:height', '630')
  }

  if (seo.canonicalUrl) {
    updateMetaProperty('og:url', seo.canonicalUrl)
    updateLink('canonical', seo.canonicalUrl)
  } else {
    updateMetaProperty('og:url', window.location.href)
  }

  // Twitter Card tags
  updateMeta('twitter:card', seo.twitterCard || 'summary_large_image')
  updateMeta('twitter:title', seo.title)
  updateMeta('twitter:description', seo.description)

  if (seo.ogImage) {
    updateMeta('twitter:image', getAbsoluteUrl(seo.ogImage))
  }

  // Robots meta
  if (seo.noindex) {
    updateMeta('robots', 'noindex, nofollow')
  } else {
    updateMeta('robots', 'index, follow')
  }
}

/**
 * Update or create a meta tag with name attribute
 */
function updateMeta(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`)

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', name)
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}

/**
 * Update or create a meta tag with property attribute (for Open Graph)
 */
function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`)

  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('property', property)
    document.head.appendChild(meta)
  }

  meta.setAttribute('content', content)
}

/**
 * Update or create a link tag
 */
function updateLink(rel: string, href: string) {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement

  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', rel)
    document.head.appendChild(link)
  }

  link.setAttribute('href', href)
}

/**
 * Convert relative URL to absolute URL
 */
function getAbsoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const origin = window.location.origin
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Generate SEO config for animation detail page
 */
export function getAnimationSEO(
  animationId: string,
  animationName: string,
  category: string
): SEOConfig {
  return {
    title: `${animationName} - Canvas Animation | Brain-Rot`,
    description: `Explore the ${animationName} animation - a mesmerizing ${category} effect created with HTML5 Canvas. Interactive, customizable, and visually stunning.`,
    keywords: [
      'canvas animation',
      animationName.toLowerCase(),
      category,
      'javascript',
      'creative coding',
      'interactive art',
    ],
    ogImage: `/animations/${animationId}/og-image.png`,
    ogType: 'article',
    twitterCard: 'summary_large_image',
  }
}

/**
 * Generate SEO config for favorites page
 */
export function getFavoritesSEO(count: number): SEOConfig {
  return {
    title: `My Favorites (${count}) - Canvas Animation Gallery`,
    description: `Your collection of ${count} favorite canvas animations. Save, organize, and revisit your most loved interactive visual effects.`,
    keywords: ['favorites', 'saved animations', 'canvas gallery', 'animation collection'],
    ogType: 'website',
  }
}

/**
 * Generate structured data (JSON-LD) for rich search results
 */
export function generateStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Brain-Rot Canvas Animation Gallery',
    description:
      'A collection of mesmerizing canvas animations including particle systems, waves, geometric patterns, and glitch effects.',
    url: window.location.origin,
    applicationCategory: 'DesignApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Brain-Rot',
    },
  }

  // Remove existing structured data
  const existing = document.querySelector('script[type="application/ld+json"]')
  if (existing) {
    existing.remove()
  }

  // Add new structured data
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(structuredData)
  document.head.appendChild(script)
}
