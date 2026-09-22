export function Resumo({ texto }: { texto: string }) {
  return (
    <section
      aria-labelledby="resumo-titulo"
      className="my-9 border-y border-[var(--color-ink)] bg-[var(--color-paper-raised)] px-5 py-5 sm:px-7"
    >
      <h2 id="resumo-titulo" className="label mb-2.5">
        Resumo
      </h2>
      <p className="text-[0.9375rem] leading-relaxed text-pretty text-[var(--color-ink-muted)]">
        {texto}
      </p>
    </section>
  )
}
