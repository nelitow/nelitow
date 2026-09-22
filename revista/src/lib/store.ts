import 'server-only'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { Nivel } from '@/content/types'

export const RESPOSTAS = ['basico', 'certo', 'tecnico'] as const
export type Resposta = (typeof RESPOSTAS)[number]

export type Calibragem = Record<Resposta, number>

export const CALIBRAGEM_VAZIA: Calibragem = { basico: 0, certo: 0, tecnico: 0 }

type Banco = Record<string, Calibragem>

const ARQUIVO = join(process.cwd(), '.data', 'calibragem.json')

/**
 * Durability note
 * ---------------
 * This is a JSON file on local disk. It survives restarts on a normal Node
 * host and is wiped on every cold start of a serverless deployment.
 *
 * That is a deliberate trade for a publication that has no database yet: the
 * signal is directional ("is level II landing as level II?"), not an audited
 * count. Swap the two functions below for a real store when it matters —
 * nothing else in the app touches the filesystem.
 */

let cache: Banco | null = null

/** Serialises read-modify-write so two concurrent votes cannot clobber. */
let fila: Promise<unknown> = Promise.resolve()

function enfileirar<T>(tarefa: () => Promise<T>): Promise<T> {
  const resultado = fila.then(tarefa, tarefa)
  fila = resultado.catch(() => {})
  return resultado
}

async function ler(): Promise<Banco> {
  if (cache) return cache
  try {
    cache = JSON.parse(await readFile(ARQUIVO, 'utf8')) as Banco
  } catch {
    // Missing or unreadable file simply means "nothing recorded yet".
    cache = {}
  }
  return cache
}

async function gravar(banco: Banco): Promise<void> {
  cache = banco
  try {
    await mkdir(dirname(ARQUIVO), { recursive: true })
    await writeFile(ARQUIVO, JSON.stringify(banco, null, 2), 'utf8')
  } catch {
    // Read-only filesystem: keep the in-memory value so the current process
    // still reflects the vote instead of failing the request.
  }
}

const chaveDe = (slug: string, nivel: Nivel) => `${slug}::${nivel}`

export async function lerCalibragem(slug: string, nivel: Nivel): Promise<Calibragem> {
  const banco = await ler()
  return { ...CALIBRAGEM_VAZIA, ...banco[chaveDe(slug, nivel)] }
}

export async function somarCalibragem(
  slug: string,
  nivel: Nivel,
  resposta: Resposta,
): Promise<Calibragem> {
  return enfileirar(async () => {
    const banco = await ler()
    const chave = chaveDe(slug, nivel)
    const atual = { ...CALIBRAGEM_VAZIA, ...banco[chave] }
    const atualizado = { ...atual, [resposta]: atual[resposta] + 1 }

    await gravar({ ...banco, [chave]: atualizado })
    return atualizado
  })
}

const INSCRITOS = join(process.cwd(), '.data', 'inscritos.json')

export async function registrarInscrito(email: string): Promise<void> {
  await enfileirar(async () => {
    let lista: string[] = []
    try {
      lista = JSON.parse(await readFile(INSCRITOS, 'utf8')) as string[]
    } catch {
      lista = []
    }

    const normalizado = email.trim().toLowerCase()
    if (lista.includes(normalizado)) return

    try {
      await mkdir(dirname(INSCRITOS), { recursive: true })
      await writeFile(INSCRITOS, JSON.stringify([...lista, normalizado], null, 2), 'utf8')
    } catch {
      /* read-only filesystem */
    }
  })
}
