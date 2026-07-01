// Rate-limit em memoria (janela deslizante), sem dependencia externa.
// Em serverless o escopo do modulo persiste em instancias quentes; num site
// solo de baixo trafego, um flood de um mesmo IP quase sempre bate na mesma
// instancia e e barrado. Nao e a prova de balas de um Upstash/Redis, mas eleva
// muito a barra a custo e complexidade zero, adequado ao estagio do projeto.

const baldes = new Map<string, number[]>();
let ultimaLimpeza = 0;
const HORIZONTE_MS = 3_600_000; // 1h: a limpeza global so descarta o bem velho

/**
 * Retorna true se a requisicao esta DENTRO do limite (pode seguir), false se
 * estourou. `chave` deve isolar a rota + o IP (ex.: `lead:1.2.3.4`).
 */
export function checarLimite(
  chave: string,
  limite: number,
  janelaMs: number,
): boolean {
  const agora = Date.now();

  // limpeza global esporadica pra nao vazar memoria (conservadora: HORIZONTE)
  if (agora - ultimaLimpeza > 60_000) {
    for (const [k, ts] of baldes) {
      const vivos = ts.filter((t) => agora - t < HORIZONTE_MS);
      if (vivos.length === 0) baldes.delete(k);
      else baldes.set(k, vivos);
    }
    ultimaLimpeza = agora;
  }

  const recentes = (baldes.get(chave) ?? []).filter(
    (t) => agora - t < janelaMs,
  );
  if (recentes.length >= limite) {
    baldes.set(chave, recentes); // guarda o estado ja podado
    return false;
  }
  recentes.push(agora);
  baldes.set(chave, recentes);
  return true;
}
