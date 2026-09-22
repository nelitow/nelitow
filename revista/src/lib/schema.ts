import type { EdicaoMeta, Nivel, Referencia } from '@/content/types'
import { NIVEIS, NIVEL_INFO } from '@/content/types'
import { identificador } from '@/lib/format'
import { SITE, urlAbsoluta } from '@/lib/site'

/**
 * Dados estruturados.
 *
 * Duas decisões que valem explicação:
 *
 * 1. Os tipos usam `@id` estável e se referenciam por `@id` em vez de repetir
 *    o objeto inteiro. É assim que um grafo de entidade se forma entre páginas,
 *    e é o que faz o publicador ser reconhecido como a mesma entidade em todas
 *    as URLs do site.
 * 2. `Article` aparece ao lado de `ScholarlyArticle`. O segundo descreve melhor
 *    o conteúdo, mas a documentação do Google enumera `Article`, `NewsArticle` e
 *    `BlogPosting` como as bases que ele processa. Declarar os dois custa nada e
 *    evita depender de o parser resolver a hierarquia.
 */

const ID_ORG = urlAbsoluta('/#organizacao')
const ID_SITE = urlAbsoluta('/#site')
const ID_PERIODICO = urlAbsoluta('/#periodico')

export function organizacao() {
  return {
    '@type': ['Organization', 'NewsMediaOrganization'],
    '@id': ID_ORG,
    name: SITE.nome,
    url: SITE.url,
    description: SITE.descricao,
    logo: { '@type': 'ImageObject', url: urlAbsoluta('/icon.svg') },
    // Política editorial pública é o sinal de E-E-A-T mais concreto que uma
    // publicação pequena consegue emitir.
    publishingPrinciples: urlAbsoluta('/metodologia'),
    ethicsPolicy: urlAbsoluta('/normas'),
    correctionsPolicy: urlAbsoluta('/metodologia#correcoes'),
    knowsLanguage: 'pt-BR',
  }
}

export function site() {
  return {
    '@type': 'WebSite',
    '@id': ID_SITE,
    url: SITE.url,
    name: SITE.nome,
    description: SITE.descricao,
    inLanguage: SITE.idioma,
    publisher: { '@id': ID_ORG },
  }
}

export function periodico() {
  return {
    '@type': 'Periodical',
    '@id': ID_PERIODICO,
    name: SITE.nome,
    publisher: { '@id': ID_ORG },
    inLanguage: SITE.idioma,
  }
}

function entidades(meta: EdicaoMeta) {
  return meta.entidades.map((e) => ({
    '@type': e.tipo,
    name: e.nome,
    ...(e.sameAs ? { sameAs: e.sameAs } : {}),
  }))
}

function citacoes(referencias: Referencia[]) {
  return referencias.map((ref) => ({
    '@type': 'CreativeWork',
    name: ref.titulo,
    url: ref.url,
    ...(ref.autores ? { author: { '@type': 'Organization', name: ref.autores } } : {}),
  }))
}

/**
 * Grafo emitido uma vez no layout. As páginas só apontam para estes `@id`,
 * em vez de repetir o publicador inteiro em cada URL — é o mesmo grafo, e
 * consumidores de JSON-LD unem os blocos da página por `@id`.
 */
export function grafoSite() {
  return { '@context': 'https://schema.org', '@graph': [organizacao(), site(), periodico()] }
}

export function migalhas(itens: { nome: string; caminho: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.nome,
      item: urlAbsoluta(item.caminho),
    })),
  }
}

/** Página-âncora da edição: é ela que responde à pergunta e carrega o FAQ. */
export function grafoAncora(meta: EdicaoMeta, referencias: Referencia[]) {
  const caminho = `/edicao/${meta.slug}`
  const url = urlAbsoluta(caminho)

  // O nó do FAQ e a referência a ele em `mainEntity` dependem da mesma
  // condição. Guardá-la numa variável é o que impede que uma edição sem
  // perguntas — o estado inicial de todo esqueleto — emita um `mainEntity`
  // apontando para um `@id` que nunca foi declarado.
  const temFaq = meta.perguntas.length > 0
  const idFaq = `${url}#faq`

  const perguntas = temFaq
    ? [
        {
          '@type': 'FAQPage',
          '@id': idFaq,
          mainEntity: meta.perguntas.map((p) => ({
            '@type': 'Question',
            name: p.pergunta,
            acceptedAnswer: { '@type': 'Answer', text: p.resposta },
          })),
        },
      ]
    : []

  return {
    '@context': 'https://schema.org',
    '@graph': [
      migalhas([
        { nome: 'Capa', caminho: '/' },
        { nome: 'Arquivo', caminho: '/arquivo' },
        { nome: meta.titulo, caminho },
      ]),
      {
        '@type': 'WebPage',
        '@id': url,
        url,
        name: meta.titulo,
        description: meta.resumo,
        inLanguage: SITE.idioma,
        isPartOf: { '@id': ID_SITE },
        datePublished: meta.publicadoEm,
        dateModified: meta.atualizadoEm ?? meta.publicadoEm,
        about: entidades(meta),
        keywords: meta.palavrasChave.join(', '),
        // As três versões são partes desta página, e não duplicatas dela.
        hasPart: NIVEIS.map((nivel) => ({
          '@type': ['Article', 'ScholarlyArticle'],
          '@id': urlAbsoluta(`${caminho}/${nivel}`),
          headline: `${meta.titulo} — nível ${NIVEL_INFO[nivel].rotulo.toLowerCase()}`,
          educationalLevel: NIVEL_INFO[nivel].publico,
          timeRequired: `PT${meta.tempoLeitura[nivel]}M`,
        })),
        ...(temFaq ? { mainEntity: { '@id': idFaq } } : {}),
      },
      ...perguntas,
      ...(meta.dadosChave.length > 0
        ? [
            {
              '@type': 'Dataset',
              '@id': `${url}#dados`,
              name: `Dados-chave: ${meta.titulo}`,
              description: meta.respostaCurta,
              creator: { '@id': ID_ORG },
              isAccessibleForFree: true,
              license: urlAbsoluta('/sobre'),
              variableMeasured: meta.dadosChave.map((dado) => ({
                '@type': 'PropertyValue',
                name: dado.rotulo,
                value: dado.valor,
                ...(dado.detalhe ? { description: dado.detalhe } : {}),
              })),
              citation: citacoes(referencias),
            },
          ]
        : []),
    ],
  }
}

/** Uma das três versões do artigo. */
export function grafoArtigo(meta: EdicaoMeta, nivel: Nivel, referencias: Referencia[]) {
  const caminhoAncora = `/edicao/${meta.slug}`
  const caminho = `${caminhoAncora}/${nivel}`
  const url = urlAbsoluta(caminho)
  const info = NIVEL_INFO[nivel]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      migalhas([
        { nome: 'Capa', caminho: '/' },
        { nome: 'Arquivo', caminho: '/arquivo' },
        { nome: meta.titulo, caminho: caminhoAncora },
        { nome: `Nível ${info.rotulo.toLowerCase()}`, caminho },
      ]),
      {
        '@type': ['Article', 'ScholarlyArticle'],
        '@id': url,
        url,
        mainEntityOfPage: url,
        headline: meta.titulo,
        alternativeHeadline: meta.subtitulo,
        abstract: meta.resumo,
        description: meta.chamada[nivel],
        inLanguage: SITE.idioma,
        datePublished: meta.publicadoEm,
        dateModified: meta.atualizadoEm ?? meta.publicadoEm,
        // `educationalLevel` é o que distingue as três versões para um parser:
        // sem ele, três URLs sobre o mesmo assunto parecem duplicatas.
        educationalLevel: info.publico,
        timeRequired: `PT${meta.tempoLeitura[nivel]}M`,
        articleSection: meta.secao,
        keywords: meta.palavrasChave.join(', '),
        isAccessibleForFree: true,
        author: { '@id': ID_ORG },
        publisher: { '@id': ID_ORG },
        isPartOf: [{ '@id': ID_PERIODICO }, { '@id': urlAbsoluta(caminhoAncora) }],
        about: entidades(meta),
        citation: citacoes(referencias),
        identifier: identificador(meta.volume, meta.numero, meta.slug),
        image: urlAbsoluta(`${caminho}/opengraph-image`),
      },
    ],
  }
}
