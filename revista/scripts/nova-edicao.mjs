#!/usr/bin/env node
/**
 * Scaffolds tomorrow's edição.
 *
 *   npm run nova-edicao -- "Bloquear a prolactina para tratar a calvície"
 *   npm run nova-edicao -- "Título" --secao Farmacologia --data 2026-09-23
 *
 * Creates the folder, the three level stubs, meta and references, and inserts
 * the entry into src/content/registry.ts. The edição starts as `publicado:
 * false`, so it is excluded from the cover, the archive, the feed and the
 * sitemap until you flip that flag.
 */

import { mkdir, readFile, writeFile, access } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR_EDICOES = join(RAIZ, 'src', 'content', 'edicoes')
const REGISTRY = join(RAIZ, 'src', 'content', 'registry.ts')
const MARCADOR = '// <!-- nova-edicao: não remova este comentário, o script insere acima dele -->'

const NIVEIS = ['leigo', 'intermediario', 'especialista']

function criarSlug(titulo) {
  return titulo
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function lerArgumentos(argv) {
  const posicionais = []
  const opcoes = {}

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith('--')) {
      opcoes[argv[i].slice(2)] = argv[i + 1]
      i += 1
    } else {
      posicionais.push(argv[i])
    }
  }

  return { posicionais, opcoes }
}

function hojeISO() {
  return new Date().toISOString().slice(0, 10)
}

async function existe(caminho) {
  try {
    await access(caminho)
    return true
  } catch {
    return false
  }
}

/** Highest edição number already registered, so the new one continues the run. */
async function proximoNumero() {
  const registry = await readFile(REGISTRY, 'utf8')
  const importados = [...registry.matchAll(/from '\.\/edicoes\/([^/]+)\/meta'/g)].map((m) => m[1])

  let maior = 0
  for (const slug of importados) {
    try {
      const meta = await readFile(join(DIR_EDICOES, slug, 'meta.ts'), 'utf8')
      const numero = Number(meta.match(/numero:\s*(\d+)/)?.[1] ?? 0)
      if (numero > maior) maior = numero
    } catch {
      /* skip unreadable entries */
    }
  }

  return maior + 1
}

const modeloMeta = ({ slug, numero, titulo, secao, data }) => `import type { EdicaoMeta } from '@/content/types'

export const meta: EdicaoMeta = {
  slug: '${slug}',
  numero: ${numero},
  volume: 1,
  secao: '${secao}',
  titulo: '${titulo.replace(/'/g, "\\'")}',
  subtitulo: 'TODO: uma linha que diga o que esta edição acrescenta.',
  resumo:
    'TODO: resumo de 3 a 5 frases. O que foi achado, em que modelo, com que força de evidência e o que continua em aberto.',
  publicadoEm: '${data}',
  palavrasChave: ['TODO'],
  tempoLeitura: {
    leigo: 5,
    intermediario: 10,
    especialista: 16,
  },
  chamada: {
    leigo: 'TODO: chamada de uma frase, sem jargão.',
    intermediario: 'TODO: chamada de uma frase, com o número que importa.',
    especialista: 'TODO: chamada de uma frase, com a ressalva metodológica.',
  },

  // Uma frase que responde à pergunta do título. Aparece em destaque na página
  // da edição e é a passagem mais provável de ser citada fora dela, então
  // precisa se sustentar sozinha, com data e magnitude.
  respostaCurta: 'TODO.',

  // Fatos isolados, com unidade e fonte. É o formato mais extraível que existe.
  dadosChave: [
    // { rotulo: 'Meia-vida estimada', valor: '≥ 65 dias', detalhe: 'ressalva', refs: ['chave'] },
  ],

  // Perguntas que as pessoas realmente digitam. Resposta de 40 a 70 palavras,
  // autossuficiente: nada de "sim", "não" ou "como vimos acima".
  perguntas: [
    // { pergunta: 'TODO?', resposta: 'TODO.', refs: ['chave'] },
  ],

  // Entidades para os dados estruturados. Só use "sameAs" com URL verificada:
  // um sameAs inventado é pior que nenhum.
  entidades: [
    // { nome: 'TODO', tipo: 'Drug', sameAs: ['https://...'] },
  ],

  // Vire para true quando a edição estiver pronta para publicar.
  publicado: false,
}

export default meta
`

const modeloReferencias = `import type { Referencia } from '@/content/types'

export const referencias: Referencia[] = [
  // {
  //   id: 'chave-curta',
  //   autores: '',
  //   titulo: '',
  //   veiculo: '',
  //   data: '',
  //   url: '',
  //   tipo: 'primaria', // primaria | secundaria | literatura | registro
  // },
]

export default referencias
`

const MODELOS_NIVEL = {
  leigo: `import { Caixa } from '@/components/journal/Caixa'
import { Figura } from '@/components/journal/Figura'

TODO: abertura concreta. Uma afirmação que o leitor consiga visualizar, sem
nenhum termo técnico ainda.

## TODO: o conceito básico, com analogia

TODO.

<Caixa tipo="definicao" titulo="TODO">

TODO: defina aqui o único termo técnico que o texto não consegue evitar.

</Caixa>

## TODO: o que foi realmente demonstrado

TODO. Deixe explícito em que modelo — camundongo, tecido em cultura, pessoa.

## TODO: o que ainda não se sabe

TODO.

## O resumo honesto

TODO: o que um leitor deve concluir e o que ele não deve fazer com isso.
`,

  intermediario: `import { Caixa } from '@/components/journal/Caixa'
import { Figura } from '@/components/journal/Figura'

TODO: abertura que situe o achado no contexto da área.

## TODO: o alvo ou mecanismo

TODO.<Cit id="TODO" />

## TODO: o que o pré-clínico mostrou

TODO.

## TODO: o desenho do estudo

TODO: população, n, braços, desfechos, duração.

<Caixa tipo="nota" titulo="TODO">

TODO: a ressalva que muda a leitura do resultado.

</Caixa>

## TODO: os números

TODO. Sempre declare a base de comparação.

## O que observar no próximo dado

TODO.
`,

  especialista: `import { Caixa } from '@/components/journal/Caixa'
import { Figura, Tabela } from '@/components/journal/Figura'

TODO: declare de saída a natureza e a limitação da base documental.

## Racional molecular

TODO.<Cit id="TODO" />

## Desenho e método

TODO.

<Caixa tipo="metodo" titulo="TODO">

TODO: o ponto técnico que a cobertura não pegou.

</Caixa>

## Limitações

TODO: enumere. Potência, multiplicidade, base de comparação, generalização,
conflito de interesse da fonte.

## Síntese

TODO: a posição defensável dado o que existe hoje.
`,
}

async function main() {
  const { posicionais, opcoes } = lerArgumentos(process.argv.slice(2))
  const titulo = posicionais.join(' ').trim()

  if (!titulo) {
    console.error('Uso: npm run nova-edicao -- "Título da edição" [--secao Farmacologia] [--data YYYY-MM-DD]')
    process.exit(1)
  }

  const slug = opcoes.slug ?? criarSlug(titulo)
  const secao = opcoes.secao ?? 'Farmacologia'
  const data = opcoes.data ?? hojeISO()
  const pasta = join(DIR_EDICOES, slug)

  if (await existe(pasta)) {
    console.error(`A edição "${slug}" já existe em src/content/edicoes/.`)
    process.exit(1)
  }

  const numero = await proximoNumero()

  await mkdir(pasta, { recursive: true })
  await writeFile(join(pasta, 'meta.ts'), modeloMeta({ slug, numero, titulo, secao, data }))
  await writeFile(join(pasta, 'referencias.ts'), modeloReferencias)

  for (const nivel of NIVEIS) {
    await writeFile(join(pasta, `${nivel}.mdx`), MODELOS_NIVEL[nivel])
  }

  // Register it, keeping the marker comment in place for the next run.
  const registry = await readFile(REGISTRY, 'utf8')

  if (!registry.includes(MARCADOR)) {
    console.error('Marcador não encontrado em registry.ts — registre a edição manualmente.')
    process.exit(1)
  }

  const camelo = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())

  const atualizado = registry
    .replace(
      /^import type \{ Edicao, Nivel \} from '\.\/types'$/m,
      `import { meta as ${camelo} } from './edicoes/${slug}/meta'\nimport { referencias as ${camelo}Refs } from './edicoes/${slug}/referencias'\nimport type { Edicao, Nivel } from './types'`,
    )
    .replace(
      MARCADOR,
      `{
    meta: ${camelo},
    referencias: ${camelo}Refs,
    niveis: {
${NIVEIS.map((n) => `      ${n}: () => import('./edicoes/${slug}/${n}.mdx'),`).join('\n')}
    },
  },
  ${MARCADOR}`,
    )

  await writeFile(REGISTRY, atualizado)

  console.log(`
Edição nº ${numero} criada.

  src/content/edicoes/${slug}/
    meta.ts            ← título, resumo, chamadas, resposta curta,
                         dados-chave, perguntas e entidades
    referencias.ts     ← adicione as fontes antes de escrever
    leigo.mdx
    intermediario.mdx
    especialista.mdx

Registrada em src/content/registry.ts com publicado: false.

Rode "npm run dev" e abra /edicao/${slug}/leigo para escrever com preview.
Antes de publicar, rode "npm run validar -- ${slug}" — as normas de redação
estão em /normas e reprovam o build se violadas.
`)
}

main().catch((erro) => {
  console.error(erro)
  process.exit(1)
})
