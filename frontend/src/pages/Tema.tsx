import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Compartilhar from "../components/Compartilhar";
import Icone from "../components/Icone";
import { useFavoritos } from "../hooks/useFavoritos";
import { buscarTema, sortearVersiculo, versiculosValidos, VersiculoValido } from "../lib/versiculos";

export default function Tema() {
  const { nome = "" } = useParams();
  const tema = buscarTema(decodeURIComponent(nome));
  const lista = useMemo(() => (tema ? versiculosValidos(tema) : []), [tema]);
  const { alternar, verificar } = useFavoritos();

  const [atual, setAtual] = useState<VersiculoValido | null>(() => sortearVersiculo(lista));

  if (!tema) {
    return (
      <section className="pagina">
        <p>Tema não encontrado.</p>
        <Link to="/" className="botao-secundario">Voltar aos temas</Link>
      </section>
    );
  }

  if (!atual) {
    return (
      <section className="pagina">
        <p>Este tema ainda não tem versículos disponíveis.</p>
        <Link to="/" className="botao-secundario">Voltar aos temas</Link>
      </section>
    );
  }

  const favoritado = verificar(tema.tema, atual.referencia);

  function outro() {
    setAtual((anterior) => sortearVersiculo(lista, anterior?.referencia ?? null));
  }

  function favoritar() {
    if (!atual) return;
    alternar({ tema: tema!.tema, referencia: atual.referencia, texto: atual.texto });
  }

  return (
    <section className="pagina">
      <div className="topo">
        <h1 className="titulo-tema">{tema.tema}</h1>
      </div>

      <article className="cartao-versiculo">
        <p className="texto-versiculo">{atual.texto}</p>
        <p className="referencia">{atual.referencia}</p>
      </article>

      <div className="acoes">
        <button type="button" className="botao-primario" onClick={outro}>
          Outro versículo
        </button>
        <button type="button" className="botao-secundario" onClick={favoritar} aria-pressed={favoritado}>
          <Icone nome="coracao" cheio={favoritado} /> {favoritado ? "Favoritado" : "Favoritar"}
        </button>
        <Compartilhar versiculo={atual} />
      </div>
    </section>
  );
}
