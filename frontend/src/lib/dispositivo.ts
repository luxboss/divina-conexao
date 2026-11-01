export const CHAVE_DISPOSITIVO = "divina-conexao:dispositivo";
export const LIMITE_APARELHOS = 2;

export function nomeDoAparelho(agente: string): string {
  if (/iPhone|iPad/i.test(agente)) return "iPhone";
  if (/Android/i.test(agente)) return "Android";
  return "Computador";
}

/** Identificador estável deste navegador/aparelho, guardado no armazenamento local. */
export function obterIdDispositivo(armazenamento: Storage = localStorage): string {
  let id = armazenamento.getItem(CHAVE_DISPOSITIVO);
  if (!id || id.length < 8) {
    id = crypto.randomUUID();
    armazenamento.setItem(CHAVE_DISPOSITIVO, id);
  }
  return id;
}
