import { beforeEach, describe, expect, it } from "vitest";
import {
  alternarFavorito,
  CHAVE_FAVORITOS,
  estaFavoritado,
  Favorito,
  lerFavoritos,
  salvarFavoritos
} from "./favoritos";

const paz: Favorito = { tema: "Paz", referencia: "João 14:27", texto: "A paz eu vos deixo." };

describe("favoritos", () => {
  beforeEach(() => localStorage.clear());

  it("começa vazio quando não há nada salvo", () => {
    expect(lerFavoritos()).toEqual([]);
  });

  it("salva e lê de volta", () => {
    salvarFavoritos([paz]);
    expect(lerFavoritos()).toEqual([paz]);
    expect(localStorage.getItem(CHAVE_FAVORITOS)).not.toBeNull();
  });

  it("ignora dados corrompidos sem quebrar", () => {
    localStorage.setItem(CHAVE_FAVORITOS, "{não é json");
    expect(lerFavoritos()).toEqual([]);
  });

  it("ignora entradas com formato inválido", () => {
    localStorage.setItem(
      CHAVE_FAVORITOS,
      JSON.stringify([paz, { tema: "X" }, null, "texto solto"])
    );
    expect(lerFavoritos()).toEqual([paz]);
  });

  it("alterna: adiciona quando não existe e remove quando existe", () => {
    const adicionado = alternarFavorito([], paz);
    expect(adicionado).toEqual([paz]);
    expect(estaFavoritado(adicionado, "Paz", "João 14:27")).toBe(true);

    const removido = alternarFavorito(adicionado, paz);
    expect(removido).toEqual([]);
  });

  it("não confunde o mesmo versículo em temas diferentes", () => {
    const outroTema: Favorito = { ...paz, tema: "Esperança" };
    const lista = alternarFavorito([paz], outroTema);
    expect(lista).toHaveLength(2);
    expect(estaFavoritado(lista, "Paz", "João 14:27")).toBe(true);
  });
});
