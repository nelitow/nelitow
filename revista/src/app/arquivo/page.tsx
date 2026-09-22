import type { Metadata } from 'next'
import { ArquivoBusca, type ResumoEdicao } from '@/components/ArquivoBusca'
import { listarEdicoes } from '@/content/registry'
import { dataLonga } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Arquivo',
  description: 'Todas as edições publicadas, buscáveis por tema e palavra-chave.',
  alternates: { canonical: '/arquivo' },
}

export default function PaginaArquivo() {
  // Only serialisable fields cross into the client component; the MDX loaders
  // on each edição stay on the server.
  const edicoes: ResumoEdicao[] = listarEdicoes().map(({ meta }) => ({
    slug: meta.slug,
    numero: meta.numero,
    titulo: meta.titulo,
    subtitulo: meta.subtitulo,
    secao: meta.secao,
    publicadoEm: meta.publicadoEm,
    dataFormatada: dataLonga(meta.publicadoEm),
    palavrasChave: meta.palavrasChave,
    tempoLeitura: meta.tempoLeitura,
  }))

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <header className="border-b border-[var(--color-rule)] pb-5">
        <p className="label">Arquivo</p>
        <h1 className="mt-2 text-[clamp(1.85rem,5vw,2.5rem)] leading-tight font-semibold tracking-[-0.02em]">
          Todas as edições
        </h1>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          Cada edição existe em três níveis. Abra pelo título para entrar no seu nível habitual, ou
          escolha um nível específico.
        </p>
      </header>

      <div className="mt-6">
        <ArquivoBusca edicoes={edicoes} />
      </div>
    </div>
  )
}
