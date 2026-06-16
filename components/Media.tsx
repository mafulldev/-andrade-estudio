"use client";

// Imagem do sistema: aspect-ratio reservado (zero layout shift), grade por
// tema, lavagem dourada e vinheta via CSS da classe .media, fallback
// elegante quando o endpoint falha (plate em gradiente da paleta + grain,
// sem erro de console), e ganchos de movimento por atributo:
//   parallax  -> data-parallax  (o controlador de cena move a camada interna)
//   kenburns  -> data-kenburns  (scale 1 a 1.05 em 16s, pausado fora do viewport)

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  parallax?: boolean;
  kenburns?: boolean;
};

export default function Media({
  src,
  alt,
  ratio = "3 / 2",
  sizes = "100vw",
  priority = false,
  className,
  parallax = false,
  kenburns = false,
}: Props) {
  const [falhou, setFalhou] = useState(false);

  return (
    <figure
      className={`media ${className ?? ""}`}
      style={{ aspectRatio: ratio }}
      data-parallax={parallax || undefined}
      data-kenburns={kenburns || undefined}
    >
      {falhou ? (
        <span className="media-fallback" aria-hidden="true" />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onError={() => setFalhou(true)}
        />
      )}
    </figure>
  );
}
