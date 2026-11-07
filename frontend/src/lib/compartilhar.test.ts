import { describe, expect, it } from "vitest";
import { linkWhatsApp, quebrarLinhas, textoDoVersiculo } from "./compartilhar";

describe("textoDoVersiculo", () => {
  it("monta o texto com referência e assinatura do app", () => {
    expect(textoDoVersiculo({ referencia: "João 14:27", texto: "A paz eu vos deixo." }))
      .toBe("“A paz eu vos deixo.” — João 14:27\n\nALTAR DIÁRIO");
  });
});

describe("linkWhatsApp", () => {
  it("codifica o texto na URL do WhatsApp", () => {
    expect(linkWhatsApp("Paz & graça")).toBe("https://wa.me/?text=Paz%20%26%20gra%C3%A7a");
  });
});

describe("quebrarLinhas", () => {
  it("quebra o texto em linhas de no máximo N caracteres, sem cortar palavras", () => {
    const linhas = quebrarLinhas("Deixo-vos a paz, a minha paz vos dou", 12);
    expect(linhas.every((l) => l.length <= 12)).toBe(true);
    expect(linhas.join(" ")).toBe("Deixo-vos a paz, a minha paz vos dou");
  });

  it("mantém palavra longa em uma linha própria", () => {
    expect(quebrarLinhas("oi paralelepipedo fim", 8)).toEqual(["oi", "paralelepipedo", "fim"]);
  });

  it("retorna lista vazia para texto vazio", () => {
    expect(quebrarLinhas("   ", 10)).toEqual([]);
  });
});
