import type { ReactNode } from 'react'

export interface FiguraProps {
  legenda: ReactNode
  /** Source note rendered after the caption, in the journal's smaller face. */
  fonte?: ReactNode
  /** Removes the frame for figures that already carry their own border. */
  semMoldura?: boolean
  children: ReactNode
}

/**
 * Numbered figure. The "Figura N." prefix comes from a CSS counter in
 * globals.css, so inserting a figure mid-article renumbers the rest for free.
 */
export function Figura({ legenda, fonte, semMoldura = false, children }: FiguraProps) {
  return (
    <figure className="figura my-8">
      <div
        className={
          semMoldura
            ? ''
            : 'rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] p-4 sm:p-6'
        }
      >
        {children}
      </div>
      <figcaption className="mt-3 font-sans text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
        {legenda}
        {fonte && (
          <span className="mt-1 block text-[var(--color-ink-faint)] italic">Fonte: {fonte}</span>
        )}
      </figcaption>
    </figure>
  )
}

export interface TabelaProps {
  legenda: ReactNode
  fonte?: ReactNode
  children: ReactNode
}

/** Numbered table. Caption sits above the table, as journals set it. */
export function Tabela({ legenda, fonte, children }: TabelaProps) {
  return (
    <figure className="tabela my-8">
      <figcaption className="mb-3 font-sans text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
        {legenda}
      </figcaption>
      <div className="overflow-x-auto">{children}</div>
      {fonte && (
        <p className="mt-2 font-sans text-[0.75rem] text-[var(--color-ink-faint)] italic">
          Fonte: {fonte}
        </p>
      )}
    </figure>
  )
}
