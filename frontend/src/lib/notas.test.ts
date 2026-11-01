import { describe, expect, it } from "vitest";
import { definirNota, type Favorito } from "./favoritos";

const base: Favorito[] = [
  { tema: "Paz", referencia: "João 14:27", texto: "A paz eu vos deixo." },
  { tema: "Fé", referencia: "Hebreus 11:1", texto: "A fé é a certeza." }
];

describe("definirNota", () => {
  it("grava a anotação só no favorito indicado", () => {
    const r = definirNota(base, "Paz", "João 14:27", "Lembrar nos dias difíceis");
    expect(r[0].nota).toBe("Lembrar nos dias difíceis");
    expect(r[1].nota).toBeUndefined();
  });

  it("remove espaços das pontas e apaga a nota quando vazia", () => {
    const comNota = definirNota(base, "Paz", "João 14:27", "  algo  ");
    expect(comNota[0].nota).toBe("algo");
    const apagada = definirNota(comNota, "Paz", "João 14:27", "   ");
    expect(apagada[0].nota).toBeUndefined();
  });

  it("não altera a lista original", () => {
    definirNota(base, "Paz", "João 14:27", "nota");
    expect(base[0].nota).toBeUndefined();
  });

  it("limita a anotação a 1000 caracteres", () => {
    const r = definirNota(base, "Paz", "João 14:27", "x".repeat(1500));
    expect(r[0].nota).toHaveLength(1000);
  });
});
