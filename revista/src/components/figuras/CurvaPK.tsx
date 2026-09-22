'use client'

import { useId, useRef, useState } from 'react'

/**
 * Figura 3 — why a 65-day half-life is the commercially interesting number.
 *
 * The curve is an ILLUSTRATIVE monoexponential model, not measured data: the
 * only published figure is the half-life estimate itself. The caption says so,
 * and the axis is labelled in "% of the first peak" rather than in µg/mL so it
 * cannot be mistaken for a real concentration read-out.
 */

const MEIA_VIDA_DIAS = 65
const LAMBDA = Math.LN2 / MEIA_VIDA_DIAS
const DOSES_DIAS = [0, 84, 168]
const DIA_FINAL = 252
const PASSO = 2

const LARGURA = 680
const ALTURA = 300
const PAD = { esquerda: 50, direita: 18, topo: 18, base: 44 }
const Y_MAX = 175

interface Ponto {
  dia: number
  nivel: number
}

function concentracao(dia: number): number {
  return DOSES_DIAS.reduce(
    (total, diaDose) => (dia >= diaDose ? total + 100 * Math.exp(-LAMBDA * (dia - diaDose)) : total),
    0,
  )
}

function gerarPontos(): Ponto[] {
  const pontos: Ponto[] = []
  for (let dia = 0; dia <= DIA_FINAL; dia += PASSO) {
    // Sample both sides of each dose so the vertical jump stays vertical.
    if (DOSES_DIAS.includes(dia) && dia > 0) {
      pontos.push({ dia, nivel: concentracao(dia - 0.001) })
    }
    pontos.push({ dia, nivel: concentracao(dia) })
  }
  return pontos
}

const PONTOS = gerarPontos()

const escalaX = (dia: number) =>
  PAD.esquerda + (dia / DIA_FINAL) * (LARGURA - PAD.esquerda - PAD.direita)

const escalaY = (nivel: number) =>
  ALTURA - PAD.base - (nivel / Y_MAX) * (ALTURA - PAD.topo - PAD.base)

const CAMINHO = PONTOS.map((p, i) => `${i === 0 ? 'M' : 'L'}${escalaX(p.dia).toFixed(2)} ${escalaY(p.nivel).toFixed(2)}`).join(' ')

const AREA = `${CAMINHO} L${escalaX(DIA_FINAL).toFixed(2)} ${escalaY(0)} L${escalaX(0).toFixed(2)} ${escalaY(0)} Z`

const MARCAS_X = [0, 42, 84, 126, 168, 210, 252]
const MARCAS_Y = [0, 50, 100, 150]

export function CurvaPK() {
  const id = useId()
  // React 19: `ref` is just a prop — no forwardRef ceremony for the SVG node.
  const svgRef = useRef<SVGSVGElement>(null)
  const [foco, setFoco] = useState<Ponto | null>(null)

  function aoMover(evento: React.PointerEvent<SVGRectElement>) {
    const svg = svgRef.current
    if (!svg) return

    const caixa = svg.getBoundingClientRect()
    // Map client pixels back into viewBox units — the SVG is fluid-width.
    const xViewBox = ((evento.clientX - caixa.left) / caixa.width) * LARGURA
    const fracao = (xViewBox - PAD.esquerda) / (LARGURA - PAD.esquerda - PAD.direita)
    const dia = Math.max(0, Math.min(DIA_FINAL, Math.round((fracao * DIA_FINAL) / PASSO) * PASSO))

    setFoco({ dia, nivel: concentracao(dia) })
  }

  return (
    <div className="font-sans">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${LARGURA} ${ALTURA}`}
        className="h-auto w-full touch-none"
        role="img"
        aria-label={`Curva ilustrativa de concentração do ABS-201 ao longo de ${DIA_FINAL} dias, com doses nos dias ${DOSES_DIAS.join(', ')} e meia-vida de ${MEIA_VIDA_DIAS} dias.`}
      >
        <defs>
          <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cor-serie)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--cor-serie)" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Recessive grid */}
        {MARCAS_Y.map((valor) => (
          <g key={valor}>
            <line
              x1={PAD.esquerda}
              x2={LARGURA - PAD.direita}
              y1={escalaY(valor)}
              y2={escalaY(valor)}
              stroke="var(--color-rule)"
              strokeWidth="1"
            />
            <text
              x={PAD.esquerda - 10}
              y={escalaY(valor)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize="11"
              fill="var(--color-ink-faint)"
              className="tabular-nums"
            >
              {valor}
            </text>
          </g>
        ))}

        {/* Dose markers */}
        {DOSES_DIAS.map((dia) => (
          <g key={dia}>
            <line
              x1={escalaX(dia)}
              x2={escalaX(dia)}
              y1={PAD.topo}
              y2={ALTURA - PAD.base}
              stroke="var(--color-especialista)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <text
              x={escalaX(dia) + 5}
              y={PAD.topo + 10}
              fontSize="10"
              fill="var(--color-especialista)"
              fontWeight="600"
            >
              dose
            </text>
          </g>
        ))}

        <path d={AREA} fill={`url(#${id}-area)`} />
        <path
          d={CAMINHO}
          fill="none"
          stroke="var(--cor-serie)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Axes */}
        <line
          x1={PAD.esquerda}
          x2={LARGURA - PAD.direita}
          y1={escalaY(0)}
          y2={escalaY(0)}
          stroke="var(--color-rule-strong)"
          strokeWidth="1"
        />
        {MARCAS_X.map((dia) => (
          <text
            key={dia}
            x={escalaX(dia)}
            y={ALTURA - PAD.base + 18}
            textAnchor="middle"
            fontSize="11"
            fill="var(--color-ink-faint)"
            className="tabular-nums"
          >
            {dia}
          </text>
        ))}
        <text
          x={(LARGURA + PAD.esquerda) / 2}
          y={ALTURA - 6}
          textAnchor="middle"
          fontSize="11"
          fill="var(--color-ink-muted)"
        >
          dias desde a primeira dose
        </text>
        <text
          x={-(ALTURA - PAD.base + PAD.topo) / 2}
          y={14}
          transform="rotate(-90)"
          textAnchor="middle"
          fontSize="11"
          fill="var(--color-ink-muted)"
        >
          % do 1º pico
        </text>

        {/* Crosshair */}
        {foco && (
          <g pointerEvents="none">
            <line
              x1={escalaX(foco.dia)}
              x2={escalaX(foco.dia)}
              y1={PAD.topo}
              y2={escalaY(0)}
              stroke="var(--color-ink-faint)"
              strokeWidth="1"
            />
            {/* 2px surface ring keeps the marker legible over the filled area. */}
            <circle
              cx={escalaX(foco.dia)}
              cy={escalaY(foco.nivel)}
              r="5"
              fill="var(--cor-serie)"
              stroke="var(--color-paper-raised)"
              strokeWidth="2"
            />
          </g>
        )}

        <rect
          x={PAD.esquerda}
          y={PAD.topo}
          width={LARGURA - PAD.esquerda - PAD.direita}
          height={ALTURA - PAD.topo - PAD.base}
          fill="transparent"
          onPointerMove={aoMover}
          onPointerLeave={() => setFoco(null)}
        />
      </svg>

      <p
        className="mt-1 h-5 text-center text-[0.75rem] text-[var(--color-ink-muted)] tabular-nums"
        aria-live="polite"
      >
        {foco
          ? `Dia ${foco.dia} · ${foco.nivel.toFixed(0)}% do primeiro pico`
          : 'Passe o cursor sobre a curva para ler os valores.'}
      </p>

      <style>{`
        :root { --cor-serie: #2a78d6; }
        [data-theme='dark'] { --cor-serie: #3987e5; }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme='light']) { --cor-serie: #3987e5; }
        }
      `}</style>
    </div>
  )
}
