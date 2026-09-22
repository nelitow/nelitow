import type { Metadata } from 'next'
import { Masthead } from '@/components/journal/Masthead'
import { Rodape } from '@/components/journal/Rodape'
import { SITE } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.nome} — ciência em três níveis`,
    template: `%s · ${SITE.nome}`,
  },
  description: SITE.descricao,
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': [{ url: '/feed.xml', title: SITE.nome }] },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: SITE.nome,
    title: `${SITE.nome} — ciência em três níveis`,
    description: SITE.descricao,
  },
  robots: { index: true, follow: true },
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
