import { describe, expect, it } from "vitest";
import { exportarBackup, importarBackup, NOME_ARQUIVO_BACKUP } from "./backup";
import type { Favorito } from "./favoritos";

const lista: Favorito[] = [
  { tema: "Paz", referencia: "João 14:27", texto: "A paz eu vos deixo.", nota: "Lembrar nos dias difíceis" },
  { tema: "Fé", referencia: "Hebreus 11:1", texto: "A fé é a certeza." }
];

describe("exportarBackup", () => {
  it("gera JSON com versão, data e favoritos", () => {
    const bruto = exportarBackup(lista, new Date("2026-10-31T12:00:00Z"));
    const obj = JSON.parse(bruto);
    expect(obj.versao).toBe(1);
    expect(obj.exportadoEm).toBe("2026-10-31T12:00:00.000Z");
    expect(obj.favoritos).toEqual(lista);
  });

  it("tem um nome de arquivo com a data", () => {
    expect(NOME_ARQUIVO_BACKUP(new Date(2026, 9, 31))).toBe("divina-conexao-backup-2026-10-31.json");
  });
});

describe("importarBackup", () => {
  it("restaura o que foi exportado", () => {
    const resultado = importarBackup(exportarBackup(lista));
    expect(resultado).toEqual({ ok: true, favoritos: lista });
  });

  it("recusa texto que não é JSON", () => {
    const r = importarBackup("não é json");
    expect(r.ok).toBe(false);
  });

  it("recusa versão desconhecida", () => {
    const r = importarBackup(JSON.stringify({ versao: 99, favoritos: [] }));
    expect(r.ok).toBe(false);
  });

  it("ignora entradas inválidas e mantém as válidas", () => {
    const bruto = JSON.stringify({
      versao: 1,
      favoritos: [lista[0], { tema: "X" }, null, { tema: "Fé", referencia: "Hb 11:1", texto: "ok", nota: 5 }]
    });
    const r = importarBackup(bruto);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.favoritos).toHaveLength(2);
      expect(r.favoritos[1].nota).toBeUndefined();
    }
  });

  it("aceita backup sem favoritos", () => {
    expect(importarBackup(JSON.stringify({ versao: 1, favoritos: [] }))).toEqual({ ok: true, favoritos: [] });
  });
});
