'use client'

import { useEffect, useState } from 'react'

interface Item {
  id: string
  texto: string
  nivel: 2 | 3
}

/**
 * Table of contents built from the rendered article rather than from front
 * matter, so an edição never has to keep a hand-written outline in sync with
 * its own headings.
 *
 * It reads the DOM after paint because the body is authored in MDX and
 * rendered on the server — the headings exist in the markup, not in any data
 * structure this component could be handed.
 */
export function SumarioArtigo({ seletor = '[data-corpo-artigo]' }: { seletor?: string }) {
  const [itens, setItens] = useState<Item[]>([])
  const [ativo, setAtivo] = useState<string | null>(null)

  useEffect(() => {
    const corpo = document.querySelector(seletor)
    if (!corpo) return

    const titulos = Array.from(corpo.querySelectorAll<HTMLHeadingElement>('h2[id], h3[id]'))

    setItens(
      titulos.map((titulo) => ({
        id: titulo.id,
        texto: titulo.textContent ?? '',
        nivel: titulo.tagName === 'H2' ? 2 : 3,
      })),
    )

    if (titulos.length === 0) return

    // Top-biased root margin: a heading counts as "current" once it reaches the
    // upper third of the viewport, which matches where a reader's eye sits.
    const observador = new IntersectionObserver(
      (entradas) => {
        const visiveis = entradas
          .filter((entrada) => entrada.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visiveis[0]) setAtivo(visiveis[0].target.id)
      },
      { rootMargin: '-80px 0px -66% 0px', threshold: 0 },
    )

    titulos.forEach((titulo) => observador.observe(titulo))
    return () => observador.disconnect()
  }, [seletor])

  if (itens.length < 3) return null

  return (
    <nav aria-label="Sumário" className="font-sans">
      <p className="label mb-2">Nesta edição</p>
      <ol className="space-y-1.5 border-s border-[var(--color-rule)]">
        {itens.map((item) => {
          const selecionado = item.id === ativo

          return (
            <li key={item.id} style={{ paddingInlineStart: item.nivel === 3 ? '1.5rem' : '0.75rem' }}>
              <a
                href={`#${item.id}`}
                aria-current={selecionado ? 'location' : undefined}
                className="block border-s-2 py-0.5 ps-2 text-[0.75rem] leading-snug no-underline transition-colors"
                style={{
                  marginInlineStart: item.nivel === 3 ? '-1.5rem' : '-0.75rem',
                  paddingInlineStart: item.nivel === 3 ? '1.5rem' : '0.75rem',
                  borderColor: selecionado ? 'var(--color-accent)' : 'transparent',
                  color: selecionado ? 'var(--color-ink)' : 'var(--color-ink-faint)',
                  fontWeight: selecionado ? 600 : 400,
                }}
              >
                {item.texto}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
