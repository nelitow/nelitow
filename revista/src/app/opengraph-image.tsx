import { edicaoMaisRecente, listarEdicoes } from '@/content/registry'
import { TAMANHO_OG, TIPO_OG, cartaoOg } from '@/lib/og'

export const alt = 'Ensaio Aberto — ciência em três níveis de leitura'
export const size = TAMANHO_OG
export const contentType = TIPO_OG

export default async function Imagem() {
  const total = listarEdicoes().length
  const destaque = edicaoMaisRecente()

  return cartaoOg({
    titulo: 'Ciência em três níveis de leitura',
    subtitulo:
      destaque?.meta.titulo ??
      'Cada achado lido em três profundidades: leigo, intermediário e especialista.',
    etiqueta: 'Publicação diária',
    rodape: `${total} ${total === 1 ? 'edição' : 'edições'}`,
  })
}
