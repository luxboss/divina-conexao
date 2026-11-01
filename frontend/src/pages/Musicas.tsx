import { Link } from "react-router-dom";
import { linkSpotify, MUSICAS_DE_MISSA } from "../lib/musicas";

export default function Musicas() {
  return (
    <section className="pagina">
      <div className="topo">
        <Link to="/" className="botao-voltar" aria-label="Voltar">←</Link>
        <h1 className="titulo-tema">Músicas de missa</h1>
      </div>
      <p className="subtitulo centro">Toque em uma música para abri-la no Spotify.</p>
      <ul className="lista-musicas">
        {MUSICAS_DE_MISSA.map((m) => (
          <li key={m.spotifyId}>
            <a className="linha-musica" href={linkSpotify(m)} target="_blank" rel="noopener noreferrer">
              <span>{m.nome}</span>
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
