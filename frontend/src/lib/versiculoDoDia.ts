import { banco as bancoPadrao, versiculosValidos, type BancoVersiculos, type VersiculoValido } from "./versiculos";

export interface VersiculoDoDia extends VersiculoValido {
  tema: string;
}

/** Data no formato AAAA-MM-DD, pelo horário local (o "dia" muda à meia-noite do aparelho). */
export function chaveDoDia(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** Hash simples e estável de uma string (não muda entre execuções). */
function hashDeTexto(texto: string): number {
  let h = 0;
  for (let i = 0; i < texto.length; i++) {
    h = (h * 31 + texto.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Mesmo versículo o dia inteiro; muda no dia seguinte. Só usa versículos com texto. */
export function versiculoDoDia(
  banco: BancoVersiculos = bancoPadrao,
  data: Date = new Date()
): VersiculoDoDia | null {
  const todos: VersiculoDoDia[] = banco.temas.flatMap((t) =>
    versiculosValidos(t).map((v) => ({ ...v, tema: t.tema }))
  );
  if (todos.length === 0) return null;
  const indice = hashDeTexto(chaveDoDia(data)) % todos.length;
  return todos[indice];
}
