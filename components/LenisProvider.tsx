// Compatibilidade: o provider de cena vive em ScrollSceneProvider.
// Este módulo reexporta para os consumidores existentes (menu, preloader,
// rail, demos, consultor) sem tocar em cada import.

export { default, useLenis } from "@/components/ScrollSceneProvider";
