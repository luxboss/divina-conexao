import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { CHAVE_RECUPERAR, supabase } from "../lib/supabase";

const URL_DO_SITE = "https://luxboss.github.io/divina-conexao/";

export function useSessao() {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [recuperando, setRecuperando] = useState(() => sessionStorage.getItem(CHAVE_RECUPERAR) === "1");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      setCarregando(false);
    });
    const { data } = supabase.auth.onAuthStateChange((evento, nova) => {
      setSessao(nova);
      if (evento === "PASSWORD_RECOVERY") setRecuperando(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const cadastrar = useCallback(async (email: string, senha: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { emailRedirectTo: URL_DO_SITE }
    });
    if (error) throw new Error(traduzirErro(error.message));
    return { precisaConfirmarEmail: !data.session };
  }, []);

  const entrar = useCallback(async (email: string, senha: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) throw new Error(traduzirErro(error.message));
  }, []);

  const sair = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  /** Envia o link para criar nova senha. Não revela se o e-mail existe. */
  const pedirNovaSenha = useCallback(async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email, { redirectTo: URL_DO_SITE });
  }, []);

  /** Grava a nova senha depois que a pessoa abriu o link do e-mail. */
  const definirNovaSenha = useCallback(async (senha: string) => {
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) throw new Error(traduzirErro(error.message));
    sessionStorage.removeItem(CHAVE_RECUPERAR);
    setRecuperando(false);
  }, []);

  return { sessao, carregando, recuperando, cadastrar, entrar, sair, pedirNovaSenha, definirNovaSenha };
}

function traduzirErro(mensagem: string): string {
  if (/invalid login credentials/i.test(mensagem)) return "E-mail ou senha incorretos.";
  if (/already registered|already been registered/i.test(mensagem)) return "Este e-mail já tem conta. Entre com sua senha.";
  if (/email not confirmed/i.test(mensagem)) return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  if (/rate limit|too many/i.test(mensagem)) return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  if (/same password|different from the old/i.test(mensagem)) return "A nova senha precisa ser diferente da anterior.";
  return "Não foi possível concluir. Tente de novo.";
}
