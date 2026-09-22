import type { MetadataRoute } from 'next'
import { urlAbsoluta } from '@/lib/site'

/**
 * Rastreadores de IA são bem-vindos, e isso é uma decisão, não um descuido.
 *
 * Uma publicação de divulgação científica ganha em ser citada por mecanismos
 * generativos: a citação leva leitor e, mais importante, coloca a ressalva
 * junto do fato. Bloquear GPTBot ou ClaudeBot não impediria a informação de
 * circular — só garantiria que ela circulasse sem a fonte e sem o "isso ainda
 * não foi demonstrado em humanos".
 *
 * Os agentes estão listados um a um, embora `*` já os cubra, para que a
 * permissão seja explícita e auditável: um bloqueio futuro será uma escolha
 * deliberada, e não efeito colateral de alguém apertar um botão de "bloquear
 * IA" em algum painel.
 */
const AGENTES_DE_IA = [
  // Treinamento e/ou busca — OpenAI
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'Claude-SearchBot',
  // Google (o Google-Extended controla Gemini/Vertex, separado do Googlebot)
  'Google-Extended',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Outros
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
  'cohere-ai',
  'Meta-ExternalAgent',
  'Amazonbot',
  'DuckAssistBot',
  'MistralAI-User',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Nada aqui é privado; o que não deve ser indexado é apenas ruído
        // operacional sem valor de busca.
        disallow: ['/api/'],
      },
      ...AGENTES_DE_IA.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: urlAbsoluta('/sitemap.xml'),
    host: urlAbsoluta('/').replace(/\/$/, ''),
  }
}
