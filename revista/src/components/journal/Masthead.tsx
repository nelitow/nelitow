import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'

const NAV = [
  { href: '/', rotulo: 'Capa', sempre: true },
  { href: '/arquivo', rotulo: 'Arquivo', sempre: true },
  // Dropped on the narrowest screens, where four items plus the brand would
  // force the nameplate to wrap onto two lines.
  { href: '/metodologia', rotulo: 'Metodologia', sempre: false },
  { href: '/sobre', rotulo: 'Sobre', sempre: true },
]

export function Masthead() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-rule)] bg-[color-mix(in_oklab,var(--color-paper)_92%,transparent)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="group flex shrink-0 items-baseline gap-2.5 no-underline">
          <span className="text-[1.0625rem] font-semibold tracking-tight whitespace-nowrap text-[var(--color-ink)]">
            Ensaio Aberto
          </span>
          <span className="hidden font-sans text-[0.6875rem] text-[var(--color-ink-faint)] sm:inline">
            ciência em três níveis
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <nav aria-label="Seções">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.href} className={item.sempre ? undefined : 'hidden sm:block'}>
                  <Link
                    href={item.href}
                    className="rounded-sm px-1.5 py-1 font-sans text-[0.75rem] whitespace-nowrap text-[var(--color-ink-muted)] no-underline hover:bg-[var(--color-paper-sunken)] hover:text-[var(--color-ink)] sm:px-2"
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

/**
 * The full nameplate, used only on the cover. Carries the double rule that
 * makes a page read as a journal rather than a blog.
 */
export function Nameplate({ edicoes }: { edicoes: number }) {
  const ano = new Date().getUTCFullYear()

  return (
    <div className="border-b border-[var(--color-rule)] pb-6">
      <div className="flex items-baseline justify-between gap-4 font-sans text-[0.6875rem] text-[var(--color-ink-faint)]">
        <span className="tracking-[0.14em] uppercase">Publicação diária</span>
        <span className="tabular-nums">
          ISSN 0000-0000 · {ano} · {edicoes} {edicoes === 1 ? 'edição' : 'edições'}
        </span>
      </div>

      <h1 className="mt-3 text-[clamp(2.5rem,9vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.03em]">
        Ensaio Aberto
      </h1>

      <div className="rule-double mt-4" />

      <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-[var(--color-ink-muted)]">
        Cada descoberta lida em três profundidades — para quem está começando, para quem tem base
        na área e para quem precisa avaliar o método. Uma edição por dia.
      </p>
    </div>
  )
}
