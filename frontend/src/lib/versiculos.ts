import dados from "../data/versiculos.json";

export interface Versiculo {
  referencia: string;
  texto: string | null;
}

export interface Tema {
  tema: string;
  versiculos: Versiculo[];
}

export interface BancoVersiculos {
  traducao: string;
  observacao?: string;
  temas: Tema[];
}

export interface VersiculoValido {
  referencia: string;
  texto: string;
}

export const banco = dados as BancoVersiculos;

/** Retorna só os versículos com texto preenchido, prontos para exibir. */
export function versiculosValidos(tema: Tema): VersiculoValido[] {
  return tema.versiculos.filter(
    (v): v is VersiculoValido => typeof v.texto === "string" && v.texto.trim().length > 0
  );
}

export function buscarTema(nome: string, origem: BancoVersiculos = banco): Tema | undefined {
  return origem.temas.find((t) => t.tema === nome);
}

/**
 * Sorteia um versículo do tema, sem repetir o atual quando houver outra opção.
 * `aleatorio` é injetável para testes (retorna número entre 0 e 1).
 */
export function sortearVersiculo(
  lista: VersiculoValido[],
  atual: string | null = null,
  aleatorio: () => number = Math.random
): VersiculoValido | null {
  if (lista.length === 0) return null;
  const candidatos = lista.length > 1 && atual ? lista.filter((v) => v.referencia !== atual) : lista;
  const indice = Math.floor(aleatorio() * candidatos.length);
  return candidatos[Math.min(indice, candidatos.length - 1)];
}
