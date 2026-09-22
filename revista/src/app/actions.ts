'use server'

import { isNivel, type Nivel } from '@/content/types'
import { CALIBRAGEM_VAZIA, ehResposta, type Calibragem, type Resposta } from '@/lib/calibragem'
import type { EstadoInscricao } from '@/lib/inscricao'
import { lerCalibragem, registrarInscrito, somarCalibragem } from '@/lib/store'

// Um slug nunca é livre: é sempre um nome de pasta que nós criamos.
const SLUG = /^[a-z0-9-]{1,80}$/

/**
 * Lê as contagens de um nível.
 *
 * Existe como ação — e não como leitura na página — para que as páginas de
 * nível continuem estáticas. Se a contagem fosse lida na renderização, cada
 * uma das três URLs por edição viraria uma página com revalidação, só para
 * exibir um número que o leitor nem vê antes de votar.
 */
export async function lerCalibragemAction(slug: string, nivel: string): Promise<Calibragem> {
  if (!SLUG.test(slug.trim()) || !isNivel(nivel)) return CALIBRAGEM_VAZIA
  return lerCalibragem(slug.trim(), nivel as Nivel)
}

/**
 * Registra se um nível de leitura acertou a profundidade que anuncia.
 *
 * Todo argumento é revalidado aqui: uma Server Action é um endpoint HTTP
 * público, e o componente cliente que a chama não é fronteira de confiança.
 */
export async function registrarCalibragem(
  slug: string,
  nivel: string,
  resposta: string,
): Promise<Calibragem> {
  const slugLimpo = slug.trim()

  if (!SLUG.test(slugLimpo)) return CALIBRAGEM_VAZIA
  if (!isNivel(nivel)) return CALIBRAGEM_VAZIA
  if (!ehResposta(resposta)) return CALIBRAGEM_VAZIA

  return somarCalibragem(slugLimpo, nivel as Nivel, resposta as Resposta)
}

// Deliberadamente conservador: rejeita o erro óbvio sem fingir que valida
// entregabilidade, o que só um e-mail de confirmação resolve.
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

  // Se a gravação falhou, o leitor precisa saber. A versão anterior gravava
  // num arquivo efêmero e sempre respondia "pronto", inclusive quando o
  // e-mail tinha acabado de ser perdido.
  const gravado = await registrarInscrito(email)

  if (!gravado) {
    return {
      status: 'erro',
      mensagem: 'Não conseguimos registrar agora. Tente de novo em alguns minutos.',
      email,
    }
  }

  return {
    status: 'ok',
    mensagem: 'Pronto. Você receberá a edição de cada dia.',
    email: '',
  }
}
