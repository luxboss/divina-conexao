import { describe, expect, it } from "vitest";
import { decidirVisibilidade } from "./rolagem";

describe("decidirVisibilidade", () => {
  it("esconde ao descer além da folga", () => {
    expect(decidirVisibilidade({ anterior: 200, atual: 220, visivel: true })).toBe(false);
  });

  it("mostra ao subir além da folga", () => {
    expect(decidirVisibilidade({ anterior: 400, atual: 380, visivel: false })).toBe(true);
  });

  it("mantém o estado para pequenos movimentos (tremor)", () => {
    expect(decidirVisibilidade({ anterior: 200, atual: 205, visivel: true })).toBe(true);
    expect(decidirVisibilidade({ anterior: 200, atual: 195, visivel: false })).toBe(false);
  });

  it("sempre mostra no topo da página", () => {
    expect(decidirVisibilidade({ anterior: 300, atual: 10, visivel: false })).toBe(true);
  });
});
