import { useEffect } from "react";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
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
import Musicas from "./pages/Musicas";

// Marca que a abertura do app já foi tratada. Fica só na memória da página,
// então zera a cada vez que o app é aberto pelo ícone ou pelo link.
let aberturaTratada = false;

/**
 * Ao abrir o app: quem não está logado vai para Entrar / Criar conta.
 * Quem já está logado continua na tela inicial (a sessão só some quando o histórico é apagado).
 * O link de recuperação de senha leva direto para a tela de nova senha.
 */
function IrParaContaAoAbrir() {
  const { sessao, carregando, recuperando } = useSessao();
  const navegar = useNavigate();

  useEffect(() => {
    if (carregando) return;
    if (aberturaTratada) return;
    aberturaTratada = true;

    const veioDeRecuperacao = recuperando || window.location.hash.includes("type=recovery");
    if (veioDeRecuperacao) {
      navegar("/entrar", { replace: true });
      return;
    }

    if (!sessao) navegar("/entrar", { replace: true });
  }, [carregando, sessao, recuperando, navegar]);

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
          <Route path="/musicas" element={<Musicas />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
