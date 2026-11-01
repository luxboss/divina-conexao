import { describe, expect, it } from "vitest";
import { MUSICAS_DE_MISSA, linkSpotify } from "./musicas";

describe("musicas de missa", () => {
  it("tem as 19 faixas enviadas, sem ID repetido", () => {
    expect(MUSICAS_DE_MISSA).toHaveLength(19);
    expect(new Set(MUSICAS_DE_MISSA.map((m) => m.spotifyId)).size).toBe(19);
  });

  it("monta o link direto da faixa no Spotify", () => {
    expect(linkSpotify({ nome: "Pai Nosso", spotifyId: "abc123" })).toBe("https://open.spotify.com/track/abc123");
  });

  it("nomes curtos, sem título longo", () => {
    for (const m of MUSICAS_DE_MISSA) {
      expect(m.nome.length).toBeLessThan(45);
    }
  });
});
