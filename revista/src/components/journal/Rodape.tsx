import Link from 'next/link'
import { SITE } from '@/lib/site'

export function Rodape() {
  return (
    <footer className="mt-20 border-t border-[var(--color-rule)]">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-sm">
            <p className="text-[1.0625rem] font-semibold">{SITE.nome}</p>
            <p className="mt-1.5 font-sans text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
              {SITE.descricao}
            </p>
          </div>

          <nav aria-label="Rodapé">
            <ul className="space-y-1.5 font-sans text-[0.8125rem]">
              {[
                { href: '/arquivo', rotulo: 'Arquivo completo' },
                { href: '/normas', rotulo: 'Normas de redação' },
                { href: '/metodologia', rotulo: 'Como apuramos' },
                { href: '/sobre', rotulo: 'Sobre a revista' },
                { href: '/feed.xml', rotulo: 'RSS' },
                { href: '/llms.txt', rotulo: 'llms.txt' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[var(--color-ink-muted)] no-underline hover:text-[var(--color-accent)]"
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-[var(--color-rule)] pt-5 font-sans text-[0.75rem] leading-relaxed text-[var(--color-ink-faint)]">
          Conteúdo de divulgação científica. Não é orientação médica, não substitui consulta e não
          constitui recomendação de investimento. Fármacos em investigação discutidos aqui não têm
          eficácia ou segurança estabelecidas e não foram aprovados por nenhuma agência reguladora.
        </p>
      </div>
    </footer>
  )
}
