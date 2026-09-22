import createMDX from '@next/mdx'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // .mdx counts as a source extension so edições can be authored as Markdown.
  pageExtensions: ['ts', 'tsx', 'mdx'],

  // Exigido pelo adapter OpenNext, que monta o Worker a partir de
  // `.next/standalone`. É aditivo: `next start` continua funcionando igual.
  output: 'standalone',

  // React Compiler (stable in React 19): auto-memoises components so we do not
  // litter the codebase with useMemo/useCallback.
  reactCompiler: true,
}

const withMDX = createMDX({
  options: {
    // Turbopack passes loader options across a worker boundary, so plugins are
    // named rather than imported — an imported function is not serialisable.
    remarkPlugins: [['remark-gfm', {}]],
    // Stable ids on headings so the table of contents can link to them.
    rehypePlugins: [['rehype-slug', {}]],
  },
})

// Dá ao `next dev` acesso aos bindings declarados no wrangler.jsonc — é o que
// faz o D1 local funcionar durante o desenvolvimento, sem subir um Worker.
initOpenNextCloudflareForDev()

export default withMDX(nextConfig)
