// Self-test do estúdio. Rodar com: npm run selftest
// Parte 1: motor de avaliação, quatro cenários com resultados travados.
// Parte 2: verificações ESTÁTICAS da casa (doutrina de motion, eases,
// cores OKLCH, travessão, honestidade das specs). Qualquer FAIL bloqueia.

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { avaliar, type Respostas } from "../lib/motor";

let falhas = 0;

function cenario(
  letra: string,
  descricao: string,
  respostas: Respostas,
  esperado: {
    caminho: string;
    categoria?: string;
    faixaMin: number;
    faixaMax: number;
    prazoEstimado?: string;
  },
) {
  const r = avaliar(respostas);
  const erros: string[] = [];

  if (r.caminho !== esperado.caminho)
    erros.push(`caminho: esperado ${esperado.caminho}, obtido ${r.caminho}`);
  if (esperado.categoria && r.categoria !== esperado.categoria)
    erros.push(
      `categoria: esperado ${esperado.categoria}, obtido ${r.categoria}`,
    );
  if (r.faixaMin !== esperado.faixaMin)
    erros.push(`faixaMin: esperado ${esperado.faixaMin}, obtido ${r.faixaMin}`);
  if (r.faixaMax !== esperado.faixaMax)
    erros.push(`faixaMax: esperado ${esperado.faixaMax}, obtido ${r.faixaMax}`);
  if (esperado.prazoEstimado && r.prazoEstimado !== esperado.prazoEstimado)
    erros.push(
      `prazo: esperado "${esperado.prazoEstimado}", obtido "${r.prazoEstimado}"`,
    );

  if (erros.length === 0) {
    console.log(`[PASS] Cenário ${letra}: ${descricao}`);
  } else {
    falhas += 1;
    console.log(`[FAIL] Cenário ${letra}: ${descricao}`);
    for (const e of erros) console.log(`       ${e}`);
  }
}

const A: Respostas = {
  segmento: "advocacia",
  objetivo: "contatos",
  func: ["blogSeo"],
  prazo: "urgente",
  invest: "ate2500",
};
cenario("A", "advocacia, contatos, [blogSeo], urgente, até 2.500", A, {
  caminho: "pronto",
  faixaMin: 1800,
  faixaMax: 4000,
  prazoEstimado: "até 1 dia útil",
});

const B: Respostas = {
  segmento: "loja",
  objetivo: "vender",
  func: ["pagamentos", "blogSeo"],
  prazo: "flexivel",
  invest: "verEstimativa",
};
cenario("B", "loja online, vender, [pagamentos, blogSeo], flexível", B, {
  caminho: "sobmedida",
  categoria: "ecommerce",
  faixaMin: 7100,
  faixaMax: 15500,
});

const C: Respostas = {
  segmento: "startup",
  objetivo: "sistema",
  func: ["admin", "integracoes"],
  prazo: "urgente",
  invest: "verEstimativa",
};
cenario("C", "startup, sistema, [admin, integracoes], urgente", C, {
  caminho: "sobmedida",
  categoria: "sistema",
  faixaMin: 12400,
  faixaMax: 40250,
});

// D: serialização e parse do payload do cenário B idênticos, e o motor
// produz o mesmo resultado sobre o payload reidratado.
{
  const serializado = JSON.stringify(B);
  const reidratado = JSON.parse(serializado) as Respostas;
  const identico =
    JSON.stringify(reidratado) === serializado &&
    JSON.stringify(avaliar(reidratado)) === JSON.stringify(avaliar(B));
  if (identico) {
    console.log(
      "[PASS] Cenário D: serialização e parse do payload B idênticos",
    );
  } else {
    falhas += 1;
    console.log(
      "[FAIL] Cenário D: payload B divergiu após serializar e parsear",
    );
  }
}

if (falhas > 0) {
  console.log(`\n${falhas} cenário(s) em FAIL. Nada é entregue com FAIL.`);
  process.exit(1);
}
console.log("\nSelf-test completo: 4 de 4 em PASS.");

// ---------------------------------------------------------------------------
// Parte 2 · Verificações estáticas da casa. Cada uma protege uma regra que
// já foi quebrada (ou quase) em alguma missão; a evidência é o próprio fonte.

const RAIZ = join(__dirname, "..");
const IGNORAR = new Set(["node_modules", ".next", "public", ".git"]);

function listar(dir: string, exts: string[]): string[] {
  const saida: string[] = [];
  for (const nome of readdirSync(dir)) {
    if (IGNORAR.has(nome)) continue;
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) {
      saida.push(...listar(caminho, exts));
    } else if (exts.some((e) => nome.endsWith(e))) {
      saida.push(caminho);
    }
  }
  return saida;
}

const fontes = listar(RAIZ, [".ts", ".tsx"]).filter(
  (f) => !f.includes("selftest"),
);
const estilos = listar(RAIZ, [".css"]);
const ler = (f: string) => readFileSync(f, "utf8");
const rel = (f: string) => f.slice(RAIZ.length + 1).replace(/\\/g, "/");

let falhasEstaticas = 0;
function checa(nome: string, problemas: string[]) {
  if (problemas.length === 0) {
    console.log(`[PASS] ${nome}`);
  } else {
    falhasEstaticas += 1;
    console.log(`[FAIL] ${nome}`);
    for (const p of problemas.slice(0, 6)) console.log(`       ${p}`);
  }
}

console.log("\nVerificações estáticas da casa:");

// E1 · Lenis: o provider é o único dono do loop (autoRaf desligado)
{
  const provider = ler(join(RAIZ, "components", "ScrollSceneProvider.tsx"));
  const problemas: string[] = [];
  if (!provider.includes("autoRaf: false"))
    problemas.push("autoRaf: false ausente");
  if (!provider.includes("syncTouch: false"))
    problemas.push("syncTouch: false ausente");
  checa("Lenis com autoRaf e syncTouch desligados no provider", problemas);
}

// E2 · Registro GSAP: Morph e MotionPath dentro, Wiggle e Bounce banidos
// (a doutrina em comentário CITA os banidos; o que conta é import real)
{
  const problemas: string[] = [];
  for (const f of fontes) {
    if (/from\s+["']gsap\/Custom(Wiggle|Bounce)["']/.test(ler(f)))
      problemas.push(`${rel(f)}: importa CustomWiggle/CustomBounce`);
  }
  const registro = ler(join(RAIZ, "lib", "motion", "registro.ts"));
  if (!registro.includes("MorphSVGPlugin"))
    problemas.push("MorphSVGPlugin ausente");
  if (!registro.includes("MotionPathPlugin"))
    problemas.push("MotionPathPlugin ausente");
  checa("Registro GSAP sem Wiggle/Bounce e com Morph/MotionPath", problemas);
}

// E3 · Motion só via m.* de "motion/react"; framer-motion banido
{
  const problemas: string[] = [];
  for (const f of fontes) {
    const t = ler(f);
    if (/from\s+["']framer-motion["']/.test(t))
      problemas.push(`${rel(f)}: import de framer-motion`);
    const importMotion = t.match(
      /import\s*{([^}]*)}\s*from\s*["']motion\/react["']/,
    );
    if (importMotion) {
      const nomes = importMotion[1]
        .split(",")
        .map((n) => n.trim().split(/\s+as\s+/)[0]);
      const proibidos = nomes.filter((n) =>
        ["motion", "useScroll", "useAnimationFrame", "useSpring"].includes(n),
      );
      if (proibidos.length)
        problemas.push(
          `${rel(f)}: importa ${proibidos.join(", ")} de motion/react`,
        );
    }
  }
  checa("Motion apenas via m.*, sem framer-motion nem useScroll", problemas);
}

// E4 · Eases GSAP: só "andrade", "cortina" ou "none" no estúdio
// (as demos têm identidades próprias por contrato e ficam de fora)
{
  const problemas: string[] = [];
  for (const f of fontes) {
    if (rel(f).includes("demos/")) continue;
    const t = ler(f);
    for (const m of t.matchAll(/ease:\s*"([^"]+)"/g)) {
      if (!["andrade", "cortina", "none"].includes(m[1]))
        problemas.push(`${rel(f)}: ease "${m[1]}"`);
    }
  }
  checa(
    'Eases GSAP do estúdio restritas a "andrade", "cortina" e "none"',
    problemas,
  );
}

// E5 · Travessão: proibido fora de comentário de código
{
  const problemas: string[] = [];
  for (const f of fontes) {
    const linhas = ler(f).split("\n");
    linhas.forEach((linha, i) => {
      if (!linha.includes("—")) return;
      const semComentario = linha.split("//")[0];
      if (
        semComentario.includes("—") &&
        !/\/\*|\*\/|^\s*\*/.test(semComentario)
      )
        problemas.push(`${rel(f)}:${i + 1}`);
    });
  }
  checa("Travessão ausente de texto visível", problemas);
}

// E6 · Cores: hex/rgb/hsl banidos de todo CSS (OKLCH only)
{
  const problemas: string[] = [];
  for (const f of estilos) {
    const linhas = ler(f).split("\n");
    linhas.forEach((linha, i) => {
      if (/#[0-9a-fA-F]{3,8}\b/.test(linha) || /\b(rgba?|hsla?)\(/.test(linha))
        problemas.push(`${rel(f)}:${i + 1}: ${linha.trim().slice(0, 60)}`);
    });
  }
  checa("CSS sem hex, rgb ou hsl (OKLCH only)", problemas);
}

// E7 · Ficha técnica: toda spec publicável carrega a data da medição
{
  const specs = ler(join(RAIZ, "lib", "specs.ts"));
  // só entradas reais (string literal), não a definição do tipo
  const rotulos = (specs.match(/rotulo:\s*"/g) || []).length;
  const medidas = (specs.match(/medidoEm:\s*"/g) || []).length;
  checa(
    "Specs da ficha técnica todas com medidoEm",
    rotulos === medidas && rotulos > 0
      ? []
      : [`${rotulos} rótulos vs ${medidas} medições datadas`],
  );
}

// E8 · Springs do Motion: sempre sem bounce
{
  const problemas: string[] = [];
  for (const f of fontes) {
    const t = ler(f);
    for (const m of t.matchAll(/type:\s*"spring"[^}]*/g)) {
      if (!m[0].includes("bounce: 0"))
        problemas.push(`${rel(f)}: spring sem bounce: 0`);
    }
  }
  checa("Springs do Motion sempre com bounce zero", problemas);
}

// E9 · Galeria de conceitos: todo card aponta para arquivo que existe
// (protege contra slug sem site publicado e thumbnail local quebrada)
{
  const problemas: string[] = [];
  const galeria = ler(join(RAIZ, "app", "conceitos", "page.tsx"));
  const slugs = [...galeria.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  if (slugs.length === 0) problemas.push("nenhum slug encontrado na galeria");
  for (const s of slugs) {
    if (!existsSync(join(RAIZ, "public", "trabalhos", s, "index.html")))
      problemas.push(`slug "${s}" sem public/trabalhos/${s}/index.html`);
  }
  for (const m of galeria.matchAll(/img:\s*"(\/[^"]+)"/g)) {
    if (!existsSync(join(RAIZ, "public", m[1])))
      problemas.push(`img local ausente: ${m[1]}`);
  }
  checa("Galeria de conceitos aponta para arquivos existentes", problemas);
}

if (falhasEstaticas > 0) {
  console.log(
    `\n${falhasEstaticas} verificação(ões) estática(s) em FAIL. Nada é entregue com FAIL.`,
  );
  process.exit(1);
}
console.log("Estático: 9 de 9 em PASS.");
