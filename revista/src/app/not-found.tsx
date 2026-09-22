import Link from 'next/link'

export default function NaoEncontrado() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <p className="label">Erro 404</p>
      <h1 className="mt-3 text-[clamp(1.85rem,5vw,2.5rem)] leading-tight font-semibold tracking-[-0.02em]">
        Esta página não existe
      </h1>
      <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
        O endereço pode estar errado ou a edição pode ter sido republicada em outro nível.
      </p>
      <div className="mt-6 flex justify-center gap-3 font-sans text-[0.8125rem]">
        <Link href="/" className="text-[var(--color-accent)]">
          Ir para a capa
        </Link>
        <span className="text-[var(--color-ink-faint)]">·</span>
        <Link href="/arquivo" className="text-[var(--color-accent)]">
          Buscar no arquivo
        </Link>
      </div>
    </div>
  )
}
