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
npm run build      # build de produção
npm run typecheck  # tsc --noEmit
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
  lib/                     formatação, config do site, armazenamento
scripts/nova-edicao.mjs    scaffold da edição diária
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
