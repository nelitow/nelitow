import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { buscarEdicao } from '@/content/registry'
import { COOKIE_NIVEL, normalizarNivel } from '@/lib/preferencia-nivel'

/**
 * Permalink for an edição, independent of reading level.
 *
 * Resolves the reader's remembered level on the server and redirects, so a
 * shared link opens at whichever depth that reader normally uses.
 */
export default async function PaginaEdicao({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!buscarEdicao(slug)) notFound()

  const preferido = (await cookies()).get(COOKIE_NIVEL)?.value
  redirect(`/edicao/${slug}/${normalizarNivel(preferido)}`)
}
