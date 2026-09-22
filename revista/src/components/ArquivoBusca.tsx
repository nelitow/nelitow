'use client'

import { useDeferredValue, useMemo, useState } from 'react'
import Link from 'next/link'
import { NIVEIS, NIVEL_INFO, type Nivel } from '@/content/types'

export interface ResumoEdicao {
  slug: string
  numero: number
  titulo: string
  subtitulo: string
  secao: string
  publicadoEm: string
  dataFormatada: string
  palavrasChave: string[]
  tempoLeitura: Record<Nivel, number>
}

function normalizar(texto: string): string {
  // Strip accents so "prolactina" matches "prolactína" and vice versa.
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function ArquivoBusca({ edicoes }: { edicoes: ResumoEdicao[] }) {
  const [consulta, setConsulta] = useState('')
  const [secao, setSecao] = useState<string>('todas')

  // The input stays responsive while the (potentially long) list re-filters
  // against the previous value for a frame.
  const consultaAdiada = useDeferredValue(consulta)
  const filtrando = consulta !== consultaAdiada

  const secoes = useMemo(
    () => ['todas', ...Array.from(new Set(edicoes.map((e) => e.secao))).sort()],
    [edicoes],
  )

  const indice = useMemo(
    () =>
      edicoes.map((edicao) => ({
        edicao,
        busca: normalizar(
          [edicao.titulo, edicao.subtitulo, edicao.secao, ...edicao.palavrasChave].join(' '),
        ),
      })),
    [edicoes],
  )

  const resultados = useMemo(() => {
    const termo = normalizar(consultaAdiada.trim())

    return indice
      .filter(({ edicao, busca }) => {
        if (secao !== 'todas' && edicao.secao !== secao) return false
        return termo.length === 0 || busca.includes(termo)
      })
      .map(({ edicao }) => edicao)
  }, [indice, consultaAdiada, secao])

  return (
    <div>
      {/* Filters in one row above the results. */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-rule)] pb-4">
        <label htmlFor="busca-arquivo" className="sr-only">
          Buscar no arquivo
        </label>
        <input
          id="busca-arquivo"
          type="search"
          value={consulta}
          onChange={(evento) => setConsulta(evento.target.value)}
          placeholder="Buscar por título, tema ou palavra-chave…"
          className="min-w-0 flex-1 rounded-sm border border-[var(--color-rule-strong)] bg-[var(--color-paper)] px-3 py-1.5 font-sans text-[0.8125rem] outline-none placeholder:text-[var(--color-ink-faint)] focus-visible:border-[var(--color-accent)]"
        />

        <label htmlFor="secao-arquivo" className="sr-only">
          Filtrar por seção
        </label>
        <select
          id="secao-arquivo"
          value={secao}
          onChange={(evento) => setSecao(evento.target.value)}
          className="rounded-sm border border-[var(--color-rule-strong)] bg-[var(--color-paper)] px-2 py-1.5 font-sans text-[0.8125rem] outline-none"
        >
          {secoes.map((nome) => (
            <option key={nome} value={nome}>
              {nome === 'todas' ? 'Todas as seções' : nome}
            </option>
          ))}
        </select>
      </div>

      <p
        className="mt-3 font-sans text-[0.6875rem] text-[var(--color-ink-faint)] tabular-nums"
        aria-live="polite"
        style={{ opacity: filtrando ? 0.5 : 1 }}
      >
        {resultados.length} {resultados.length === 1 ? 'edição' : 'edições'}
      </p>

      <ol className="mt-2 divide-y divide-[var(--color-rule)]">
        {resultados.map((edicao) => (
          <li key={edicao.slug} className="py-5">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-[0.6875rem]">
              <span className="tabular-nums text-[var(--color-ink-faint)]">
                nº {String(edicao.numero).padStart(3, '0')}
              </span>
              <span className="tracking-[0.14em] text-[var(--color-accent)] uppercase">
                {edicao.secao}
              </span>
              <time dateTime={edicao.publicadoEm} className="text-[var(--color-ink-faint)]">
                {edicao.dataFormatada}
              </time>
            </div>

            <h3 className="mt-1.5 text-[1.125rem] leading-snug font-semibold">
              <Link
                href={`/edicao/${edicao.slug}`}
                className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)]"
              >
                {edicao.titulo}
              </Link>
            </h3>

            <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
              {edicao.subtitulo}
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {NIVEIS.map((nivel) => {
                const info = NIVEL_INFO[nivel]
                return (
                  <Link
                    key={nivel}
                    href={`/edicao/${edicao.slug}/${nivel}`}
                    className="rounded-sm border px-2 py-0.5 font-sans text-[0.6875rem] no-underline"
                    style={{ borderColor: info.corSuave, color: info.cor }}
                  >
                    {info.rotulo}{' '}
                    <span className="text-[var(--color-ink-faint)] tabular-nums">
                      {edicao.tempoLeitura[nivel]} min
                    </span>
                  </Link>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      {resultados.length === 0 && (
        <p className="py-10 text-center font-sans text-[0.875rem] text-[var(--color-ink-muted)]">
          Nenhuma edição corresponde a essa busca.
        </p>
      )}
    </div>
  )
}
