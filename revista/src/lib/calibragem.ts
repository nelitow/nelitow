/**
 * Tipos da calibragem, separados do armazenamento.
 *
 * O componente cliente precisa destes tipos; o `store` importa `server-only` e
 * fala com o banco. Mantê-los em módulos diferentes garante que nenhuma
 * mudança futura no store arraste código de servidor para o bundle do cliente.
 */

export const RESPOSTAS = ['basico', 'certo', 'tecnico'] as const

export type Resposta = (typeof RESPOSTAS)[number]

export type Calibragem = Record<Resposta, number>

export const CALIBRAGEM_VAZIA: Calibragem = { basico: 0, certo: 0, tecnico: 0 }

export function ehResposta(valor: string): valor is Resposta {
  return (RESPOSTAS as readonly string[]).includes(valor)
}
