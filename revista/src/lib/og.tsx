import { ImageResponse } from 'next/og'

export const TAMANHO_OG = { width: 1200, height: 630 }
export const TIPO_OG = 'image/png'

const PAPEL = '#fbf8f2'
const TINTA = '#2a2420'
const SUAVE = '#6b625b'
const REGUA = '#d8d0c4'

const COR_NIVEL: Record<string, string> = {
  Leigo: '#8a5a2b',
  Intermediário: '#1d5f77',
  Especialista: '#8a2c28',
  '': '#8a2c28',
}

/**
 * Cartão social com a mesma gramática visual do site: papel quente, régua
 * dupla e tipografia com hierarquia clara.
 *
 * Satori só entende flexbox, então cada contêiner declara `display: flex`
 * explicitamente — sem isso o elemento simplesmente não é desenhado.
 */
export function cartaoOg({
  titulo,
  subtitulo,
  nivel,
  etiqueta,
  rodape,
}: {
  titulo: string
  subtitulo?: string
  nivel?: string
  etiqueta: string
  rodape: string
}) {
  const acento = COR_NIVEL[nivel ?? ''] ?? '#8a2c28'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: PAPEL,
          padding: '64px 72px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                fontSize: 20,
                letterSpacing: 3,
                textTransform: 'uppercase',
                color: acento,
                fontWeight: 700,
              }}
            >
              {etiqueta}
            </div>
            {nivel && (
              <div
                style={{
                  display: 'flex',
                  fontSize: 19,
                  color: SUAVE,
                  border: `1px solid ${REGUA}`,
                  borderRadius: 4,
                  padding: '3px 12px',
                }}
              >
                nível {nivel.toLowerCase()}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', height: 4, backgroundColor: TINTA, marginTop: 22 }} />

          <div
            style={{
              display: 'flex',
              fontSize: titulo.length > 62 ? 60 : 72,
              lineHeight: 1.08,
              fontWeight: 700,
              color: TINTA,
              marginTop: 34,
              letterSpacing: -1.5,
            }}
          >
            {titulo}
          </div>

          {subtitulo && (
            <div
              style={{
                display: 'flex',
                fontSize: 30,
                lineHeight: 1.3,
                color: SUAVE,
                marginTop: 22,
              }}
            >
              {subtitulo.length > 128 ? `${subtitulo.slice(0, 125)}…` : subtitulo}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `1px solid ${REGUA}`,
            paddingTop: 22,
          }}
        >
          <div style={{ display: 'flex', fontSize: 27, fontWeight: 700, color: TINTA }}>
            Ensaio Aberto
          </div>
          <div style={{ display: 'flex', fontSize: 21, color: SUAVE }}>{rodape}</div>
        </div>
      </div>
    ),
    TAMANHO_OG,
  )
}
