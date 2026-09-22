'use client'

import { useState } from 'react'

/**
 * Hairline progress bar pinned under the masthead.
 *
 * Uses React 19's cleanup-returning ref callback: the listener is attached when
 * the article element mounts and torn down when it unmounts, with no effect and
 * no separate ref object. Swapping reading levels remounts the article, so the
 * listener follows the element it actually measures.
 */
export function ProgressoLeitura() {
  const [progresso, setProgresso] = useState(0)

  function medir(alvo: HTMLElement) {
    const topo = alvo.offsetTop
    const altura = alvo.offsetHeight
    const percorrido = window.scrollY + window.innerHeight - topo
    setProgresso(Math.max(0, Math.min(1, percorrido / altura)))
  }

  return (
    <>
      <div
        ref={(node) => {
          if (!node) return
          const artigo = node.closest('article') ?? document.querySelector('article')
          if (!(artigo instanceof HTMLElement)) return

          const aoRolar = () => medir(artigo)
          aoRolar()

          window.addEventListener('scroll', aoRolar, { passive: true })
          window.addEventListener('resize', aoRolar)

          // React 19: returning a function from a ref callback is the cleanup.
          return () => {
            window.removeEventListener('scroll', aoRolar)
            window.removeEventListener('resize', aoRolar)
          }
        }}
        hidden
      />

      <div
        className="fixed inset-x-0 top-[52px] z-30 h-px"
        aria-hidden="true"
        style={{ backgroundColor: 'transparent' }}
      >
        <div
          className="h-px origin-left transition-transform duration-150 ease-out"
          style={{
            backgroundColor: 'var(--color-accent)',
            transform: `scaleX(${progresso})`,
          }}
        />
      </div>
    </>
  )
}
