import { describe, expect, it } from "vitest";
import {
  banco,
  buscarTema,
  sortearVersiculo,
  versiculosValidos,
  type VersiculoValido
} from "./versiculos";

const lista: VersiculoValido[] = [
  { referencia: "João 14:27", texto: "A paz eu vos deixo." },
  { referencia: "Salmos 4:8", texto: "Em paz me deito." },
  { referencia: "Isaías 26:3", texto: "Perfeita paz." }
];

describe("banco de versículos", () => {
  it("tem 20 temas com 20 versículos cada", () => {
    expect(banco.temas).toHaveLength(20);
    for (const tema of banco.temas) {
      expect(tema.versiculos, tema.tema).toHaveLength(20);
    }
  });

  it("não repete referência dentro do mesmo tema", () => {
    for (const tema of banco.temas) {
      const refs = tema.versiculos.map((v) => v.referencia);
      expect(new Set(refs).size, tema.tema).toBe(refs.length);
    }
  });

  it("todo versículo tem texto preenchido", () => {
    for (const tema of banco.temas) {
      expect(versiculosValidos(tema), tema.tema).toHaveLength(tema.versiculos.length);
    }
  });
});

describe("versiculosValidos", () => {
  it("descarta versículos sem texto ou com texto vazio", () => {
    const tema = {
      tema: "Teste",
      versiculos: [
        { referencia: "A", texto: null },
        { referencia: "B", texto: "   " },
        { referencia: "C", texto: "Texto válido" }
      ]
    };
    expect(versiculosValidos(tema)).toEqual([{ referencia: "C", texto: "Texto válido" }]);
  });
});

describe("buscarTema", () => {
  it("encontra o tema pelo nome exato", () => {
    expect(buscarTema("Paz")?.tema).toBe("Paz");
  });

  it("retorna undefined para tema inexistente", () => {
    expect(buscarTema("Inexistente")).toBeUndefined();
  });
});

describe("sortearVersiculo", () => {
  it("retorna null quando a lista está vazia", () => {
    expect(sortearVersiculo([])).toBeNull();
  });

  it("escolhe pelo número aleatório injetado", () => {
    expect(sortearVersiculo(lista, null, () => 0)?.referencia).toBe("João 14:27");
    expect(sortearVersiculo(lista, null, () => 0.99)?.referencia).toBe("Isaías 26:3");
  });

  it("não repete o versículo atual quando há outra opção", () => {
    const escolhido = sortearVersiculo(lista, "João 14:27", () => 0);
    expect(escolhido?.referencia).not.toBe("João 14:27");
  });

  it("aceita o mesmo versículo quando é o único da lista", () => {
    const unico = [lista[0]];
    expect(sortearVersiculo(unico, "João 14:27", () => 0)?.referencia).toBe("João 14:27");
  });

  it("não quebra quando o número aleatório é exatamente 1", () => {
    expect(sortearVersiculo(lista, null, () => 1)).not.toBeNull();
  });
});
