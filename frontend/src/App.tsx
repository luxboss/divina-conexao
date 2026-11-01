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

// Marca que esta abertura do app já foi tratada. Some ao fechar o app ou a aba,
// então cada vez que o app é aberto (pelo ícone ou pelo link) a tela de entrar aparece.
const CHAVE_ABERTURA = "divina-conexao:abertura-feita";

/**
 * A cada abertura do app, a pessoa começa na tela de Entrar / Criar conta.
 * Se já havia uma sessão salva no aparelho, ela é encerrada, para exigir o login de novo.
 * O link de recuperação de senha é exceção: nele a sessão precisa ser mantida para trocar a senha.
 */
function IrParaContaAoAbrir() {
  const { sessao, carregando, recuperando, sair } = useSessao();
  const navegar = useNavigate();

  useEffect(() => {
    if (carregando) return;
    if (sessionStorage.getItem(CHAVE_ABERTURA)) return;
    sessionStorage.setItem(CHAVE_ABERTURA, "1");

    const veioDeRecuperacao = recuperando || window.location.hash.includes("type=recovery");
    if (veioDeRecuperacao) {
      navegar("/entrar", { replace: true });
      return;
    }

    if (sessao) void sair();
    navegar("/entrar", { replace: true });
  }, [carregando, sessao, recuperando, sair, navegar]);

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
