import type { Metadata } from 'next'
import Link from 'next/link'
import { Assinatura } from '@/components/Assinatura'
import { NIVEIS, NIVEL_INFO } from '@/content/types'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Sobre',
  description: SITE.descricao,
  alternates: { canonical: '/sobre' },
}

export default function PaginaSobre() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 lg:py-14">
      <header className="border-b border-[var(--color-rule)] pb-5">
        <p className="label">Sobre</p>
        <h1 className="mt-2 text-[clamp(1.85rem,5vw,2.5rem)] leading-tight font-semibold tracking-[-0.02em]">
          Uma revista que não escolhe por você
        </h1>
      </header>

      <div className="prose-journal measure mt-8">
        <p>
          Divulgação científica costuma resolver o problema do público escolhendo um só. Ou o texto é
          raso e quem entende do assunto não tem o que fazer ali, ou é denso e quem está chegando
          desiste no terceiro parágrafo. As duas escolhas perdem leitor.
        </p>

        <p>
          O <strong>{SITE.nome}</strong> não escolhe. Cada achado sai em três textos independentes,
          publicados juntos, e o leitor troca de nível com um clique — inclusive no meio da leitura,
          quando percebe que pegou o nível errado.
        </p>

        <h2>O que muda entre os níveis</h2>

        <p>
          Não é o comprimento. É o que se assume que o leitor já sabe, quais perguntas valem a pena
          e quais ressalvas são interessantes.
        </p>

        <ul>
          {NIVEIS.map((nivel) => {
            const info = NIVEL_INFO[nivel]
            return (
              <li key={nivel}>
                <strong style={{ color: info.cor }}>{info.rotulo}</strong> — {info.publico}.{' '}
                {info.descricao}
              </li>
            )
          })}
        </ul>

        <h2>Ritmo</h2>

        <p>
          Uma edição por dia. O assunto é normalmente um achado recente em farmacologia, biologia ou
          medicina — com preferência por casos em que a distância entre a manchete e o dado é grande
          o bastante para valer uma explicação.
        </p>

        <h2>O que esta revista não é</h2>

        <p>
          Não é aconselhamento médico e não é análise de investimento. Boa parte do que se discute
          aqui são fármacos em investigação, que por definição não têm eficácia nem segurança
          estabelecidas. Nenhuma edição deve ser usada para decidir tratamento ou alocação de
          capital.
        </p>

        <p>
          O critério de apuração e a classificação de fontes estão descritos na{' '}
          <Link href="/metodologia">página de metodologia</Link>.
        </p>
      </div>

      <div className="mt-12">
        <Assinatura />
      </div>
    </div>
  )
}
