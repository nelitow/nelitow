# Ensaio Aberto

Revista diária de divulgação científica em pt-BR. Cada achado é publicado em **três níveis de
leitura independentes** — leigo, intermediário e especialista — com a aparência e o aparato de um
periódico científico: resumo estruturado, seções numeradas, figuras legendadas, citações
sobrescritas e lista de referências classificadas por tipo de fonte.

A primeira edição cobre o **ABS-201**, o anticorpo anti-receptor de prolactina da Absci para
alopecia androgenética.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 + React Compiler |
| Estilo | Tailwind CSS v4 (`@theme` + camadas de cascata) |
| Conteúdo | MDX com componentes editoriais próprios |
| Tipografia | Charter / Georgia — sem dependência de rede |

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção (roda o validador antes)
npm run validar    # normas de redação
npm run typecheck  # tsc --noEmit
npm run verificar  # validar + typecheck
```

Defina `NEXT_PUBLIC_SITE_URL` no ambiente de deploy (usado em canonical, RSS, sitemap e Open
Graph). Sem ela o site assume `http://localhost:3000`.

## Publicando uma edição por dia

```bash
npm run nova-edicao -- "Título da edição de hoje"
npm run nova-edicao -- "Título" --secao Imunologia --data 2026-09-23
```

O script cria a pasta em `src/content/edicoes/<slug>/`, gera `meta.ts`, `referencias.ts` e os três
`.mdx` com esqueleto, e registra a edição em `src/content/registry.ts`. Ela nasce com
`publicado: false` — fica invisível na capa, no arquivo, no RSS e no sitemap até você virar a flag.

Fluxo sugerido:

1. `npm run nova-edicao -- "..."`
2. Preencher `referencias.ts` **antes** de escrever — cada afirmação factual precisa de uma fonte.
3. Escrever os três níveis. Não são resumos uns dos outros: veja
   [`/metodologia`](src/app/metodologia/page.tsx) para o contrato de cada nível.
4. Preencher `resumo`, `chamada` e `tempoLeitura` em `meta.ts`.
5. Virar `publicado: true` e fazer o build.

### Componentes disponíveis no MDX

Sem import (registrados em `mdx-components.tsx`): `<Caixa>`, `<Figura>`, `<Tabela>`.
Injetado por edição: `<Cit id="chave" />` — numera automaticamente a partir de `referencias.ts` e
aceita várias chaves (`id="a,b"`).

```mdx
<Caixa tipo="alerta" titulo="O que ainda não sabemos">
Texto da ressalva.
</Caixa>

<Figura legenda="O que a figura mostra." fonte="de onde veio">
  <MeuGrafico />
</Figura>

A meia-vida foi estimada em 65 dias<Cit id="fase1" />.
```

Tipos de caixa: `nota`, `alerta`, `definicao`, `metodo`.

## Normas de redação (e o validador)

Cada edição precisa passar por um conjunto de regras cujo objetivo é um só: que
o texto não leia como saída de máquina. As regras vivem em
`src/lib/validacao/regras.mjs`, são executadas por `npm run validar` e são
renderizadas em [`/normas`](src/app/normas/page.tsx) — mesma fonte, sem versão
documental que possa divergir.

```bash
npm run validar                 # todas as edições
npm run validar -- <slug>       # uma edição
npm run validar -- --metricas   # tabela de métricas por nível
npm run validar -- --estrito    # avisos também reprovam
```

O validador roda no `prebuild`, então uma edição que viole uma regra de nível
*reprova* não chega a ser publicada.

As regras atacam três eixos que a literatura sobre texto gerado documenta:

| Eixo | Exemplos de regra |
|---|---|
| **Léxico** | `crucial`, `desvendar`, `potencializar`, `holístico`, `divisor de águas` — cada entrada traz o substituto |
| **Construções** | "Vale ressaltar que", "Em suma", "não é apenas X mas Y", "No mundo de hoje", vírgula serial, título em Title Case |
| **Distribuição** | variação de comprimento de frase (CV ≥ 0,45) e de parágrafo (CV ≥ 0,35), densidade de travessões, tricólon, conectivo em início de parágrafo, nominalização |

Há também requisitos **positivos**, porque limpar vícios não produz um texto
bom: densidade mínima de citações, de números com unidade, e presença de marcas
de julgamento autoral. O eixo da postura é o mais importante — o achado mais
consistente da literatura é que texto gerado é impessoal e não assume posição, e
é essa ausência de autor que o leitor lê como baixo valor.

Limiares variam por nível quando faz sentido: o texto leigo tem licença para ser
menos numérico, o especialista tem exigência maior. Rascunhos com `TODO` são
ignorados.

Cada limiar aponta para o trabalho que o sustenta; as referências estão em
`FONTES`, no fim de `regras.mjs`, e aparecem no rodapé de `/normas`.

## Busca e mecanismos generativos

A arquitetura de URLs foi desenhada em torno de um problema específico: três
textos sobre o mesmo assunto competindo entre si.

**A página da edição (`/edicao/<slug>`) é a canônica do tema.** Ela não
redireciona — traz resposta curta, dados-chave com unidade e fonte, perguntas
com resposta autossuficiente, referências e links para os três níveis. É a
página que responde à busca ampla e a que faz sentido ser citada. Os três níveis
respondem a intenções de busca diferentes entre si, com título, descrição e
`educationalLevel` próprios.

(A versão anterior redirecionava essa URL para o nível lembrado em cookie. Isso
entregava a página certa ao leitor recorrente e nada indexável a todo mundo
mais. Hoje a preferência aparece como atalho, não como redirecionamento, e todas
as rotas são estáticas.)

O que está implementado:

- **Dados estruturados** em `src/lib/schema.ts`: `Organization` +
  `NewsMediaOrganization` com `publishingPrinciples`, `ethicsPolicy` e
  `correctionsPolicy`; `WebSite`; `Periodical`; `BreadcrumbList`; `WebPage` com
  `hasPart` para os três níveis; `FAQPage`; `Dataset` com os dados-chave como
  `variableMeasured`; e `Article` + `ScholarlyArticle` por nível, com `about`
  apontando para entidades (`Drug`, `MedicalCondition`) por `sameAs` verificado.
  O grafo do publicador é emitido uma vez no layout; as páginas referenciam por
  `@id`.
- **Páginas de tema** (`/tema/<slug>`), geradas das palavras-chave, que acumulam
  a cobertura contínua de um assunto e dão ao site uma estrutura de links
  internos em vez de uma pilha de posts.
- **Imagens sociais** geradas por `next/og`, uma por edição e uma por nível, com
  a mesma gramática visual do site.
- **`robots.txt`** permitindo explicitamente GPTBot, ClaudeBot, PerplexityBot,
  OAI-SearchBot, Google-Extended e outros. É uma decisão: citação em resposta
  generativa leva a ressalva junto do fato, e bloquear não impediria a
  informação de circular sem fonte.
- **`max-snippet:-1` e `max-image-preview:large`** na diretiva geral, não só na
  do Google — é o trecho longo que vira citação.
- **`llms.txt`**, com expectativa calibrada: o Google disse publicamente que não
  usa, nenhum grande laboratório se comprometeu, e medições mostram que os
  rastreadores quase nunca o buscam. Custa uma rota e serve de mapa; quem
  controla acesso de fato é o `robots.txt`.
- **RSS por nível**, sitemap com prioridade maior nas páginas-âncora, e
  `canonical` em todas as rotas.

O que move o ponteiro no fim não é nada disso: é ter o número com a unidade, a
base de comparação declarada e a fonte ao lado. Os fatores que mais aumentam
citação por mecanismos generativos são justamente citação, estatística e
clareza — que é o que as normas de redação já cobram.

## O que é React 19 aqui

Não é vitrine solta — cada recurso resolve um problema concreto da publicação:

| Recurso | Onde | Por quê |
|---|---|---|
| Server Components | todo o corpo dos artigos | MDX nunca chega ao bundle do cliente |
| `useOptimistic` | `NivelSwitcher`, `Calibragem` | o nível clicado pinta na hora, sem esperar a navegação |
| `useActionState` | `Assinatura` | estado de formulário e validação vindos do servidor |
| `useFormStatus` | botão de `Assinatura` | pendência lida de dentro do `<form>`, sem prop drilling |
| Server Actions | `src/app/actions.ts` | calibragem e inscrição sem rota de API |
| ref com cleanup | `ProgressoLeitura` | listener atado ao elemento medido, sem `useEffect` |
| `ref` como prop | `CurvaPK` | acesso ao SVG sem `forwardRef` |
| `useDeferredValue` | `ArquivoBusca` | o campo não trava enquanto a lista refiltra |
| React Compiler | global | memoização automática, sem `useMemo` espalhado |

## Estrutura

```
src/
  app/                     rotas, Server Actions, RSS, sitemap
  components/
    journal/               aparato editorial (cabeçalho, resumo, citação, referências)
    figuras/               figuras da edição 1
    *.tsx                  componentes interativos (nível, calibragem, busca, sumário)
  content/
    types.ts               modelo de dados e definição dos três níveis
    registry.ts            índice do periódico
    edicoes/<slug>/        meta.ts + referencias.ts + três .mdx
  lib/
    validacao/             normas de redação: regras + motor de análise
    schema.ts              dados estruturados (JSON-LD)
    og.tsx                 cartões sociais
    ...                    formatação, config do site, armazenamento
scripts/nova-edicao.mjs    scaffold da edição diária
scripts/validar.mjs        validador das normas de redação
```

## Armazenamento

A calibragem (o voto de "esse nível acertou a profundidade?") e a lista de inscritos ficam em JSON
sob `.data/`, fora do git. Isso sobrevive a restarts num host Node comum e **é apagado a cada cold
start em ambiente serverless**. É uma troca deliberada enquanto não há banco: o sinal é
direcional, não auditado. Para trocar, só `src/lib/store.ts` toca o disco.

## Gráficos

As figuras de dados seguem um procedimento fixo: a forma vem da função do dado, a cor vem por
último e a paleta é validada por script contra as superfícies claras e escuras reais do site —
faixa de luminosidade, piso de croma, separação para daltonismo e contraste. Barras que comparam
uma única medida entre categorias usam **uma só cor**; cor ali não codificaria nada.

Curvas simuladas a partir de um parâmetro publicado (como a de farmacocinética) são sempre
rotuladas como ilustrativas na legenda, com o eixo em unidade relativa, para que não sejam
confundidas com dados medidos.

## Aviso

Conteúdo de divulgação científica. Não é orientação médica nem recomendação de investimento.
Fármacos em investigação discutidos aqui não têm eficácia ou segurança estabelecidas.
