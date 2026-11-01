import { describe, expect, it } from "vitest";
import { agruparEvolucao, criarRegistro, diasSeguidos, resumoEvolucao, type Registro } from "./diario";
import { HUMORES, temasDoHumor } from "./humores";

const reg = (data: string, humor = "feliz"): Registro => ({
  id: `${data}-${humor}`, data, humor, tema: "Alegria", referencia: "Neemias 8:10", texto: "x"
});

describe("humores", () => {
  it("tem seis humores com temas que existem no banco", () => {
    expect(HUMORES).toHaveLength(6);
    for (const h of HUMORES) expect(temasDoHumor(h.id).length).toBeGreaterThan(0);
  });

  it("devolve temas vazios para humor desconhecido", () => {
    expect(temasDoHumor("inexistente")).toEqual([]);
  });
});

describe("criarRegistro", () => {
  it("guarda data no formato AAAA-MM-DD, humor e versículo", () => {
    const r = criarRegistro({ humor: "triste", tema: "Consolo", referencia: "Mateus 5:4", texto: "t" }, new Date(2026, 9, 31));
    expect(r.data).toBe("2026-10-31");
    expect(r.humor).toBe("triste");
    expect(r.id).toBeTruthy();
    expect(r.nota).toBeUndefined();
  });
});

describe("diasSeguidos", () => {
  it("conta dias seguidos até hoje", () => {
    const hoje = new Date(2026, 9, 31);
    expect(diasSeguidos([reg("2026-10-29"), reg("2026-10-30"), reg("2026-10-31")], hoje)).toBe(3);
  });

  it("zera se o último registro é antes de ontem", () => {
    expect(diasSeguidos([reg("2026-10-20")], new Date(2026, 9, 31))).toBe(0);
  });

  it("conta a sequência mesmo que hoje ainda não tenha registro", () => {
    expect(diasSeguidos([reg("2026-10-29"), reg("2026-10-30")], new Date(2026, 9, 31))).toBe(2);
  });
});

describe("agruparEvolucao", () => {
  const hoje = new Date(2026, 9, 31); // sábado

  it("semana: 7 barras, últimos 7 dias, com contagem por dia", () => {
    const barras = agruparEvolucao([reg("2026-10-31"), reg("2026-10-31", "triste"), reg("2026-10-20")], "semana", hoje);
    expect(barras).toHaveLength(7);
    expect(barras[barras.length - 1].total).toBe(2);
    expect(barras.reduce((a, b) => a + b.total, 0)).toBe(2);
  });

  it("mês: 12 barras (meses do ano corrente)", () => {
    const barras = agruparEvolucao([reg("2026-03-10"), reg("2026-10-01")], "mes", hoje);
    expect(barras).toHaveLength(12);
    expect(barras[2].total).toBe(1);
    expect(barras[9].total).toBe(1);
  });

  it("ano: uma barra por ano, dos últimos cinco anos", () => {
    const barras = agruparEvolucao([reg("2024-05-01"), reg("2026-01-01")], "ano", hoje);
    expect(barras).toHaveLength(5);
    expect(barras.reduce((a, b) => a + b.total, 0)).toBe(2);
  });
});

describe("resumoEvolucao", () => {
  it("conta total, dias únicos e humor mais frequente", () => {
    const r = resumoEvolucao([reg("2026-10-30", "feliz"), reg("2026-10-30", "feliz"), reg("2026-10-31", "triste")]);
    expect(r.total).toBe(3);
    expect(r.diasUnicos).toBe(2);
    expect(r.humorMaisFrequente).toBe("feliz");
  });

  it("sem registros, zera e não tem humor frequente", () => {
    expect(resumoEvolucao([])).toEqual({ total: 0, diasUnicos: 0, humorMaisFrequente: null });
  });
});
