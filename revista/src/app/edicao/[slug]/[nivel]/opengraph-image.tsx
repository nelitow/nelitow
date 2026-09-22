import { notFound } from 'next/navigation'
import { buscarEdicao } from '@/content/registry'
import { NIVEL_INFO, isNivel } from '@/content/types'
import { dataCurta } from '@/lib/format'
import { TAMANHO_OG, TIPO_OG, cartaoOg } from '@/lib/og'

export const alt = 'Cartão da edição no Ensaio Aberto'
export const size = TAMANHO_OG
export const contentType = TIPO_OG

export default async function Imagem({
  params,
}: {
  params: Promise<{ slug: string; nivel: string }>
}) {
  const { slug, nivel } = await params
  const edicao = buscarEdicao(slug)

  if (!edicao || !isNivel(nivel)) notFound()

  const { meta } = edicao

  return cartaoOg({
    titulo: meta.titulo,
    subtitulo: meta.chamada[nivel],
    nivel: NIVEL_INFO[nivel].rotulo,
    etiqueta: meta.secao,
    rodape: `${dataCurta(meta.publicadoEm)} · ${meta.tempoLeitura[nivel]} min de leitura`,
  })
}
