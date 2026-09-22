/**
 * Marcador de referência entre colchetes.
 *
 * O corpo do artigo usa sobrescrito simples, que é a convenção e funciona bem
 * em prosa corrida. Aqui não: valores como "+14 fios não-velo/cm²" já carregam
 * um expoente, e um sobrescrito nu ao lado dele lê como "cm²13". O colchete
 * separa o que é unidade do que é citação.
 */
export function RefsChave({
  ids,
  posicao,
}: {
  ids?: string[]
  posicao: Map<string, number>
}) {
  const numeros = (ids ?? []).map((id) => posicao.get(id)).filter((n): n is number => n != null)

  if (numeros.length === 0) return null

  return (
    <sup className="ms-1 font-sans text-[0.65rem] font-semibold whitespace-nowrap">
      <span className="text-[var(--color-ink-faint)]">[</span>
      {numeros.map((n, i) => (
        <span key={n}>
          {i > 0 && <span className="text-[var(--color-ink-faint)]">,</span>}
          <a
            href={`#ref-${n}`}
            className="text-[var(--color-accent)] no-underline hover:underline"
            aria-label={`Ver referência ${n}`}
          >
            {n}
          </a>
        </span>
      ))}
      <span className="text-[var(--color-ink-faint)]">]</span>
    </sup>
  )
}
