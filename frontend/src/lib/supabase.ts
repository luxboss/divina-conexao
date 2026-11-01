import { createClient } from "@supabase/supabase-js";

// Chave pública (publishable): feita para ficar no navegador. A segurança dos dados
// vem das regras de acesso (RLS) no banco, não desta chave.
const URL_PROJETO = "https://nrwkuoyesiyfnzsnvzij.supabase.co";
const CHAVE_PUBLICA = "sb_publishable_0lt5cB19O6kdX6tBAhnLwA_YxnHxXbu";

export const CHAVE_RECUPERAR = "divina-conexao:recuperar-senha";

// A cada carregamento do app, a sessão salva no aparelho é apagada, para exigir o login de novo.
// Exceção: o link de recuperação de senha, que precisa da sessão para trocar a senha.
const ehLinkDeRecuperacao = window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery");
if (!ehLinkDeRecuperacao) {
  for (const chave of Object.keys(localStorage)) {
    if (/^sb-.*-auth-token/.test(chave)) localStorage.removeItem(chave);
  }
}

export const supabase = createClient(URL_PROJETO, CHAVE_PUBLICA, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
});

// Guarda o aviso de recuperação assim que o link do e-mail é processado,
// mesmo que a tela de entrar ainda não esteja aberta.
supabase.auth.onAuthStateChange((evento) => {
  if (evento === "PASSWORD_RECOVERY") {
    sessionStorage.setItem(CHAVE_RECUPERAR, "1");
  }
});
