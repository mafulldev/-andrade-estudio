// Estado de tema e de primeira visita: cookies de sessão simples,
// lidos no layout para SSR coerente. Nenhum localStorage no projeto.

export type Tema = "dark" | "light";

export const COOKIE_TEMA = "andrade_tema";
export const COOKIE_VISITOU = "andrade_visitou";

// Aproximações em hex dos tokens --bg, apenas para <meta name="theme-color">.
export const THEME_COLOR: Record<Tema, string> = {
  dark: "#0b0a08",
  light: "#fbfaf7",
};

export function lerTemaDoCookieCliente(): Tema | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)andrade_tema=(dark|light)/);
  return m ? (m[1] as Tema) : null;
}

export function gravarTemaCliente(tema: Tema) {
  document.cookie = `${COOKIE_TEMA}=${tema}; path=/; samesite=lax`;
}

export function aplicarTemaNoDocumento(tema: Tema) {
  document.documentElement.dataset.theme = tema;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[tema]);
}
