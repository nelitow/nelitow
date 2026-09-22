import 'server-only'

import { getCloudflareContext } from '@opennextjs/cloudflare'
import type { Nivel } from '@/content/types'
import { CALIBRAGEM_VAZIA, RESPOSTAS, type Calibragem, type Resposta } from '@/lib/calibragem'

/**
 * Armazenamento em D1 (SQLite da Cloudflare).
 *
 * Substituiu um arquivo JSON em disco. O motivo não foi a plataforma: o
 * Workers não tem filesystem, mas o container do Railway também perde o disco
 * a cada deploy. Gravar e-mail de inscrito num arquivo efêmero perdia dado em
 * silêncio em qualquer host — o `try/catch` que engolia o erro fazia a falha
 * ser invisível.
 *
 * Duas propriedades que o arquivo não tinha:
 *
 * - A contagem de voto é um `UPDATE total = total + 1` atômico, em vez de
 *   ler-modificar-escrever. A fila com mutex que existia antes só protegia
 *   contra corrida dentro de um processo; aqui não há corrida nenhuma.
 * - A inscrição usa `ON CONFLICT DO NOTHING`, então e-mail repetido não
 *   duplica nem precisa de leitura prévia.
 */

interface BancoD1 {
  prepare(sql: string): {
    bind(...valores: unknown[]): {
      all<T>(): Promise<{ results: T[] }>
      run(): Promise<unknown>
    }
  }
}

/**
 * Devolve o binding do D1, ou null quando ele não existe.
 *
 * Nunca lança. Em `next build` não há binding, e nenhuma página deve quebrar
 * por causa disso; em desenvolvimento sem wrangler, o site precisa continuar
 * navegável mesmo que a calibragem não persista.
 */
function banco(): BancoD1 | null {
  try {
    const env = getCloudflareContext().env as unknown as { DB?: BancoD1 }
    return env.DB ?? null
  } catch {
    return null
  }
}

const SEM_BANCO = 'D1 indisponível: binding "DB" ausente. Nada foi gravado.'

export async function lerCalibragem(slug: string, nivel: Nivel): Promise<Calibragem> {
  const db = banco()
  if (!db) return { ...CALIBRAGEM_VAZIA }

  try {
    const { results } = await db
      .prepare('SELECT resposta, total FROM calibragem WHERE slug = ? AND nivel = ?')
      .bind(slug, nivel)
      .all<{ resposta: string; total: number }>()

    const contagens = { ...CALIBRAGEM_VAZIA }
    for (const linha of results) {
      if ((RESPOSTAS as readonly string[]).includes(linha.resposta)) {
        contagens[linha.resposta as Resposta] = Number(linha.total) || 0
      }
    }
    return contagens
  } catch (erro) {
    console.error('Falha ao ler calibragem:', erro)
    return { ...CALIBRAGEM_VAZIA }
  }
}

export async function somarCalibragem(
  slug: string,
  nivel: Nivel,
  resposta: Resposta,
): Promise<Calibragem> {
  const db = banco()
  if (!db) {
    console.warn(SEM_BANCO)
    return { ...CALIBRAGEM_VAZIA }
  }

  try {
    await db
      .prepare(
        `INSERT INTO calibragem (slug, nivel, resposta, total)
         VALUES (?, ?, ?, 1)
         ON CONFLICT(slug, nivel, resposta) DO UPDATE SET total = total + 1`,
      )
      .bind(slug, nivel, resposta)
      .run()
  } catch (erro) {
    console.error('Falha ao registrar calibragem:', erro)
  }

  return lerCalibragem(slug, nivel)
}

/**
 * @returns `true` quando o e-mail foi aceito e gravado.
 *
 * Devolver o resultado, em vez de engolir a falha, é o que permite a ação
 * dizer ao leitor que a inscrição não foi feita. Era exatamente isso que
 * faltava na versão em arquivo.
 */
export async function registrarInscrito(email: string): Promise<boolean> {
  const db = banco()
  if (!db) {
    console.warn(SEM_BANCO)
    return false
  }

  try {
    await db
      .prepare(
        `INSERT INTO inscritos (email, criado_em)
         VALUES (?, ?)
         ON CONFLICT(email) DO NOTHING`,
      )
      .bind(email.trim().toLowerCase(), new Date().toISOString())
      .run()
    return true
  } catch (erro) {
    console.error('Falha ao registrar inscrito:', erro)
    return false
  }
}
