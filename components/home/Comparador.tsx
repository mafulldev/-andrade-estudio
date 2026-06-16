"use client";

// Comparador v2: PRONTO × SOB MEDIDA em duas faces sobrepostas recortadas
// por uma régua vertical com arraste (Draggable + inércia) e teclado completo
// (role slider: setas movem 5 pontos, Home/End nos extremos). Abaixo de
// 720px ou em reduced-motion vira pilha estática, todo o conteúdo visível.
// Ganchos para a Cena02: [data-face], [data-valor], [data-item], [data-regua].

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { registrarMotion } from "@/lib/motion/registro";
import s from "./comparador.module.css";

registrarMotion();

const FACES = {
  pronto: {
    nome: "Pronto",
    valor: "R$ 1.200",
    prazo: "no ar em 1 dia útil",
    itens: [
      "Modelo refinado do seu nicho",
      "Identidade e textos aplicados",
      "Uma rodada de ajustes inclusa",
      "Domínio e hospedagem em seu nome",
      "Código entregue",
    ],
  },
  sobmedida: {
    nome: "Sob medida",
    valor: "R$ 2.800",
    prazo: "de 2 a 4 semanas",
    itens: [
      "Design exclusivo desenhado do zero",
      "SEO técnico e performance",
      "Animações e tema duplo",
      "Suporte de estreia",
      "Código entregue",
    ],
  },
};

function Face({ qual, classe }: { qual: keyof typeof FACES; classe: string }) {
  const f = FACES[qual];
  return (
    <div className={`${s.face} ${classe}`} data-face={qual}>
      <div className={s.faceMiolo}>
        <div className={s.faceCabeca}>
          <span className={s.faceNome}>{f.nome}</span>
          <span className={s.faceDe}>a partir de</span>
          <span className={s.faceValor} data-valor={f.valor}>
            {f.valor}
          </span>
          <span className={s.facePrazo}>{f.prazo}</span>
        </div>
        <ul className={s.faceItens}>
          {f.itens.map((item) => (
            <li key={item} data-item>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Comparador() {
  const quadroRef = useRef<HTMLDivElement>(null);
  const reguaRef = useRef<HTMLButtonElement>(null);
  const posRef = useRef(50);
  const [pilha, setPilha] = useState(false);

  // modo pilha: telas estreitas ou reduced-motion
  useEffect(() => {
    const mqs = [
      window.matchMedia("(max-width: 719px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    const decidir = () => setPilha(mqs.some((m) => m.matches));
    decidir();
    mqs.forEach((m) => m.addEventListener("change", decidir));
    return () => mqs.forEach((m) => m.removeEventListener("change", decidir));
  }, []);

  // posiciona a régua e o recorte
  const aplicar = (pos: number) => {
    const quadro = quadroRef.current;
    const regua = reguaRef.current;
    if (!quadro || !regua) return;
    posRef.current = pos;
    quadro.style.setProperty("--pos", `${pos}%`);
    regua.setAttribute("aria-valuenow", String(Math.round(pos)));
  };

  // arraste com inércia
  useEffect(() => {
    if (pilha) return;
    const quadro = quadroRef.current;
    const regua = reguaRef.current;
    if (!quadro || !regua) return;

    const limitar = gsap.utils.clamp(8, 92);
    const proxy = document.createElement("div");
    let larguraQuadro = 1;
    let posInicial = 50;

    // micro do gesto: ao assentar, os dois valores decodificam e a régua
    // pulsa de volta à opacidade plena (guarda anti-spam por isTweening)
    const valores = quadro.querySelectorAll("[data-valor]");
    const assentar = () => {
      valores.forEach((v) => {
        if (gsap.isTweening(v)) return;
        gsap.to(v, {
          duration: 0.4,
          ease: "none",
          scrambleText: { text: "{original}", chars: "0123456789.", speed: 1.1 },
        });
      });
      gsap.fromTo(
        regua,
        { opacity: 0.55 },
        { opacity: 1, duration: 0.45, ease: "andrade", overwrite: "auto" },
      );
    };

    const arrastavel = Draggable.create(proxy, {
      type: "x",
      trigger: regua,
      inertia: true,
      onPress() {
        larguraQuadro = quadro.getBoundingClientRect().width;
        posInicial = posRef.current;
        gsap.set(proxy, { x: 0 });
        regua.dataset.arrastando = "1";
      },
      onDrag() {
        aplicar(limitar(posInicial + (this.x / larguraQuadro) * 100));
      },
      onThrowUpdate() {
        aplicar(limitar(posInicial + (this.x / larguraQuadro) * 100));
      },
      onRelease() {
        delete regua.dataset.arrastando;
      },
      onThrowComplete() {
        delete regua.dataset.arrastando;
        assentar();
      },
    })[0];

    return () => {
      arrastavel.kill();
    };
  }, [pilha]);

  const aoTeclar = (e: React.KeyboardEvent) => {
    const limitar = gsap.utils.clamp(8, 92);
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      aplicar(limitar(posRef.current - 5));
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      aplicar(limitar(posRef.current + 5));
    } else if (e.key === "Home") {
      e.preventDefault();
      aplicar(8);
    } else if (e.key === "End") {
      e.preventDefault();
      aplicar(92);
    }
  };

  return (
    <div
      className={s.quadro}
      ref={quadroRef}
      data-pilha={pilha ? "1" : undefined}
      data-comparador
    >
      <Face qual="sobmedida" classe={s.faceBase} />
      <Face qual="pronto" classe={s.faceTopo} />
      {!pilha && (
        <button
          type="button"
          className={s.regua}
          ref={reguaRef}
          role="slider"
          aria-label="Comparar Pronto e Sob medida"
          aria-valuemin={8}
          aria-valuemax={92}
          aria-valuenow={50}
          aria-orientation="horizontal"
          onKeyDown={aoTeclar}
          data-regua
          data-cursor="ARRASTE"
        >
          <span className={s.reguaPega} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
