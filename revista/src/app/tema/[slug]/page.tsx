import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { Migalhas } from '@/components/journal/Migalhas'
import { buscarTema, listarTemas } from '@/content/registry'
import { NIVEIS, NIVEL_INFO } from '@/content/types'
import { dataLonga } from '@/lib/format'
import { migalhas } from '@/lib/schema'
import { SITE, urlAbsoluta } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

/**
 * Página de tema.
 *
 * Numa publicação diária, o valor não está em cada edição isolada — está em
 * ter cobertura contínua de um assunto. Estas páginas são o que torna essa
 * continuidade visível: um lugar por assunto que acumula toda a cobertura e
 * que pode ranquear para a busca ampla ("alopecia androgenética"), enquanto
 * cada edição responde à busca específica.
 */
export function generateStaticParams() {
  return listarTemas().map((tema) => ({ slug: tema.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tema = buscarTema(slug)
  if (!tema) return {}

  const descricao = `Toda a cobertura do Ensaio Aberto sobre ${tema.tema}: ${tema.total} ${
    tema.total === 1 ? 'edição' : 'edições'
  }, cada uma em três níveis de leitura, com fontes primárias e o que ainda não foi demonstrado.`

  return {
    title: tema.tema,
    description: descricao,
    keywords: [tema.tema, ...tema.edicoes.flatMap((e) => e.meta.palavrasChave).slice(0, 8)],
    alternates: { canonical: `/tema/${slug}` },
    openGraph: {
      type: 'website',
      title: `${tema.tema} · ${SITE.nome}`,
      description: descricao,
      url: urlAbsoluta(`/tema/${slug}`),
    },
  }
}

export default async function PaginaTema({ params }: Props) {
  const { slug } = await params
  const tema = buscarTema(slug)
  if (!tema) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      migalhas([
        { nome: 'Capa', caminho: '/' },
        { nome: 'Temas', caminho: '/arquivo' },
        { nome: tema.tema, caminho: `/tema/${slug}` },
      ]),
      {
        '@type': 'CollectionPage',
        '@id': urlAbsoluta(`/tema/${slug}`),
        name: tema.tema,
        inLanguage: SITE.idioma,
        isPartOf: { '@id': urlAbsoluta('/#site') },
        about: { '@type': 'Thing', name: tema.tema },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: tema.edicoes.length,
          itemListElement: tema.edicoes.map(({ meta }, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: urlAbsoluta(`/edicao/${meta.slug}`),
            name: meta.titulo,
          })),
        },
      },
    ],
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Migalhas
        itens={[
          { nome: 'Capa', caminho: '/' },
          { nome: 'Arquivo', caminho: '/arquivo' },
          { nome: tema.tema },
        ]}
      />

      <header className="border-b border-[var(--color-rule)] pb-5">
        <p className="label">Tema</p>
        <h1 className="mt-2 text-[clamp(1.85rem,5vw,2.5rem)] leading-tight font-semibold tracking-[-0.02em] text-balance">
          {tema.tema}
        </h1>
        <p className="mt-2 font-sans text-[0.875rem] text-[var(--color-ink-muted)]">
          {tema.total} {tema.total === 1 ? 'edição publicada' : 'edições publicadas'}, cada uma em
          três níveis de leitura.
        </p>
      </header>

      <ol className="divide-y divide-[var(--color-rule)]">
        {tema.edicoes.map(({ meta }) => (
          <li key={meta.slug} className="py-5">
            <div className="flex flex-wrap items-baseline gap-x-3 font-sans text-[0.6875rem] text-[var(--color-ink-faint)]">
              <span className="tabular-nums">nº {String(meta.numero).padStart(3, '0')}</span>
              <span className="tracking-[0.14em] text-[var(--color-accent)] uppercase">
                {meta.secao}
              </span>
              <time dateTime={meta.publicadoEm}>{dataLonga(meta.publicadoEm)}</time>
            </div>

            <h2 className="mt-1.5 text-[1.125rem] leading-snug font-semibold">
              <Link
                href={`/edicao/${meta.slug}`}
                className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)]"
              >
                {meta.titulo}
              </Link>
            </h2>

            <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
              {meta.respostaCurta}
            </p>

            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {NIVEIS.map((nivel) => {
                const info = NIVEL_INFO[nivel]
                return (
                  <Link
                    key={nivel}
                    href={`/edicao/${meta.slug}/${nivel}`}
                    className="rounded-sm border px-2 py-0.5 font-sans text-[0.6875rem] no-underline"
                    style={{ borderColor: info.corSuave, color: info.cor }}
                  >
                    {info.rotulo}{' '}
                    <span className="text-[var(--color-ink-faint)] tabular-nums">
                      {meta.tempoLeitura[nivel]} min
                    </span>
                  </Link>
                )
              })}
            </div>
          </li>
        ))}
      </ol>

      <nav aria-label="Outros temas" className="mt-10 border-t border-[var(--color-rule)] pt-5">
        <h2 className="label mb-2.5">Outros temas</h2>
        <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
          {listarTemas()
            .filter((t) => t.slug !== slug)
            .map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tema/${t.slug}`}
                  className="block rounded-sm border border-[var(--color-rule)] px-2 py-0.5 font-sans text-[0.75rem] text-[var(--color-ink-muted)] no-underline hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {t.tema}{' '}
                  <span className="text-[var(--color-ink-faint)] tabular-nums">{t.total}</span>
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  )
}
