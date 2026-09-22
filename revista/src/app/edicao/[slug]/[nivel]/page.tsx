import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { CabecalhoArtigo, PalavrasChave } from '@/components/journal/CabecalhoArtigo'
import { NotasEditoriais, Referencias } from '@/components/journal/Referencias'
import { Resumo } from '@/components/journal/Resumo'
import { criarCit } from '@/components/journal/Cit'
import { Calibragem } from '@/components/Calibragem'
import { NivelSwitcher } from '@/components/NivelSwitcher'
import { ProgressoLeitura } from '@/components/ProgressoLeitura'
import { SumarioArtigo } from '@/components/SumarioArtigo'
import { buscarEdicao, listarTodas, vizinhas } from '@/content/registry'
import { NIVEIS, NIVEL_INFO, isNivel, type Nivel } from '@/content/types'
import { identificador } from '@/lib/format'
import { lerCalibragem } from '@/lib/store'
import { SITE, urlAbsoluta } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string; nivel: string }>
}

// Refresh the calibration tallies periodically without making the whole
// article dynamic — the body itself never changes between requests.
export const revalidate = 3600

export function generateStaticParams() {
  return listarTodas().flatMap((edicao) =>
    NIVEIS.map((nivel) => ({ slug: edicao.meta.slug, nivel })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, nivel } = await params
  const edicao = buscarEdicao(slug)

  if (!edicao || !isNivel(nivel)) return {}

  const { meta } = edicao
  const info = NIVEL_INFO[nivel]
  const caminho = `/edicao/${slug}/${nivel}`

  return {
    title: `${meta.titulo} — nível ${info.rotulo.toLowerCase()}`,
    description: meta.chamada[nivel],
    keywords: meta.palavrasChave,
    alternates: {
      canonical: caminho,
      // Every level is a legitimate entry point for the same subject.
      languages: Object.fromEntries(
        NIVEIS.map((outro) => [`pt-BR-x-${outro}`, `/edicao/${slug}/${outro}`]),
      ),
    },
    openGraph: {
      type: 'article',
      title: meta.titulo,
      description: meta.chamada[nivel],
      url: urlAbsoluta(caminho),
      publishedTime: meta.publicadoEm,
      modifiedTime: meta.atualizadoEm,
      section: meta.secao,
      tags: meta.palavrasChave,
    },
  }
}

export default async function PaginaNivel({ params }: Props) {
  const { slug, nivel } = await params
  const edicao = buscarEdicao(slug)

  if (!edicao || !isNivel(nivel)) notFound()

  const nivelTipado = nivel as Nivel
  const { meta, referencias } = edicao

  const Corpo = (await edicao.niveis[nivelTipado]()).default
  const Cit = criarCit(referencias)
  const contagens = await lerCalibragem(slug, nivelTipado)
  const { anterior, proxima } = vizinhas(slug)

  const idEdicao = identificador(meta.volume, meta.numero, meta.slug)
  const urlCanonica = urlAbsoluta(`/edicao/${slug}/${nivelTipado}`)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: meta.titulo,
    description: meta.resumo,
    inLanguage: SITE.idioma,
    datePublished: meta.publicadoEm,
    dateModified: meta.atualizadoEm ?? meta.publicadoEm,
    keywords: meta.palavrasChave.join(', '),
    articleSection: meta.secao,
    url: urlCanonica,
    isPartOf: { '@type': 'Periodical', name: SITE.nome },
    citation: referencias.map((ref) => ({
      '@type': 'CreativeWork',
      name: ref.titulo,
      url: ref.url,
    })),
  }

  return (
    <>
      <ProgressoLeitura />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-5 py-10 lg:py-14">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_13rem] lg:gap-12">
          <article>
            <CabecalhoArtigo meta={meta} nivel={nivelTipado} />

            <div className="mt-8">
              <NivelSwitcher
                slug={slug}
                nivelAtual={nivelTipado}
                tempoLeitura={meta.tempoLeitura}
              />
            </div>

            <Resumo texto={meta.resumo} />

            {/* `key` on the level makes a switch remount the body, which resets
                scroll-spy state and lets the view transition target a fresh
                subtree instead of diffing two different articles together. */}
            <div
              key={nivelTipado}
              data-corpo-artigo
              className={`prose-journal measure ${nivelTipado === 'leigo' ? 'dropcap' : ''}`}
              style={{ viewTransitionName: 'article-body' }}
            >
              <Corpo components={{ Cit }} />
            </div>

            <PalavrasChave palavras={meta.palavrasChave} />

            <Referencias referencias={referencias} />

            <NotasEditoriais
              identificadorEdicao={idEdicao}
              url={urlCanonica}
              titulo={meta.titulo}
              publicadoEm={meta.publicadoEm}
            />

            <Calibragem slug={slug} nivel={nivelTipado} iniciais={contagens} />

            {(anterior || proxima) && (
              <nav
                aria-label="Outras edições"
                className="mt-12 grid gap-4 border-t border-[var(--color-rule)] pt-6 sm:grid-cols-2"
              >
                {anterior ? (
                  <Link
                    href={`/edicao/${anterior.meta.slug}`}
                    className="no-underline group"
                  >
                    <span className="label">Edição anterior</span>
                    <span className="mt-1 block text-[0.9375rem] leading-snug font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                      {anterior.meta.titulo}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}

                {proxima && (
                  <Link
                    href={`/edicao/${proxima.meta.slug}`}
                    className="no-underline group sm:text-end"
                  >
                    <span className="label">Próxima edição</span>
                    <span className="mt-1 block text-[0.9375rem] leading-snug font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)]">
                      {proxima.meta.titulo}
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <SumarioArtigo />
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
