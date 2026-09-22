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

export async function carregarNivel(slug: string, nivel: Nivel) {
  const edicao = buscarEdicao(slug)
  if (!edicao) return null
  const modulo = await edicao.niveis[nivel]()
  return modulo.default
}
