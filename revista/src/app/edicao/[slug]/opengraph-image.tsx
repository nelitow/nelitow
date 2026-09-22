import { notFound } from 'next/navigation'
import { buscarEdicao } from '@/content/registry'
import { dataCurta, localizador } from '@/lib/format'
import { TAMANHO_OG, TIPO_OG, cartaoOg } from '@/lib/og'

export const alt = 'Cartão da edição no Ensaio Aberto'
export const size = TAMANHO_OG
export const contentType = TIPO_OG

export default async function Imagem({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const edicao = buscarEdicao(slug)
  if (!edicao) notFound()

  const { meta } = edicao

  return cartaoOg({
    titulo: meta.titulo,
    subtitulo: meta.subtitulo,
    etiqueta: meta.secao,
    rodape: `${localizador(meta.volume, meta.numero)} · ${dataCurta(meta.publicadoEm)}`,
  })
}
