export interface Favorito {
  tema: string;
  referencia: string;
  texto: string;
  /** Anotação pessoal da pessoa sobre o versículo. Opcional. */
  nota?: string;
}

export const CHAVE_FAVORITOS = "divina-conexao:favoritos";
export const LIMITE_NOTA = 1000;

/** Confere se um objeto tem o formato de favorito; a nota é opcional e precisa ser texto. */
export function ehFavoritoValido(f: unknown): f is Favorito {
  if (typeof f !== "object" || f === null) return false;
  const o = f as Record<string, unknown>;
  return (
    typeof o.tema === "string" &&
    typeof o.referencia === "string" &&
    typeof o.texto === "string" &&
    (o.nota === undefined || typeof o.nota === "string")
  );
}

/** Lê os favoritos salvos. Dados corrompidos viram lista vazia. */
export function lerFavoritos(armazenamento: Storage = localStorage): Favorito[] {
  try {
    const bruto = armazenamento.getItem(CHAVE_FAVORITOS);
    if (!bruto) return [];
    const lista = JSON.parse(bruto);
    if (!Array.isArray(lista)) return [];
    return lista.filter(ehFavoritoValido);
  } catch {
    return [];
  }
}

export function salvarFavoritos(lista: Favorito[], armazenamento: Storage = localStorage): void {
  armazenamento.setItem(CHAVE_FAVORITOS, JSON.stringify(lista));
}

export function estaFavoritado(lista: Favorito[], tema: string, referencia: string): boolean {
  return lista.some((f) => f.tema === tema && f.referencia === referencia);
}

/** Adiciona se não existe; remove se já existe. Retorna a nova lista. */
export function alternarFavorito(lista: Favorito[], novo: Favorito): Favorito[] {
  if (estaFavoritado(lista, novo.tema, novo.referencia)) {
    return lista.filter((f) => !(f.tema === novo.tema && f.referencia === novo.referencia));
  }
  return [...lista, { tema: novo.tema, referencia: novo.referencia, texto: novo.texto }];
}

/**
 * Grava a anotação de um favorito. Texto vazio apaga a nota.
 * Retorna uma nova lista; a original não é alterada.
 */
export function definirNota(lista: Favorito[], tema: string, referencia: string, nota: string): Favorito[] {
  const limpa = nota.trim().slice(0, LIMITE_NOTA);
  return lista.map((f) => {
    if (f.tema !== tema || f.referencia !== referencia) return f;
    const { nota: _antiga, ...semNota } = f;
    return limpa ? { ...semNota, nota: limpa } : semNota;
  });
}
