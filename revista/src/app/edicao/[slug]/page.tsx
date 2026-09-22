import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { DadosChave } from '@/components/journal/DadosChave'
import { Migalhas } from '@/components/journal/Migalhas'
import { NotasEditoriais, Referencias } from '@/components/journal/Referencias'
import { Perguntas } from '@/components/journal/Perguntas'
import { Relacionadas } from '@/components/journal/Relacionadas'
import { NivelLembrado } from '@/components/NivelLembrado'
import { buscarEdicao, listarTodas, relacionadas, temaParaSlug } from '@/content/registry'
import { NIVEIS, NIVEL_INFO } from '@/content/types'
import { dataLonga, identificador, localizador } from '@/lib/format'
import { grafoAncora } from '@/lib/schema'
import { urlAbsoluta } from '@/lib/site'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return listarTodas().map((edicao) => ({ slug: edicao.meta.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const edicao = buscarEdicao(slug)
  if (!edicao) return {}

  const { meta } = edicao
  const caminho = `/edicao/${slug}`

  return {
    title: meta.titulo,
    description: meta.respostaCurta,
    keywords: meta.palavrasChave,
    alternates: { canonical: caminho },
    // Rascunhos são construídos para pré-visualização e ficam fora da capa, do
    // arquivo, do feed e do sitemap — mas a URL existe. Sem isto, bastaria um
    // link vazado para o rascunho ser indexado.
    ...(meta.publicado ? {} : { robots: { index: false, follow: false } }),
    openGraph: {
      type: 'article',
      title: meta.titulo,
      description: meta.respostaCurta,
      url: urlAbsoluta(caminho),
      publishedTime: meta.publicadoEm,
      modifiedTime: meta.atualizadoEm,
      section: meta.secao,
      tags: meta.palavrasChave,
    },
  }
}

/**
 * Página-âncora da edição.
 *
 * Antes daqui havia um redirecionamento para o nível lembrado em cookie. Isso
 * custava caro: a URL que todo mundo compartilha e que o buscador indexa nunca
 * renderizava conteúdo próprio, e as três versões ficavam competindo entre si
 * sem nenhuma página consolidando o assunto.
 *
 * Agora esta é a página canônica do tema — resposta curta, fatos, perguntas e
 * referências — e os três níveis são as leituras longas que partem dela. Quem
 * já escolheu um nível vê o cartão dele promovido, sem redirecionamento.
 */
export default async function PaginaEdicao({ params }: Props) {
  const { slug } = await params
  const edicao = buscarEdicao(slug)
  if (!edicao) notFound()

  const { meta, referencias } = edicao
  const caminho = `/edicao/${slug}`
  const relatadas = relacionadas(slug)

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(grafoAncora(meta, referencias)) }}
      />

      <Migalhas
        itens={[
          { nome: 'Capa', caminho: '/' },
          { nome: 'Arquivo', caminho: '/arquivo' },
          { nome: meta.secao, caminho: `/tema/${temaParaSlug(meta.palavrasChave[0] ?? meta.secao)}` },
          { nome: meta.titulo },
        ]}
      />

      <article>
        <header>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[0.6875rem]">
            <span className="tracking-[0.14em] text-[var(--color-accent)] uppercase">
              {meta.secao}
            </span>
            <span className="text-[var(--color-ink-faint)] tabular-nums">
              {localizador(meta.volume, meta.numero)}
            </span>
            <time dateTime={meta.publicadoEm} className="text-[var(--color-ink-faint)]">
              {dataLonga(meta.publicadoEm)}
            </time>
            {meta.atualizadoEm && (
              <span className="text-[var(--color-ink-faint)]">
                atualizada em <time dateTime={meta.atualizadoEm}>{dataLonga(meta.atualizadoEm)}</time>
              </span>
            )}
          </div>

          <h1 className="mt-4 text-[clamp(1.85rem,5.2vw,2.85rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance">
            {meta.titulo}
          </h1>

          <p className="mt-3 text-[clamp(1.0625rem,2.4vw,1.25rem)] leading-snug text-pretty text-[var(--color-ink-muted)]">
            {meta.subtitulo}
          </p>

          <div className="rule-double mt-6" />
        </header>

        {/* Resposta curta em destaque: é a pergunta que traz o leitor até aqui,
            e a passagem que faz sentido citada fora da página. */}
        <div
          className="mt-7 border-s-2 ps-5"
          style={{ borderColor: 'var(--color-accent)' }}
        >
          <p className="label mb-1.5">Resposta curta</p>
          <p className="text-[1.0625rem] leading-relaxed text-pretty">{meta.respostaCurta}</p>
        </div>

        <section aria-labelledby="niveis" className="mt-9">
          <h2 id="niveis" className="label mb-3">
            Leia na profundidade que você quer
          </h2>

          <div className="grid gap-3 sm:grid-cols-3">
            {NIVEIS.map((nivel) => {
              const info = NIVEL_INFO[nivel]
              return (
                <Link
                  key={nivel}
                  href={`${caminho}/${nivel}`}
                  data-nivel={nivel}
                  className="group flex flex-col rounded-sm border p-4 no-underline transition-colors hover:border-[var(--color-rule-strong)]"
                  style={{ borderColor: 'var(--color-rule)' }}
                >
                  <span
                    className="font-sans text-[0.625rem] font-semibold tracking-[0.14em]"
                    style={{ color: info.cor }}
                  >
                    NÍVEL {info.ordinal}
                  </span>
                  <span
                    className="mt-1 font-sans text-[0.9375rem] font-semibold"
                    style={{ color: info.cor }}
                  >
                    {info.rotulo}
                  </span>
                  <span className="mt-2 font-sans text-[0.75rem] leading-relaxed text-[var(--color-ink-muted)]">
                    {meta.chamada[nivel]}
                  </span>
                  <span className="mt-3 font-sans text-[0.6875rem] text-[var(--color-ink-faint)] tabular-nums">
                    {meta.tempoLeitura[nivel]} min · {info.publico.toLowerCase()}
                  </span>
                </Link>
              )
            })}
          </div>

          <NivelLembrado />
        </section>

        <section aria-labelledby="resumo-ancora" className="mt-10">
          <h2
            id="resumo-ancora"
            className="border-b border-[var(--color-ink)] pb-2 text-[1.0625rem] font-semibold"
          >
            Resumo
          </h2>
          <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-pretty text-[var(--color-ink-muted)]">
            {meta.resumo}
          </p>
        </section>

        <DadosChave dados={meta.dadosChave} referencias={referencias} />

        <Perguntas perguntas={meta.perguntas} referencias={referencias} />

        <section className="mt-12 border-t border-[var(--color-rule)] pt-5">
          <h2 className="label mb-2">Temas</h2>
          <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
            {meta.palavrasChave.map((palavra) => (
              <li key={palavra}>
                <Link
                  href={`/tema/${temaParaSlug(palavra)}`}
                  className="block rounded-sm border border-[var(--color-rule)] px-2 py-0.5 font-sans text-[0.75rem] text-[var(--color-ink-muted)] no-underline hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {palavra}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <Referencias referencias={referencias} />

        <NotasEditoriais
          identificadorEdicao={identificador(meta.volume, meta.numero, meta.slug)}
          url={urlAbsoluta(caminho)}
          titulo={meta.titulo}
          publicadoEm={meta.publicadoEm}
        />

        <Relacionadas edicoes={relatadas} />
      </article>
    </div>
  )
}
