import { describe, expect, it } from "vitest";
import { chaveDoDia, versiculoDoDia } from "./versiculoDoDia";
import type { BancoVersiculos } from "./versiculos";

const banco: BancoVersiculos = {
  traducao: "teste",
  temas: [
    { tema: "Paz", versiculos: [
      { referencia: "João 14:27", texto: "A paz eu vos deixo." },
      { referencia: "Salmos 4:8", texto: "Em paz me deito." }
    ] },
    { tema: "Fé", versiculos: [
      { referencia: "Hebreus 11:1", texto: "A fé é a certeza." },
      { referencia: "Habacuque 2:4", texto: null }
    ] }
  ]
};

describe("chaveDoDia", () => {
  it("formata a data como AAAA-MM-DD", () => {
    expect(chaveDoDia(new Date(2026, 9, 31, 22, 15))).toBe("2026-10-31");
  });
});

describe("versiculoDoDia", () => {
  it("retorna o mesmo versículo para a mesma data", () => {
    const a = versiculoDoDia(banco, new Date(2026, 9, 31));
    const b = versiculoDoDia(banco, new Date(2026, 9, 31, 23, 59));
    expect(a).toEqual(b);
  });

  it("muda de versículo em pelo menos um dia da semana", () => {
    const refs = new Set<string>();
    for (let dia = 1; dia <= 30; dia++) {
      refs.add(versiculoDoDia(banco, new Date(2026, 0, dia))!.referencia);
    }
    expect(refs.size).toBeGreaterThan(1);
  });

  it("nunca escolhe versículo sem texto", () => {
    for (let dia = 1; dia <= 30; dia++) {
      const v = versiculoDoDia(banco, new Date(2026, 0, dia))!;
      expect(v.texto).toBeTruthy();
    }
  });

  it("informa o tema do versículo", () => {
    const v = versiculoDoDia(banco, new Date(2026, 0, 1))!;
    expect(["Paz", "Fé"]).toContain(v.tema);
  });

  it("retorna null quando não há nenhum versículo válido", () => {
    const vazio: BancoVersiculos = { traducao: "", temas: [{ tema: "X", versiculos: [{ referencia: "A 1:1", texto: null }] }] };
    expect(versiculoDoDia(vazio, new Date(2026, 0, 1))).toBeNull();
  });
});

describe("versículo do dia pelo horário de Brasília", () => {
  it("muda à meia-noite de Brasília, não à meia-noite UTC", () => {
    // 2026-10-31 02:30 UTC = 2026-10-30 23:30 em Brasília (ainda é o dia 30)
    const antesDaMeiaNoite = versiculoDoDia(banco, new Date("2026-10-31T02:30:00Z"));
    const ondeFicouODia30 = versiculoDoDia(banco, new Date("2026-10-30T15:00:00Z"));
    expect(antesDaMeiaNoite).toEqual(ondeFicouODia30);
  });

  it("o dia seguinte começa à meia-noite de Brasília (03:00 UTC)", () => {
    const dia30 = versiculoDoDia(banco, new Date("2026-10-30T15:00:00Z"));
    const dia31 = versiculoDoDia(banco, new Date("2026-10-31T03:00:00Z"));
    expect(dia31).not.toEqual(dia30);
  });
});
