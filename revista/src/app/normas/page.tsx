import type { Metadata } from 'next'
import Link from 'next/link'
import { Caixa } from '@/components/journal/Caixa'
import { CONSTRUCOES, FONTES, LEXICO, METRICAS } from '@/lib/validacao/regras.mjs'

export const metadata: Metadata = {
  title: 'Normas de redação',
  description:
    'As regras que cada edição precisa cumprir para não ler como texto gerado por máquina: léxico proibido, construções vedadas e limiares de ritmo, densidade e postura autoral — todas verificadas automaticamente antes da publicação.',
  alternates: { canonical: '/normas' },
  keywords: [
    'normas de redação',
    'como identificar texto escrito por IA',
    'marcas de texto gerado por inteligência artificial',
    'clichês de IA em português',
    'guia de estilo científico',
  ],
}

function Limiar({ metrica }: { metrica: (typeof METRICAS)[number] }) {
  const partes: string[] = []
  if (metrica.min != null) partes.push(`mínimo ${metrica.min}`)
  if (metrica.max != null) partes.push(`máximo ${metrica.max}`)

  const porNivel = metrica.porNivel
    ? Object.entries(metrica.porNivel).map(
        ([nivel, ajuste]) =>
          `${nivel}: ${ajuste.min != null ? `mín. ${ajuste.min}` : `máx. ${ajuste.max}`}`,
      )
    : []

  return (
    <span className="font-mono text-[0.75rem] whitespace-nowrap">
      {partes.join(' · ')}
      {porNivel.length > 0 && (
        <span className="block text-[0.6875rem] text-[var(--color-ink-faint)]">
          {porNivel.join(' · ')}
        </span>
      )}
    </span>
  )
}

function Etiqueta({ nivel }: { nivel: string }) {
  const erro = nivel === 'erro'
  return (
    <span
      className="rounded-sm border px-1.5 py-px font-sans text-[0.625rem] font-semibold tracking-wide uppercase"
      style={{
        color: erro ? 'var(--color-accent)' : 'var(--color-ink-faint)',
        borderColor: erro ? 'var(--color-accent)' : 'var(--color-rule-strong)',
      }}
    >
      {erro ? 'reprova' : 'avisa'}
    </span>
  )
}

export default function PaginaNormas() {
  const totalRegras = LEXICO.length + CONSTRUCOES.length + METRICAS.length

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <header className="border-b border-[var(--color-rule)] pb-5">
        <p className="label">Normas editoriais</p>
        <h1 className="mt-2 text-[clamp(1.85rem,5vw,2.5rem)] leading-tight font-semibold tracking-[-0.02em] text-balance">
          Normas de redação
        </h1>
        <p className="mt-3 text-[1.0625rem] leading-relaxed text-[var(--color-ink-muted)]">
          O que uma edição precisa cumprir para não ler como texto de máquina. São{' '}
          {totalRegras} regras, e nenhuma delas é opinião de gosto: cada uma responde a um traço que
          a literatura sobre texto gerado documenta como marca de origem.
        </p>
      </header>

      <div className="prose-journal measure mt-8">
        <h2>Por que estas normas existem</h2>

        <p>
          Texto gerado por modelo de linguagem não é ruim por ser artificial. Ele é ruim por três
          razões mensuráveis: usa vocabulário mais estreito que o de um autor humano, distribui o
          comprimento de frases e parágrafos de forma quase uniforme, e evita assumir posição. O
          resultado lê como correto e vazio ao mesmo tempo, e o leitor atribui a isso um valor
          baixo antes mesmo de conseguir dizer por quê.
        </p>

        <p>
          As regras abaixo atacam exatamente esses três eixos. Elas valem para qualquer texto
          publicado aqui, tenha sido escrito com assistência de máquina ou inteiramente à mão. Um
          autor humano distraído produz os mesmos vícios, e a norma não pergunta a origem: pergunta
          o resultado.
        </p>

        <Caixa tipo="metodo" titulo="Estas regras são executadas, não recomendadas">
          <p>
            Tudo nesta página é código. O comando <code>npm run validar</code> executa exatamente as
            regras aqui listadas sobre os três níveis de cada edição, e o build falha se qualquer
            regra de nível <em>reprova</em> for violada. Não há versão documental que possa divergir
            do que a máquina cobra: a página lê o mesmo arquivo que o validador.
          </p>
        </Caixa>

        <h2>Léxico vedado</h2>

        <p>
          Palavras cuja frequência disparou na literatura científica a partir de 2023 e que hoje
          funcionam como assinatura. Cada entrada traz a saída: banir sem oferecer substituto
          produz paráfrase pior.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse font-sans text-[0.8125rem]">
          <thead>
            <tr className="border-y border-[var(--color-ink)]">
              <th className="px-2 py-2 text-start font-semibold">Termo</th>
              <th className="px-2 py-2 text-start font-semibold">No lugar dele</th>
              <th className="px-2 py-2 text-start font-semibold">Nível</th>
            </tr>
          </thead>
          <tbody>
            {LEXICO.map((entrada) => (
              <tr key={entrada.rotulo} className="border-b border-[var(--color-rule)] align-top">
                <td className="px-2 py-2.5 font-medium">
                  {entrada.rotulo}
                  {entrada.porque && (
                    <span className="mt-1 block text-[0.75rem] font-normal text-[var(--color-ink-faint)]">
                      {entrada.porque}
                    </span>
                  )}
                </td>
                <td className="px-2 py-2.5 text-[var(--color-ink-muted)]">{entrada.saida}</td>
                <td className="px-2 py-2.5">
                  <Etiqueta nivel={entrada.nivel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose-journal measure mt-10">
        <h2>Construções vedadas</h2>

        <p>
          Fórmulas sintáticas, não palavras isoladas. São o que sobra quando alguém troca o
          vocabulário proibido por sinônimos e mantém a mesma arquitetura de frase.
        </p>
      </div>

      <ol className="mt-6 space-y-5">
        {CONSTRUCOES.map((regra) => (
          <li key={regra.id} className="border-s-2 border-[var(--color-rule)] ps-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-sans text-[0.9375rem] font-semibold">{regra.rotulo}</h3>
              <Etiqueta nivel={regra.nivel} />
            </div>
            {regra.porque && (
              <p className="mt-1 font-sans text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
                {regra.porque}
              </p>
            )}
            <p className="mt-1.5 font-sans text-[0.8125rem] leading-relaxed">
              <span className="font-semibold text-[var(--color-accent)]">No lugar: </span>
              <span className="text-[var(--color-ink-muted)]">{regra.saida}</span>
            </p>
          </li>
        ))}
      </ol>

      <div className="prose-journal measure mt-12">
        <h2>Limiares mensuráveis</h2>

        <p>
          O léxico é o mais fácil de burlar. Estes números não são: eles medem ritmo, distribuição
          de atenção e densidade de compromisso factual. Um texto pode não conter uma só palavra
          proibida e ainda assim reprovar aqui, e é nesse caso que a norma ganha o salário dela.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        {METRICAS.map((metrica) => (
          <div
            key={metrica.id}
            className="rounded-sm border border-[var(--color-rule)] px-4 py-3.5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-sans text-[0.9375rem] font-semibold">{metrica.rotulo}</h3>
              <div className="flex items-baseline gap-2">
                <Limiar metrica={metrica} />
                <Etiqueta nivel={metrica.nivel} />
              </div>
            </div>
            <p className="mt-0.5 font-sans text-[0.6875rem] text-[var(--color-ink-faint)]">
              medido em {metrica.unidade}
            </p>
            {metrica.porque && (
              <p className="mt-2 font-sans text-[0.8125rem] leading-relaxed text-[var(--color-ink-muted)]">
                {metrica.porque}
              </p>
            )}
            <p className="mt-1.5 font-sans text-[0.8125rem] leading-relaxed">
              <span className="font-semibold text-[var(--color-accent)]">Como corrigir: </span>
              <span className="text-[var(--color-ink-muted)]">{metrica.saida}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="prose-journal measure mt-12">
        <h2>O que nenhum validador pega</h2>

        <p>
          As regras acima removem o que denuncia origem automática. Elas não produzem, sozinhas, um
          texto que valha a leitura. O que resta é responsabilidade editorial e não tem métrica:
        </p>

        <ol>
          <li>
            <strong>Assimetria de interesse.</strong> Um autor gasta espaço onde tem alguma coisa a
            dizer. Se todas as seções têm o mesmo peso, ninguém decidiu nada — apenas cobriu o
            assunto.
          </li>
          <li>
            <strong>Um julgamento que possa estar errado.</strong> Afirmação que ninguém poderia
            contestar não é análise. Em cada edição deve haver ao menos uma leitura que o autor
            assina e que o tempo pode desmentir.
          </li>
          <li>
            <strong>O detalhe que só quem leu a fonte tem.</strong> A janela de coleta menor que a
            meia-vida estimada, a troca de via entre porções do estudo, o representante que entrou
            no conselho da indicação errada. É isso que separa apuração de paráfrase de comunicado.
          </li>
          <li>
            <strong>Dizer o que não se sabe.</strong> A fronteira entre demonstrado e plausível
            aparece explicitamente, nos três níveis. Mecanismo que faz sentido não é resultado.
          </li>
        </ol>

        <h2>Verificação</h2>

        <p>
          O validador roda automaticamente antes de todo build. Localmente:
        </p>

        <pre>
          <code>{`npm run validar                 # todas as edições
npm run validar -- <slug>       # uma edição
npm run validar -- --metricas   # tabela de métricas por nível
npm run validar -- --estrito    # avisos também reprovam`}</code>
        </pre>

        <p>
          Rascunhos que ainda contêm <code>TODO</code> são ignorados, para que o esqueleto recém-criado
          por <code>npm run nova-edicao</code> não produza ruído antes de haver texto.
        </p>

        <p>
          O critério de apuração e a classificação de fontes estão na{' '}
          <Link href="/metodologia">página de metodologia</Link>.
        </p>

        <h2>Fundamentação</h2>

        <p>Os limiares não foram escolhidos por gosto. Cada um veio de um destes trabalhos:</p>
      </div>

      <ol className="mt-5 space-y-3">
        {FONTES.map((fonte, i) => (
          <li key={fonte.url} className="flex gap-3 font-sans text-[0.8125rem] leading-relaxed">
            <span className="w-5 shrink-0 text-end font-semibold text-[var(--color-ink-faint)] tabular-nums">
              {i + 1}.
            </span>
            <span className="min-w-0">
              <a
                href={fonte.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-ink)] underline decoration-[var(--color-rule-strong)] underline-offset-2 hover:decoration-[var(--color-accent)]"
              >
                {fonte.titulo}
              </a>
              <span className="text-[var(--color-ink-muted)]">
                {' '}
                — <em>{fonte.veiculo}</em>.
              </span>
              <span className="mt-0.5 block text-[0.75rem] text-[var(--color-ink-faint)]">
                Usado aqui para: {fonte.usoAqui}.
              </span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
