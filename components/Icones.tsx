// Ícones SVG inline do sistema: stroke 1.5px (linguagem OURO), sem
// preenchimento. Emoji jamais é usado como ícone.

import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 18, children, ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IcoSetaDireita = (p: Props) => (
  <Svg {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);

export const IcoSetaDiagonal = (p: Props) => (
  <Svg {...p}>
    <path d="M7 17 17 7" />
    <path d="M9 7h8v8" />
  </Svg>
);

export const IcoMais = (p: Props) => (
  <Svg {...p}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </Svg>
);

export const IcoFechar = (p: Props) => (
  <Svg {...p}>
    <path d="m6 6 12 12" />
    <path d="M18 6 6 18" />
  </Svg>
);

export const IcoCheckCircular = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.2 2.4 2.4 4.6-5" />
  </Svg>
);

export const IcoRelogio = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 1.8" />
  </Svg>
);

export const IcoCodigo = (p: Props) => (
  <Svg {...p}>
    <path d="m8 8-4.5 4L8 16" />
    <path d="m16 8 4.5 4L16 16" />
    <path d="m13.2 5-2.4 14" />
  </Svg>
);

export const IcoCamadas = (p: Props) => (
  <Svg {...p}>
    <path d="m12 4 8.5 4.5L12 13 3.5 8.5Z" />
    <path d="m3.5 13 8.5 4.5 8.5-4.5" />
    <path d="m3.5 17 8.5 4.5 8.5-4.5" opacity="0.45" />
  </Svg>
);

export const IcoCompasso = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5-5 2 2-5Z" />
  </Svg>
);

export const IcoPino = (p: Props) => (
  <Svg {...p}>
    <path d="M12 21s-6.5-5.4-6.5-10A6.5 6.5 0 0 1 18.5 11c0 4.6-6.5 10-6.5 10Z" />
    <circle cx="12" cy="11" r="2.2" />
  </Svg>
);

export const IcoBalao = (p: Props) => (
  <Svg {...p}>
    <path d="M20 14.5a2 2 0 0 1-2 2H8.5L4 20.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
  </Svg>
);

export const IcoTema = (p: Props) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none" />
  </Svg>
);

export const IcoLosango = (p: Props) => (
  <Svg {...p}>
    <path d="M12 3.5 20.5 12 12 20.5 3.5 12Z" />
  </Svg>
);

export const IcoLink = (p: Props) => (
  <Svg {...p}>
    <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.4 1.4" />
    <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.4-1.4" />
  </Svg>
);

export const IcoImpressora = (p: Props) => (
  <Svg {...p}>
    <path d="M7 8V3.5h10V8" />
    <path d="M5 16H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1" />
    <path d="M7 13.5h10v7H7Z" />
  </Svg>
);

export const IcoGithub = (p: Props) => (
  <Svg {...p}>
    <path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.62-.2.62-.43v-1.7c-2.5.54-3.03-1.08-3.03-1.08-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.38 2.12.98 2.63.75.08-.59.32-.98.57-1.21-2-.22-4.1-1-4.1-4.44 0-.98.35-1.79.93-2.42-.1-.23-.4-1.15.08-2.4 0 0 .76-.24 2.48.92a8.6 8.6 0 0 1 4.5 0c1.72-1.16 2.48-.92 2.48-.92.49 1.25.18 2.17.09 2.4.58.63.93 1.44.93 2.42 0 3.45-2.1 4.21-4.11 4.43.32.28.61.83.61 1.67v2.47c0 .24.16.52.62.43A9 9 0 0 0 12 3Z" />
  </Svg>
);

export const IcoEmail = (p: Props) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Svg>
);

export const IcoWhatsapp = (p: Props) => (
  <Svg {...p}>
    <path d="M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5Z" />
    <path d="M9.2 8.4c.6-.6 1-.4 1.3.2l.5 1.1c.2.4 0 .8-.5 1.2-.3.2.7 1.6 1.4 2.1.6.5 1 .6 1.3.3.4-.4.8-.6 1.2-.3l1.2.7c.5.3.6.8 0 1.4-1.6 1.6-6.9-2.6-6.4-6.7Z" />
  </Svg>
);
