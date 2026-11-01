import { useState } from "react";
import { linkWhatsApp, textoDoVersiculo } from "../lib/compartilhar";
import { compartilharImagem } from "../lib/imagemCartao";
import type { VersiculoValido } from "../lib/versiculos";

export default function Compartilhar({ versiculo }: { versiculo: VersiculoValido }) {
  const [estado, setEstado] = useState<"parado" | "gerando" | "erro">("parado");

  async function compartilhar() {
    setEstado("gerando");
    try {
      await compartilharImagem(versiculo);
      setEstado("parado");
    } catch (erro) {
      // Cancelar o menu de compartilhamento também cai aqui; não é um erro real.
      const cancelado = erro instanceof DOMException && erro.name === "AbortError";
      setEstado(cancelado ? "parado" : "erro");
    }
  }

  return (
    <div className="compartilhar">
      <button type="button" className="botao-secundario" onClick={compartilhar} disabled={estado === "gerando"}>
        {estado === "gerando" ? "Gerando imagem…" : "Compartilhar imagem"}
      </button>
      <a
        className="botao-secundario"
        href={linkWhatsApp(textoDoVersiculo(versiculo))}
        target="_blank"
        rel="noopener noreferrer"
      >
        Enviar no WhatsApp
      </a>
      {estado === "erro" && <p className="aviso-erro">Não foi possível gerar a imagem. Tente de novo.</p>}
    </div>
  );
}
