import type { Metadata } from 'next'
import { Caixa } from '@/components/journal/Caixa'
import { NIVEIS, NIVEL_INFO } from '@/content/types'

export const metadata: Metadata = {
  title: 'Metodologia',
  description:
    'Como cada edição é apurada, como as fontes são classificadas e o que os três níveis de leitura garantem.',
  alternates: { canonical: '/metodologia' },
}

export default function PaginaMetodologia() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <header className="border-b border-[var(--color-rule)] pb-5">
        <p className="label">Metodologia</p>
        <h1 className="mt-2 text-[clamp(1.85rem,5vw,2.5rem)] leading-tight font-semibold tracking-[-0.02em]">
          Como cada edição é feita
        </h1>
      </header>

      <div className="prose-journal measure mt-8">
        <h2>Os três níveis</h2>

        <p>
          Cada assunto é escrito três vezes, do zero. Não são versões resumidas umas das outras: o
          texto de nível I não é o de nível III com palavras trocadas, e o de nível III não repete o
          de nível I com jargão por cima. São três recortes diferentes do mesmo material, cada um
          com o que aquele leitor precisa e sem o que ele não precisa.
        </p>

        <ul>
          {NIVEIS.map((nivel) => {
            const info = NIVEL_INFO[nivel]
            return (
              <li key={nivel}>
                <strong style={{ color: info.cor }}>
                  Nível {info.ordinal} — {info.rotulo}:
                </strong>{' '}
                {info.descricao}
              </li>
            )
          })}
        </ul>

        <p>
          O botão de calibragem no fim de cada texto existe para corrigir a régua. Se um texto de
          nível II estiver sendo lido como &ldquo;técnico demais&rdquo; de forma consistente, é o
          nível II que está errado, não o leitor.
        </p>

        <h2>Classificação das fontes</h2>

        <p>
          Toda referência é marcada por tipo, e o tipo muda o peso que ela tem no texto:
        </p>

        <ul>
          <li>
            <strong>Fonte primária</strong> — comunicado da própria empresa, documento entregue a
            regulador, material institucional. É o dado mais próximo da origem e também o mais
            interessado. Tratado como factual quanto aos números e como promocional quanto à
            interpretação.
          </li>
          <li>
            <strong>Registro de ensaio</strong> — ClinicalTrials.gov e equivalentes. Útil sobretudo
            para desenho, desfechos declarados e datas, que são difíceis de reescrever depois.
          </li>
          <li>
            <strong>Literatura</strong> — artigo revisado por pares. Maior peso; normalmente o que
            sustenta as afirmações de mecanismo.
          </li>
          <li>
            <strong>Cobertura</strong> — imprensa especializada. Usada para contexto e para
            declarações, raramente como base de uma afirmação técnica.
          </li>
        </ul>

        <h2>Regras que não são negociáveis</h2>

        <ol>
          <li>
            <strong>A distinção entre &ldquo;foi demonstrado&rdquo; e &ldquo;é
            plausível&rdquo;</strong> aparece explicitamente, nos três níveis. Um mecanismo que faz
            sentido não é um resultado.
          </li>
          <li>
            <strong>Base de comparação sempre declarada.</strong> Um ganho medido contra o basal e
            um ganho medido contra placebo não são o mesmo número e nunca aparecem lado a lado sem
            aviso.
          </li>
          <li>
            <strong>Modelos são identificados.</strong> Camundongo é camundongo, cultura de tecido é
            cultura de tecido, voluntário saudável não é paciente.
          </li>
          <li>
            <strong>Gráficos ilustrativos são rotulados como tais.</strong> Quando uma curva é
            simulada a partir de um parâmetro publicado, a legenda diz que não são dados medidos.
          </li>
          <li>
            <strong>Nenhuma edição é recomendação.</strong> Nem clínica, nem financeira.
          </li>
        </ol>

        <Caixa tipo="alerta" titulo="Sobre assistência de IA">
          <p>
            A apuração e a redação destas edições usam assistência de modelos de linguagem para
            levantamento e estruturação. Toda afirmação factual é rastreada até uma fonte listada
            nas referências, e o texto é revisado antes de publicar. Erros que escaparem serão
            corrigidos no próprio artigo, com a data de atualização registrada no cabeçalho.
          </p>
        </Caixa>

        <h2>Correções</h2>

        <p>
          Quando uma edição é corrigida, a data de atualização passa a constar no cabeçalho e a
          natureza da correção é descrita no próprio texto. Edições não são apagadas nem reescritas
          silenciosamente.
        </p>
      </div>
    </div>
  )
}
