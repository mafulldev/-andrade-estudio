// SOLACE: UM ÚNICO timing em todo o site, cubic-bezier(.16, 1, .3, 1).
// Os dois nomes históricos ("andrade" para entradas, "cortina" para véus,
// Flip e preloader) apontam para a MESMA curva; scrubs de scroll nunca
// usam ease (mapeamento linear do scroll não é animação).

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

let registradas = false;

export function registrarEases() {
  if (registradas) return;
  registradas = true;
  CustomEase.create("andrade", "0.16, 1, 0.3, 1");
  CustomEase.create("cortina", "0.16, 1, 0.3, 1");
}

/* A mesma curva da casa em forma de função, para os scrollTo do Lenis
   (expo-out: equivalente funcional do cubic-bezier(0.16, 1, 0.3, 1)). */
export const easingCasa = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/* Duração de rolagem proporcional à distância: saltos curtos são ágeis,
   saltos de página inteira respiram (0.9s a 1.8s). */
export const duracaoRolagem = (delta: number): number =>
  Math.min(1.8, Math.max(0.9, 0.9 + Math.abs(delta) / 4000));
