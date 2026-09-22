#!/usr/bin/env node
/**
 * Validador das normas de redação.
 *
 *   npm run validar                    # todas as edições
 *   npm run validar -- abs-201-prolactina
 *   npm run validar -- --metricas      # imprime a tabela de métricas por nível
 *   npm run validar -- --estrito       # avisos também reprovam
 *
 * Sai com código 1 se houver qualquer achado de nível "erro".
 */

import { readdir, readFile } from 'node:fs/promises'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { analisar } from '../src/lib/validacao/analisador.mjs'
import { METRICAS } from '../src/lib/validacao/regras.mjs'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIR = join(RAIZ, 'src', 'content', 'edicoes')
const NIVEIS = ['leigo', 'intermediario', 'especialista']

const cor = process.stdout.isTTY
  ? {
      vermelho: (s) => `\x1b[31m${s}\x1b[0m`,
      amarelo: (s) => `\x1b[33m${s}\x1b[0m`,
      verde: (s) => `\x1b[32m${s}\x1b[0m`,
      cinza: (s) => `\x1b[90m${s}\x1b[0m`,
      forte: (s) => `\x1b[1m${s}\x1b[0m`,
    }
  : { vermelho: (s) => s, amarelo: (s) => s, verde: (s) => s, cinza: (s) => s, forte: (s) => s }

const argv = process.argv.slice(2)
const estrito = argv.includes('--estrito')
const mostrarMetricas = argv.includes('--metricas')
const alvo = argv.find((a) => !a.startsWith('--'))

async function main() {
  let slugs
  try {
    slugs = (await readdir(DIR, { withFileTypes: true }))
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  } catch {
    console.error(`Nenhuma edição encontrada em ${relative(RAIZ, DIR)}.`)
    process.exit(1)
  }

  if (alvo) slugs = slugs.filter((s) => s === alvo)
  if (slugs.length === 0) {
    console.error(alvo ? `Edição "${alvo}" não existe.` : 'Nenhuma edição para validar.')
    process.exit(1)
  }

  let erros = 0
  let avisos = 0
  const tabela = []

  for (const slug of slugs.sort()) {
    console.log(`\n${cor.forte(slug)}`)

    for (const nivel of NIVEIS) {
      const caminho = join(DIR, slug, `${nivel}.mdx`)
      let fonte
      try {
        fonte = await readFile(caminho, 'utf8')
      } catch {
        console.log(`  ${cor.vermelho('✗')} ${nivel}: arquivo ausente`);
        erros += 1
        continue
      }

      // Esqueletos recém-criados ainda são TODO; cobrar normas neles é ruído.
      if (/\bTODO\b/.test(fonte)) {
        console.log(`  ${cor.cinza('–')} ${nivel}: rascunho (contém TODO), não validado`)
        continue
      }

      const r = analisar(fonte, nivel)
      tabela.push({ slug, nivel, ...r })

      const doNivel = r.achados.filter((a) => a.nivel === 'erro')
      const deAviso = r.achados.filter((a) => a.nivel === 'aviso')
      erros += doNivel.length
      avisos += deAviso.length

      const marca =
        doNivel.length > 0 ? cor.vermelho('✗') : deAviso.length > 0 ? cor.amarelo('!') : cor.verde('✓')

      console.log(
        `  ${marca} ${nivel} ${cor.cinza(`· ${r.palavras} palavras · ${r.frases} frases`)}`,
      )

      for (const a of [...doNivel, ...deAviso]) {
        const etiqueta = a.nivel === 'erro' ? cor.vermelho('erro ') : cor.amarelo('aviso')
        const local = a.linha ? cor.cinza(`${relative(RAIZ, caminho)}:${a.linha}`) : cor.cinza('métrica')
        console.log(`      ${etiqueta} ${a.mensagem}`)
        console.log(`            ${local}`)
        if (a.trecho) console.log(`            ${cor.cinza(a.trecho)}`)
        if (a.saida) console.log(`            ${cor.cinza(`→ ${a.saida}`)}`)
      }
    }
  }

  if (mostrarMetricas) imprimirMetricas(tabela)

  console.log('')
  if (erros > 0) {
    console.log(cor.vermelho(`${erros} erro(s)`) + cor.cinza(` · ${avisos} aviso(s)`))
    console.log(cor.cinza('As normas estão em /normas e em src/lib/validacao/regras.mjs.'))
    process.exit(1)
  }
  if (avisos > 0 && estrito) {
    console.log(cor.amarelo(`${avisos} aviso(s)`) + cor.cinza(' — modo estrito'))
    process.exit(1)
  }
  console.log(cor.verde('Normas de redação: aprovado') + cor.cinza(` · ${avisos} aviso(s)`))
}

function imprimirMetricas(tabela) {
  console.log(`\n${cor.forte('Métricas')}`)

  for (const metrica of METRICAS) {
    const limite =
      metrica.min != null ? `min ${metrica.min}` : metrica.max != null ? `máx ${metrica.max}` : ''
    console.log(`\n  ${metrica.rotulo} ${cor.cinza(`(${metrica.unidade}, ${limite})`)}`)

    for (const linha of tabela) {
      const v = linha.valores[metrica.id]
      if (v == null) continue
      const ruim =
        (metrica.min != null && v < metrica.min) || (metrica.max != null && v > metrica.max)
      const texto = Number.isInteger(v) ? String(v) : v.toFixed(2).replace('.', ',')
      console.log(
        `    ${(linha.nivel + '            ').slice(0, 14)} ${
          ruim ? cor.amarelo(texto) : cor.verde(texto)
        }`,
      )
    }
  }
}

main().catch((erro) => {
  console.error(erro)
  process.exit(1)
})
