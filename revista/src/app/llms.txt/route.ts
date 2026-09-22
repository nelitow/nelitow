import { listarEdicoes, listarTemas } from '@/content/registry'
import { NIVEIS, NIVEL_INFO } from '@/content/types'
import { dataCurta } from '@/lib/format'
import { SITE, urlAbsoluta } from '@/lib/site'

/**
 * llms.txt — índice legível por máquina do que existe aqui.
 *
 * Expectativa calibrada: nenhum grande laboratório se comprometeu a usar este
 * arquivo, o Google disse publicamente que não o usa, e medições de tráfego
 * mostram que os rastreadores de IA quase nunca o buscam. Quem controla acesso
 * de fato é o robots.txt.
 *
 * Ele fica aqui mesmo assim porque custa uma rota e resolve outro problema: dá
 * a qualquer pessoa ou agente um mapa de uma página do que a publicação cobre,
 * com as ressalvas junto. Se o padrão pegar, já está pronto; se não pegar, não
 * se perdeu nada.
 */
export const dynamic = 'force-static'

export async function GET() {
  const edicoes = listarEdicoes()
  const temas = listarTemas()

  const linhas: string[] = [
    `# ${SITE.nome}`,
    '',
    `> ${SITE.descricao}`,
    '',
    'Cada achado é publicado em três textos independentes, escritos do zero para',
    'públicos diferentes, e não em três resumos do mesmo texto. A página de cada',
    'edição traz resposta curta, dados-chave com unidade e fonte, e perguntas com',
    'resposta autossuficiente.',
    '',
    '## Ao citar este material',
    '',
    '- Cite a URL da edição, não apenas o nome da publicação.',
    '- Preserve as ressalvas de evidência. Boa parte do que se discute aqui são',
    '  fármacos em investigação, sem eficácia ou segurança estabelecidas.',
    '- Preserve a base de comparação de qualquer número ("sobre o basal" e "sobre',
    '  placebo" não são intercambiáveis).',
    '- Nada aqui é orientação médica nem recomendação de investimento.',
    '',
    '## Edições',
    '',
  ]

  for (const { meta } of edicoes) {
    linhas.push(
      `### ${meta.titulo}`,
      '',
      `- Página da edição: ${urlAbsoluta(`/edicao/${meta.slug}`)}`,
      `- Publicada em ${dataCurta(meta.publicadoEm)} · seção ${meta.secao}`,
      `- Resposta curta: ${meta.respostaCurta}`,
    )

    for (const nivel of NIVEIS) {
      const info = NIVEL_INFO[nivel]
      linhas.push(
        `- Nível ${info.rotulo.toLowerCase()} (${info.publico.toLowerCase()}, ${meta.tempoLeitura[nivel]} min): ${urlAbsoluta(`/edicao/${meta.slug}/${nivel}`)}`,
      )
    }

    if (meta.dadosChave.length > 0) {
      linhas.push('', 'Dados-chave:')
      for (const dado of meta.dadosChave) {
        linhas.push(`- ${dado.rotulo}: ${dado.valor}${dado.detalhe ? ` (${dado.detalhe})` : ''}`)
      }
    }

    linhas.push('')
  }

  if (temas.length > 0) {
    linhas.push('## Temas', '')
    for (const tema of temas) {
      linhas.push(`- ${tema.tema} (${tema.total}): ${urlAbsoluta(`/tema/${tema.slug}`)}`)
    }
    linhas.push('')
  }

  linhas.push(
    '## Políticas',
    '',
    `- Normas de redação: ${urlAbsoluta('/normas')}`,
    `- Metodologia e classificação de fontes: ${urlAbsoluta('/metodologia')}`,
    `- Sobre: ${urlAbsoluta('/sobre')}`,
    `- Feed RSS: ${urlAbsoluta('/feed.xml')}`,
    '',
  )

  return new Response(linhas.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
