'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { inscrever } from '@/app/actions'
import { INSCRICAO_INICIAL } from '@/lib/inscricao'

/**
 * Submit button that reads the pending state of the form it sits inside.
 *
 * `useFormStatus` only works from a child of the <form>, which is precisely
 * why this is its own component rather than a prop drilled down from the
 * parent's action state.
 */
function Botao() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="shrink-0 rounded-sm border border-[var(--color-ink)] bg-[var(--color-ink)] px-4 py-2 font-sans text-[0.8125rem] font-semibold text-[var(--color-paper)] transition-opacity disabled:opacity-60"
    >
      {pending ? 'Enviando…' : 'Assinar'}
    </button>
  )
}

export function Assinatura() {
  const [estado, acao] = useActionState(inscrever, INSCRICAO_INICIAL)

  return (
    <section
      aria-labelledby="assinatura-titulo"
      className="border-y border-[var(--color-rule)] py-8"
    >
      <div className="mx-auto max-w-xl text-center">
        <h2 id="assinatura-titulo" className="text-[1.25rem] font-semibold">
          Uma edição por dia
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[0.9375rem] leading-relaxed text-[var(--color-ink-muted)]">
          Um achado científico por dia, explicado nos três níveis. Sem resumo genérico e sem
          manchete inflada.
        </p>

        <form action={acao} className="mx-auto mt-5 flex max-w-md gap-2">
          <label htmlFor="email-assinatura" className="sr-only">
            Seu e-mail
          </label>
          <input
            id="email-assinatura"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={estado.email}
            placeholder="voce@exemplo.com"
            aria-describedby={estado.mensagem ? 'assinatura-retorno' : undefined}
            aria-invalid={estado.status === 'erro'}
            className="min-w-0 flex-1 rounded-sm border border-[var(--color-rule-strong)] bg-[var(--color-paper)] px-3 py-2 font-sans text-[0.875rem] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-ink-faint)] focus-visible:border-[var(--color-accent)]"
          />
          <Botao />
        </form>

        <p
          id="assinatura-retorno"
          aria-live="polite"
          className="mt-2.5 h-5 font-sans text-[0.75rem]"
          style={{
            color: estado.status === 'erro' ? 'var(--color-accent)' : 'var(--color-ink-muted)',
          }}
        >
          {estado.mensagem}
        </p>
      </div>
    </section>
  )
}
