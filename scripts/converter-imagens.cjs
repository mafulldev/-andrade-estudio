// Converte as 44 imagens geradas (PNG na pasta Inspiracoes) para AVIF nos
// caminhos finais de /public, com os nomes que o site e os demos esperam.
// Mapeamento feito por identificacao visual de cada imagem (uma a uma).
// Uso: node scripts/converter-imagens.cjs

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC_DIR = "C:\\Users\\macsa\\Desktop\\Inspiraçoes";
const PUB = path.join(__dirname, "..", "public");
const PREFIXO = "ChatGPT Image 16 de jun. de 2026, ";

// [ tempo+indice do arquivo de origem, caminho destino relativo a /public ]
const MAPA = [
  // HOME
  ["19_24_52 (1)", "fotos/processo-01.avif"],
  ["19_24_53 (3)", "fotos/processo-02.avif"],
  ["19_24_54 (4)", "fotos/processo-03.avif"],
  ["19_24_54 (5)", "fotos/processo-04.avif"],
  ["19_24_55 (6)", "fotos/estudio-faixa.avif"],
  ["19_24_55 (7)", "fotos/bastidores-codigo.avif"],
  ["19_24_56 (8)", "fotos/coda-horizonte.avif"],
  // BRASA
  ["19_24_53 (2)", "demos/brasa/hero.avif"],
  ["19_24_57 (9)", "demos/brasa/prato-1.avif"],
  ["19_24_57 (10)", "demos/brasa/prato-2.avif"],
  ["19_24_40 (1)", "demos/brasa/prato-3.avif"],
  ["19_24_41 (2)", "demos/brasa/prato-4.avif"],
  ["19_24_42 (3)", "demos/brasa/prato-5.avif"],
  ["19_24_43 (4)", "demos/brasa/prato-6.avif"],
  ["19_24_44 (5)", "demos/brasa/prato-7.avif"],
  ["19_24_44 (6)", "demos/brasa/prato-8.avif"],
  ["19_24_45 (7)", "demos/brasa/forno.avif"],
  ["19_24_46 (8)", "demos/brasa/salao.avif"],
  // VITTA
  ["19_24_27 (1)", "demos/vitta/recepcao.avif"],
  ["19_24_28 (2)", "demos/vitta/dra-helena.avif"],
  ["19_24_29 (3)", "demos/vitta/dr-caio.avif"],
  ["19_24_30 (4)", "demos/vitta/dra-julia.avif"],
  ["19_24_30 (5)", "demos/vitta/corredor.avif"],
  ["19_24_30 (6)", "demos/vitta/fachada.avif"],
  // FORO
  ["19_24_32 (7)", "demos/foro/arquivo.avif"],
  ["19_24_33 (8)", "demos/foro/biblioteca.avif"],
  ["19_24_33 (9)", "demos/foro/artigo-contrato.avif"],
  ["19_24_34 (10)", "demos/foro/artigo-familia.avif"],
  ["19_24_17 (1)", "demos/foro/artigo-lgpd.avif"],
  ["19_24_17 (2)", "demos/foro/sala-reuniao.avif"],
  // PRUMO
  ["19_24_18 (3)", "demos/prumo/hero-equipe.avif"],
  ["19_24_19 (4)", "demos/prumo/servicos-ferramentas.avif"],
  ["19_24_19 (5)", "demos/prumo/cozinha-depois.avif"],
  ["19_24_20 (6)", "demos/prumo/cozinha-antes.avif"],
  ["19_24_20 (7)", "demos/prumo/medicao-laser.avif"],
  ["19_24_20 (8)", "demos/prumo/van-equipe.avif"],
  // SOLAR
  ["19_24_20 (9)", "demos/solar/casa-patio-fachada.avif"],
  ["19_24_21 (10)", "demos/solar/casa-patio-patio.avif"],
  ["19_24_06 (1)", "demos/solar/casa-patio-interior.avif"],
  ["19_24_06 (2)", "demos/solar/varanda.avif"],
  ["19_24_06 (3)", "demos/solar/apartamento-interior.avif"],
  ["19_24_07 (4)", "demos/solar/vista-horizonte.avif"],
  ["19_24_07 (5)", "demos/solar/varanda-gourmet.avif"],
  ["19_24_07 (6)", "demos/solar/refugio-serra.avif"],
];

(async () => {
  let ok = 0;
  const faltando = [];
  for (const [tempo, destRel] of MAPA) {
    const src = path.join(SRC_DIR, PREFIXO + tempo + ".png");
    const dest = path.join(PUB, destRel);
    if (!fs.existsSync(src)) {
      faltando.push(src);
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(src)
      .avif({ quality: 60, effort: 4 })
      .toFile(dest);
    ok += 1;
    console.log("OK  " + destRel);
  }
  console.log("\nConvertidas: " + ok + " de " + MAPA.length);
  if (faltando.length) {
    console.log("FALTANDO origem:");
    faltando.forEach((f) => console.log("  " + f));
  }
})().catch((e) => {
  console.error("ERRO:", e);
  process.exit(1);
});
