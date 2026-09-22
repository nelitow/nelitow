import Link from 'next/link'
import type { Edicao } from '@/content/types'
import { dataCurta } from '@/lib/format'

/**
 * Edições que compartilham palavras-chave com a atual.
 *
 * Links internos entre edições do mesmo assunto são o que transforma uma
 * sequência de posts diários num conjunto navegável — para o leitor e para
 * qualquer rastreador que precise entender do que o site trata.
 */
export function Relacionadas({ edicoes, titulo = 'Relacionadas' }: { edicoes: Edicao[]; titulo?: string }) {
  if (edicoes.length === 0) return null

  return (
    <section aria-labelledby="relacionadas" className="mt-12">
      <h2 id="relacionadas" className="label mb-3">
        {titulo}
      </h2>
      <ul className="divide-y divide-[var(--color-rule)]">
        {edicoes.map(({ meta }) => (
          <li key={meta.slug} className="py-3">
            <div className="flex flex-wrap items-baseline gap-x-3 font-sans text-[0.6875rem] text-[var(--color-ink-faint)]">
              <span className="tracking-[0.14em] text-[var(--color-accent)] uppercase">
                {meta.secao}
              </span>
              <time dateTime={meta.publicadoEm}>{dataCurta(meta.publicadoEm)}</time>
            </div>
            <h3 className="mt-0.5 text-[0.9375rem] leading-snug font-semibold">
              <Link
                href={`/edicao/${meta.slug}`}
                className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)]"
              >
                {meta.titulo}
              </Link>
            </h3>
          </li>
        ))}
      </ul>
    </section>
  )
}
