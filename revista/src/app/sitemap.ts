import type { MetadataRoute } from 'next'
import { listarEdicoes, listarTemas } from '@/content/registry'
import { NIVEIS } from '@/content/types'
import { paraData } from '@/lib/format'
import { urlAbsoluta } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const edicoes = listarEdicoes()
  const maisRecente = edicoes[0]
    ? paraData(edicoes[0].meta.atualizadoEm ?? edicoes[0].meta.publicadoEm)
    : new Date()

  const estaticas: MetadataRoute.Sitemap = [
    { url: urlAbsoluta('/'), lastModified: maisRecente, changeFrequency: 'daily', priority: 1 },
    {
      url: urlAbsoluta('/arquivo'),
      lastModified: maisRecente,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    { url: urlAbsoluta('/normas'), changeFrequency: 'monthly', priority: 0.6 },
    { url: urlAbsoluta('/metodologia'), changeFrequency: 'monthly', priority: 0.6 },
    { url: urlAbsoluta('/sobre'), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // A página-âncora tem prioridade acima dos níveis: é ela que consolida o
  // assunto e a que deve ganhar a busca ampla.
  const ancoras: MetadataRoute.Sitemap = edicoes.map(({ meta }) => ({
    url: urlAbsoluta(`/edicao/${meta.slug}`),
    lastModified: paraData(meta.atualizadoEm ?? meta.publicadoEm),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }))

  const niveis: MetadataRoute.Sitemap = edicoes.flatMap(({ meta }) =>
    NIVEIS.map((nivel) => ({
      url: urlAbsoluta(`/edicao/${meta.slug}/${nivel}`),
      lastModified: paraData(meta.atualizadoEm ?? meta.publicadoEm),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  )

  const temas: MetadataRoute.Sitemap = listarTemas().map((tema) => ({
    url: urlAbsoluta(`/tema/${tema.slug}`),
    lastModified: maisRecente,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...estaticas, ...ancoras, ...niveis, ...temas]
}
