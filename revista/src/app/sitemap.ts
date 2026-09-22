import type { MetadataRoute } from 'next'
import { listarEdicoes } from '@/content/registry'
import { NIVEIS } from '@/content/types'
import { paraData } from '@/lib/format'
import { urlAbsoluta } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const edicoes = listarEdicoes()

  const estaticas: MetadataRoute.Sitemap = [
    { url: urlAbsoluta('/'), changeFrequency: 'daily', priority: 1 },
    { url: urlAbsoluta('/arquivo'), changeFrequency: 'daily', priority: 0.8 },
    { url: urlAbsoluta('/metodologia'), changeFrequency: 'monthly', priority: 0.5 },
    { url: urlAbsoluta('/sobre'), changeFrequency: 'monthly', priority: 0.5 },
  ]

  const artigos: MetadataRoute.Sitemap = edicoes.flatMap(({ meta }) =>
    NIVEIS.map((nivel) => ({
      url: urlAbsoluta(`/edicao/${meta.slug}/${nivel}`),
      lastModified: paraData(meta.atualizadoEm ?? meta.publicadoEm),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  )

  return [...estaticas, ...artigos]
}
