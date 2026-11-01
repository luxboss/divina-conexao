import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Temas from "./pages/Temas";
import Tema from "./pages/Tema";
import Humor from "./pages/Humor";
import Diario from "./pages/Diario";
import Evolucao from "./pages/Evolucao";
import Favoritos from "./pages/Favoritos";
import Entrar from "./pages/Entrar";

export default function App() {
  return (
    <HashRouter>
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
