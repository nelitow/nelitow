import type { MDXComponents } from 'mdx/types'
import { Caixa } from '@/components/journal/Caixa'
import { Figura, Tabela } from '@/components/journal/Figura'

/**
 * Defaults available to every MDX body without an import.
 *
 * Per-edição components that need article-scoped data — `<Cit>`, which has to
 * know that edição's reference list — are passed as a `components` prop where
 * the body is rendered, not registered here.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Caixa,
    Figura,
    Tabela,
    ...components,
  }
}
