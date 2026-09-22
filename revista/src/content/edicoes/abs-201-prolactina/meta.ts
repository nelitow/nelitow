import type { EdicaoMeta } from '@/content/types'

export const meta: EdicaoMeta = {
  slug: 'abs-201-prolactina',
  numero: 1,
  volume: 1,
  secao: 'Farmacologia',
  titulo: 'Bloquear a prolactina para tratar a calvície',
  subtitulo:
    'O que os dados de Fase 1 do ABS-201 mostram — e, principalmente, o que ainda não mostram',
  resumo:
    'O ABS-201 é um anticorpo monoclonal desenhado por inteligência artificial que bloqueia o receptor de prolactina (PRLR). É a primeira tentativa séria de tratar a alopecia androgenética por uma via que não passa pela di-hidrotestosterona. Em junho de 2026 a Absci divulgou os dados intermediários de Fase 1: nenhum evento adverso grave em 32 voluntários saudáveis e uma meia-vida estimada em pelo menos 65 dias, o que permitiria duas ou três injeções por semestre. No mesmo dia a empresa levantou US$ 100 milhões, incluindo US$ 40 milhões da Eli Lilly. Nada disso, porém, é evidência de que a droga faça cabelo crescer em gente careca: até a data desta edição, nenhum dado de eficácia em humanos com alopecia foi publicado. Esta edição reconstrói o que se sabe em três níveis de leitura.',
  publicadoEm: '2026-09-22',
  palavrasChave: [
    'alopecia androgenética',
    'receptor de prolactina',
    'ABS-201',
    'anticorpo monoclonal',
    'ensaio clínico de fase 1',
    'Absci',
  ],
  tempoLeitura: {
    leigo: 6,
    intermediario: 12,
    especialista: 19,
  },
  chamada: {
    leigo: 'O cabelo tem um freio de mão. Uma droga nova tenta soltá-lo — e ninguém ainda sabe se funciona.',
    intermediario:
      'Meia-vida de 65 dias, nenhum evento adverso grave e um alvo que não é a DHT. Por que isso interessa e onde estão as ressalvas.',
    especialista:
      'Inibição de STAT5, preservação do pool K15+/CD34+ e um comparador de classe que entregou +14 fios/cm². A leitura crítica do desenho do HEADLINE.',
  },
  publicado: true,
}

export default meta
