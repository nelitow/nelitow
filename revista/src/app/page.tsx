import Link from 'next/link'
import { Nameplate } from '@/components/journal/Masthead'
import { Assinatura } from '@/components/Assinatura'
import { edicaoMaisRecente, listarEdicoes } from '@/content/registry'
import { NIVEIS, NIVEL_INFO } from '@/content/types'
import { dataLonga, localizador } from '@/lib/format'

export default function Capa() {
  const edicoes = listarEdicoes()
  const destaque = edicaoMaisRecente()
  const anteriores = edicoes.slice(1)

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Nameplate edicoes={edicoes.length} />

      {destaque ? (
        <article className="mt-10">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-[0.6875rem]">
            <span className="rounded-sm bg-[var(--color-accent)] px-1.5 py-0.5 font-semibold tracking-[0.1em] text-[var(--color-paper)] uppercase">
              Edição de hoje
            </span>
            <span className="tracking-[0.14em] text-[var(--color-accent)] uppercase">
              {destaque.meta.secao}
            </span>
            <span className="text-[var(--color-ink-faint)] tabular-nums">
              {localizador(destaque.meta.volume, destaque.meta.numero)}
            </span>
            <time
              dateTime={destaque.meta.publicadoEm}
              className="text-[var(--color-ink-faint)]"
            >
              {dataLonga(destaque.meta.publicadoEm)}
            </time>
          </div>

          <h2 className="mt-3 text-[clamp(2rem,6vw,3.25rem)] leading-[1.05] font-semibold tracking-[-0.025em] text-balance">
            <Link
              href={`/edicao/${destaque.meta.slug}`}
              className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)]"
            >
              {destaque.meta.titulo}
            </Link>
          </h2>

          <p className="mt-3 max-w-2xl text-[clamp(1.0625rem,2.2vw,1.25rem)] leading-snug text-[var(--color-ink-muted)] text-pretty">
            {destaque.meta.subtitulo}
          </p>

          <p className="measure mt-5 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
            {destaque.meta.resumo}
          </p>

          {/* The three doors into the same subject — the whole premise of the
              publication, so they get the most prominent block on the cover. */}
          <div className="mt-8">
            <p className="label mb-3">Escolha por onde entrar</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {NIVEIS.map((nivel) => {
                const info = NIVEL_INFO[nivel]

                return (
                  <Link
                    key={nivel}
                    href={`/edicao/${destaque.meta.slug}/${nivel}`}
                    className="group flex flex-col rounded-sm border p-4 no-underline transition-colors"
                    style={{ borderColor: 'var(--color-rule)' }}
                  >
                    <span
                      className="font-sans text-[0.625rem] font-semibold tracking-[0.14em]"
                      style={{ color: info.cor }}
                    >
                      NÍVEL {info.ordinal}
                    </span>
                    <span
                      className="mt-1 font-sans text-[0.9375rem] font-semibold"
                      style={{ color: info.cor }}
                    >
                      {info.rotulo}
                    </span>
                    <span className="mt-2 font-sans text-[0.75rem] leading-relaxed text-[var(--color-ink-muted)]">
                      {destaque.meta.chamada[nivel]}
                    </span>
                    <span className="mt-3 font-sans text-[0.6875rem] text-[var(--color-ink-faint)] tabular-nums">
                      {destaque.meta.tempoLeitura[nivel]} min · {info.publico.toLowerCase()}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </article>
      ) : (
        <p className="mt-10 font-sans text-[0.875rem] text-[var(--color-ink-muted)]">
          Nenhuma edição publicada ainda.
        </p>
      )}

      {anteriores.length > 0 && (
        <section className="mt-16">
          <h2 className="border-b border-[var(--color-ink)] pb-2 text-[1.0625rem] font-semibold">
            Edições anteriores
          </h2>

          <ol className="divide-y divide-[var(--color-rule)]">
            {anteriores.slice(0, 8).map((edicao) => (
              <li key={edicao.meta.slug} className="py-4">
                <div className="flex flex-wrap items-baseline gap-x-3 font-sans text-[0.6875rem] text-[var(--color-ink-faint)]">
                  <span className="tabular-nums">
                    nº {String(edicao.meta.numero).padStart(3, '0')}
                  </span>
                  <span className="tracking-[0.14em] text-[var(--color-accent)] uppercase">
                    {edicao.meta.secao}
                  </span>
                  <time dateTime={edicao.meta.publicadoEm}>
                    {dataLonga(edicao.meta.publicadoEm)}
                  </time>
                </div>
                <h3 className="mt-1 text-[1.0625rem] leading-snug font-semibold">
                  <Link
                    href={`/edicao/${edicao.meta.slug}`}
                    className="text-[var(--color-ink)] no-underline hover:text-[var(--color-accent)]"
                  >
                    {edicao.meta.titulo}
                  </Link>
                </h3>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
                  {edicao.meta.subtitulo}
                </p>
              </li>
            ))}
          </ol>

          {anteriores.length > 8 && (
            <Link
              href="/arquivo"
              className="mt-4 inline-block font-sans text-[0.8125rem] text-[var(--color-accent)]"
            >
              Ver o arquivo completo →
            </Link>
          )}
        </section>
      )}

      <div className="mt-16">
        <Assinatura />
      </div>
    </div>
  )
}
