'use client'

import { useEffect, useState } from 'react'

type Tema = 'light' | 'dark' | 'auto'

const PROXIMO: Record<Tema, Tema> = { auto: 'light', light: 'dark', dark: 'auto' }

const ROTULO: Record<Tema, string> = {
  auto: 'Tema: automático',
  light: 'Tema: claro',
  dark: 'Tema: escuro',
}

function aplicar(tema: Tema) {
  const raiz = document.documentElement
  if (tema === 'auto') {
    raiz.removeAttribute('data-theme')
  } else {
    raiz.setAttribute('data-theme', tema)
  }
  try {
    localStorage.setItem('ensaio-tema', tema)
  } catch {
    // Private browsing / blocked storage — the toggle still works for this visit.
  }
}

export function ThemeToggle() {
  const [tema, setTema] = useState<Tema>('auto')

  // Read the stored preference after hydration so the server and client markup
  // match; the inline script in layout.tsx prevents the flash of wrong theme.
  useEffect(() => {
    try {
      const salvo = localStorage.getItem('ensaio-tema')
      if (salvo === 'light' || salvo === 'dark' || salvo === 'auto') setTema(salvo)
    } catch {
      /* ignore */
    }
  }, [])

  function alternar() {
    const proximo = PROXIMO[tema]
    setTema(proximo)
    aplicar(proximo)
  }

  return (
    <button
      type="button"
      onClick={alternar}
      title={ROTULO[tema]}
      aria-label={ROTULO[tema]}
      className="ms-1 rounded-sm border border-[var(--color-rule)] px-2 py-1 font-sans text-[0.6875rem] text-[var(--color-ink-muted)] hover:bg-[var(--color-paper-sunken)] hover:text-[var(--color-ink)]"
    >
      <span aria-hidden="true">{tema === 'dark' ? '◑' : tema === 'light' ? '○' : '◐'}</span>
    </button>
  )
}
