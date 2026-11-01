import { ReactNode, useEffect, useState } from "react";
import { decidirVisibilidade } from "../lib/rolagem";
import { Link, useLocation } from "react-router-dom";
import Icone from "./Icone";

const ITENS = [
  { para: "/diario", rotulo: "Diário", icone: "livro" as const, central: false, ativo: (p: string) => p.startsWith("/diario") },
  { para: "/evolucao", rotulo: "Evolução", icone: "broto" as const, central: false, ativo: (p: string) => p.startsWith("/evolucao") },
  { para: "/", rotulo: "Início", icone: "cruz" as const, central: true, ativo: (p: string) => p === "/" || p.startsWith("/humor") || p.startsWith("/tema") },
  { para: "/favoritos", rotulo: "Favoritos", icone: "calice" as const, central: false, ativo: (p: string) => p.startsWith("/favoritos") },
  { para: "/temas", rotulo: "Temas", icone: "janela" as const, central: false, ativo: (p: string) => p === "/temas" }
];

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [barraVisivel, setBarraVisivel] = useState(true);

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
      <main className="conteudo">
        {children}
      </main>
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
    </div>
  );
}
