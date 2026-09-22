import type { MDXProps } from 'mdx/types'
import type { ComponentType } from 'react'

export const NIVEIS = ['leigo', 'intermediario', 'especialista'] as const

export type Nivel = (typeof NIVEIS)[number]

export function isNivel(value: string): value is Nivel {
  return (NIVEIS as readonly string[]).includes(value)
}

export interface NivelInfo {
  id: Nivel
  /** Short label for the switcher. */
  rotulo: string
  /** Ordinal shown in the switcher, journal-style. */
  ordinal: string
  /** One line describing who this level is written for. */
  publico: string
  /** Longer description used on the cover and the "sobre" page. */
  descricao: string
  /** CSS custom property holding this level's accent colour. */
  cor: string
  corSuave: string
}

export const NIVEL_INFO: Record<Nivel, NivelInfo> = {
  leigo: {
    id: 'leigo',
    rotulo: 'Leigo',
    ordinal: 'I',
    publico: 'Para quem nunca leu um artigo científico',
    descricao:
      'Sem jargão e sem pressupor formação na área. Usa analogias do dia a dia para explicar o que a droga faz, o que já se sabe e o que ainda não se sabe.',
    cor: 'var(--color-leigo)',
    corSuave: 'var(--color-leigo-soft)',
  },
  intermediario: {
    id: 'intermediario',
    rotulo: 'Intermediário',
    ordinal: 'II',
    publico: 'Para quem tem base em biologia ou saúde',
    descricao:
      'Assume familiaridade com termos como receptor, fase de ensaio clínico e placebo. Entra no mecanismo, nos números do estudo e no que diferencia esta droga das existentes.',
    cor: 'var(--color-intermediario)',
    corSuave: 'var(--color-intermediario-soft)',
  },
  especialista: {
    id: 'especialista',
    rotulo: 'Especialista',
    ordinal: 'III',
    publico: 'Para pesquisadores e profissionais de saúde',
    descricao:
      'Farmacologia molecular, desenho estatístico, farmacocinética, comparação com o comparador de classe e as limitações metodológicas que a nota à imprensa não menciona.',
    cor: 'var(--color-especialista)',
    corSuave: 'var(--color-especialista-soft)',
  },
}

export interface Referencia {
  /** Stable key cited from the body text via <Cit id="..." />. */
  id: string
  autores: string
  titulo: string
  veiculo: string
  data: string
  url: string
  /** Marks primary sources (press releases, filings, registries) vs coverage. */
  tipo: 'primaria' | 'secundaria' | 'literatura' | 'registro'
}

/**
 * Fato isolado, com unidade e fonte — a unidade que um mecanismo generativo
 * consegue extrair e citar sem precisar interpretar o artigo inteiro.
 */
export interface DadoChave {
  rotulo: string
  valor: string
  detalhe?: string
  /** Ids de `referencias.ts` que sustentam o número. */
  refs?: string[]
}

/**
 * Pergunta real com resposta direta e autossuficiente (40–70 palavras).
 * Vive só na página-âncora da edição, nunca repetida nos três níveis: o mesmo
 * bloco em quatro URLs seria conteúdo duplicado.
 */
export interface Pergunta {
  pergunta: string
  resposta: string
  refs?: string[]
}

/** Entidade nomeada para `about`/`mentions` nos dados estruturados. */
export interface Entidade {
  nome: string
  tipo: 'Drug' | 'MedicalCondition' | 'Organization' | 'MedicalEntity'
  /** Só URLs verificadas. Um `sameAs` inventado é pior que nenhum. */
  sameAs?: string[]
}

export interface EdicaoMeta {
  /** URL segment and folder name. */
  slug: string
  /** Sequential article number within the journal. */
  numero: number
  volume: number
  titulo: string
  subtitulo: string
  /** Structured abstract, rendered in the journal's "Resumo" box. */
  resumo: string
  /** ISO date (YYYY-MM-DD) used for ordering, RSS and the article header. */
  publicadoEm: string
  atualizadoEm?: string
  palavrasChave: string[]
  /** Section of the journal, e.g. "Farmacologia". */
  secao: string
  /** Per-level reading time in minutes. */
  tempoLeitura: Record<Nivel, number>
  /** Short teaser per level, shown on the cover. */
  chamada: Record<Nivel, string>
  /** Verifiable facts, shown on the edição's anchor page. */
  dadosChave: DadoChave[]
  /** Direct answers to the questions people actually type. */
  perguntas: Pergunta[]
  /** What this edição is about, for structured data. */
  entidades: Entidade[]
  /** One sentence answering the headline question, for the anchor page lede. */
  respostaCurta: string
  /** Set false while drafting; drafts are excluded from listings and feeds. */
  publicado: boolean
}

export interface Edicao {
  meta: EdicaoMeta
  referencias: Referencia[]
  /**
   * Lazily-imported MDX body per level. Typed with `MDXProps` so the page can
   * pass the article-scoped `components` map (notably `<Cit>`) down into it.
   */
  niveis: Record<Nivel, () => Promise<{ default: ComponentType<MDXProps> }>>
}
