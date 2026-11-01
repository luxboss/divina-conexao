import { describe, expect, it } from "vitest";
import { validarCadastro, validarEmail, validarNovaSenha, MINIMO_SENHA } from "./auth";

describe("validarEmail", () => {
  it("aceita e-mail comum", () => {
    expect(validarEmail("luan@exemplo.com.br")).toBe(true);
  });
  it("recusa texto sem arroba ou domínio", () => {
    expect(validarEmail("luan.exemplo.com")).toBe(false);
    expect(validarEmail("luan@")).toBe(false);
    expect(validarEmail("")).toBe(false);
  });
});

describe("validarCadastro", () => {
  it("passa com e-mail válido e senha forte o bastante", () => {
    expect(validarCadastro({ email: "a@b.com", senha: "senha1234" })).toEqual([]);
  });
  it("aponta senha curta", () => {
    const erros = validarCadastro({ email: "a@b.com", senha: "123" });
    expect(erros).toContain(`A senha precisa ter pelo menos ${MINIMO_SENHA} caracteres.`);
  });
  it("aponta e-mail inválido", () => {
    expect(validarCadastro({ email: "x", senha: "senha1234" })).toContain("Informe um e-mail válido.");
  });
});

describe("validarNovaSenha", () => {
  it("aceita senha com tamanho mínimo e confirmação igual", () => {
    expect(validarNovaSenha("senha1234", "senha1234")).toEqual([]);
  });
  it("recusa senha curta", () => {
    expect(validarNovaSenha("123", "123")).toContain(`A senha precisa ter pelo menos ${MINIMO_SENHA} caracteres.`);
  });
  it("recusa confirmação diferente", () => {
    expect(validarNovaSenha("senha1234", "senha1235")).toContain("As duas senhas não são iguais.");
  });
});
