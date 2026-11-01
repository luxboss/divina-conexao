import { Link } from "react-router-dom";
import { banco } from "../lib/versiculos";

export default function Temas() {
  return (
    <section className="pagina">
      <div className="topo">
        <Link to="/" className="botao-voltar" aria-label="Voltar">←</Link>
        <h1 className="titulo-tema">Temas</h1>
      </div>
      <div className="grade-temas">
        {banco.temas.map((t) => (
          <Link key={t.tema} to={`/tema/${encodeURIComponent(t.tema)}`} className="cartao-tema">
            {t.tema}
          </Link>
        ))}
      </div>
    </section>
  );
}
