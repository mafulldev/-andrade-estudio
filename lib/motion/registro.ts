// Registro único e idempotente de TODOS os plugins GSAP do estúdio.
// Importado pelo ScrollSceneProvider (client) antes de qualquer filho
// coreografar; nenhum outro arquivo chama gsap.registerPlugin para estes.
//
// DOUTRINA DE MOTION DA CASA (vale para todo PR):
//   1. GSAP anima NARRATIVA: scroll, pins, splits, SVG, cenas.
//   2. Motion (motion/react) anima ESTADO DE UI: aberto/fechado, presença,
//      hover, layout (⌘K, accordion, toasts). Sempre via LazyMotion strict
//      e componentes m.* — nunca import de "framer-motion".
//   3. NUNCA dois donos do mesmo nó/propriedade (Motion não toca nada
//      dirigido por ScrollTrigger/Lenis).
//   4. PROIBIDO useScroll/useAnimationFrame do Motion: o Lenis é o único
//      dono do scroll e o gsap.ticker o único loop permanente.
//   5. Springs sem bounce: { type: "spring", visualDuration, bounce: 0 };
//      saídas em tween [0.16, 1, 0.3, 1]. CustomWiggle/CustomBounce ficam
//      FORA deste registro por contrato (sem bounce/elastic no site).

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { registrarEases } from "@/lib/motion/eases";

let registrado = false;

export function registrarMotion() {
  if (registrado) return;
  registrado = true;
  gsap.registerPlugin(
    ScrollTrigger,
    ScrollToPlugin,
    SplitText,
    DrawSVGPlugin,
    ScrambleTextPlugin,
    Flip,
    Draggable,
    InertiaPlugin,
    // MorphSVG e MotionPath: só hairline → hairline e pontos sobre anéis,
    // sempre na curva da casa; nada de morfo decorativo gratuito.
    MorphSVGPlugin,
    MotionPathPlugin,
  );
  ScrollTrigger.config({ ignoreMobileResize: true });
  registrarEases();
}

export { ScrollTrigger, SplitText, DrawSVGPlugin, ScrambleTextPlugin, Flip, Draggable };
