import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSessao } from "../hooks/useSessao";
import { validarCadastro, validarEmail, validarNovaSenha } from "../lib/auth";
import { Aparelho, listarAparelhos, registrarAparelhoAtual, removerAparelho } from "../lib/aparelhos";
import { LIMITE_APARELHOS } from "../lib/dispositivo";

function IconeOlho({ aberto }: { aberto: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8" />
      {!aberto && <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
    </svg>
  );
}

/** Campo de senha com botão para mostrar ou ocultar o texto. */
function CampoSenha({
  id,
  valor,
  onChange,
  autoComplete,
  rotulo
}: {
  id: string;
  valor: string;
  onChange: (v: string) => void;
  autoComplete: string;
  rotulo: string;
}) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="campo-senha">
      <label className="rotulo-campo" htmlFor={id}>{rotulo}</label>
      <div className="campo-senha-linha">
        <input
          id={id}
          className="campo-texto"
          type={visivel ? "text" : "password"}
          autoComplete={autoComplete}
          required
          value={valor}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          className="botao-olho"
          aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visivel}
          onClick={() => setVisivel((v) => !v)}
        >
          <IconeOlho aberto={visivel} />
        </button>
      </div>
    </div>
  );
}

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

function NovaSenha({ definir }: { definir: (senha: string) => Promise<void> }) {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erros, setErros] = useState<string[]>([]);
  const [enviando, setEnviando] = useState(false);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    const erroCampos = validarNovaSenha(senha, confirmacao);
    setErros(erroCampos);
    if (erroCampos.length) return;
    setEnviando(true);
    try {
      await definir(senha);
    } catch (erro) {
      setErros([(erro as Error).message]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="pagina">
      <header className="cabecalho">
        <h1>Criar nova senha</h1>
        <p className="subtitulo">Escolha uma senha nova para a sua conta</p>
      </header>
      <form className="cartao-diario" onSubmit={salvar}>
        <CampoSenha id="nova-senha" rotulo="Nova senha" valor={senha} onChange={setSenha} autoComplete="new-password" />
        <CampoSenha id="confirma-senha" rotulo="Repita a nova senha" valor={confirmacao} onChange={setConfirmacao} autoComplete="new-password" />
        {erros.map((m) => (
          <p key={m} className="aviso-erro" role="alert">{m}</p>
        ))}
        <button type="submit" className="botao-primario largo" disabled={enviando}>
          {enviando ? "Salvando…" : "Salvar nova senha"}
        </button>
      </form>
    </section>
  );
}

export default function Entrar() {
  const { sessao, carregando, recuperando, cadastrar, entrar, sair, pedirNovaSenha, definirNovaSenha } = useSessao();
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

  if (recuperando) {
    return <NovaSenha definir={definirNovaSenha} />;
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

  async function esqueciSenha() {
    setAviso(null);
    if (!validarEmail(email)) {
      setErros(["Digite seu e-mail no campo acima para receber o link de nova senha."]);
      return;
    }
    setErros([]);
    await pedirNovaSenha(email.trim());
    setAviso("Se este e-mail tiver uma conta, enviamos um link para criar uma nova senha.");
  }

  return (
    <section className="pagina">
      <img
        className="foto-hero entrar-foto"
        src="./imagens/hero-maria-azul.jpg"
        alt="Vitral azul com a Virgem Maria segurando o Menino Jesus"
        loading="eager"
        decoding="async"
      />
      <header className="cabecalho">
        <h1>Divina Conexão</h1>
        <p className="subtitulo">Seu companheiro espiritual diário</p>
      </header>

      <div className="abas abas-duas" role="tablist" aria-label="Conta">
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

        <CampoSenha
          id="senha"
          rotulo="Senha"
          valor={senha}
          onChange={setSenha}
          autoComplete={modo === "entrar" ? "current-password" : "new-password"}
        />

        {erros.map((m) => (
          <p key={m} className="aviso-erro" role="alert">{m}</p>
        ))}
        {aviso && <p className="aviso-ok" role="status">{aviso}</p>}

        <button type="submit" className="botao-primario largo" disabled={enviando}>
          {enviando ? "Aguarde…" : modo === "entrar" ? "Entrar" : "Criar conta"}
        </button>

        {modo === "entrar" && (
          <button type="button" className="link-acao" onClick={() => void esqueciSenha()}>
            Esqueci minha senha
          </button>
        )}
      </form>
    </section>
  );
}
