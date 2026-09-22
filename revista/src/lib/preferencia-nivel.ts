import { isNivel, type Nivel } from '@/content/types'

export const COOKIE_NIVEL = 'ensaio-nivel'

const UM_ANO = 60 * 60 * 24 * 365

/**
 * The reader's preferred depth.
 *
 * Stored in a cookie rather than localStorage specifically so the server can
 * read it: `/edicao/[slug]` resolves straight to the remembered level in a
 * redirect, with no client round trip and no flash of the wrong level.
 */
export function lembrarNivel(nivel: Nivel): void {
  try {
    document.cookie = `${COOKIE_NIVEL}=${nivel}; path=/; max-age=${UM_ANO}; samesite=lax`
  } catch {
    // Blocked cookies just mean the site stops remembering — never an error.
  }
}

export function normalizarNivel(valor: string | undefined, padrao: Nivel = 'leigo'): Nivel {
  return valor && isNivel(valor) ? valor : padrao
}

/** Lê o nível lembrado no navegador. Devolve null quando não há preferência. */
export function nivelLembrado(): Nivel | null {
  try {
    const achado = document.cookie.match(
      new RegExp(`(?:^|;\\s*)${COOKIE_NIVEL}=([^;]*)`),
    )
    const valor = achado?.[1] ? decodeURIComponent(achado[1]) : undefined
    return valor && isNivel(valor) ? valor : null
  } catch {
    return null
  }
}
