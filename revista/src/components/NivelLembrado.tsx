'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NIVEL_INFO, type Nivel } from '@/content/types'
import { nivelLembrado } from '@/lib/preferencia-nivel'

/**
 * Atalho para o nível que o leitor costuma usar.
 *
 * Substitui o redirecionamento por cookie que existia nesta rota. O
 * redirecionamento entregava a experiência certa ao leitor recorrente e a
 * página errada a todo mundo mais — buscadores inclusive, que nunca chegavam
 * a ver a página-âncora. Aqui a página é sempre a mesma; só este atalho muda.
 *
 * Renderiza nada até o cookie ser lido, então não existe estado intermediário
 * visível nem diferença entre o HTML do servidor e a primeira pintura.
 */
export function NivelLembrado() {
  const caminho = usePathname()
  const [nivel, setNivel] = useState<Nivel | null>(null)

  useEffect(() => {
    setNivel(nivelLembrado())
  }, [])

  if (!nivel) return null

  const info = NIVEL_INFO[nivel]

  return (
    <p className="mt-3 font-sans text-[0.8125rem] text-[var(--color-ink-muted)]">
      Você costuma ler no nível{' '}
      <Link
        href={`${caminho}/${nivel}`}
        className="font-semibold no-underline hover:underline"
        style={{ color: info.cor }}
      >
        {info.rotulo.toLowerCase()} →
      </Link>
    </p>
  )
}
