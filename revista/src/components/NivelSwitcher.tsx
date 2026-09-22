'use client'

import { useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { NIVEIS, NIVEL_INFO, type Nivel } from '@/content/types'
import { lembrarNivel } from '@/lib/preferencia-nivel'

interface Props {
  slug: string
  nivelAtual: Nivel
  tempoLeitura: Record<Nivel, number>
}

/**
 * The switcher that defines the publication: one subject, three depths.
 *
 * React 19's `useOptimistic` paints the destination level as selected the
 * instant it is clicked, while the router transition streams the new server
 * component in. Without it, the control would sit visually frozen on the old
 * level for the whole navigation — the exact interaction that makes a site
 * feel broken.
 */
export function NivelSwitcher({ slug, nivelAtual, tempoLeitura }: Props) {
  const router = useRouter()
  const [pendente, iniciarTransicao] = useTransition()
  const [nivelOtimista, definirOtimista] = useOptimistic(nivelAtual)

  function trocar(alvo: Nivel) {
    if (alvo === nivelAtual) return

    iniciarTransicao(async () => {
      definirOtimista(alvo)
      // Remembered so the next edição opens at the reader's usual depth.
      lembrarNivel(alvo)
      router.push(`/edicao/${slug}/${alvo}`, { scroll: false })
    })
  }

  const info = NIVEL_INFO[nivelOtimista]

  return (
    <div className="not-prose">
      <div className="flex items-baseline justify-between gap-3">
        <p className="label">Nível de leitura</p>
        <p
          className="font-sans text-[0.6875rem] text-[var(--color-ink-faint)] transition-opacity"
          style={{ opacity: pendente ? 1 : 0 }}
          aria-hidden={!pendente}
        >
          carregando…
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Escolha a profundidade do texto"
        className="mt-2 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-[var(--color-rule-strong)] bg-[var(--color-rule)]"
      >
        {NIVEIS.map((nivel) => {
          const dados = NIVEL_INFO[nivel]
          const ativo = nivel === nivelOtimista

          return (
            <button
              key={nivel}
              type="button"
              role="tab"
              aria-selected={ativo}
              onClick={() => trocar(nivel)}
              className="group flex flex-col items-center gap-0.5 px-2 py-2.5 font-sans transition-colors"
              style={{
                backgroundColor: ativo ? dados.corSuave : 'var(--color-paper)',
                color: ativo ? dados.cor : 'var(--color-ink-muted)',
              }}
            >
              <span className="text-[0.625rem] font-semibold tracking-[0.12em] opacity-70">
                {dados.ordinal}
              </span>
              <span className="text-[0.8125rem] font-semibold">{dados.rotulo}</span>
              <span className="text-[0.625rem] tabular-nums opacity-70">
                {tempoLeitura[nivel]} min
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-2.5 font-sans text-[0.75rem] leading-relaxed text-[var(--color-ink-muted)]">
        <span className="font-semibold" style={{ color: info.cor }}>
          {info.publico}.
        </span>{' '}
        {info.descricao}
      </p>
    </div>
  )
}
