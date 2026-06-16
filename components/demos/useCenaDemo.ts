"use client";

// Cena compartilhada das demos: o mesmo regime de movimento do estúdio,
// escopado à raiz de cada modelo, em useGSAP com cleanup automático.
//
// Ganchos que o hook entende dentro da raiz:
//   [data-hero]            a seção do hero (gatilho da saída com parallax)
//   [data-hero-conjunto]   o conjunto que anda y +20% com fade parcial ao rolar
//   [data-hero-plate]      o plate do hero: scale 1.3 -> 1 na abertura
//   [data-hero-linhas]     título do hero mascarado por linha ([data-linha])
//   [data-hero-item]       microdados do hero subindo em cadência
//   data-reveal="linhas"   títulos por linha, yPercent 110 -> 0, stagger 0.03
//   data-reveal="mascara"  blocos, y 36 + opacity, 1.0s, once
//   data-reveal="plate"    imagens por clip-path inset(100% 0 0 0) -> 0 + scale 1.15 -> 1
//   [data-kenburns]        img interna: scale 1 -> 1.05 em 16s, pausado fora do viewport
//   [data-parallax]        img interna: overscan 1.28 e ±9% vertical (touch x0.4)
//
// Reduced-motion: nada se move; o gate html.cena-pronta mostra tudo.

import { type RefObject } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useCenaDemo(raizRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const raiz = raizRef.current;
      if (!raiz) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const f = window.matchMedia("(max-width: 860px)").matches ? 0.4 : 1;
      const q = gsap.utils.selector(raiz);

      /* hero: plate e título em escala, microdados em cadência, saída +20% */

      const plateHero = q("[data-hero-plate]");
      if (plateHero.length) {
        gsap.fromTo(plateHero, { scale: 1.3 }, { scale: 1, duration: 1.6, ease: "expo.out" });
      }
      const linhasHero = q("[data-hero-linhas] [data-linha]");
      if (linhasHero.length) {
        gsap.fromTo(
          linhasHero,
          { yPercent: 110 },
          { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.03, delay: 0.15 },
        );
      }
      const itensHero = q("[data-hero-item]");
      if (itensHero.length) {
        gsap.fromTo(
          itensHero,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.45 },
        );
      }
      const conjunto = raiz.querySelector("[data-hero-conjunto]");
      const hero = raiz.querySelector("[data-hero]") ?? conjunto;
      if (conjunto && hero) {
        gsap.to(conjunto, {
          yPercent: 20,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.9 },
        });
      }

      /* revelações por variante */

      q('[data-reveal="linhas"]').forEach((el) => {
        if (el.closest("[data-hero-linhas]")) return;
        gsap.fromTo(
          el.querySelectorAll("[data-linha]"),
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.03,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      q('[data-reveal="mascara"]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      q('[data-reveal="plate"]').forEach((el) => {
        const img = el.querySelector("img");
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
        if (img && !el.matches("[data-parallax]") && !el.closest("[data-parallax]")) {
          gsap.fromTo(
            img,
            { scale: 1.15 },
            {
              scale: 1,
              duration: 1.4,
              ease: "expo.out",
              scrollTrigger: { trigger: el, start: "top 85%", once: true },
            },
          );
        }
      });

      /* parallax interno e Ken Burns */

      q("[data-parallax]").forEach((fig) => {
        const img = fig.querySelector("img");
        if (!img) return;
        gsap.set(img, { scale: 1.3 });
        gsap.fromTo(
          img,
          { yPercent: -11 * f },
          { yPercent: 11 * f, ease: "none", scrollTrigger: { trigger: fig, scrub: 1 } },
        );
      });

      q("[data-kenburns]").forEach((fig) => {
        const img = fig.querySelector("img");
        if (!img) return;
        const base =
          fig.matches("[data-parallax]") || fig.closest("[data-parallax]") ? 1.3 : 1;
        gsap.fromTo(
          img,
          { scale: base },
          {
            scale: base * 1.05,
            duration: 16,
            ease: "none",
            scrollTrigger: { trigger: fig, toggleActions: "play pause resume pause" },
          },
        );
      });
    },
    { scope: raizRef },
  );
}
