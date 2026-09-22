const FORMATO_LONGO = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

const FORMATO_CURTO = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
})

/** Parses a bare `YYYY-MM-DD` as UTC midnight so the day never shifts. */
export function paraData(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`)
}

export function dataLonga(iso: string): string {
  return FORMATO_LONGO.format(paraData(iso))
}

export function dataCurta(iso: string): string {
  return FORMATO_CURTO.format(paraData(iso))
}

/** RFC 822 date, required by RSS readers. */
export function dataRss(iso: string): string {
  return paraData(iso).toUTCString()
}

/** `v1 n3` style locator shown in the article header. */
export function localizador(volume: number, numero: number): string {
  return `v. ${volume}, n. ${numero}`
}

/**
 * Stable pseudo-DOI so each edição has a citable identifier without us
 * actually registering one. The `10.0000` prefix is reserved for examples.
 */
export function identificador(volume: number, numero: number, slug: string): string {
  return `10.0000/ensaio.v${volume}.n${String(numero).padStart(3, '0')}.${slug}`
}
