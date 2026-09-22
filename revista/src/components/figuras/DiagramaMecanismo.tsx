import type { ReactNode } from 'react'

/**
 * Figura 1 — the two pathways that shorten anagen, side by side.
 *
 * Built from CSS grid + HTML boxes rather than a fixed-coordinate SVG so the
 * Portuguese labels wrap naturally and the whole thing collapses to one column
 * on a phone. Only the connector glyphs are SVG.
 */

function Caixa({
  children,
  tom = 'neutro',
  nota,
}: {
  children: ReactNode
  tom?: 'neutro' | 'androgenica' | 'prolactina' | 'desfecho'
  nota?: string
}) {
  const tons = {
    neutro: {
      borda: 'var(--color-rule-strong)',
      fundo: 'var(--color-paper)',
      texto: 'var(--color-ink)',
    },
    androgenica: {
      borda: 'var(--color-intermediario)',
      fundo: 'var(--color-intermediario-soft)',
      texto: 'var(--color-ink)',
    },
    prolactina: {
      borda: 'var(--color-especialista)',
      fundo: 'var(--color-especialista-soft)',
      texto: 'var(--color-ink)',
    },
    desfecho: {
      borda: 'var(--color-ink)',
      fundo: 'var(--color-paper-sunken)',
      texto: 'var(--color-ink)',
    },
  }[tom]

  return (
    <div
      className="rounded-sm border px-3 py-2 text-center"
      style={{ borderColor: tons.borda, backgroundColor: tons.fundo, color: tons.texto }}
    >
      <p className="font-sans text-[0.8125rem] leading-snug font-medium">{children}</p>
      {nota && (
        <p className="mt-0.5 font-sans text-[0.6875rem] leading-snug text-[var(--color-ink-faint)]">
          {nota}
        </p>
      )}
    </div>
  )
}

/** Downward arrow, optionally carrying the name of the step it represents. */
function Seta({ rotulo }: { rotulo?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      {rotulo && (
        <span className="font-sans text-[0.6875rem] text-[var(--color-ink-faint)] italic">
          {rotulo}
        </span>
      )}
      <svg width="10" height="22" viewBox="0 0 10 22" aria-hidden="true" className="shrink-0">
        <path
          d="M5 0 V16"
          stroke="var(--color-rule-strong)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M5 21 L1 14 H9 Z" fill="var(--color-rule-strong)" />
      </svg>
    </div>
  )
}

/**
 * Inhibition glyph — the flat-headed "⊣" that pharmacology uses for a blocker,
 * deliberately distinct from the pointed arrowhead of an activating step.
 */
function Inibicao({ droga, cor, aprovado }: { droga: string; cor: string; aprovado: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1">
      <span
        className="rounded-sm border px-2 py-0.5 font-sans text-[0.6875rem] font-semibold"
        style={{ color: cor, borderColor: cor }}
      >
        {droga}
        <span className="ms-1 font-normal text-[var(--color-ink-faint)]">
          {aprovado ? 'aprovado' : 'investigacional'}
        </span>
      </span>
      <svg width="34" height="14" viewBox="0 0 34 14" aria-hidden="true" className="shrink-0">
        <path d="M0 7 H24" stroke={cor} strokeWidth="1.5" strokeLinecap="round" />
        {/* Flat head = inhibition, not activation. */}
        <path d="M27 1 V13" stroke={cor} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function TituloColuna({ children, sub, cor }: { children: ReactNode; sub: string; cor: string }) {
  return (
    <div className="mb-3 border-b pb-2" style={{ borderColor: cor }}>
      <p className="label" style={{ color: cor }}>
        {children}
      </p>
      <p className="mt-1 font-sans text-[0.6875rem] text-[var(--color-ink-faint)]">{sub}</p>
    </div>
  )
}

export function DiagramaMecanismo() {
  return (
    <div className="font-sans">
      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
        {/* --- Established androgen pathway --- */}
        <div>
          <TituloColuna sub="Alvo de todos os tratamentos aprovados" cor="var(--color-intermediario)">
            Via androgênica
          </TituloColuna>
          <Caixa tom="androgenica">Testosterona</Caixa>
          <Inibicao droga="finasterida" cor="var(--color-intermediario)" aprovado />
          <Seta rotulo="5α-redutase" />
          <Caixa tom="androgenica">DHT</Caixa>
          <Seta />
          <Caixa tom="neutro" nota="receptor de andrógeno">
            Sinalização na papila dérmica
          </Caixa>
          <Seta />
          <Caixa tom="neutro">Encurtamento progressivo do anágeno</Caixa>
        </div>

        {/* --- Investigational prolactin pathway --- */}
        <div>
          <TituloColuna sub="Alvo do ABS-201 — ainda sem eficácia comprovada" cor="var(--color-especialista)">
            Via da prolactina
          </TituloColuna>
          <Caixa tom="prolactina" nota="produzida também no próprio folículo">
            Prolactina (PRL)
          </Caixa>
          <Inibicao droga="ABS-201" cor="var(--color-especialista)" aprovado={false} />
          <Seta />
          <Caixa tom="prolactina">Receptor de prolactina (PRLR)</Caixa>
          <Seta rotulo="fosforilação" />
          <Caixa tom="neutro">STAT5-P</Caixa>
          <Seta />
          <Caixa tom="neutro" nota="apoptose de células-tronco K15⁺ no bulge">
            Entrada precoce em catágeno
          </Caixa>
        </div>
      </div>

      {/* --- Shared downstream outcome --- */}
      <div className="mt-2 flex justify-center">
        <svg width="240" height="30" viewBox="0 0 240 30" aria-hidden="true" className="max-w-full">
          <path
            d="M30 0 V12 Q30 20 44 20 H196 Q210 20 210 12 V0"
            stroke="var(--color-rule-strong)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M120 20 V24"
            stroke="var(--color-rule-strong)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path d="M120 30 L116 23 H124 Z" fill="var(--color-rule-strong)" />
        </svg>
      </div>

      <div className="mx-auto max-w-md">
        <Caixa tom="desfecho" nota="o fio fica mais fino, mais curto e mais claro a cada ciclo">
          Miniaturização: fio terminal → fio velo
        </Caixa>
      </div>
    </div>
  )
}
