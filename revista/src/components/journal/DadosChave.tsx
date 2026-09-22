import { RefsChave } from '@/components/journal/RefsChave'
import type { DadoChave, Referencia } from '@/content/types'

/**
 * Tabela de fatos verificáveis.
 *
 * Existe por dois motivos que coincidem. Para o leitor, é o resumo que ele
 * queria antes de decidir ler 2 mil palavras. Para um mecanismo de busca
 * generativo, é a forma mais extraível possível de um fato: rótulo, valor com
 * unidade, ressalva e fonte, sem depender de interpretar o argumento em volta.
 */
export function DadosChave({
  dados,
  referencias,
}: {
  dados: DadoChave[]
  referencias: Referencia[]
}) {
  if (dados.length === 0) return null

  const posicao = new Map(referencias.map((ref, i) => [ref.id, i + 1]))

  return (
    <section aria-labelledby="dados-chave" className="mt-10">
      <h2
        id="dados-chave"
        className="border-b border-[var(--color-ink)] pb-2 text-[1.0625rem] font-semibold"
      >
        Dados-chave
      </h2>

      <dl className="mt-1 divide-y divide-[var(--color-rule)]">
        {dados.map((dado) => (
          <div
            key={dado.rotulo}
            className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]"
          >
            <dt className="font-sans text-[0.8125rem] text-[var(--color-ink-muted)]">
              {dado.rotulo}
            </dt>
            <dd>
              <span className="font-sans text-[0.9375rem] font-semibold text-[var(--color-ink)]">
                {dado.valor}
              </span>
              <RefsChave ids={dado.refs} posicao={posicao} />
              {dado.detalhe && (
                <span className="mt-0.5 block font-sans text-[0.75rem] leading-relaxed text-[var(--color-ink-faint)]">
                  {dado.detalhe}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
