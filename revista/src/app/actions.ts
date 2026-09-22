'use server'

import { isNivel, type Nivel } from '@/content/types'
import type { EstadoInscricao } from '@/lib/inscricao'
import {
  CALIBRAGEM_VAZIA,
  RESPOSTAS,
  registrarInscrito,
  somarCalibragem,
  type Calibragem,
  type Resposta,
} from '@/lib/store'

/**
 * Records whether a reading level landed at the depth it claims.
 *
 * Every argument is re-validated here: a Server Action is a public HTTP
 * endpoint, and the client component that calls it is not a trust boundary.
 */
export async function registrarCalibragem(
  slug: string,
  nivel: string,
  resposta: string,
): Promise<Calibragem> {
  const slugLimpo = slug.trim()

  if (!/^[a-z0-9-]{1,80}$/.test(slugLimpo)) return CALIBRAGEM_VAZIA
  if (!isNivel(nivel)) return CALIBRAGEM_VAZIA
  if (!(RESPOSTAS as readonly string[]).includes(resposta)) return CALIBRAGEM_VAZIA

  return somarCalibragem(slugLimpo, nivel as Nivel, resposta as Resposta)
}

// Deliberately conservative: rejects the obvious mistakes without pretending
// to validate deliverability, which only a confirmation e-mail can do.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function inscrever(
  _anterior: EstadoInscricao,
  dados: FormData,
): Promise<EstadoInscricao> {
  const email = String(dados.get('email') ?? '').trim()

  if (email.length === 0) {
    return { status: 'erro', mensagem: 'Digite um e-mail.', email }
  }

  if (email.length > 254 || !EMAIL.test(email)) {
    return { status: 'erro', mensagem: 'Esse e-mail não parece válido.', email }
  }

  await registrarInscrito(email)

  return {
    status: 'ok',
    mensagem: 'Pronto. Você receberá a edição de cada dia.',
    email: '',
  }
}
