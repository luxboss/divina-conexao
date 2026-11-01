// Valida backend/versiculos.json. Sai com código 1 se algo estiver fora do padrão.
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const caminho = resolve(dirname(fileURLToPath(import.meta.url)), "versiculos.json");
const dados = JSON.parse(readFileSync(caminho, "utf8"));
const erros = [];

const TEMAS_ESPERADOS = 20;
const VERSICULOS_POR_TEMA = 20;

if (!Array.isArray(dados.temas)) erros.push("campo 'temas' ausente ou inválido");

if (Array.isArray(dados.temas)) {
  if (dados.temas.length !== TEMAS_ESPERADOS) {
    erros.push(`esperava ${TEMAS_ESPERADOS} temas, encontrei ${dados.temas.length}`);
  }

  const nomes = new Set();
  for (const tema of dados.temas) {
    if (!tema.tema || typeof tema.tema !== "string") {
      erros.push("tema sem nome");
      continue;
    }
    if (nomes.has(tema.tema)) erros.push(`tema duplicado: ${tema.tema}`);
    nomes.add(tema.tema);

    if (tema.versiculos.length !== VERSICULOS_POR_TEMA) {
      erros.push(`${tema.tema}: esperava ${VERSICULOS_POR_TEMA} versículos, encontrei ${tema.versiculos.length}`);
    }

    const refs = new Set();
    for (const v of tema.versiculos) {
      if (!v.referencia || !/\d+:\d+/.test(v.referencia)) {
        erros.push(`${tema.tema}: referência inválida '${v.referencia}'`);
      }
      if (refs.has(v.referencia)) erros.push(`${tema.tema}: referência repetida '${v.referencia}'`);
      refs.add(v.referencia);

      if (typeof v.texto !== "string" || v.texto.trim().length === 0) {
        erros.push(`${tema.tema} / ${v.referencia}: texto vazio`);
      } else if (v.texto.length > 600) {
        erros.push(`${tema.tema} / ${v.referencia}: texto longo demais (${v.texto.length} caracteres)`);
      }
    }
  }
}

if (erros.length) {
  console.error(`Falhou com ${erros.length} erro(s):`);
  for (const e of erros) console.error(" -", e);
  process.exit(1);
}

const total = dados.temas.reduce((a, t) => a + t.versiculos.length, 0);
console.log(`OK: ${dados.temas.length} temas, ${total} versículos, todos com texto.`);
