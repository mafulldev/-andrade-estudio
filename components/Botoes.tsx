"use client";

// CTA CIRCULAR, o padrão único de ação do SOLACE: label uppercase com
// tracking longo ao lado de um círculo hairline com a seta dentro; no hover
// o círculo preenche com ink e a seta desliza. BotaoLinha e BotaoCircular
// rendem o MESMO padrão (o circular com aro maior); primario/cheio nascem
// preenchidos. useMagnetico segue exportado para o botão de MENU.

import Link from "next/link";
import gsap from "gsap";
import { useEffect, useRef, type ReactNode } from "react";
import { IcoSetaDireita } from "@/components/Icones";

const RAIO_MAGNETICO = 24;

export function useMagnetico() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const limitar = gsap.utils.clamp(-RAIO_MAGNETICO, RAIO_MAGNETICO);
    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "andrade" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "andrade" });
    const mover = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo(limitar((e.clientX - (r.left + r.width / 2)) * 0.35));
      yTo(limitar((e.clientY - (r.top + r.height / 2)) * 0.35));
    };
    const sair = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", mover);
    el.addEventListener("pointerleave", sair);
    return () => {
      el.removeEventListener("pointermove", mover);
      el.removeEventListener("pointerleave", sair);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, []);

  return ref;
}

type BotaoProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  cursor?: string;
  className?: string;
  externo?: boolean;
  tipo?: "button" | "submit";
  compacto?: boolean;
};

function Casca({
  classes,
  href,
  externo,
  cursor,
  onClick,
  tipo,
  children,
}: BotaoProps & { classes: string }) {
  if (href && externo) {
    return (
      <a
        className={classes}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor={cursor}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  if (href) {
    return (
      <Link className={classes} href={href} data-cursor={cursor} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button type={tipo ?? "button"} className={classes} data-cursor={cursor} onClick={onClick}>
      {children}
    </button>
  );
}

export function BotaoLinha(props: BotaoProps & { primario?: boolean }) {
  const classes = [
    "botao-linha",
    props.primario ? "botao-linha--primario" : "",
    props.compacto ? "botao-linha--compacto" : "",
    props.className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Casca {...props} classes={classes}>
      <span>{props.children}</span>
      <IcoSetaDireita size={14} />
    </Casca>
  );
}

export function BotaoCircular(props: BotaoProps & { cheio?: boolean }) {
  const classes = [
    "botao-circular",
    props.cheio ? "botao-circular--cheio" : "",
    props.compacto ? "botao-circular--compacto" : "",
    props.className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Casca {...props} classes={classes}>
      <IcoSetaDireita size={14} />
      <span>{props.children}</span>
    </Casca>
  );
}

