/** Músicas de missa e católicas. O app não toca nem guarda o áudio: cada item abre a faixa no Spotify. */
export interface Musica {
  nome: string;
  /** ID da faixa no Spotify (parte final do link). */
  spotifyId: string;
}

export const MUSICAS_DE_MISSA: Musica[] = [
  { nome: "Glória a Deus nas alturas", spotifyId: "1ZlOr7yhSFhaXaQYmttDqO" },
  { nome: "Glória a Deus nas alturas (outra versão)", spotifyId: "4jeQ7e9Tko4XRytdlXAMU2" },
  { nome: "Santo, Santo, Santo", spotifyId: "7qCEd9DseDpJ7C5TOXoIYn" },
  { nome: "Santo, Santo, Santo (outra versão)", spotifyId: "2xDtcpNZ5VUdw8m6m51p2y" },
  { nome: "Cordeiro de Deus", spotifyId: "4nYrUnF9mokXjwjlgCjqgO" },
  { nome: "Cordeiro de Deus (outra versão)", spotifyId: "2bNDN4tVycREK41NV42gKH" },
  { nome: "Aleluia (Händel)", spotifyId: "0rZTGJrXGFvD3lK4AcK1ES" },
  { nome: "Pai Nosso (ao vivo)", spotifyId: "4uDI1wTCXEiMVZfOxcqWbj" },
  { nome: "Ave Maria (Schubert)", spotifyId: "46DZCruzZuDWYinEI25UPo" },
  { nome: "Salve Rainha (outra versão)", spotifyId: "1v0vEq4MgNJkHetFsWjHkS" },
  { nome: "Salve Rainha", spotifyId: "5v4OnUzAGZWL4QWbYJqxFR" },
  { nome: "Aclamai ao Senhor", spotifyId: "1ARfcF0sKGO03frkPvKEiK" },
  { nome: "Bendito seja Deus", spotifyId: "0UWpcKxhiQoclsQsdQI33R" },
  { nome: "Maria de Nazaré", spotifyId: "4ENxf4WU6RwdjIjEEmJfj7" },
  { nome: "Vinde, Espírito Santo (outra versão)", spotifyId: "24Aih9C8tJ1sFEqjSn4VYP" },
  { nome: "Vinde, Espírito Santo", spotifyId: "6mkTvlLPnaglazrIMymaFd" },
  { nome: "Ó Senhor, Vós Sois Minha Luz", spotifyId: "5ow9s0YwyUAdOUteWjwjo0" },
  { nome: "Vem, e Eu Mostrarei", spotifyId: "0Y8GSJnD7mEwPZSyVU9iXa" },
  { nome: "Profetiza Filho de Maria (ao vivo)", spotifyId: "6fQ3FqpRdrww210b5dw11R" }
];

/** Link direto da faixa no Spotify. Abre o aplicativo, se instalado, ou a página do Spotify. */
export function linkSpotify(musica: Musica): string {
  return `https://open.spotify.com/track/${musica.spotifyId}`;
}
