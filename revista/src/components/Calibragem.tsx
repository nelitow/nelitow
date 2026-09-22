'use client'

import { useEffect, useOptimistic, useState, useTransition } from 'react'
import { registrarCalibragem } from '@/app/actions'
import { NIVEL_INFO, type Nivel } from '@/content/types'
import type { Calibragem as Contagens, Resposta } from '@/lib/store'

const OPCOES: { id: Resposta; rotulo: string; dica: string }[] = [
  { id: 'basico', rotulo: 'Básico demais', dica: 'Suba um nível na próxima' },
  { id: 'certo', rotulo: 'No ponto', dica: 'Era a profundidade que eu queria' },
  { id: 'tecnico', rotulo: 'Técnico demais', dica: 'Desça um nível na próxima' },
]

interface Props {
  slug: string
  nivel: Nivel
  iniciais: Contagens
}

/**
 * Asks the only question that matters for a three-level publication: did this
 * level land at the depth it advertises?
 *
 * `useOptimistic` applies the reader's answer to the tallies before the Server
 * Action resolves, so the control never feels like it swallowed the click; the
 * authoritative counts returned by the action then replace the guess.
 */
export function Calibragem({ slug, nivel, iniciais }: Props) {
  const [contagens, setContagens] = useState(iniciais)
  const [otimista, aplicarOtimista] = useOptimistic(
    contagens,
    (estado, resposta: Resposta): Contagens => ({ ...estado, [resposta]: estado[resposta] + 1 }),
  )
  const [escolha, setEscolha] = useState<Resposta | null>(null)
  const [, iniciarTransicao] = useTransition()

  const chave = `ensaio-calibragem:${slug}:${nivel}`

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(chave)
      if (salvo === 'basico' || salvo === 'certo' || salvo === 'tecnico') setEscolha(salvo)
    } catch {
      /* ignore */
    }
  }, [chave])

  function votar(resposta: Resposta) {
    if (escolha) return
    setEscolha(resposta)
    try {
      localStorage.setItem(chave, resposta)
    } catch {
      /* ignore */
    }

    iniciarTransicao(async () => {
      aplicarOtimista(resposta)
      setContagens(await registrarCalibragem(slug, nivel, resposta))
    })
  }

  const total = OPCOES.reduce((soma, opcao) => soma + otimista[opcao.id], 0)
  const info = NIVEL_INFO[nivel]

  return (
    <section
      aria-labelledby="calibragem-titulo"
      className="mt-12 rounded-sm border border-[var(--color-rule)] bg-[var(--color-paper-raised)] px-5 py-5"
    >
      <h2 id="calibragem-titulo" className="label mb-1">
        Calibragem
      </h2>
      <p className="mb-4 font-sans text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
        Este texto foi escrito como <strong style={{ color: info.cor }}>nível {info.ordinal}</strong>
        . Ele chegou nessa profundidade para você? A resposta ajusta a régua das próximas edições.
      </p>

      <div className="grid gap-2 sm:grid-cols-3">
        {OPCOES.map((opcao) => {
          const contagem = otimista[opcao.id]
          const proporcao = total > 0 ? contagem / total : 0
          const selecionado = escolha === opcao.id

          return (
            <button
              key={opcao.id}
              type="button"
              onClick={() => votar(opcao.id)}
              disabled={escolha !== null}
              aria-pressed={selecionado}
              className="group relative overflow-hidden rounded-sm border px-3 py-2.5 text-start font-sans transition-colors disabled:cursor-default"
              style={{
                borderColor: selecionado ? info.cor : 'var(--color-rule)',
                backgroundColor: selecionado ? info.corSuave : 'var(--color-paper)',
              }}
            >
              {/* Result bar, revealed only after the reader has answered. */}
              {escolha && (
                <span
                  aria-hidden="true"
                  className="absolute inset-y-0 start-0 transition-[width] duration-500"
                  style={{
                    width: `${proporcao * 100}%`,
                    backgroundColor: 'var(--color-paper-sunken)',
                  }}
                />
              )}

              <span className="relative flex items-baseline justify-between gap-2">
                <span
                  className="text-[0.8125rem] font-semibold"
                  style={{ color: selecionado ? info.cor : 'var(--color-ink)' }}
                >
                  {opcao.rotulo}
                </span>
                {escolha && (
                  <span className="text-[0.6875rem] text-[var(--color-ink-faint)] tabular-nums">
                    {contagem}
                  </span>
                )}
              </span>
              <span className="relative mt-0.5 block text-[0.6875rem] text-[var(--color-ink-faint)]">
                {opcao.dica}
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-3 font-sans text-[0.6875rem] text-[var(--color-ink-faint)]" aria-live="polite">
        {escolha
          ? `Obrigado. ${total} ${total === 1 ? 'resposta' : 'respostas'} neste nível.`
          : 'Uma resposta por pessoa, por nível.'}
      </p>
    </section>
  )
}
