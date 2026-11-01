import { useState } from "react";
import { Link } from "react-router-dom";
import { useDiario } from "../hooks/useDiario";
import { rotuloDoHumor } from "../lib/humores";
import { LIMITE_NOTA } from "../lib/favoritos";

function ItemDiario({
  dataTexto,
  humor,
  referencia,
  texto,
  nota,
  onAnotar,
  onRemover
}: {
  dataTexto: string;
  humor: string;
  referencia: string;
  texto: string;
  nota?: string;
  onAnotar: (nota: string) => void;
  onRemover: () => void;
}) {
  const [rascunho, setRascunho] = useState(nota ?? "");
  const alterado = rascunho.trim() !== (nota ?? "");
  return (
    <li className="item-favorito">
      <p className="rotulo">{dataTexto} · {rotuloDoHumor(humor)}</p>
      <p className="texto-versiculo pequeno">{texto}</p>
      <p className="referencia">{referencia}</p>
      <textarea
        className="campo-nota"
        rows={3}
        maxLength={LIMITE_NOTA}
        value={rascunho}
        aria-label={`Anotação de ${referencia}`}
        onChange={(e) => setRascunho(e.target.value)}
      />
      <div className="linha-acoes">
        <button type="button" className="botao-primario pequeno" disabled={!alterado} onClick={() => onAnotar(rascunho)}>
          Salvar anotação
        </button>
        <button type="button" className="botao-secundario pequeno" onClick={onRemover}>Remover</button>
      </div>
    </li>
  );
}

export default function Diario() {
  const { registros, anotar, remover } = useDiario();
  const ordenados = [...registros].sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));

  return (
    <section className="pagina">
      <header className="cabecalho">
        <h1>Meu diário</h1>
        <p className="subtitulo">Cada dia que você escolhe seu humor fica guardado aqui</p>
      </header>

      {ordenados.length === 0 ? (
        <div className="cartao-vazio">
          <p>Seu diário está vazio.</p>
          <p>Escolha seu humor na tela inicial para começar.</p>
          <Link to="/" className="botao-primario">Escolher meu humor</Link>
        </div>
      ) : (
        <ul className="lista-favoritos">
          {ordenados.map((r) => (
            <ItemDiario
              key={r.id}
              dataTexto={r.data.split("-").reverse().join("/")}
              humor={r.humor}
              referencia={r.referencia}
              texto={r.texto}
              nota={r.nota}
              onAnotar={(nota) => anotar(r.id, nota)}
              onRemover={() => remover(r.id)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
