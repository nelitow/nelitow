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
  // Correção no mesmo dia: os três níveis tratavam os +14 fios/cm² do HMI-115
  // como teto da classe sem registrar o argumento de ocupação de receptor.
  atualizadoEm: '2026-09-22',
  palavrasChave: [
    'alopecia androgenética',
    'receptor de prolactina',
    'ABS-201',
    'anticorpo monoclonal',
    'ensaio clínico de fase 1',
    'Absci',
  ],
  tempoLeitura: {
    leigo: 7,
    intermediario: 14,
    especialista: 24,
  },
  chamada: {
    leigo: 'O cabelo tem um freio de mão. Uma droga nova tenta soltá-lo — e ninguém ainda sabe se funciona.',
    intermediario:
      'Meia-vida de 65 dias, nenhum evento adverso grave e um alvo que não é a DHT. Por que isso interessa e onde estão as ressalvas.',
    especialista:
      'Inibição de STAT5, preservação do pool K15+/CD34+ e um comparador de classe que entregou +14 fios/cm². A leitura crítica do desenho do HEADLINE.',
  },
  respostaCurta:
    'Ainda não há resposta. Até 22 de setembro de 2026 o ABS-201 tinha segurança e farmacocinética demonstradas em 32 voluntários saudáveis, e nenhuma contagem de fios divulgada em pessoas com alopecia androgenética.',

  dadosChave: [
    { rotulo: 'Alvo molecular', valor: 'Receptor de prolactina (PRLR)', refs: ['caso-absci'] },
    {
      rotulo: 'Fase clínica',
      valor: 'Fase 1/2a',
      detalhe: 'Ensaio HEADLINE, NCT07317544',
      refs: ['headline-registro'],
    },
    {
      rotulo: 'Participantes da Fase 1',
      valor: '32 adultos saudáveis',
      detalhe: 'sem alopecia; quatro coortes de dose única ascendente',
      refs: ['fase1'],
    },
    {
      rotulo: 'Doses testadas',
      valor: '150, 450, 900 e 1800 mg',
      detalhe: 'por via intravenosa, na porção SAD',
      refs: ['fase1'],
    },
    {
      rotulo: 'Meia-vida estimada',
      valor: '≥ 65 dias',
      detalhe: 'a partir de seguimento até o dia 56 nas coortes de dose mais baixa',
      refs: ['fase1'],
    },
    {
      rotulo: 'Posologia projetada',
      valor: '2 a 3 injeções por semestre',
      detalhe: 'pendente de confirmação na via subcutânea',
      refs: ['fase1'],
    },
    {
      rotulo: 'Eventos adversos graves',
      valor: 'Nenhum',
      detalhe: 'dados cegos; efeito mais comum foi cefaleia leve e transitória',
      refs: ['fase1'],
    },
    {
      rotulo: 'Dados de eficácia em humanos',
      valor: 'Nenhum publicado',
      detalhe: 'situação em 22 de setembro de 2026',
      refs: ['fase1'],
    },
    {
      rotulo: 'Leitura de eficácia prevista',
      valor: '2º semestre de 2026',
      detalhe: 'parcial; resultado completo prometido para o início de 2027',
      refs: ['fase1', 'q2-2026'],
    },
    {
      rotulo: 'Comparador de classe (HMI-115)',
      valor: '+14 fios não-velo/cm²',
      detalhe: 'sobre o basal, em Fase 1b com 240 mg a cada duas semanas — não é comparação direta',
      refs: ['hmi115-fase1b', 'revisao-anticorpos'],
    },
    {
      rotulo: 'Ocupação de receptor visada',
      valor: '> 90%',
      detalhe:
        'projeção de modelo da Absci; estima 50–70% para o regime do HMI-115. Não medida em humanos para nenhum dos dois',
      refs: ['caso-absci', 'absci-teleconferencia-q2'],
    },
    {
      rotulo: 'Financiamento',
      valor: 'US$ 100 milhões',
      detalhe: 'incluindo US$ 40 milhões da Eli Lilly, sem direitos sobre o programa',
      refs: ['oferta'],
    },
  ],

  perguntas: [
    {
      pergunta: 'O ABS-201 funciona para calvície?',
      resposta:
        'Não se sabe. Até setembro de 2026, nenhum estudo mediu contagem de fios em pessoas com alopecia androgenética tratadas com ABS-201. O que existe é segurança e farmacocinética em 32 voluntários saudáveis, além de resultados em camundongo e em couro cabeludo humano cultivado em laboratório. A primeira leitura de eficácia foi prometida para o segundo semestre de 2026.',
      refs: ['fase1', 'exvivo'],
    },
    {
      pergunta: 'Como o ABS-201 é diferente da finasterida?',
      resposta:
        'A finasterida bloqueia a enzima que converte testosterona em DHT. O ABS-201 bloqueia o receptor de prolactina, uma via que não passa pelos hormônios masculinos em nenhum ponto. Por operarem em rotas separadas, os dois poderiam em tese ser somados, e o ABS-201 atenderia quem não pode usar antiandrogênico. Essa aditividade não foi testada.',
      refs: ['caso-absci', 'exvivo'],
    },
    {
      pergunta: 'Quantas aplicações de ABS-201 seriam necessárias por ano?',
      resposta:
        'A empresa projeta duas a três injeções a cada seis meses, com base numa meia-vida estimada em pelo menos 65 dias. A estimativa vem da via intravenosa, enquanto o produto será subcutâneo, e a própria Absci a descreve como pendente de confirmação. Se confirmada, substituiria o comprimido diário da finasterida.',
      refs: ['fase1'],
    },
    {
      pergunta: 'O ABS-201 tem efeitos colaterais?',
      resposta:
        'Nas quatro coortes de dose única não houve nenhum evento adverso grave, e o efeito mais frequente foi dor de cabeça leve e passageira. Esses dados são cegos, ou seja, agrupam quem recebeu a droga e quem recebeu placebo. Trinta e dois participantes com exposição única não permitem detectar eventos raros.',
      refs: ['fase1'],
    },
    {
      pergunta: 'A prolactina causa queda de cabelo?',
      resposta:
        'A prolactina age como sinal de término do ciclo do fio: empurra o folículo da fase de crescimento para a fase de regressão. O folículo humano tem receptores para ela e produz um pouco dela localmente. A hipótese do ABS-201 é que esse freio esteja sendo acionado cedo demais no couro cabeludo de quem está calvo.',
      refs: ['exvivo', 'practical-derm'],
    },
    {
      pergunta: 'O resultado do HMI-115 mostra o limite dos bloqueadores de prolactina?',
      resposta:
        'Provavelmente não mostra. Na Fase 1b, o HMI-115 foi aplicado em 240 mg a cada duas semanas, e a Absci estima por modelagem que esse regime ocupava só 50% a 70% dos receptores de prolactina, abaixo dos 90% que considera necessários. A estimativa é de uma concorrente e a ocupação nunca foi medida em humanos, nem para o HMI-115 nem para o ABS-201.',
      refs: ['hmi115-fase1b', 'caso-absci'],
    },
    {
      pergunta: 'Quando o ABS-201 pode chegar ao mercado?',
      resposta:
        'Não antes do fim da década, se chegar. Depois da prova de conceito prevista para 2026 e 2027, ainda seria necessário um estudo de Fase 3 e a aprovação de agências reguladoras. O ABS-201 não foi aprovado pela FDA, pela EMA nem pela Anvisa, e sua eficácia não está estabelecida.',
      refs: ['fase1', 'q2-2026'],
    },
    {
      pergunta: 'Por que a Eli Lilly investiu na Absci?',
      resposta:
        'A Lilly aplicou US$ 40 milhões dentro de uma oferta de US$ 100 milhões em 24 de junho de 2026. É participação acionária e não confere nenhum direito sobre o programa. O representante da Lilly entrou no conselho consultivo de endometriose da Absci, não no de alopecia, o que sugere interesse maior na segunda indicação do mesmo alvo.',
      refs: ['oferta', 'q2-2026'],
    },
  ],

  entidades: [
    {
      nome: 'ABS-201',
      tipo: 'Drug',
      sameAs: ['https://en.wikipedia.org/wiki/ABS-201', 'https://clinicaltrials.gov/study/NCT07317544'],
    },
    {
      nome: 'Alopecia androgenética',
      tipo: 'MedicalCondition',
      sameAs: [
        'https://pt.wikipedia.org/wiki/Alopecia_androgen%C3%A9tica',
        'https://www.wikidata.org/wiki/Q2276095',
      ],
    },
    { nome: 'Receptor de prolactina', tipo: 'MedicalEntity' },
    { nome: 'Absci Corporation', tipo: 'Organization', sameAs: ['https://www.absci.com/'] },
  ],

  publicado: true,
}

export default meta
