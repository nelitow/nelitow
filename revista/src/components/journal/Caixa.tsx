import type { ReactNode } from 'react'

type TipoCaixa = 'nota' | 'alerta' | 'definicao' | 'metodo'

const ESTILOS: Record<TipoCaixa, { rotulo: string; cor: string; fundo: string }> = {
  nota: {
    rotulo: 'Nota',
    cor: 'var(--color-intermediario)',
    fundo: 'var(--color-intermediario-soft)',
  },
  alerta: {
    rotulo: 'Atenção',
    cor: 'var(--color-accent)',
    fundo: 'var(--color-accent-soft)',
  },
  definicao: {
    rotulo: 'Definição',
    cor: 'var(--color-leigo)',
    fundo: 'var(--color-leigo-soft)',
  },
  metodo: {
    rotulo: 'Método',
    cor: 'var(--color-especialista)',
    fundo: 'var(--color-especialista-soft)',
  },
}

export interface CaixaProps {
  tipo?: TipoCaixa
  /** Overrides the default label for the box type. */
  titulo?: string
  children: ReactNode
}

/** Set-off box for definitions, caveats and methodological asides. */
export function Caixa({ tipo = 'nota', titulo, children }: CaixaProps) {
  const estilo = ESTILOS[tipo]

  return (
    <aside
      className="my-7 rounded-sm border-s-2 px-5 py-4"
      style={{ borderInlineStartColor: estilo.cor, backgroundColor: estilo.fundo }}
    >
      <p className="label mb-2" style={{ color: estilo.cor }}>
        {titulo ?? estilo.rotulo}
      </p>
      <div className="[&>*+*]:mt-3 [&_p]:text-left [&_p]:text-[0.9375rem] [&_p]:leading-relaxed">
        {children}
      </div>
    </aside>
  )
}
