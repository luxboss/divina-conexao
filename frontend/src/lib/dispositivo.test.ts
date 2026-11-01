import { describe, expect, it } from "vitest";
import { nomeDoAparelho } from "./dispositivo";

describe("nomeDoAparelho", () => {
  it("reconhece iPhone", () => {
    expect(nomeDoAparelho("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)")).toBe("iPhone");
  });
  it("reconhece Android", () => {
    expect(nomeDoAparelho("Mozilla/5.0 (Linux; Android 14; SM-S911B)")).toBe("Android");
  });
  it("usa Computador para o resto", () => {
    expect(nomeDoAparelho("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("Computador");
  });
});
