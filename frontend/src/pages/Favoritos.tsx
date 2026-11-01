import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useFavoritos } from "../hooks/useFavoritos";
import { LIMITE_NOTA } from "../lib/favoritos";
import { baixarArquivo } from "../lib/imagemCartao";
import { exportarBackup, importarBackup, NOME_ARQUIVO_BACKUP } from "../lib/backup";

function ItemFavorito({
  tema,
  referencia,
  texto,
  nota,
  onAnotar,
  onRemover
}: {
  tema: string;
  referencia: string;
  texto: string;
  nota?: string;
  onAnotar: (nota: string) => void;
  onRemover: () => void;
}) {
  const [rascunho, setRascunho] = useState(nota ?? "");
  const [salvo, setSalvo] = useState(false);
  const alterado = rascunho.trim() !== (nota ?? "");

  return (
    <li className="item-favorito">
      <p className="texto-versiculo pequeno">{texto}</p>
      <p className="referencia">
        {referencia} · <span className="tema-pequeno">{tema}</span>
      </p>

      <label className="rotulo-campo" htmlFor={`nota-${tema}-${referencia}`}>Minha anotação</label>
      <textarea
        id={`nota-${tema}-${referencia}`}
        className="campo-nota"
        maxLength={LIMITE_NOTA}
        rows={3}
        value={rascunho}
        placeholder="O que este versículo significou para você hoje?"
        onChange={(e) => {
          setRascunho(e.target.value);
          setSalvo(false);
        }}
      />

      <div className="linha-acoes">
        <button
          type="button"
          className="botao-primario pequeno"
          disabled={!alterado}
          onClick={() => {
            onAnotar(rascunho);
            setSalvo(true);
          }}
        >
          Salvar anotação
        </button>
        {salvo && <span className="confirmacao">Salvo</span>}
        <button type="button" className="botao-secundario pequeno" onClick={onRemover}>
          Remover
        </button>
      </div>
    </li>
  );
}

export default function Favoritos() {
  const { favoritos, remover, anotar, substituir } = useFavoritos();
  const inputArquivo = useRef<HTMLInputElement>(null);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  function exportar() {
    const conteudo = exportarBackup(favoritos);
    baixarArquivo(new Blob([conteudo], { type: "application/json" }), NOME_ARQUIVO_BACKUP());
    setMensagem({ tipo: "ok", texto: `Backup exportado com ${favoritos.length} favorito(s).` });
  }

  async function importar(arquivo: File) {
    const resultado = importarBackup(await arquivo.text());
    if (!resultado.ok) {
      setMensagem({ tipo: "erro", texto: resultado.erro });
      return;
    }
    substituir(resultado.favoritos);
    setMensagem({ tipo: "ok", texto: `Backup importado: ${resultado.favoritos.length} favorito(s).` });
  }

  return (
    <section className="pagina">
      <img
        className="foto-banner"
        src="./imagens/light-of-the-world-stained-glass-window-2.jpg"
        alt="Vitral com a imagem de Cristo, luz do mundo"
        loading="lazy"
        decoding="async"
      />
      <header className="cabecalho">
        <h1>Meus favoritos</h1>
        <p className="subtitulo">Versículos que você guardou, com suas anotações</p>
      </header>

      <div className="backup">
        <button type="button" className="botao-secundario" onClick={exportar}>
          Exportar backup
        </button>
        <button type="button" className="botao-secundario" onClick={() => inputArquivo.current?.click()}>
          Importar backup
        </button>
        <input
          ref={inputArquivo}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={(e) => {
            const arquivo = e.target.files?.[0];
            if (arquivo) void importar(arquivo);
            e.target.value = "";
          }}
        />
        <p className="dica">Seus favoritos ficam neste navegador. Exporte um backup para não perder nada.</p>
        {mensagem && <p className={mensagem.tipo === "ok" ? "aviso-ok" : "aviso-erro"} role="status">{mensagem.texto}</p>}
      </div>

      {favoritos.length === 0 ? (
        <div className="cartao-vazio">
          <p>Nenhum favorito ainda.</p>
          <Link to="/" className="botao-primario">Escolher um tema</Link>
        </div>
      ) : (
        <ul className="lista-favoritos">
          {favoritos.map((f) => (
            <ItemFavorito
              key={`${f.tema}|${f.referencia}`}
              tema={f.tema}
              referencia={f.referencia}
              texto={f.texto}
              nota={f.nota}
              onAnotar={(nota) => anotar(f.tema, f.referencia, nota)}
              onRemover={() => remover(f.tema, f.referencia)}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
