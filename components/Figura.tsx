// Fotografia editorial da casa (Server Component): next/image em palco com
// ratio reservado, grade fria por tema (classe .media), véu de gradiente,
// legenda hairline e ganchos [data-figura] para a coreografia central
// (components/home/Figuras.tsx): reveal por clip-path direcional, scale
// interna 1.15 → 1 e parallax contínuo. Sem JS aqui: quem anima é o
// controlador; sem ele (reduced/JS-off) a foto aparece pronta.

import Image from "next/image";

export default function Figura({
  src,
  alt,
  ratio = "3 / 2",
  sizes = "100vw",
  prioridade = false,
  parallax = 0.6,
  reveal = "cortina",
  direcao = "baixo",
  veu = "nenhum",
  legenda,
  credito,
  vetorial = false,
  className,
}: {
  src: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  prioridade?: boolean;
  /** -1..1: sentido e profundidade do parallax interno */
  parallax?: number;
  reveal?: "cortina" | "nenhum";
  direcao?: "baixo" | "esquerda" | "direita";
  veu?: "lateral" | "vertical" | "nenhum";
  legenda?: string;
  credito?: string;
  /** arte vetorial autoral (.svg): img direto, fora do otimizador */
  vetorial?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`figura ${className ?? ""}`}
      data-figura
      data-reveal-fig={reveal}
      data-direcao={direcao}
      data-parallax={parallax}
    >
      <div className="figura-clip" style={{ aspectRatio: ratio }}>
        <div className="figura-inner media">
          {vetorial ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={prioridade}
              quality={70}
            />
          )}
        </div>
        {veu !== "nenhum" && (
          <span className="figura-veu" data-veu={veu} aria-hidden="true" />
        )}
      </div>
      {legenda && (
        <figcaption className="figura-legenda">
          <span className="figura-regua" aria-hidden="true" />
          <span className="label">{legenda}</span>
          {credito && <span className="figura-credito">{credito}</span>}
        </figcaption>
      )}
    </figure>
  );
}
