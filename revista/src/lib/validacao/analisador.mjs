/**
 * Motor de análise das normas de redação.
 *
 * Recebe o fonte MDX de um nível e devolve métricas + achados com número de
 * linha. Não tem dependências: roda no Node do validador e é importável pelo
 * Next se algum dia a redação quiser um painel.
 */

import {
  CONECTIVOS_INICIAIS,
  CONSTRUCOES,
  LEXICO,
  MARCAS_AUTORAIS,
  METRICAS,
} from './regras.mjs'

// ---------------------------------------------------------------------------
// Preparação do texto
// ---------------------------------------------------------------------------

/**
 * Classifica cada linha do MDX. Só as linhas de prosa entram na análise
 * linguística — imports, blocos de código e linhas que são apenas marcação JSX
 * não são texto que o leitor lê.
 */
export function classificarLinhas(mdx) {
  const linhas = mdx.split('\n')
  const saida = []
  let dentroDeCodigo = false
  // Tags JSX abertas em várias linhas (<Figura\n  legenda={…}\n>) não são
  // prosa; sem isto os nomes de atributo entram na contagem de palavras.
  let dentroDeTag = false

  for (let i = 0; i < linhas.length; i += 1) {
    const bruta = linhas[i]
    const texto = bruta.trim()

    if (texto.startsWith('```')) {
      dentroDeCodigo = !dentroDeCodigo
      saida.push({ n: i + 1, bruta, tipo: 'codigo', prosa: '' })
      continue
    }
    if (dentroDeCodigo) {
      saida.push({ n: i + 1, bruta, tipo: 'codigo', prosa: '' })
      continue
    }
    if (dentroDeTag) {
      const prosaAtributo = atributosDeProsa(texto)
      if (/>\s*$/.test(texto) || /^\s*>/.test(texto)) dentroDeTag = false
      saida.push({
        n: i + 1,
        bruta,
        tipo: prosaAtributo ? 'prosa' : 'jsx',
        prosa: prosaAtributo,
      })
      continue
    }
    // Abre uma tag e não a fecha na mesma linha.
    if (/^<[A-Za-z]/.test(texto) && !texto.includes('>')) {
      dentroDeTag = true
      saida.push({ n: i + 1, bruta, tipo: 'jsx', prosa: '' })
      continue
    }
    if (/^import\s/.test(texto) || /^export\s/.test(texto)) {
      saida.push({ n: i + 1, bruta, tipo: 'import', prosa: '' })
      continue
    }
    if (texto === '') {
      saida.push({ n: i + 1, bruta, tipo: 'vazia', prosa: '' })
      continue
    }
    if (/^#{1,6}\s/.test(texto)) {
      saida.push({ n: i + 1, bruta, tipo: 'titulo', prosa: texto.replace(/^#{1,6}\s+/, '') })
      continue
    }
    if (/^([-*]|\d+\.)\s/.test(texto)) {
      saida.push({ n: i + 1, bruta, tipo: 'lista', prosa: semMarcacao(texto) })
      continue
    }
    if (/^\|/.test(texto)) {
      saida.push({ n: i + 1, bruta, tipo: 'tabela', prosa: '' })
      continue
    }

    const prosa = semMarcacao(texto)
    // Linha que só carregava marcação JSX não sobra nada de legível.
    saida.push({ n: i + 1, bruta, tipo: prosa.length > 0 ? 'prosa' : 'jsx', prosa })
  }

  return saida
}

/**
 * Dentro de uma tag multilinha, só o valor textual de atributos de prosa
 * interessa; `legenda={<>…</>}` é JSX e é analisado pelas linhas internas.
 */
function atributosDeProsa(texto) {
  const achado = texto.match(/\b(legenda|titulo|fonte|alt)="([^"]*)"/)
  return achado ? achado[2] : ''
}

/** Remove marcação MDX/JSX preservando o texto que o leitor vê. */
function semMarcacao(texto) {
  return texto
    // Atributos de prosa viram texto analisável antes de as tags caírem.
    .replace(/\b(legenda|titulo|fonte|alt)="([^"]*)"/g, ' $2 ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/(^|\s)\*([^*]+)\*/g, '$1$2')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^([-*]|\d+\.)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const ABREVIACOES = new Set([
  'dr', 'dra', 'sr', 'sra', 'prof', 'ex', 'etc', 'al', 'cf', 'p', 'pp', 'n', 'v', 'vol',
  'fig', 'tab', 'ed', 'org', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago',
  'set', 'out', 'nov', 'dez', 'aprox', 'ca', 'i.e', 'e.g', 'us', 'r',
])

/** Divide em frases tolerando abreviações e números com ponto de milhar. */
export function dividirFrases(texto) {
  const frases = []
  let atual = ''

  for (let i = 0; i < texto.length; i += 1) {
    atual += texto[i]

    if (!'.!?…'.includes(texto[i])) continue

    const resto = texto.slice(i + 1)
    // Só encerra se o que vem depois começa frase nova.
    if (!/^\s+["“«(]?[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9]/.test(resto)) continue

    const anterior = atual.slice(0, -1)
    const ultimoToken = (anterior.match(/([\p{L}\p{N}.]+)$/u) ?? [''])[0].toLowerCase()

    if (ABREVIACOES.has(ultimoToken.replace(/\.$/, ''))) continue
    // "13.495.277" e "Fase 1." não terminam frase.
    if (/\d$/.test(anterior) && /^\s*\d/.test(resto)) continue

    frases.push(atual.trim())
    atual = ''
  }

  if (atual.trim()) frases.push(atual.trim())
  return frases.filter((f) => contarPalavras(f) > 0)
}

export function contarPalavras(texto) {
  const achados = texto.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)
  return achados ? achados.length : 0
}

function coeficienteVariacao(valores) {
  if (valores.length < 3) return null
  const media = valores.reduce((a, b) => a + b, 0) / valores.length
  if (media === 0) return null
  const variancia = valores.reduce((s, v) => s + (v - media) ** 2, 0) / valores.length
  return Math.sqrt(variancia) / media
}

// ---------------------------------------------------------------------------
// Análise
// ---------------------------------------------------------------------------

export function analisar(mdx, nivel = null) {
  const linhas = classificarLinhas(mdx)
  const achados = []

  const linhasAnalisaveis = linhas.filter((l) => ['prosa', 'lista', 'titulo'].includes(l.tipo))
  const textoProsa = linhasAnalisaveis.map((l) => l.prosa).join('\n')
  const palavras = contarPalavras(textoProsa)
  const porMil = (n) => (palavras === 0 ? 0 : (n / palavras) * 1000)

  // --- Léxico e construções, com número de linha ---
  for (const entrada of LEXICO) {
    for (const linha of linhasAnalisaveis) {
      const ocorrencias = linha.prosa.match(entrada.termo)
      if (!ocorrencias) continue
      achados.push({
        tipo: 'lexico',
        id: entrada.rotulo,
        nivel: entrada.nivel,
        linha: linha.n,
        trecho: recorte(linha.prosa, ocorrencias[0]),
        mensagem: `Termo desaconselhado: "${ocorrencias[0]}"`,
        saida: entrada.saida,
      })
    }
  }

  for (const regra of CONSTRUCOES) {
    for (const linha of linhasAnalisaveis) {
      // `re` é global; zera o cursor entre linhas.
      regra.re.lastIndex = 0
      const ocorrencias = linha.prosa.match(regra.re)
      if (!ocorrencias) continue
      achados.push({
        tipo: 'construcao',
        id: regra.id,
        nivel: regra.nivel,
        linha: linha.n,
        trecho: recorte(linha.prosa, ocorrencias[0]),
        mensagem: regra.rotulo,
        saida: regra.saida,
      })
    }
  }

  // --- Métricas ---
  const paragrafos = agruparParagrafos(linhas)
  // Dividir por parágrafo, e não no texto inteiro, dá a cada frase a linha de
  // origem e evita frases que atravessam a fronteira de dois parágrafos.
  const frases = paragrafos.flatMap((par) =>
    dividirFrases(par.texto).map((texto) => ({ texto, linha: par.linha, palavras: contarPalavras(texto) })),
  )
  const tamanhosFrase = frases.map((f) => f.palavras)
  const tamanhosParagrafo = paragrafos.map((p) => contarPalavras(p.texto)).filter((n) => n >= 5)
  const repetidas = aberturasRepetidas(paragrafos)
  const longas = frases.filter((f) => f.palavras > 45)
  const trios = localizarTricolon(frases)

  const valores = {
    'variacao-frases': coeficienteVariacao(tamanhosFrase),
    'variacao-paragrafos': coeficienteVariacao(tamanhosParagrafo),
    travessoes: porMil((textoProsa.match(/—/g) ?? []).length),
    'conectivo-inicial':
      paragrafos.length === 0
        ? 0
        : (paragrafos.filter((p) => CONECTIVOS_INICIAIS.test(p.texto.trim())).length /
            paragrafos.length) *
          100,
    nominalizacao: porMil(
      (textoProsa.match(/\b[\p{L}]+(ção|ções|mento|mentos|dade|dades)\b/giu) ?? []).length,
    ),
    'adverbios-mente': porMil((textoProsa.match(/\b[\p{L}]+mente\b/giu) ?? []).length),
    'frase-longa': longas.length,
    tricolon: trios.length,
    'aberturas-repetidas': repetidas.length,
    'proporcao-listas':
      linhasAnalisaveis.length === 0
        ? 0
        : (linhas.filter((l) => l.tipo === 'lista').length / linhasAnalisaveis.length) * 100,
    // Contadas no fonte bruto: <Cit> é marcação, não prosa.
    'densidade-citacoes': porMil((mdx.match(/<Cit\b/g) ?? []).length),
    'densidade-numeros': porMil(contarNumerosInformativos(textoProsa)),
    'postura-autoral': (textoProsa.match(marcasAutorais()) ?? []).length,
  }

  for (const metrica of METRICAS) {
    const valor = valores[metrica.id]
    if (valor == null) continue

    // Um limiar por nível vence o limiar geral quando existe.
    const ajuste = (nivel && metrica.porNivel?.[nivel]) || {}
    const min = ajuste.min ?? metrica.min
    const max = ajuste.max ?? metrica.max

    const abaixo = min != null && valor < min
    const acima = max != null && valor > max
    if (!abaixo && !acima) continue

    const detalhe = detalharMetrica(metrica.id, { repetidas, longas, trios })

    achados.push({
      tipo: 'metrica',
      id: metrica.id,
      nivel: metrica.nivel,
      linha: null,
      mensagem: `${metrica.rotulo}: ${formatar(valor)} ${metrica.unidade} (${
        abaixo ? `mínimo ${min}` : `máximo ${max}`
      })${detalhe}`,
      saida: metrica.saida,
    })
  }

  return { palavras, frases: frases.length, paragrafos: paragrafos.length, valores, achados }
}

function agruparParagrafos(linhas) {
  const paragrafos = []
  let buffer = []
  let inicio = 0

  for (const linha of linhas) {
    if (linha.tipo === 'prosa') {
      if (buffer.length === 0) inicio = linha.n
      buffer.push(linha.prosa)
    } else if (buffer.length > 0) {
      paragrafos.push({ linha: inicio, texto: buffer.join(' ') })
      buffer = []
    }
  }
  if (buffer.length > 0) paragrafos.push({ linha: inicio, texto: buffer.join(' ') })

  return paragrafos
}

/** Três frases curtas seguidas, de comprimento quase igual, com a linha. */
function localizarTricolon(frases) {
  const achados = []
  for (let i = 0; i + 2 < frases.length; i += 1) {
    const trio = frases.slice(i, i + 3)
    if (trio.some((f, k) => k > 0 && f.linha !== trio[0].linha && f.linha - trio[0].linha > 6)) continue
    const n = trio.map((f) => f.palavras)
    if (n.every((v) => v <= 9) && Math.max(...n) - Math.min(...n) <= 4) {
      achados.push({ linha: trio[0].linha, trecho: trio.map((f) => f.texto).join(' ') })
    }
  }
  return achados
}

/** Anexa localização às métricas que têm um lugar concreto no arquivo. */
function detalharMetrica(id, { repetidas, longas, trios }) {
  if (id === 'aberturas-repetidas' && repetidas.length > 0) {
    return ` — repete: ${repetidas
      .map((r) => `"${r.chave}" (linhas ${r.linhas.join(', ')})`)
      .join('; ')}`
  }
  if (id === 'frase-longa' && longas.length > 0) {
    return ` — linhas ${[...new Set(longas.map((f) => f.linha))].join(', ')}`
  }
  if (id === 'tricolon' && trios.length > 0) {
    return trios.map((t) => `\n            linha ${t.linha}: "${t.trecho.slice(0, 110)}…"`).join('')
  }
  return ''
}

/** Aberturas de parágrafo repetidas, com as linhas onde ocorrem. */
function aberturasRepetidas(paragrafos) {
  const porChave = new Map()

  for (const p of paragrafos) {
    const chave = p.texto
      .toLowerCase()
      .replace(/[^\p{L}\s]/gu, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .join(' ')
    if (chave.length < 4) continue
    porChave.set(chave, [...(porChave.get(chave) ?? []), p.linha])
  }

  return [...porChave.entries()]
    .filter(([, linhas]) => linhas.length > 1)
    .map(([chave, linhas]) => ({ chave, linhas }))
}

/** Número acompanhado de unidade, percentual, data ou magnitude. */
function contarNumerosInformativos(texto) {
  const padrao =
    /\d[\d.,]*\s*(%|mg|kg|g\b|mL|L\b|cm²|cm\b|mm\b|dias?|semanas?|meses|anos?|horas?|milhões?|bilhões?|mil\b|fios|participantes|pacientes|voluntários|coortes|US\$|R\$|vezes|× )|\b(19|20)\d{2}\b|\bfase \d|\bn\s*=\s*\d/gi
  return (texto.match(padrao) ?? []).length
}

function formatar(valor) {
  return Number.isInteger(valor) ? String(valor) : valor.toFixed(2).replace('.', ',')
}

function recorte(texto, alvo) {
  const i = texto.indexOf(alvo)
  if (i === -1) return texto.slice(0, 90)
  const de = Math.max(0, i - 35)
  const ate = Math.min(texto.length, i + alvo.length + 35)
  return `${de > 0 ? '…' : ''}${texto.slice(de, ate)}${ate < texto.length ? '…' : ''}`
}

/** Cópia limpa do regex global, para não compartilhar `lastIndex` entre arquivos. */
function marcasAutorais() {
  return new RegExp(MARCAS_AUTORAIS.source, MARCAS_AUTORAIS.flags)
}
