import type { Referencia } from '@/content/types'

export interface CitProps {
  /** One or more reference ids, comma-separated: `id="fase1,exvivo"`. */
  id: string
}

/**
 * Builds a citation component bound to one edição's reference list.
 *
 * Binding at build time (rather than reading a context) keeps `<Cit>` usable
 * from Server Components, which is where all MDX bodies are rendered.
 */
export function criarCit(referencias: Referencia[]) {
  const posicaoPorId = new Map(referencias.map((ref, i) => [ref.id, i + 1]))

  return function Cit({ id }: CitProps) {
    const ids = id.split(',').map((valor) => valor.trim())
    const numeros = ids.map((chave) => posicaoPorId.get(chave)).filter((n): n is number => n != null)

    if (numeros.length === 0) {
      // Loud in development, harmless in production: a typo'd id should be
      // visible while writing rather than silently dropping the citation.
      return (
        <sup
          className="font-sans text-[0.7em] text-[var(--color-accent)]"
          title={`Referência desconhecida: ${id}`}
        >
          [?]
        </sup>
      )
    }

    return (
      <sup className="whitespace-nowrap font-sans text-[0.7em] font-semibold tabular-nums">
        {numeros.map((numero, i) => (
          <span key={numero}>
            {i > 0 && <span className="text-[var(--color-ink-faint)]">,</span>}
            <a
              href={`#ref-${numero}`}
              className="text-[var(--color-accent)] no-underline hover:underline"
              aria-label={`Ver referência ${numero}`}
            >
              {numero}
            </a>
          </span>
        ))}
      </sup>
    )
  }
}
