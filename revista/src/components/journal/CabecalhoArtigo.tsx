import { dataLonga, identificador, localizador } from '@/lib/format'
import { NIVEL_INFO, type EdicaoMeta, type Nivel } from '@/content/types'

interface Props {
  meta: EdicaoMeta
  nivel: Nivel
}

function Campo({ rotulo, children }: { rotulo: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="label">{rotulo}</dt>
      <dd className="mt-0.5 font-sans text-[0.8125rem] text-[var(--color-ink-muted)]">{children}</dd>
    </div>
  )
}

export function CabecalhoArtigo({ meta, nivel }: Props) {
  const info = NIVEL_INFO[nivel]

  return (
    <header>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[0.6875rem]">
        <span className="tracking-[0.14em] text-[var(--color-accent)] uppercase">{meta.secao}</span>
        <span className="text-[var(--color-ink-faint)]">·</span>
        <span className="text-[var(--color-ink-faint)] tabular-nums">
          {localizador(meta.volume, meta.numero)}
        </span>
        <span className="text-[var(--color-ink-faint)]">·</span>
        <span
          className="rounded-sm px-1.5 py-px font-semibold"
          style={{ color: info.cor, backgroundColor: info.corSuave }}
        >
          Nível {info.ordinal} — {info.rotulo}
        </span>
      </div>

      <h1 className="mt-4 text-[clamp(1.85rem,5.2vw,2.85rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-balance">
        {meta.titulo}
      </h1>

      <p className="mt-3 text-[clamp(1.0625rem,2.4vw,1.25rem)] leading-snug text-[var(--color-ink-muted)] text-pretty">
        {meta.subtitulo}
      </p>

      <div className="rule-double mt-6" />

      <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        <Campo rotulo="Publicado em">
          <time dateTime={meta.publicadoEm}>{dataLonga(meta.publicadoEm)}</time>
        </Campo>
        <Campo rotulo="Leitura neste nível">{meta.tempoLeitura[nivel]} minutos</Campo>
        <Campo rotulo="Escrito para">{info.publico}</Campo>
        <Campo rotulo="Identificador">
          <code className="font-mono text-[0.6875rem] break-all">
            {identificador(meta.volume, meta.numero, meta.slug)}
          </code>
        </Campo>
      </dl>

      {meta.atualizadoEm && (
        <p className="mt-4 border-s-2 border-[var(--color-accent)] ps-3 font-sans text-[0.75rem] text-[var(--color-ink-muted)]">
          Atualizado em <time dateTime={meta.atualizadoEm}>{dataLonga(meta.atualizadoEm)}</time>.
        </p>
      )}
    </header>
  )
}

export function PalavrasChave({ palavras }: { palavras: string[] }) {
  return (
    <div className="mt-8 border-t border-[var(--color-rule)] pt-4">
      <p className="label mb-2">Palavras-chave</p>
      <ul className="flex flex-wrap gap-x-2 gap-y-1.5">
        {palavras.map((palavra) => (
          <li
            key={palavra}
            className="rounded-sm border border-[var(--color-rule)] px-2 py-0.5 font-sans text-[0.75rem] text-[var(--color-ink-muted)]"
          >
            {palavra}
          </li>
        ))}
      </ul>
    </div>
  )
}
