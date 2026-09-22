export const SITE = {
  nome: 'Ensaio Aberto',
  descricao:
    'Revista diária de divulgação científica. Cada achado lido em três profundidades: leigo, intermediário e especialista.',
  idioma: 'pt-BR',
  /** Set NEXT_PUBLIC_SITE_URL in the deploy environment. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, ''),
} as const

export function urlAbsoluta(caminho: string): string {
  return `${SITE.url}${caminho.startsWith('/') ? caminho : `/${caminho}`}`
}
