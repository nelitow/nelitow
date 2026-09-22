import { meta as absProlactina } from './edicoes/abs-201-prolactina/meta'
import { referencias as absProlactinaRefs } from './edicoes/abs-201-prolactina/referencias'
import type { Edicao, Nivel } from './types'

/**
 * The journal's table of contents.
 *
 * Every edição is registered explicitly rather than discovered by globbing: an
 * explicit map keeps the MDX imports statically analysable (so each level is a
 * separate lazily-loaded chunk) and makes an unregistered draft impossible to
 * publish by accident.
 *
 * `npm run nova-edicao` appends to this list for you.
 */
const EDICOES: Edicao[] = [
  {
    meta: absProlactina,
    referencias: absProlactinaRefs,
    niveis: {
      leigo: () => import('./edicoes/abs-201-prolactina/leigo.mdx'),
      intermediario: () => import('./edicoes/abs-201-prolactina/intermediario.mdx'),
      especialista: () => import('./edicoes/abs-201-prolactina/especialista.mdx'),
    },
  },
  // <!-- nova-edicao: não remova este comentário, o script insere acima dele -->
]

const porData = (a: Edicao, b: Edicao) =>
  b.meta.publicadoEm.localeCompare(a.meta.publicadoEm) || b.meta.numero - a.meta.numero

/** Published edições, newest first. Drafts are never returned. */
export function listarEdicoes(): Edicao[] {
  return EDICOES.filter((edicao) => edicao.meta.publicado).sort(porData)
}

/** Includes drafts — for build-time route generation during development. */
export function listarTodas(): Edicao[] {
  return [...EDICOES].sort(porData)
}

export function buscarEdicao(slug: string): Edicao | undefined {
  return EDICOES.find((edicao) => edicao.meta.slug === slug)
}

export function edicaoMaisRecente(): Edicao | undefined {
  return listarEdicoes()[0]
}

/** Previous/next navigation within the published run. */
export function vizinhas(slug: string): { anterior?: Edicao; proxima?: Edicao } {
  const publicadas = listarEdicoes()
  const i = publicadas.findIndex((edicao) => edicao.meta.slug === slug)
  if (i === -1) return {}
  return { anterior: publicadas[i + 1], proxima: publicadas[i - 1] }
}

/** Normaliza um tema para URL: sem acento, sem espaço. */
export function temaParaSlug(tema: string): string {
  return tema
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Todos os temas publicados, com contagem, do mais frequente ao menos. */
export function listarTemas(): { tema: string; slug: string; total: number }[] {
  const contagem = new Map<string, number>()

  for (const { meta } of listarEdicoes()) {
    for (const palavra of meta.palavrasChave) {
      contagem.set(palavra, (contagem.get(palavra) ?? 0) + 1)
    }
  }

  return [...contagem.entries()]
    .map(([tema, total]) => ({ tema, slug: temaParaSlug(tema), total }))
    .sort((a, b) => b.total - a.total || a.tema.localeCompare(b.tema, 'pt-BR'))
}

export function buscarTema(slug: string) {
  const encontrado = listarTemas().find((t) => t.slug === slug)
  if (!encontrado) return null

  return {
    ...encontrado,
    edicoes: listarEdicoes().filter(({ meta }) => meta.palavrasChave.includes(encontrado.tema)),
  }
}

/**
 * Edições que compartilham palavras-chave com esta, mais compartilhadas
 * primeiro. É o que liga uma sequência de posts diários num assunto contínuo.
 */
export function relacionadas(slug: string, limite = 4): Edicao[] {
  const atual = buscarEdicao(slug)
  if (!atual) return []

  const chaves = new Set(atual.meta.palavrasChave)

  return listarEdicoes()
    .filter((e) => e.meta.slug !== slug)
    .map((e) => ({
      edicao: e,
      peso: e.meta.palavrasChave.filter((p) => chaves.has(p)).length,
    }))
    .filter(({ peso }) => peso > 0)
    .sort((a, b) => b.peso - a.peso)
    .slice(0, limite)
    .map(({ edicao }) => edicao)
}

export async function carregarNivel(slug: string, nivel: Nivel) {
  const edicao = buscarEdicao(slug)
  if (!edicao) return null
  const modulo = await edicao.niveis[nivel]()
  return modulo.default
}
