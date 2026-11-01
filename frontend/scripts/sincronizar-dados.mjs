// Copia o banco de versículos (fonte única em backend/) para o frontend antes de dev, test e build.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const origem = resolve(raiz, "backend", "versiculos.json");
const destino = resolve(raiz, "frontend", "src", "data", "versiculos.json");

mkdirSync(dirname(destino), { recursive: true });
copyFileSync(origem, destino);
console.log("Dados sincronizados:", origem, "->", destino);
