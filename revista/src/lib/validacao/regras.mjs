/**
 * Normas de redação do Ensaio Aberto — parte executável.
 *
 * Este módulo é a fonte única: o validador (`npm run validar`) executa estas
 * regras e a página /normas renderiza estas mesmas regras. Não existe versão
 * "documental" separada que possa divergir do que a máquina cobra.
 *
 * Fundamentação empírica de cada limiar está em `porque`. As referências estão
 * em `FONTES`, no fim do arquivo.
 *
 * Níveis:
 *   'erro'  — bloqueia a publicação. Marca de origem automática.
 *   'aviso' — exige decisão editorial consciente, não bloqueia.
 */

// ---------------------------------------------------------------------------
// 1. Léxico — palavras cuja frequência disparou na era dos modelos de linguagem
// ---------------------------------------------------------------------------

/**
 * Cada entrada tem um substituto concreto. Banir sem oferecer saída produz
 * paráfrase pior; a regra só é útil se o redator souber o que escrever no lugar.
 */
export const LEXICO = [
  // — Calcos diretos das palavras-foco do inglês (delve, tapestry, realm…) —
  {
    termo: /\bmergulh(ar|ando|amos|e)\s+fundo\b/gi,
    rotulo: 'mergulhar fundo',
    nivel: 'erro',
    saida: 'Diga o que você vai fazer: "medir", "comparar", "reconstruir a cronologia".',
  },
  {
    termo: /\bdesvendar?\b/gi,
    rotulo: 'desvendar',
    nivel: 'erro',
    saida: '"explicar", "mostrar", "descrever". Nada aqui é um mistério.',
  },
  {
    termo: /\btapeçaria\b/gi,
    rotulo: 'tapeçaria (metáfora)',
    nivel: 'erro',
    saida: 'Corte. A metáfora não sobreviveu à tradução e não descreve nada.',
  },
  {
    termo: /\b(potencializar|alavancar|maximizar|impulsionar|catalisar|empoderar)\b/gi,
    rotulo: 'potencializar / alavancar / maximizar / impulsionar / catalisar / empoderar',
    nivel: 'erro',
    saida: 'Diga o efeito real: "aumenta a densidade em 14 fios/cm²", não "potencializa resultados".',
  },
  {
    termo: /\b(holístic[oa]|sinergia|ecossistema|jornada)\b/gi,
    rotulo: 'holístico / sinergia / ecossistema / jornada',
    nivel: 'erro',
    saida: 'Vocabulário de apresentação corporativa. Nomeie a coisa concreta.',
  },
  {
    termo: /\b(divisor de águas|game[ -]changer|mudança de jogo|revolucionári[oa])\b/gi,
    rotulo: 'divisor de águas / game-changer / revolucionário',
    nivel: 'erro',
    saida: 'Se o efeito é grande, dê o número. Se não há número, não é divisor de águas.',
  },
  {
    termo: /\b(desbloquear|destravar)\s+(o\s+)?potencial\b/gi,
    rotulo: 'desbloquear o potencial',
    nivel: 'erro',
    saida: 'Corte a frase inteira.',
  },

  // — Intensificadores vazios —
  {
    termo: /\bcrucial\b/gi,
    rotulo: 'crucial',
    nivel: 'erro',
    porque:
      'Palavra-foco nº 1 em português: é o adjetivo que mais salta em textos gerados. Quase sempre é ornamento removível.',
    saida: 'Corte. Se o ponto é mesmo decisivo, mostre por quê em vez de rotular.',
  },
  {
    termo: /\b(primordial|imprescindível|inegáve(l|is)|inquestionáve(l|is))\b/gi,
    rotulo: 'primordial / imprescindível / inegável / inquestionável',
    nivel: 'erro',
    saida: 'Em ciência quase nada é inegável. Diga qual é a evidência e deixe o leitor avaliar.',
  },
  {
    termo: /\b(verdadeir[oa])\s+(?=[a-záéíóúâêôãõç]+\b)/gi,
    rotulo: '"verdadeiro" como intensificador',
    nivel: 'aviso',
    saida: 'Corte: "um verdadeiro avanço" → "um avanço".',
  },
  {
    termo: /\bcada vez mais\b/gi,
    rotulo: 'cada vez mais',
    nivel: 'aviso',
    saida: 'Dê a taxa ou a comparação temporal. "Cada vez mais" não informa direção nem tamanho.',
  },

  // — Vagueza avaliativa —
  {
    termo: /\bsignificativ[oa]s?\b/gi,
    rotulo: 'significativo',
    nivel: 'aviso',
    porque:
      'Ambíguo em texto científico: o leitor lê como significância estatística. Se não for isso, é erro factual, não estilo.',
    saida: 'Reserve para p-valor declarado. Nos demais casos, dê a magnitude.',
  },
  {
    termo: /\babrangentes?\b/gi,
    rotulo: 'abrangente',
    nivel: 'aviso',
    saida: 'Diga o que está coberto. "Abrangente" é autoelogio sem conteúdo.',
  },
  {
    termo: /\b(notáve(l|is)|louváve(l|is)|meticulos[oa]s?|intrincad[oa]s?)\b/gi,
    rotulo: 'notável / louvável / meticuloso / intrincado',
    nivel: 'aviso',
    saida: 'Elogio genérico. Ou descreva o que foi bem feito, ou corte.',
  },
]

// ---------------------------------------------------------------------------
// 2. Construções — as fórmulas sintáticas que denunciam origem automática
// ---------------------------------------------------------------------------

export const CONSTRUCOES = [
  {
    id: 'vale-ressaltar',
    re: /\b(vale (a pena )?(ressaltar|destacar|lembrar|mencionar|notar|observar)|é (importante|fundamental|essencial|válido) (ressaltar|destacar|lembrar|notar|mencionar|entender|compreender))\b/gi,
    rotulo: '"Vale ressaltar que" / "É importante destacar que"',
    nivel: 'erro',
    porque:
      'A muleta mais reconhecível em português. Anuncia importância em vez de demonstrá-la, e empilhada em parágrafos seguidos vira assinatura de origem automática.',
    saida:
      'Se é importante, escreva a frase importante. O anúncio é sempre descartável: "Vale ressaltar que a meia-vida é de 65 dias" → "A meia-vida é de 65 dias".',
  },
  {
    id: 'em-suma',
    re: /(^|\n)\s*(em suma|em conclusão|em resumo|concluindo|resumindo|por fim)\b/gi,
    rotulo: 'Abertura de parágrafo com "Em suma" / "Em conclusão" / "Em resumo"',
    nivel: 'erro',
    porque:
      'Conclusão formulaica: o fecho que reafirma o que já foi dito, com moldura anunciada. Editores listam isso entre os cinco tells mais confiáveis.',
    saida:
      'O último parágrafo deve acrescentar um julgamento, não recapitular. Se ele só recapitula, apague-o.',
  },
  {
    id: 'nao-apenas-mas',
    re: /\bnão (é |se trata de |são )?(apenas|só|somente)\b[^.!?]{0,80}?\bmas\b/gi,
    rotulo: 'Estrutura "não é apenas X, mas (também) Y"',
    nivel: 'erro',
    porque:
      'Forma retórica simétrica de altíssima frequência em texto gerado. Cria contraste onde muitas vezes não há tensão real.',
    saida: 'Afirme Y diretamente. Se o contraste com X importa, mostre por que X é insuficiente.',
  },
  {
    id: 'mundo-de-hoje',
    re: /\b(no mundo (de hoje|atual|moderno)|nos dias de hoje|em um (mundo|cenário|contexto|mercado) cada vez mais|na era d[oa])\b/gi,
    rotulo: '"No mundo de hoje" / "Em um cenário cada vez mais…"',
    nivel: 'erro',
    saida: 'Abertura sem informação. Comece pelo fato mais específico que você tem.',
  },
  {
    id: 'final-do-dia',
    re: /\b(no final (do dia|das contas)|ao fim e ao cabo)\b/gi,
    rotulo: '"No final do dia" / "No final das contas"',
    nivel: 'erro',
    saida: 'Calco de "at the end of the day". Corte e vá direto à conclusão.',
  },
  {
    id: 'vamos-explorar',
    re: /\b(vamos (explorar|mergulhar|entender|descobrir|analisar juntos)|neste artigo,? (vamos|iremos)|prepare-se para|descubra como)\b/gi,
    rotulo: '"Vamos explorar" / "Neste artigo, vamos…" / "Descubra como"',
    nivel: 'erro',
    porque: 'Ninguém diz isso numa conversa real. É moldura de conteúdo de blog automatizado.',
    saida: 'Comece pelo assunto. O leitor já sabe que está lendo um artigo.',
  },
  {
    id: 'chave-segredo',
    re: /\b(a chave (é|está)|o segredo (é|está)|o pulo do gato)\b/gi,
    rotulo: '"A chave é…" / "O segredo está…"',
    nivel: 'erro',
    saida: 'Registro de autoajuda. Afirme o mecanismo.',
  },
  {
    id: 'como-vimos',
    re: /\b(como (vimos|mencionado) (anteriormente|acima)|conforme (mencionado|citado) anteriormente)\b/gi,
    rotulo: '"Como vimos anteriormente"',
    nivel: 'aviso',
    saida: 'Se o leitor precisa da lembrança, o texto está longo demais. Reestruture ou corte.',
  },
  {
    id: 'seja-voce',
    re: /\bseja você\b[^.!?]{0,60}\bou\b/gi,
    rotulo: '"Seja você X ou Y"',
    nivel: 'erro',
    saida: 'Endereçamento genérico ao leitor. Corte.',
  },
  {
    id: 'pode-ser-aliado',
    re: /\b(pode ser (um|uma) (grande )?(aliad[oa]|ferramenta poderosa)|ferramenta poderosa)\b/gi,
    rotulo: '"pode ser um grande aliado" / "ferramenta poderosa"',
    nivel: 'erro',
    saida: 'Diga o que a coisa faz e com que magnitude.',
  },
  {
    id: 'virgula-serial',
    // Exige uma vírgula de lista logo antes: só então "…, e X" é serial.
    // Vírgula ligando duas orações com sujeitos distintos é correta em
    // português e não pode ser sinalizada.
    // O lookahead descarta o caso em que a primeira vírgula abre uma oração
    // relativa intercalada ("a Fase 3, que é longa, e depois…"): ali a vírgula
    // antes do "e" fecha a relativa e está correta.
    re: /,(?!\s*(?:que|quem|qual|quais|cuj[oa]s?|onde)\b)[^,.;:!?]{2,50},\s+e\s+(?![ée]\b)[a-záéíóúâêôãõç]/g,
    rotulo: 'Vírgula serial antes de "e" em enumeração',
    nivel: 'aviso',
    porque:
      'O português não usa vírgula serial em enumeração. Sua presença indica texto pensado em inglês — é um dos calcos tipográficos mais citados.',
    saida:
      'Em "A, B, e C", remova a vírgula antes do "e". A vírgula permanece quando separa orações com sujeitos diferentes.',
  },
  {
    id: 'lista-negrito',
    re: /(^|\n)\s*[-*]\s+\*\*[^*]{2,40}\*\*\s*[:—-]/g,
    rotulo: 'Lista de itens no formato "**Termo**: explicação"',
    nivel: 'aviso',
    porque:
      'Formatação de resposta de assistente. Três ou mais itens seguidos nesse molde é a assinatura visual mais reconhecível de texto gerado.',
    saida: 'Transforme em parágrafos corridos, ou dê ao item um verbo em vez de dois-pontos.',
  },
  {
    id: 'titulo-caixa-alta',
    re: /(^|\n)#{2,3}\s+(?:[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+\s+){2,}[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]+\s*$/gm,
    rotulo: 'Título em Title Case (Todas As Palavras Maiúsculas)',
    nivel: 'aviso',
    porque: 'Convenção do inglês. Em português o título vai em caixa baixa, com maiúscula só na primeira palavra e em nomes próprios.',
    saida: 'Reescreva o título em caixa de sentença.',
  },
  {
    id: 'emoji',
    re: /[\u{1F300}-\u{1FAFF}\u{2700}-\u{27BF}\u{2600}-\u{26FF}]/gu,
    rotulo: 'Emoji no corpo do texto',
    nivel: 'erro',
    saida: 'Fora do registro da publicação. Remova.',
  },
]

// ---------------------------------------------------------------------------
// 3. Métricas — o que o léxico não pega: ritmo, distribuição, densidade
// ---------------------------------------------------------------------------

/**
 * As métricas capturam o que distingue texto humano depois que o vocabulário já
 * foi limpo. Um redator pode trocar todas as palavras proibidas e ainda
 * entregar um texto de cadência mecânica; estes limiares pegam isso.
 *
 * `min`/`max` são limiares. `nivel` diz se violar bloqueia ou avisa.
 */
/**
 * @typedef {{ min?: number, max?: number }} Limiar
 * @typedef {object} Metrica
 * @property {string} id
 * @property {string} rotulo
 * @property {string} unidade
 * @property {number} [min]
 * @property {number} [max]
 * @property {Record<string, Limiar>} [porNivel]
 * @property {'erro'|'aviso'} nivel
 * @property {string} [porque]
 * @property {string} saida
 */

/** @type {Metrica[]} */
export const METRICAS = [
  {
    id: 'variacao-frases',
    rotulo: 'Variação do comprimento das frases (burstiness)',
    unidade: 'coeficiente de variação',
    min: 0.45,
    nivel: 'erro',
    porque:
      'É a diferença estrutural mais robusta entre texto humano e gerado. Modelos comprimem a variância: produzem frases de comprimento parecido, numa cadência plana. Humanos alternam três frases curtas e uma longa sem perceber.',
    saida:
      'Quebre uma frase longa em duas curtas. Emende duas curtas numa longa. Não distribua o comprimento uniformemente — concentre as frases curtas onde há ênfase.',
  },
  {
    id: 'variacao-paragrafos',
    rotulo: 'Variação do tamanho dos parágrafos',
    unidade: 'coeficiente de variação',
    min: 0.35,
    nivel: 'erro',
    porque:
      'Texto gerado distribui atenção democraticamente: se há quatro fatores, cada um ganha um parágrafo de tamanho quase idêntico. Autor humano tem preferências — gasta três parágrafos no que o fascina e uma linha no que não.',
    saida:
      'Escolha o ponto que mais importa e gaste o dobro do espaço nele. Reduza outro a uma frase.',
  },
  {
    id: 'travessoes',
    rotulo: 'Densidade de travessões',
    unidade: 'por mil palavras',
    max: 9,
    nivel: 'aviso',
    porque:
      'A frequência de travessão em textos acadêmicos subiu de forma abrupta com a adoção de modelos de linguagem (razão de chances ≈ 2,9 para presença em resumos). O travessão continua correto em português — o que denuncia é a densidade.',
    saida: 'Converta parte em vírgula, ponto ou parênteses. Guarde o travessão para a ruptura que merece.',
  },
  {
    id: 'conectivo-inicial',
    rotulo: 'Parágrafos abertos por conectivo formulaico',
    unidade: '% dos parágrafos',
    max: 12,
    nivel: 'erro',
    porque:
      '"Além disso", "Ademais", "Por outro lado", "Dessa forma", "Nesse sentido" aparecem em texto gerado a taxas muito acima do uso humano, porque o modelo sinaliza coesão em vez de construí-la.',
    saida:
      'Se a ligação lógica é real, ela aparece no conteúdo da primeira frase. Comece pelo sujeito do parágrafo.',
  },
  {
    id: 'nominalizacao',
    rotulo: 'Densidade de nominalizações',
    unidade: 'por mil palavras',
    max: 58,
    nivel: 'aviso',
    porque:
      'Modelos atingem "complexidade acadêmica" empilhando substantivos abstratos em -ção, -mento, -dade. O efeito é prosa sem agente: coisas acontecem, ninguém faz.',
    saida: '"a realização da medição" → "mediram". Devolva o verbo e o sujeito.',
  },
  {
    id: 'adverbios-mente',
    rotulo: 'Advérbios terminados em -mente',
    unidade: 'por mil palavras',
    max: 12,
    nivel: 'aviso',
    saida: 'Corte ou troque por locução curta. "Significativamente maior" → "maior" com o número ao lado.',
  },
  {
    id: 'frase-longa',
    rotulo: 'Frases acima de 45 palavras',
    unidade: 'ocorrências',
    max: 2,
    nivel: 'aviso',
    saida: 'Divida. Uma frase longa por seção é ritmo; quatro é descuido.',
  },
  {
    id: 'tricolon',
    rotulo: 'Tricólon (três frases curtas consecutivas de tamanho semelhante)',
    unidade: 'ocorrências',
    max: 1,
    nivel: 'erro',
    porque:
      'A "regra de três" — "Sem enrolação. Sem gordura. Sem estresse." — é um dos padrões rítmicos mais associados a geração automática.',
    saida: 'Mantenha duas ou amplie uma delas. A simetria perfeita é o que denuncia.',
  },
  {
    id: 'aberturas-repetidas',
    rotulo: 'Parágrafos que começam com as mesmas duas palavras',
    unidade: 'ocorrências',
    max: 1,
    nivel: 'aviso',
    saida: 'Reescreva a abertura de um deles.',
  },
  {
    id: 'proporcao-listas',
    rotulo: 'Proporção do texto em listas',
    unidade: '% das linhas de conteúdo',
    max: 22,
    nivel: 'aviso',
    porque:
      'Texto gerado converte argumento em lista porque a lista dispensa transição. Argumento em prosa exige que as partes se liguem — e é aí que o raciocínio aparece.',
    saida: 'Uma lista por seção, no máximo. O resto vira parágrafo.',
  },

  // — Requisitos positivos: o que precisa ESTAR presente —
  {
    id: 'densidade-citacoes',
    rotulo: 'Citações a fontes',
    unidade: 'por mil palavras',
    min: 3,
    porNivel: { leigo: { min: 2 }, especialista: { min: 4 } },
    nivel: 'erro',
    porque:
      'Requisito editorial e também de recuperação: densidade de citação e de estatística estão entre os fatores que mais aumentam a probabilidade de um trecho ser citado por mecanismos generativos.',
    saida: 'Ancore cada afirmação factual em <Cit id="…" />.',
  },
  {
    id: 'densidade-numeros',
    rotulo: 'Números com unidade, data ou magnitude',
    unidade: 'por mil palavras',
    min: 8,
    // O nível leigo tem licença para ser menos numérico: o texto que explica
    // por analogia perde o leitor se cada frase carregar uma cifra. O nível
    // especialista, ao contrário, existe para carregar número.
    porNivel: { leigo: { min: 5 }, especialista: { min: 10 } },
    nivel: 'aviso',
    porque:
      'Especificidade numérica é o que texto gerado mais evita, porque exige compromisso verificável. É também o que mais distingue uma passagem citável de uma passagem genérica.',
    saida: 'Troque "grande aumento" por "+17,3 fios/cm²". Troque "recentemente" por "em junho de 2026".',
  },
  {
    id: 'postura-autoral',
    rotulo: 'Marcas de julgamento autoral',
    unidade: 'ocorrências',
    min: 2,
    nivel: 'erro',
    porque:
      'O achado mais consistente da literatura: texto gerado é mais impessoal e usa menos marcadores epistêmicos — objetivo na superfície, sem posição. É a ausência de um autor que faz o texto parecer de baixo valor.',
    saida:
      'Assuma uma posição em algum ponto: "a leitura honesta é…", "isso não convence", "aqui é preciso desconfiar", "o número que importa é outro".',
  },
]

/** Expressões que contam como postura autoral para a métrica acima. */
export const MARCAS_AUTORAIS =
  /\b(a leitura (honesta|justa|correta)|não convence|é preciso desconfiar|vale desconfiar|na minha leitura|o que incomoda|o ponto desconfortável|aqui é onde|o que ninguém (comentou|notou|pegou)|passou batido|é razoável argumentar|discordo|me parece|parece-me|não me convence|o resumo honesto|sejamos precisos|dito isso|a parte (boa|ruim|desconfortável)|o que seria impróprio|defensáve(l|is))\b/gi

/** Conectivos cuja aparição em INÍCIO de parágrafo é penalizada. */
export const CONECTIVOS_INICIAIS =
  /^(além disso|ademais|outrossim|por outro lado|dessa forma|desse modo|sendo assim|nesse sentido|nesse contexto|diante disso|portanto|assim sendo|com efeito|por conseguinte)\b/i

export const FONTES = [
  {
    titulo: 'Linguistic Characteristics of AI-Generated Text: A Survey',
    veiculo: 'arXiv:2510.05136',
    url: 'https://arxiv.org/abs/2510.05136',
    usoAqui: 'diversidade lexical, variância de comprimento de frase, nominalização, estilo impessoal',
  },
  {
    titulo:
      'Em-ergence of the em-dash: a population-level rise in em-dash frequency in medRxiv preprints',
    veiculo: 'arXiv',
    url: 'https://arxiv.org/pdf/2606.29540',
    usoAqui: 'limiar de densidade de travessões',
  },
  {
    titulo: 'The Shrinking Landscape of Linguistic Diversity in the Age of Large Language Models',
    veiculo: 'arXiv:2502.11266',
    url: 'https://arxiv.org/pdf/2502.11266',
    usoAqui: 'perda de vocabulário raro e homogeneização',
  },
  {
    titulo: 'Top 10 Most Common Words Used by AI',
    veiculo: 'GPTZero',
    url: 'https://gptzero.me/news/most-common-ai-vocabulary/',
    usoAqui: 'palavras-foco traduzidas para o léxico em português',
  },
  {
    titulo: 'AI Sentence Structure: The Formulaic Patterns That Make AI Writing Recognizable',
    veiculo: 'Bloomberry',
    url: 'https://www.bloomberry.ai/research/ai-sentence-structure',
    usoAqui: 'simetria de parágrafos, tricólon, cadência plana',
  },
  {
    titulo: 'Os 12 maiores vícios de linguagem de IA em 2026',
    veiculo: 'Envox',
    url: 'https://envox.com.br/marketing-de-conteudo/vicios-linguagem-ia-2026-exemplos-reais/agencia-de-marketing-digital/trafego-pago/vendas/',
    usoAqui: 'clichês específicos do português brasileiro e vírgula serial',
  },
  {
    titulo: 'GEO: Generative Engine Optimization',
    veiculo: 'pesquisa sobre citação por mecanismos generativos',
    url: 'https://arxiv.org/abs/2311.09735',
    usoAqui: 'densidade de citação e de estatística como requisitos positivos',
  },
]
