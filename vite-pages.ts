import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import type { Plugin } from 'vite'
import { notFoundPage, publicPages, siteOrigin } from './src/content/pages.ts'

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

export function publicPageFiles(): Plugin {
  let root: string
  let output: string

  return {
    name: 'public-page-files',
    apply: 'build',
    configResolved(config) {
      root = config.root
      output = resolve(root, config.build.outDir)
    },
    closeBundle() {
      const template = readFileSync(resolve(output, 'index.html'), 'utf8')
      const image = `${siteOrigin}/social-preview.png`

      function writePage(file: string, page: typeof notFoundPage, url?: string) {
        const title = escapeHtml(page.title)
        const description = escapeHtml(page.description)
        const metadata = url ? [
          `<link rel="canonical" href="${url}" />`,
          '<meta property="og:type" content="website" />',
          '<meta property="og:site_name" content="Core Eye Group" />',
          `<meta property="og:url" content="${url}" />`,
          `<meta property="og:title" content="${title}" />`,
          `<meta property="og:description" content="${description}" />`,
          `<meta property="og:image" content="${image}" />`,
          '<meta property="og:image:alt" content="Core Eye Group emblem" />',
          '<meta name="twitter:card" content="summary_large_image" />',
        ] : ['<meta name="robots" content="noindex" />']
        const location = resolve(output, file)
        mkdirSync(dirname(location), { recursive: true })
        writeFileSync(location, template
          .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
          .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
          .replace('</head>', `${metadata.join('\n    ')}\n  </head>`))
      }

      for (const page of publicPages) {
        writePage(`${page.path.slice(1)}index.html`, page, siteOrigin + page.path)
      }
      writePage('404.html', notFoundPage)
      writeFileSync(resolve(output, 'robots.txt'), `Sitemap: ${siteOrigin}/sitemap.xml\n`)
      copyFileSync(resolve(root, 'src/assets/core-eye-master-logo.png'), resolve(output, 'social-preview.png'))
      const urls = publicPages.map(page => `  <url><loc>${siteOrigin}${page.path}</loc></url>`)
      writeFileSync(resolve(output, 'sitemap.xml'), [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
        '',
      ].join('\n'))
    },
  }
}
