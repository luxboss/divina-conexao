import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import { useSessao } from "./hooks/useSessao";
import Home from "./pages/Home";
import Temas from "./pages/Temas";
import Tema from "./pages/Tema";
import Humor from "./pages/Humor";
import Diario from "./pages/Diario";
import Evolucao from "./pages/Evolucao";
import Favoritos from "./pages/Favoritos";
import Entrar from "./pages/Entrar";

const CHAVE_ABERTURA = "divina-conexao:abertura-feita";

/**
 * Ao abrir o app, quem não está logado vai direto para Entrar / Criar conta.
 * Acontece uma vez por abertura, para não prender a pessoa na tela de login.
 */
function IrParaContaAoAbrir() {
  const { sessao, carregando } = useSessao();
  const navegar = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (carregando) return;
    if (sessionStorage.getItem(CHAVE_ABERTURA)) return;
    sessionStorage.setItem(CHAVE_ABERTURA, "1");
    if (!sessao && (pathname === "/" || pathname === "")) {
      navegar("/entrar", { replace: true });
    }
  }, [carregando, sessao, pathname, navegar]);

  return null;
}

export default function App() {
  return (
    <HashRouter>
      <IrParaContaAoAbrir />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/temas" element={<Temas />} />
          <Route path="/tema/:nome" element={<Tema />} />
          <Route path="/humor/:id" element={<Humor />} />
          <Route path="/diario" element={<Diario />} />
          <Route path="/evolucao" element={<Evolucao />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/entrar" element={<Entrar />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
