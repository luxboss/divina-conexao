import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export function useSessao() {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      setCarregando(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) => setSessao(nova));
    return () => data.subscription.unsubscribe();
  }, []);

  const cadastrar = useCallback(async (email: string, senha: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { emailRedirectTo: "https://luxboss.github.io/divina-conexao/" }
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

  return { sessao, carregando, cadastrar, entrar, sair };
}

function traduzirErro(mensagem: string): string {
  if (/invalid login credentials/i.test(mensagem)) return "E-mail ou senha incorretos.";
  if (/already registered|already been registered/i.test(mensagem)) return "Este e-mail já tem conta. Entre com sua senha.";
  if (/email not confirmed/i.test(mensagem)) return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  if (/rate limit|too many/i.test(mensagem)) return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  return "Não foi possível concluir. Tente de novo.";
}
