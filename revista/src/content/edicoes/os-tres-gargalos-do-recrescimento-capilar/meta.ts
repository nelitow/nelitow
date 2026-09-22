import type { EdicaoMeta } from '@/content/types'

export const meta: EdicaoMeta = {
  slug: 'os-tres-gargalos-do-recrescimento-capilar',
  numero: 5,
  volume: 1,
  secao: 'Fisiologia',
  titulo: 'Os três gargalos do recrescimento capilar',
  subtitulo: 'TODO: uma linha que diga o que esta edição acrescenta.',
  resumo:
    'TODO: resumo de 3 a 5 frases. O que foi achado, em que modelo, com que força de evidência e o que continua em aberto.',
  publicadoEm: '2026-09-26',
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
