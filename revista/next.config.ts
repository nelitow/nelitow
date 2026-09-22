import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // .mdx counts as a source extension so edições can be authored as Markdown.
  pageExtensions: ['ts', 'tsx', 'mdx'],

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

export default withMDX(nextConfig)
