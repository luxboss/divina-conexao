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
// Tempo em segundo plano (ms) a partir do qual o login é pedido de novo ao voltar ao app.
const TEMPO_PARA_PEDIR_LOGIN_MS = 30_000;

// Fica só na memória da página: zera a cada abertura do app (inclusive ao reabrir pela tela inicial).
let aberturaTratada = false;

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
    if (aberturaTratada) return;
    aberturaTratada = true;

    const veioDeRecuperacao = recuperando || window.location.hash.includes("type=recovery");
    if (veioDeRecuperacao) {
      navegar("/entrar", { replace: true });
      return;
    }

    if (sessao) void sair();
    navegar("/entrar", { replace: true });
  }, [carregando, sessao, recuperando, sair, navegar]);

  // Quando o app volta do segundo plano depois de um tempo, exige o login de novo.
  // (No iPhone, o app minimizado continua na memória, então a regra de abertura não roda de novo.)
  useEffect(() => {
    let ocultadoEm = 0;
    const aoMudarVisibilidade = () => {
      if (document.hidden) {
        ocultadoEm = Date.now();
        return;
      }
      if (ocultadoEm && Date.now() - ocultadoEm >= TEMPO_PARA_PEDIR_LOGIN_MS) {
        void sair();
        navegar("/entrar", { replace: true });
      }
      ocultadoEm = 0;
    };
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    return () => document.removeEventListener("visibilitychange", aoMudarVisibilidade);
  }, [sair, navegar]);

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
