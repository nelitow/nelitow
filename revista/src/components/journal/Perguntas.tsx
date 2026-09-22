import { RefsChave } from '@/components/journal/RefsChave'
import type { Pergunta, Referencia } from '@/content/types'

/**
 * Perguntas com resposta direta e autossuficiente.
 *
 * Cada resposta precisa fazer sentido recortada e lida fora da página — é
 * assim que ela é consumida, tanto por quem chega de busca quanto por um
 * mecanismo que cita um trecho. Por isso nenhuma resposta começa com "sim",
 * "não" ou "como vimos acima": todas repetem o suficiente para se sustentar.
 *
 * Fica só na página-âncora. O mesmo bloco nos três níveis seria conteúdo
 * duplicado em quatro URLs disputando as mesmas buscas.
 */
export function Perguntas({
  perguntas,
  referencias,
}: {
  perguntas: Pergunta[]
  referencias: Referencia[]
}) {
  if (perguntas.length === 0) return null

  const posicao = new Map(referencias.map((ref, i) => [ref.id, i + 1]))

  return (
    <section aria-labelledby="perguntas" className="mt-12">
      <h2
        id="perguntas"
        className="border-b border-[var(--color-ink)] pb-2 text-[1.0625rem] font-semibold"
      >
        Perguntas diretas
      </h2>

      <div className="mt-2 divide-y divide-[var(--color-rule)]">
        {perguntas.map((item) => (
          <article key={item.pergunta} className="py-4">
            <h3 className="text-[1.0625rem] leading-snug font-semibold text-balance">
              {item.pergunta}
            </h3>
            <p className="measure mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
              {item.resposta}
              <RefsChave ids={item.refs} posicao={posicao} />
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
