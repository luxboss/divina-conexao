import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Compartilhar from "../components/Compartilhar";
import Icone from "../components/Icone";
import { useDiario } from "../hooks/useDiario";
import { useFavoritos } from "../hooks/useFavoritos";
import { criarRegistro } from "../lib/diario";
import { rotuloDoHumor, temasDoHumor } from "../lib/humores";
import { banco, sortearVersiculo, versiculosValidos, type VersiculoValido } from "../lib/versiculos";

export default function Humor() {
  const { id = "" } = useParams();
  const temas = temasDoHumor(id);

  // Versículos de todos os temas do humor, sem repetir o atual.
  const lista = useMemo(() => {
    const todos: (VersiculoValido & { tema: string })[] = [];
    for (const nome of temas) {
      const t = banco.temas.find((x) => x.tema === nome);
      if (t) for (const v of versiculosValidos(t)) todos.push({ ...v, tema: t.tema });
    }
    return todos;
  }, [id]);

  const [atual, setAtual] = useState(() => sortearVersiculo(lista));
  const [salvoNoDiario, setSalvoNoDiario] = useState(false);
  const [nota, setNota] = useState("");
  const { adicionar } = useDiario();
  const { alternar, verificar } = useFavoritos();

  if (temas.length === 0 || !atual) {
    return (
      <section className="pagina">
        <p>Humor não encontrado.</p>
        <Link to="/" className="botao-secundario">Voltar</Link>
      </section>
    );
  }

  const tema = (atual as VersiculoValido & { tema?: string }).tema ?? temas[0];
  const favoritado = verificar(tema, atual.referencia);

  function outro() {
    setSalvoNoDiario(false);
    setNota("");
    setAtual((anterior) => sortearVersiculo(lista, anterior?.referencia ?? null));
  }

  function salvarNoDiario() {
    adicionar(criarRegistro({ humor: id, tema, referencia: atual!.referencia, texto: atual!.texto, nota: nota.trim() || undefined }));
    setSalvoNoDiario(true);
  }

  return (
    <section className="pagina">
      <div className="topo">
        <h1 className="titulo-tema">Você está {rotuloDoHumor(id).toLowerCase()}</h1>
      </div>

      <article className="cartao-versiculo">
        <p className="texto-versiculo">{atual.texto}</p>
        <p className="referencia">{atual.referencia}</p>
      </article>

      <div className="acoes">
        <button type="button" className="botao-primario" onClick={outro}>Outro versículo</button>
        <button
          type="button"
          className="botao-secundario"
          onClick={() => alternar({ tema, referencia: atual!.referencia, texto: atual!.texto })}
          aria-pressed={favoritado}
        >
          <Icone nome="coracao" cheio={favoritado} /> {favoritado ? "Favoritado" : "Favoritar"}
        </button>
        <Compartilhar versiculo={atual} />
      </div>

      <div className="cartao-diario">
        <h2 className="pergunta esquerda">Salvar no meu diário</h2>
        <label className="rotulo-campo" htmlFor="nota-humor">O que este versículo significa para você hoje? (opcional)</label>
        <textarea
          id="nota-humor"
          className="campo-nota"
          rows={3}
          maxLength={1000}
          value={nota}
          onChange={(e) => setNota(e.target.value)}
          disabled={salvoNoDiario}
        />
        <button type="button" className="botao-primario" onClick={salvarNoDiario} disabled={salvoNoDiario}>
          {salvoNoDiario ? "Salvo no diário" : "Salvar no diário"}
        </button>
        {salvoNoDiario && <p className="confirmacao">Registro salvo. <Link to="/diario">Ver meu diário</Link></p>}
      </div>
    </section>
  );
}
