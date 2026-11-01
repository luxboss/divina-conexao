import { ReactNode, useEffect, useState } from "react";
import { decidirVisibilidade } from "../lib/rolagem";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icone from "./Icone";
import { useSessao } from "../hooks/useSessao";

const ITENS = [
  { para: "/diario", rotulo: "Diário", icone: "livro" as const, central: false, ativo: (p: string) => p.startsWith("/diario") },
  { para: "/evolucao", rotulo: "Evolução", icone: "broto" as const, central: false, ativo: (p: string) => p.startsWith("/evolucao") },
  { para: "/", rotulo: "Início", icone: "cruz" as const, central: true, ativo: (p: string) => p === "/" || p.startsWith("/humor") || p.startsWith("/tema") },
  { para: "/musicas", rotulo: "Músicas", icone: "nota" as const, central: false, ativo: (p: string) => p.startsWith("/musicas") },
  { para: "/temas", rotulo: "Temas", icone: "janela" as const, central: false, ativo: (p: string) => p === "/temas" }
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navegar = useNavigate();
  const mostrarVoltar = pathname !== "/entrar";
  function voltar() {
    if (window.history.length > 1) navegar(-1);
    else navegar("/");
  }
  const [barraVisivel, setBarraVisivel] = useState(true);

  // Ao trocar de aba, a página começa sempre no topo (e não na posição de rolagem anterior).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  const { sessao, carregando } = useSessao();
  // A barra só aparece para quem já entrou na conta.
  const mostrarBarra = !carregando && !!sessao;

  useEffect(() => {
    let anterior = window.scrollY;
    let ticando = false;
    const aoRolar = () => {
      if (ticando) return;
      ticando = true;
      requestAnimationFrame(() => {
        const atual = window.scrollY;
        setBarraVisivel((visivel) => decidirVisibilidade({ anterior, atual, visivel }));
        anterior = atual;
        ticando = false;
      });
    };
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <div className="app">
      {mostrarVoltar && (
        <button type="button" className="botao-voltar-topo" aria-label="Voltar" onClick={voltar}>←</button>
      )}
      <main className="conteudo">
        {children}
      </main>
      {mostrarBarra && (
      <nav className={barraVisivel ? "barra-inferior barra-central" : "barra-inferior barra-central oculta"} aria-label="Navegação principal">
        {ITENS.map((item) => {
          const ativo = item.ativo(pathname);
          return (
            <Link
              key={item.para}
              to={item.para}
              className={[ativo ? "ativo" : "", item.central ? "central" : ""].join(" ").trim()}
              aria-current={ativo ? "page" : undefined}
              
            >
              <Icone nome={item.icone} />
              <span>{item.rotulo}</span>
            </Link>
          );
        })}
      </nav>
      )}
    </div>
  );
}
