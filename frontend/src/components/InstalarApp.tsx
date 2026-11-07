import { useEffect, useState } from "react";

interface EventoInstalar extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Banner "Instale Altar Diário". Usa o convite nativo quando o navegador oferece;
 * caso contrário mostra como instalar pelo menu do navegador.
 */
export default function InstalarApp() {
  const [convite, setConvite] = useState<EventoInstalar | null>(null);
  const [fechado, setFechado] = useState(() => localStorage.getItem("altar-diario:banner-instalar") === "fechado" || localStorage.getItem("divina-conexao:banner-instalar") === "fechado");
  const [instalado, setInstalado] = useState(false);

  useEffect(() => {
    const aoConvidar = (e: Event) => {
      e.preventDefault();
      setConvite(e as EventoInstalar);
    };
    const aoInstalar = () => setInstalado(true);
    window.addEventListener("beforeinstallprompt", aoConvidar);
    window.addEventListener("appinstalled", aoInstalar);
    return () => {
      window.removeEventListener("beforeinstallprompt", aoConvidar);
      window.removeEventListener("appinstalled", aoInstalar);
    };
  }, []);

  if (fechado || instalado) return null;

  async function instalar() {
    if (convite) {
      await convite.prompt();
      const escolha = await convite.userChoice;
      if (escolha.outcome === "accepted") setInstalado(true);
      setConvite(null);
    }
  }

  function fechar() {
    localStorage.setItem("divina-conexao:banner-instalar", "fechado");
    setFechado(true);
  }

  return (
    <aside className="banner-instalar" aria-label="Instalar o aplicativo">
      <div className="banner-texto">
        <strong>Instale ALTAR DIÁRIO</strong>
        <span>Acesso rápido na sua tela inicial e funciona sem internet.</span>
        {!convite && (
          <span className="dica">No menu do navegador, escolha "Adicionar à tela inicial".</span>
        )}
      </div>
      {convite && (
        <button type="button" className="botao-primario pequeno" onClick={instalar}>
          Instalar agora
        </button>
      )}
      <button type="button" className="botao-secundario pequeno" onClick={fechar} aria-label="Fechar aviso">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </aside>
  );
}
