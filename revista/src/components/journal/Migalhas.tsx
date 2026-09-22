import Link from 'next/link'

/** Trilha visível. A versão em JSON-LD é montada em `lib/schema.ts`. */
export function Migalhas({ itens }: { itens: { nome: string; caminho?: string }[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="mb-5">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-sans text-[0.6875rem] text-[var(--color-ink-faint)]">
        {itens.map((item, i) => (
          <li key={item.nome} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.caminho ? (
              <Link href={item.caminho} className="no-underline hover:text-[var(--color-accent)]">
                {item.nome}
              </Link>
            ) : (
              <span aria-current="page" className="text-[var(--color-ink-muted)]">
                {item.nome}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
