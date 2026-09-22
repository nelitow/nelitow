export interface EstadoInscricao {
  status: 'ocioso' | 'ok' | 'erro'
  mensagem: string
  /** Echoed back so the field keeps its value when validation fails. */
  email: string
}

/**
 * Lives here rather than beside the action because a `'use server'` module may
 * only export async functions — exporting this object from there makes the
 * whole module fail to evaluate at runtime.
 */
export const INSCRICAO_INICIAL: EstadoInscricao = { status: 'ocioso', mensagem: '', email: '' }
