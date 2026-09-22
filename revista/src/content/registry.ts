import { meta as absProlactina } from './edicoes/abs-201-prolactina/meta'
import { referencias as absProlactinaRefs } from './edicoes/abs-201-prolactina/referencias'
import { meta as ocupacaoDeReceptorPorQueBloquear60PodeNaoBastar } from './edicoes/ocupacao-de-receptor-por-que-bloquear-60-pode-nao-bastar/meta'
import { referencias as ocupacaoDeReceptorPorQueBloquear60PodeNaoBastarRefs } from './edicoes/ocupacao-de-receptor-por-que-bloquear-60-pode-nao-bastar/referencias'
import { meta as oQueAProlactinaFazNoFoliculoCapilar } from './edicoes/o-que-a-prolactina-faz-no-foliculo-capilar/meta'
import { referencias as oQueAProlactinaFazNoFoliculoCapilarRefs } from './edicoes/o-que-a-prolactina-faz-no-foliculo-capilar/referencias'
import { meta as prolactinaAltaECalvicieOQueDizemOsDadosObservaciona } from './edicoes/prolactina-alta-e-calvicie-dados-observacionais/meta'
import { referencias as prolactinaAltaECalvicieOQueDizemOsDadosObservacionaRefs } from './edicoes/prolactina-alta-e-calvicie-dados-observacionais/referencias'
import { meta as osTresGargalosDoRecrescimentoCapilar } from './edicoes/os-tres-gargalos-do-recrescimento-capilar/meta'
import { referencias as osTresGargalosDoRecrescimentoCapilarRefs } from './edicoes/os-tres-gargalos-do-recrescimento-capilar/referencias'
import { meta as osMacacosCalvosDaBayerEOQueElesProvam } from './edicoes/os-macacos-calvos-da-bayer-e-o-que-eles-provam/meta'
import { referencias as osMacacosCalvosDaBayerEOQueElesProvamRefs } from './edicoes/os-macacos-calvos-da-bayer-e-o-que-eles-provam/referencias'
import { meta as pessoasSemReceptorDeProlactinaOArgumentoGenetico } from './edicoes/pessoas-sem-receptor-de-prolactina-o-argumento-genetico/meta'
import { referencias as pessoasSemReceptorDeProlactinaOArgumentoGeneticoRefs } from './edicoes/pessoas-sem-receptor-de-prolactina-o-argumento-genetico/referencias'
import { meta as couroCabeludoEmCulturaOAlcanceDosDadosExVivo } from './edicoes/couro-cabeludo-em-cultura-o-alcance-dos-dados-ex-vivo/meta'
import { referencias as couroCabeludoEmCulturaOAlcanceDosDadosExVivoRefs } from './edicoes/couro-cabeludo-em-cultura-o-alcance-dos-dados-ex-vivo/referencias'
import { meta as osRiscosDeBloquearAProlactina } from './edicoes/os-riscos-de-bloquear-a-prolactina/meta'
import { referencias as osRiscosDeBloquearAProlactinaRefs } from './edicoes/os-riscos-de-bloquear-a-prolactina/referencias'
import { meta as oQueObservarNaLeituraDeEficaciaDoAbs201 } from './edicoes/o-que-observar-na-leitura-de-eficacia-do-abs-201/meta'
import { referencias as oQueObservarNaLeituraDeEficaciaDoAbs201Refs } from './edicoes/o-que-observar-na-leitura-de-eficacia-do-abs-201/referencias'
import { meta as tratamentosParaCalvicieDoMaisAoMenosComprovado } from './edicoes/tratamentos-para-calvicie-do-mais-ao-menos-comprovado/meta'
import { referencias as tratamentosParaCalvicieDoMaisAoMenosComprovadoRefs } from './edicoes/tratamentos-para-calvicie-do-mais-ao-menos-comprovado/referencias'
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
  {
    meta: ocupacaoDeReceptorPorQueBloquear60PodeNaoBastar,
    referencias: ocupacaoDeReceptorPorQueBloquear60PodeNaoBastarRefs,
    niveis: {
      leigo: () => import('./edicoes/ocupacao-de-receptor-por-que-bloquear-60-pode-nao-bastar/leigo.mdx'),
      intermediario: () => import('./edicoes/ocupacao-de-receptor-por-que-bloquear-60-pode-nao-bastar/intermediario.mdx'),
      especialista: () => import('./edicoes/ocupacao-de-receptor-por-que-bloquear-60-pode-nao-bastar/especialista.mdx'),
    },
  },
  {
    meta: oQueAProlactinaFazNoFoliculoCapilar,
    referencias: oQueAProlactinaFazNoFoliculoCapilarRefs,
    niveis: {
      leigo: () => import('./edicoes/o-que-a-prolactina-faz-no-foliculo-capilar/leigo.mdx'),
      intermediario: () => import('./edicoes/o-que-a-prolactina-faz-no-foliculo-capilar/intermediario.mdx'),
      especialista: () => import('./edicoes/o-que-a-prolactina-faz-no-foliculo-capilar/especialista.mdx'),
    },
  },
  {
    meta: prolactinaAltaECalvicieOQueDizemOsDadosObservaciona,
    referencias: prolactinaAltaECalvicieOQueDizemOsDadosObservacionaRefs,
    niveis: {
      leigo: () => import('./edicoes/prolactina-alta-e-calvicie-dados-observacionais/leigo.mdx'),
      intermediario: () => import('./edicoes/prolactina-alta-e-calvicie-dados-observacionais/intermediario.mdx'),
      especialista: () => import('./edicoes/prolactina-alta-e-calvicie-dados-observacionais/especialista.mdx'),
    },
  },
  {
    meta: osTresGargalosDoRecrescimentoCapilar,
    referencias: osTresGargalosDoRecrescimentoCapilarRefs,
    niveis: {
      leigo: () => import('./edicoes/os-tres-gargalos-do-recrescimento-capilar/leigo.mdx'),
      intermediario: () => import('./edicoes/os-tres-gargalos-do-recrescimento-capilar/intermediario.mdx'),
      especialista: () => import('./edicoes/os-tres-gargalos-do-recrescimento-capilar/especialista.mdx'),
    },
  },
  {
    meta: osMacacosCalvosDaBayerEOQueElesProvam,
    referencias: osMacacosCalvosDaBayerEOQueElesProvamRefs,
    niveis: {
      leigo: () => import('./edicoes/os-macacos-calvos-da-bayer-e-o-que-eles-provam/leigo.mdx'),
      intermediario: () => import('./edicoes/os-macacos-calvos-da-bayer-e-o-que-eles-provam/intermediario.mdx'),
      especialista: () => import('./edicoes/os-macacos-calvos-da-bayer-e-o-que-eles-provam/especialista.mdx'),
    },
  },
  {
    meta: pessoasSemReceptorDeProlactinaOArgumentoGenetico,
    referencias: pessoasSemReceptorDeProlactinaOArgumentoGeneticoRefs,
    niveis: {
      leigo: () => import('./edicoes/pessoas-sem-receptor-de-prolactina-o-argumento-genetico/leigo.mdx'),
      intermediario: () => import('./edicoes/pessoas-sem-receptor-de-prolactina-o-argumento-genetico/intermediario.mdx'),
      especialista: () => import('./edicoes/pessoas-sem-receptor-de-prolactina-o-argumento-genetico/especialista.mdx'),
    },
  },
  {
    meta: couroCabeludoEmCulturaOAlcanceDosDadosExVivo,
    referencias: couroCabeludoEmCulturaOAlcanceDosDadosExVivoRefs,
    niveis: {
      leigo: () => import('./edicoes/couro-cabeludo-em-cultura-o-alcance-dos-dados-ex-vivo/leigo.mdx'),
      intermediario: () => import('./edicoes/couro-cabeludo-em-cultura-o-alcance-dos-dados-ex-vivo/intermediario.mdx'),
      especialista: () => import('./edicoes/couro-cabeludo-em-cultura-o-alcance-dos-dados-ex-vivo/especialista.mdx'),
    },
  },
  {
    meta: osRiscosDeBloquearAProlactina,
    referencias: osRiscosDeBloquearAProlactinaRefs,
    niveis: {
      leigo: () => import('./edicoes/os-riscos-de-bloquear-a-prolactina/leigo.mdx'),
      intermediario: () => import('./edicoes/os-riscos-de-bloquear-a-prolactina/intermediario.mdx'),
      especialista: () => import('./edicoes/os-riscos-de-bloquear-a-prolactina/especialista.mdx'),
    },
  },
  {
    meta: oQueObservarNaLeituraDeEficaciaDoAbs201,
    referencias: oQueObservarNaLeituraDeEficaciaDoAbs201Refs,
    niveis: {
      leigo: () => import('./edicoes/o-que-observar-na-leitura-de-eficacia-do-abs-201/leigo.mdx'),
      intermediario: () => import('./edicoes/o-que-observar-na-leitura-de-eficacia-do-abs-201/intermediario.mdx'),
      especialista: () => import('./edicoes/o-que-observar-na-leitura-de-eficacia-do-abs-201/especialista.mdx'),
    },
  },
  {
    meta: tratamentosParaCalvicieDoMaisAoMenosComprovado,
    referencias: tratamentosParaCalvicieDoMaisAoMenosComprovadoRefs,
    niveis: {
      leigo: () => import('./edicoes/tratamentos-para-calvicie-do-mais-ao-menos-comprovado/leigo.mdx'),
      intermediario: () => import('./edicoes/tratamentos-para-calvicie-do-mais-ao-menos-comprovado/intermediario.mdx'),
      especialista: () => import('./edicoes/tratamentos-para-calvicie-do-mais-ao-menos-comprovado/especialista.mdx'),
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
