// Gera o path SVG de "Andrade" a partir de fontes caligráficas do Windows.
// Uso único (não entra no build): node scripts/gen-assinatura.cjs
const opentype = require("opentype.js");
const fs = require("fs");

function carregar(caminho) {
  const b = fs.readFileSync(caminho);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}

const candidatos = {
  Gabriola: "C:/Windows/Fonts/Gabriola.ttf",
  SegoeScript: "C:/Windows/Fonts/segoesc.ttf",
};

const out = {};
for (const [nome, caminho] of Object.entries(candidatos)) {
  try {
    const font = carregar(caminho);
    const path = font.getPath("Andrade", 0, 160, 200, { kerning: true });
    const d = path.toPathData(1);
    const bb = path.getBoundingBox();
    out[nome] = {
      ok: true,
      dLen: d.length,
      bb: { x1: Math.round(bb.x1), y1: Math.round(bb.y1), x2: Math.round(bb.x2), y2: Math.round(bb.y2) },
    };
    fs.writeFileSync(`scripts/sig-${nome}.txt`, d);
  } catch (e) {
    out[nome] = { ok: false, erro: String(e.message).slice(0, 70) };
  }
}
console.log(JSON.stringify(out, null, 1));
