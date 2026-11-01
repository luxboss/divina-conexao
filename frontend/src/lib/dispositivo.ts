export const CHAVE_DISPOSITIVO = "divina-conexao:dispositivo";
export const LIMITE_APARELHOS = 2;

export function nomeDoAparelho(agente: string): string {
  if (/iPhone|iPad/i.test(agente)) return "iPhone";
  if (/Android/i.test(agente)) return "Android";
  return "Computador";
}

/** Gera um identificador aleatório. Funciona também em endereços sem HTTPS (crypto.randomUUID não existe ali). */
export function gerarIdAleatorio(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Identificador estável deste navegador/aparelho, guardado no armazenamento local. */
export function obterIdDispositivo(armazenamento: Storage = localStorage): string {
  let id = armazenamento.getItem(CHAVE_DISPOSITIVO);
  if (!id || id.length < 8) {
    id = gerarIdAleatorio();
    armazenamento.setItem(CHAVE_DISPOSITIVO, id);
  }
  return id;
}
