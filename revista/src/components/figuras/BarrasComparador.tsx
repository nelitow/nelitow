interface Comparador {
  nome: string
  classe: string
  valor: number | null
  /** What the number is measured against — the whole point of this figure. */
  base: string
  detalhe: string
}

const COMPARADORES: Comparador[] = [
  {
    nome: 'Minoxidil 5% tópico',
    classe: 'Abridor de canais de potássio',
    valor: 18.6,
    base: 'vs. basal',
    detalhe: 'fios não-velo/cm²',
  },
  {
    nome: 'Finasterida 1 mg/dia',
    classe: 'Inibidor da 5α-redutase',
    valor: 17.3,
    base: 'vs. placebo',
    detalhe: 'fios totais/cm², 48 semanas, vértex',
  },
  {
    nome: 'HMI-115',
    classe: 'Anticorpo anti-PRLR (Fase 1b)',
    valor: 14.0,
    base: 'vs. basal',
    detalhe: 'fios não-velo/cm², homens com AGA',
  },
  {
    nome: 'ABS-201',
    classe: 'Anticorpo anti-PRLR (Fase 1/2a)',
    valor: null,
    base: '—',
    detalhe: 'nenhuma contagem de fios publicada até 22 set. 2026',
  },
]

const MAX = 20

/**
 * Figura 4 — one measure (hair count gain) across four treatments, so every
 * bar takes the SAME hue. Colour would be encoding nothing here; the y-axis
 * labels already carry identity.
 *
 * The bars are deliberately NOT a head-to-head: the comparison bases differ
 * (vs. placebo vs. vs. baseline) and so do the outcome definitions. That
 * mismatch is printed on each bar rather than hidden in the caption.
 */
export function BarrasComparador() {
  return (
    <div className="font-sans">
      <div className="space-y-4">
        {COMPARADORES.map((item) => {
          const semDados = item.valor == null

          return (
            <div key={item.nome}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3">
                <span className="text-[0.8125rem] font-semibold">{item.nome}</span>
                <span className="text-[0.6875rem] text-[var(--color-ink-faint)]">{item.classe}</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Track is a faint tint of the ink rather than a solid fill, so
                    it reads as an empty scale and not as a second data bar. */}
                <div
                  className="h-5 flex-1 rounded-[2px]"
                  style={{ backgroundColor: 'color-mix(in oklab, var(--color-ink) 8%, transparent)' }}
                >
                  {semDados ? (
                    <div
                      className="flex h-5 items-center rounded-[2px] border border-dashed px-2"
                      style={{
                        width: '100%',
                        borderColor: 'var(--color-ink-faint)',
                      }}
                    >
                      <span className="text-[0.6875rem] text-[var(--color-ink-faint)] italic">
                        sem dados de eficácia em humanos
                      </span>
                    </div>
                  ) : (
                    <div
                      className="h-5 rounded-e-[4px]"
                      style={{
                        width: `${((item.valor ?? 0) / MAX) * 100}%`,
                        backgroundColor: 'var(--cor-barra)',
                      }}
                    />
                  )}
                </div>

                <span
                  className="w-24 shrink-0 text-end text-[0.8125rem] font-semibold tabular-nums"
                  style={{ color: semDados ? 'var(--color-ink-faint)' : 'var(--color-ink)' }}
                >
                  {semDados ? 'n/d' : `+${item.valor?.toFixed(1).replace('.', ',')}`}
                  <span className="ms-1 font-normal text-[0.6875rem] text-[var(--color-ink-faint)]">
                    {item.base}
                  </span>
                </span>
              </div>

              <p className="mt-1 text-[0.6875rem] text-[var(--color-ink-faint)]">{item.detalhe}</p>
            </div>
          )
        })}
      </div>

      <p
        className="mt-5 border-t pt-3 text-[0.75rem] leading-relaxed text-[var(--color-ink-muted)]"
        style={{ borderColor: 'var(--color-rule)' }}
      >
        <strong className="font-semibold">Isto não é uma comparação direta.</strong> Os números vêm de
        estudos diferentes, com populações, durações e definições de desfecho diferentes — e, o mais
        importante, com <em>bases</em> diferentes: o ganho da finasterida é líquido sobre o placebo,
        enquanto os demais são medidos contra o próprio valor inicial do participante. Ganhos contra
        o basal tendem a parecer maiores porque incorporam o efeito placebo e a variação sazonal.
      </p>

      <style>{`
        :root { --cor-barra: #2a78d6; }
        [data-theme='dark'] { --cor-barra: #3987e5; }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme='light']) { --cor-barra: #3987e5; }
        }
      `}</style>
    </div>
  )
}
