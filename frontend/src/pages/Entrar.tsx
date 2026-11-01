import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSessao } from "../hooks/useSessao";
import { validarCadastro } from "../lib/auth";
import { Aparelho, listarAparelhos, registrarAparelhoAtual, removerAparelho } from "../lib/aparelhos";
import { LIMITE_APARELHOS } from "../lib/dispositivo";

function ContaLogada({ email, sair }: { email: string; sair: () => Promise<void> }) {
  const [estado, setEstado] = useState<"verificando" | "ok" | "limite">("verificando");
  const [aparelhos, setAparelhos] = useState<Aparelho[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const verificar = useCallback(async () => {
    const resultado = await registrarAparelhoAtual();
    if (resultado.ok) {
      setEstado("ok");
      setErro(null);
    } else if (resultado.limite) {
      setEstado("limite");
    } else {
      setErro(resultado.erro);
    }
    setAparelhos(await listarAparelhos());
  }, []);

  useEffect(() => {
    void verificar();
  }, [verificar]);

  async function remover(id: string) {
    await removerAparelho(id);
    await verificar();
  }

  return (
    <section className="pagina">
      <header className="cabecalho">
        <h1>Minha conta</h1>
        <p className="subtitulo">Conectado como {email}</p>
      </header>

      {estado === "verificando" && <p className="subtitulo centro">Verificando este aparelho…</p>}

      {estado === "limite" && (
        <div className="cartao-diario">
          <p className="aviso-erro" role="alert">
            Esta conta já está em {LIMITE_APARELHOS} aparelhos. Remova um deles abaixo para usar este aparelho.
          </p>
        </div>
      )}

      {erro && <p className="aviso-erro" role="alert">{erro}</p>}

      {aparelhos.length > 0 && (
        <section className="cartao-diario" aria-label="Aparelhos conectados">
          <h2 className="pergunta esquerda">Aparelhos conectados ({aparelhos.length}/{LIMITE_APARELHOS})</h2>
          <ul className="lista-aparelhos">
            {aparelhos.map((a) => (
              <li key={a.id} className="linha-aparelho">
                <span>
                  {a.nome ?? "Aparelho"} {a.atual && <strong className="confirmacao">(este aparelho)</strong>}
                </span>
                <button type="button" className="botao-secundario pequeno" onClick={() => void remover(a.id)}>
                  Remover
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <button type="button" className="botao-secundario largo" onClick={() => void sair()}>Sair da conta</button>
      <Link to="/" className="botao-primario largo">Voltar ao início</Link>
    </section>
  );
}

export default function Entrar() {
  const { sessao, carregando, cadastrar, entrar, sair } = useSessao();
  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState<string[]>([]);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (carregando) {
    return (
      <section className="pagina">
        <p className="subtitulo centro">Carregando…</p>
      </section>
    );
  }

  if (sessao) {
    return <ContaLogada email={sessao.user.email ?? "sua conta"} sair={sair} />;
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setAviso(null);
    if (modo === "cadastrar") {
      const erroCampos = validarCadastro({ email, senha });
      setErros(erroCampos);
      if (erroCampos.length) return;
    }
    setEnviando(true);
    try {
      if (modo === "entrar") {
        await entrar(email.trim(), senha);
      } else {
        const { precisaConfirmarEmail } = await cadastrar(email.trim(), senha);
        setAviso(
          precisaConfirmarEmail
            ? "Conta criada! Enviamos um link de confirmação para o seu e-mail."
            : "Conta criada e conectada."
        );
      }
      setErros([]);
    } catch (erro) {
      setErros([(erro as Error).message]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="pagina">
      <img
        className="foto-hero"
        src="./imagens/hero-maria-azul.jpg"
        alt="Vitral azul com a Virgem Maria segurando o Menino Jesus"
        loading="eager"
        decoding="async"
      />
      <header className="cabecalho">
        <h1>{modo === "entrar" ? "Entrar" : "Criar conta"}</h1>
        <p className="subtitulo">Seu diário e favoritos ficam guardados na sua conta</p>
      </header>

      <div className="abas" role="tablist" aria-label="Conta">
        <button type="button" role="tab" aria-selected={modo === "entrar"} className={modo === "entrar" ? "aba ativa" : "aba"} onClick={() => setModo("entrar")}>
          Entrar
        </button>
        <button type="button" role="tab" aria-selected={modo === "cadastrar"} className={modo === "cadastrar" ? "aba ativa" : "aba"} onClick={() => setModo("cadastrar")}>
          Criar conta
        </button>
      </div>

      <form className="cartao-diario" onSubmit={enviar}>
        <label className="rotulo-campo" htmlFor="email">E-mail</label>
        <input id="email" className="campo-texto" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="rotulo-campo" htmlFor="senha">Senha</label>
        <input
          id="senha"
          className="campo-texto"
          type="password"
          autoComplete={modo === "entrar" ? "current-password" : "new-password"}
          required
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        {erros.map((m) => (
          <p key={m} className="aviso-erro" role="alert">{m}</p>
        ))}
        {aviso && <p className="aviso-ok" role="status">{aviso}</p>}

        <button type="submit" className="botao-primario largo" disabled={enviando}>
          {enviando ? "Aguarde…" : modo === "entrar" ? "Entrar" : "Criar conta"}
        </button>
      </form>

      <Link to="/" className="botao-secundario largo">Voltar ao início</Link>
    </section>
  );
}
