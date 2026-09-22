import type { Referencia } from '@/content/types'

const TIPO_ROTULO: Record<Referencia['tipo'], string> = {
  primaria: 'fonte primária',
  secundaria: 'cobertura',
  literatura: 'literatura',
  registro: 'registro de ensaio',
}

export function Referencias({ referencias }: { referencias: Referencia[] }) {
  if (referencias.length === 0) return null

  return (
    <section aria-labelledby="referencias-titulo" className="mt-14">
      <h2
        id="referencias-titulo"
        className="border-b border-[var(--color-ink)] pb-2 text-[1.0625rem] font-semibold"
      >
        Referências
      </h2>

      <ol className="mt-4 space-y-3">
        {referencias.map((ref, i) => (
          <li
            key={ref.id}
            id={`ref-${i + 1}`}
            className="flex scroll-mt-24 gap-3 font-sans text-[0.8125rem] leading-relaxed target:bg-[var(--color-accent-soft)]"
          >
            <span className="w-6 shrink-0 text-end font-semibold text-[var(--color-ink-faint)] tabular-nums">
              {i + 1}.
            </span>
            <span className="min-w-0">
              <span className="text-[var(--color-ink-muted)]">{ref.autores}. </span>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-ink)] underline decoration-[var(--color-rule-strong)] underline-offset-2 hover:decoration-[var(--color-accent)]"
              >
                {ref.titulo}
              </a>
              <span className="text-[var(--color-ink-muted)]">
                {' '}
                — <em>{ref.veiculo}</em>, {ref.data}.
              </span>
              <span className="ms-1.5 rounded-sm border border-[var(--color-rule)] px-1 py-px text-[0.625rem] tracking-wide text-[var(--color-ink-faint)] uppercase">
                {TIPO_ROTULO[ref.tipo]}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** Journal-style end matter: how to cite, funding, conflicts. */
export function NotasEditoriais({
  identificadorEdicao,
  url,
  titulo,
  publicadoEm,
}: {
  identificadorEdicao: string
  url: string
  titulo: string
  publicadoEm: string
}) {
  const ano = publicadoEm.slice(0, 4)

  return (
    <section className="mt-12 grid gap-6 border-t border-[var(--color-rule)] pt-6 sm:grid-cols-2">
      <div>
        <h3 className="label mb-1.5">Como citar</h3>
        <p className="font-sans text-[0.75rem] leading-relaxed text-[var(--color-ink-muted)]">
          Redação Ensaio Aberto. {titulo}. <em>Ensaio Aberto</em>, {ano}.{' '}
          <code className="font-mono text-[0.6875rem] break-all">{identificadorEdicao}</code>.
          Disponível em: {url}
        </p>
      </div>

      <div>
        <h3 className="label mb-1.5">Conflitos e financiamento</h3>
        <p className="font-sans text-[0.75rem] leading-relaxed text-[var(--color-ink-muted)]">
          Publicação independente, sem financiamento de terceiros e sem vínculo com nenhuma das
          empresas citadas. Não há posição financeira nos ativos mencionados. Este texto é
          divulgação científica e não constitui orientação médica nem recomendação de investimento.
        </p>
      </div>
    </section>
  )
}
