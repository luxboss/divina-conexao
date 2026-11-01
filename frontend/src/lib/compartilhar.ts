import type { VersiculoValido } from "./versiculos";

/** Texto pronto para colar ou enviar: citação, referência e assinatura do app. */
export function textoDoVersiculo(v: VersiculoValido): string {
  return `“${v.texto}” — ${v.referencia}\n\nDivina Conexão`;
}

/** Link que abre o WhatsApp com o texto já preenchido. */
export function linkWhatsApp(texto: string): string {
  return `https://wa.me/?text=${encodeURIComponent(texto)}`;
}

/**
 * Quebra um texto em linhas de no máximo `largura` caracteres, sem cortar palavras.
 * Palavra maior que a largura fica sozinha na linha.
 */
export function quebrarLinhas(texto: string, largura: number): string[] {
  const palavras = texto.trim().split(/\s+/).filter(Boolean);
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of palavras) {
    const candidata = atual ? `${atual} ${palavra}` : palavra;
    if (candidata.length <= largura || atual === "") {
      atual = candidata;
    } else {
      linhas.push(atual);
      atual = palavra;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}
