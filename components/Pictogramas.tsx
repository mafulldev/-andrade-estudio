// Pictogramas AUTORAIS da casa: SVGs hairline (stroke 1.5, currentColor)
// com paths marcados para o DrawSVG das cenas ([data-picto] desenha once).
// Decisão de arquitetura: autoral em vez de Lottie (licença limpa, 1-2KB,
// tema de graça via currentColor, mesma linguagem do monograma).

const BASE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PictoEscuta({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" data-picto>
      <g {...BASE}>
        <path d="M18 30a8 8 0 0 1 0-12" />
        <path d="M13 35a15 15 0 0 1 0-22" />
        <path d="M8 40a22 22 0 0 1 0-32" />
        <circle cx="30" cy="24" r="2.4" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

export function PictoDesenho({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" data-picto>
      <g {...BASE}>
        <rect x="8" y="12" width="32" height="24" />
        <path d="M8 12 L40 36" />
        <path d="M28 12 L28 36" opacity="0.55" />
      </g>
    </svg>
  );
}

export function PictoPrumo({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" data-picto>
      <g {...BASE}>
        <path d="M24 6 L24 28" />
        <path d="M24 28 L19 35 L24 42 L29 35 Z" />
        <circle cx="24" cy="6" r="2.2" />
      </g>
    </svg>
  );
}

export function PictoEntrega({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" data-picto>
      <g {...BASE}>
        <rect x="9" y="10" width="30" height="20" />
        <path d="M9 34 L39 34" opacity="0.55" />
        <path d="M17 20 l5 5 9 -9" />
      </g>
    </svg>
  );
}

export function PictoSelo({ size = 44 }: { size?: number }) {
  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" data-picto>
      <g {...BASE}>
        <circle cx="24" cy="24" r="17" />
        <path d="M16 32 L24 13 L32 32" />
        <path d="M19.5 26 L28.5 26" />
      </g>
    </svg>
  );
}
