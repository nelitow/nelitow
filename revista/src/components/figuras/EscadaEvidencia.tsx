type Estado = 'concluido' | 'andamento' | 'nao-iniciado'

interface Degrau {
  etapa: string
  modelo: string
  mostrou: string
  estado: Estado
  quando: string
}

/**
 * Status styling. Colour never carries the state alone — every row also gets a
 * glyph and a written label, which is the documented mitigation for the
 * sub-3:1 status steps on a light surface.
 */
const ESTADOS: Record<Estado, { rotulo: string; cor: string; glifo: string }> = {
  concluido: { rotulo: 'Concluído', cor: '#0ca30c', glifo: '●' },
  andamento: { rotulo: 'Em andamento', cor: '#fab219', glifo: '◐' },
  'nao-iniciado': { rotulo: 'Não iniciado', cor: 'var(--color-ink-faint)', glifo: '○' },
}

const DEGRAUS: Degrau[] = [
  {
    etapa: 'Modelo animal',
    modelo: 'Camundongo',
    mostrou: 'Recrescimento estatisticamente superior ao do minoxidil.',
    estado: 'concluido',
    quando: '2025',
  },
  {
    etapa: 'Tecido humano fora do corpo',
    modelo: 'Couro cabeludo humano ex vivo (doadores masculinos)',
    mostrou:
      'Inibição da fosforilação de STAT5, anágeno prolongado, proteção de células-tronco K15⁺ e aumento de IGF-1 e FGF7.',
    estado: 'concluido',
    quando: 'dez. 2025',
  },
  {
    etapa: 'Fase 1 — dose única (SAD)',
    modelo: '32 voluntários saudáveis, sem calvície',
    mostrou:
      'Segurança e farmacocinética. Nenhum evento adverso grave; meia-vida estimada em ≥ 65 dias. Não mede cabelo.',
    estado: 'concluido',
    quando: 'jun. 2026',
  },
  {
    etapa: 'Fase 2a — doses múltiplas (MAD)',
    modelo: 'Participantes com alopecia androgenética',
    mostrou:
      'É aqui que a contagem de fios finalmente aparece. Leitura parcial prometida para o 2º semestre de 2026.',
    estado: 'andamento',
    quando: 'em curso',
  },
  {
    etapa: 'Fase 3 — confirmação',
    modelo: 'Centenas a milhares de participantes',
    mostrou: 'Eficácia e segurança em escala, requisito para aprovação regulatória.',
    estado: 'nao-iniciado',
    quando: '—',
  },
]

export function EscadaEvidencia() {
  return (
    <div className="font-sans">
      <ol className="relative space-y-0">
        {DEGRAUS.map((degrau, i) => {
          const estado = ESTADOS[degrau.estado]
          const ultimo = i === DEGRAUS.length - 1

          return (
            <li key={degrau.etapa} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Rail + node */}
              <div className="flex w-4 shrink-0 flex-col items-center">
                <span
                  aria-hidden="true"
                  className="mt-[3px] block text-[0.9375rem] leading-none"
                  style={{ color: estado.cor }}
                >
                  {estado.glifo}
                </span>
                {!ultimo && (
                  <span
                    aria-hidden="true"
                    className="mt-1 w-px flex-1"
                    style={{ backgroundColor: 'var(--color-rule)' }}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {/* A rung label, not a document heading — keeping it a <p>
                      avoids injecting a phantom entry into the article outline. */}
                  <p className="text-[0.875rem] font-semibold">{degrau.etapa}</p>
                  <span
                    className="rounded-sm px-1.5 py-px text-[0.625rem] font-semibold tracking-wide uppercase"
                    style={{
                      color: estado.cor,
                      border: `1px solid ${estado.cor}`,
                    }}
                  >
                    {estado.rotulo}
                  </span>
                  <span className="text-[0.6875rem] text-[var(--color-ink-faint)] tabular-nums">
                    {degrau.quando}
                  </span>
                </div>
                <p className="mt-0.5 text-[0.6875rem] text-[var(--color-ink-faint)] italic">
                  {degrau.modelo}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {degrau.mostrou}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <p
        className="mt-5 border-t pt-3 text-[0.75rem] leading-relaxed text-[var(--color-ink-muted)]"
        style={{ borderColor: 'var(--color-rule)' }}
      >
        <strong className="font-semibold">Leitura da figura:</strong> os três primeiros degraus estão
        cumpridos, mas nenhum deles responde à pergunta que interessa ao paciente. A pergunta
        &ldquo;nasce cabelo em quem está careca?&rdquo; só começa a ser respondida no quarto degrau.
      </p>
    </div>
  )
}
