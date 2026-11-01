import { useMemo } from "react";
import { Link } from "react-router-dom";
import Icone from "../components/Icone";
import InstalarApp from "../components/InstalarApp";
import { HUMORES } from "../lib/humores";
import { versiculoDoDia } from "../lib/versiculoDoDia";
import { banco } from "../lib/versiculos";

const DATA_HOJE = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export default function Home() {
  const hoje = useMemo(() => new Date(), []);
  const doDia = useMemo(() => versiculoDoDia(banco, hoje), [hoje]);
  const dataTexto = DATA_HOJE.format(hoje);

  return (
    <section className="pagina">
      <InstalarApp />

      <img
        className="foto-hero"
        src="./imagens/hero-maria-azul.jpg"
        alt="Vitral azul com a Virgem Maria segurando o Menino Jesus, cercada de cordeiros"
        loading="eager"
        decoding="async"
      />

      <header className="cabecalho">
        <div className="logo"><Icone nome="coracao" cheio /></div>
        <h1>Divina Conexão</h1>
        <p className="subtitulo">Seu companheiro espiritual diário</p>
      </header>

      <div className="acoes-topo">
        <Link to="/diario" className="botao-secundario largo">Acessar meu diário</Link>
        <Link to="/evolucao" className="botao-secundario largo">Minha evolução</Link>
      </div>

      <p className="data-hoje">{dataTexto}</p>

      <h2 className="pergunta">Como você se sente hoje?</h2>
      <div className="grade-humores">
        {HUMORES.map((h) => (
          <Link key={h.id} to={`/humor/${h.id}`} className="cartao-humor">
            <span className="emoji-humor" aria-hidden="true">{h.emoji}</span>
            {h.rotulo}
          </Link>
        ))}
      </div>
      <p className="subtitulo centro">Escolha seu humor para receber sua mensagem espiritual do dia.</p>

      {doDia && (
        <Link to={`/tema/${encodeURIComponent(doDia.tema)}`} className="cartao-dia" aria-label={`Versículo do dia: ${doDia.referencia}`}>
          <span className="rotulo">Versículo do dia</span>
          <p className="texto-versiculo pequeno">{doDia.texto}</p>
          <p className="referencia">{doDia.referencia}</p>
        </Link>
      )}

      <img
        className="foto-faixa"
        src="./imagens/faixa-jesus-calice.jpg"
        alt="Vitral de Jesus segurando um cálice dourado, com halo amarelo"
        loading="lazy"
        decoding="async"
      />

      <section className="caracteristicas" aria-labelledby="caracteristicas-titulo">
        <h2 id="caracteristicas-titulo" className="pergunta">Características</h2>
        <ul>
          <li>Devocionais personalizados de acordo com seu humor</li>
          <li>Versículos bíblicos inspiradores</li>
          <li>Orações guiadas para cada situação</li>
          <li>Conselhos práticos para o seu dia</li>
          <li>Funciona sem conexão à internet</li>
        </ul>
      </section>

      <Link to="/temas" className="botao-primario largo">Explorar temas</Link>
    </section>
  );
}
