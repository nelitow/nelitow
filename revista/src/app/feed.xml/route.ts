import { listarEdicoes } from '@/content/registry'
import { NIVEIS, NIVEL_INFO } from '@/content/types'
import { dataRss } from '@/lib/format'
import { SITE, urlAbsoluta } from '@/lib/site'

function escapar(texto: string): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * One RSS item per level, not per edição: a subscriber who reads at the
 * specialist level should not have to open a plain-language post to find out
 * it is not for them. Each item carries its own title suffix and link.
 */
export async function GET() {
  const edicoes = listarEdicoes()

  const itens = edicoes
    .flatMap((edicao) =>
      NIVEIS.map((nivel) => {
        const { meta } = edicao
        const info = NIVEL_INFO[nivel]
        const link = urlAbsoluta(`/edicao/${meta.slug}/${nivel}`)

        return `
    <item>
      <title>${escapar(`${meta.titulo} — nível ${info.rotulo.toLowerCase()}`)}</title>
      <link>${escapar(link)}</link>
      <guid isPermaLink="true">${escapar(link)}</guid>
      <pubDate>${dataRss(meta.publicadoEm)}</pubDate>
      <category>${escapar(meta.secao)}</category>
      <category>${escapar(info.rotulo)}</category>
      <description>${escapar(meta.chamada[nivel])}</description>
    </item>`
      }),
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapar(SITE.nome)}</title>
    <link>${escapar(SITE.url)}</link>
    <description>${escapar(SITE.descricao)}</description>
    <language>${SITE.idioma.toLowerCase()}</language>
    <atom:link href="${escapar(urlAbsoluta('/feed.xml'))}" rel="self" type="application/rss+xml" />${itens}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
