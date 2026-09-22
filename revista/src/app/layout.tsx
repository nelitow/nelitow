import type { Metadata } from 'next'
import { Masthead } from '@/components/journal/Masthead'
import { Rodape } from '@/components/journal/Rodape'
import { grafoSite } from '@/lib/schema'
import { SITE } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nome} — ciência em três níveis de leitura`,
    template: `%s · ${SITE.nome}`,
  },
  description: SITE.descricao,
  applicationName: SITE.nome,
  category: 'science',
  authors: [{ name: `Redação ${SITE.nome}`, url: SITE.url }],
  creator: `Redação ${SITE.nome}`,
  publisher: SITE.nome,
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: SITE.nome }],
      'text/plain': [{ url: '/llms.txt', title: `${SITE.nome} — índice para agentes` }],
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE.nome,
    title: `${SITE.nome} — ciência em três níveis de leitura`,
    description: SITE.descricao,
    url: SITE.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.nome} — ciência em três níveis de leitura`,
    description: SITE.descricao,
  },
  robots: {
    index: true,
    follow: true,
    // Sem estes três, o buscador corta o trecho em ~160 caracteres e a imagem
    // vira miniatura. É justamente o trecho longo que acaba citado em resposta
    // generativa, então eles vão na diretiva geral — que Bing e outros leem —
    // e não só na específica do Google.
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
}

/**
 * Applies the stored theme before first paint. Inline and synchronous on
 * purpose: any deferred version produces a flash of the wrong background.
 */
const SCRIPT_TEMA = `
try {
  var t = localStorage.getItem('ensaio-tema');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={SITE.idioma} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
        {/* Publicador e site declarados uma vez; cada página referencia por @id. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(grafoSite()) }}
        />
      </head>
      <body className="min-h-dvh">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-[var(--color-ink)] focus:px-3 focus:py-2 focus:font-sans focus:text-[0.8125rem] focus:text-[var(--color-paper)]"
        >
          Pular para o conteúdo
        </a>

        <Masthead />
        <main id="conteudo">{children}</main>
        <Rodape />
      </body>
    </html>
  )
}
